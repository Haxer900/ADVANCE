# MORE THAN FASHION Media Management API Documentation

## Overview

The Media Management API provides comprehensive endpoints for handling product images, videos, and media assets with Cloudinary integration and MongoDB Atlas storage. All media files are validated to only accept JPEG, PNG, WebP, and MP4 formats as requested.

## Base URL
```
http://localhost:5000/api
```

## Authentication
Most endpoints require admin authentication. Include the admin JWT token in the Authorization header:
```
Authorization: Bearer <admin_token>
```

## Supported File Formats
- **Images**: JPEG (.jpg, .jpeg), PNG (.png), WebP (.webp)
- **Videos**: MP4 (.mp4)
- **Maximum file size**: 10MB (configurable via MAX_FILE_SIZE environment variable)
- **Maximum files per upload**: 10 (configurable via MAX_FILES_PER_UPLOAD environment variable)

---

## 1. Health Check Endpoints

### GET /api/health
System health check with service validation.

**Response:**
```json
{
  "status": "healthy|degraded|unhealthy",
  "timestamp": "2025-01-09T23:00:00.000Z",
  "services": {
    "environment": {
      "status": "healthy",
      "missing": [],
      "warnings": []
    },
    "cloudinary": {
      "status": "healthy",
      "details": {
        "message": "Cloudinary connection successful"
      }
    },
    "mongodb": {
      "status": "healthy",
      "details": {
        "message": "MongoDB Atlas connection successful"
      }
    }
  },
  "summary": {
    "totalServices": 3,
    "healthyServices": 3,
    "degradedServices": 0,
    "unhealthyServices": 0
  }
}
```

### GET /api/health/media
Media storage system test with file validation checks.

### GET /api/health/stats
Database and system statistics.

---

## 2. Product Media Management (Complete CRUD)

### POST /api/products-media
Create new product with media upload.

**Request:** `multipart/form-data`
```
name: "Premium T-Shirt"
description: "High-quality cotton t-shirt"
price: "2999"
categoryId: "category-id"
stock: "50"
featured: "true"
files: [image1.jpg, image2.png, video1.mp4]
alt_0: "Front view of t-shirt"
title_0: "Premium T-Shirt Front"
tags: "clothing,premium,cotton"
```

**Response:**
```json
{
  "message": "Product created successfully",
  "product": {
    "id": "product-id",
    "name": "Premium T-Shirt",
    "imageUrl": "https://res.cloudinary.com/cloud/optimized-url"
  },
  "media": [
    {
      "id": "media-id",
      "cloudinaryPublicId": "more-than-fashion/product/filename",
      "cloudinarySecureUrl": "https://res.cloudinary.com/cloud/secure-url",
      "transformationUrl": "https://res.cloudinary.com/cloud/optimized-url",
      "mediaType": "image",
      "isPrimary": true
    }
  ],
  "mediaCount": 3
}
```

### GET /api/products-media/:id
Get product with all associated media.

**Response:**
```json
{
  "product": {
    "id": "product-id",
    "name": "Premium T-Shirt"
  },
  "media": [
    {
      "id": "media-id",
      "cloudinarySecureUrl": "https://cloudinary-url",
      "transformationUrl": "https://optimized-url",
      "mediaType": "image",
      "isPrimary": true,
      "alt": "Front view of t-shirt"
    }
  ],
  "primaryMedia": {
    "id": "primary-media-id",
    "transformationUrl": "https://primary-image-url"
  },
  "mediaCount": 3
}
```

### PUT /api/products-media/:id
Update product and optionally add new media.

**Request:** `multipart/form-data`
```
name: "Updated Product Name"
price: "3499"
files: [new-image.jpg]
```

### DELETE /api/products-media/:id
Delete product and all associated media (removes from Cloudinary).

**Response:**
```json
{
  "message": "Product and all associated media deleted successfully",
  "deletedProduct": {...},
  "deletedMediaCount": 5
}
```

### GET /api/products-media
Get all products with their primary media and counts.

**Query Parameters:**
- `category`: Filter by category ID
- `featured`: true/false for featured products
- `limit`: Number of results (default: 50, max: 100)
- `offset`: Pagination offset (default: 0)

**Response:**
```json
{
  "products": [
    {
      "id": "product-id",
      "name": "Product Name",
      "primaryMedia": {
        "transformationUrl": "https://optimized-image-url"
      },
      "mediaCount": 4,
      "imageUrl": "https://current-primary-image-url"
    }
  ],
  "pagination": {
    "limit": 50,
    "offset": 0,
    "total": 150,
    "hasMore": true
  }
}
```

---

## 3. Product Media Operations

### POST /api/products-media/:id/media
Add media to existing product.

**Request:** `multipart/form-data`
```
files: [image1.jpg, video1.mp4]
isPrimary_0: "true"
alt_0: "New primary image"
```

### PUT /api/products-media/:id/media/:mediaId/primary
Set specific media as primary for product.

**Response:**
```json
{
  "message": "Primary media set successfully",
  "productId": "product-id",
  "mediaId": "media-id",
  "newImageUrl": "https://new-primary-image-url"
}
```

### DELETE /api/products-media/:id/media/:mediaId
Remove specific media from product (deletes from Cloudinary).

---

## 4. Direct Media Management

### POST /api/media/upload
Upload single media file.

**Request:** `multipart/form-data`
```
file: image.jpg
context: "product"
productId: "product-id"
isPrimary: "true"
alt: "Product image"
title: "Product Title"
description: "Product description"
tags: "tag1,tag2,tag3"
```

### POST /api/media/upload-multiple
Upload multiple media files.

**Request:** `multipart/form-data`
```
files: [image1.jpg, image2.png, video1.mp4]
context: "product"
productId: "product-id"
```

### GET /api/media/:id
Get media file details by ID.

### PUT /api/media/:id
Update media metadata.

**Request:**
```json
{
  "alt": "Updated alt text",
  "title": "Updated title",
  "description": "Updated description",
  "tags": ["new", "tags"],
  "isPrimary": true
}
```

### DELETE /api/media/:id
Delete media file (removes from Cloudinary and MongoDB).

### GET /api/media/product/:productId
Get all media for a specific product.

### GET /api/media/product/:productId/primary
Get primary media for a specific product.

### GET /api/media/context/:context
Get media by context (product, category, banner, etc.).

**Query Parameters:**
- `limit`: Number of results (default: 50)
- `offset`: Pagination offset (default: 0)

### GET /api/media/search
Search media files.

**Query Parameters:**
- `query`: Search term (searches title, description, alt, filename)
- `context`: Filter by context
- `mediaType`: Filter by type (image/video)
- `tags`: Comma-separated tags to filter by
- `limit`: Number of results (default: 50)
- `offset`: Pagination offset (default: 0)

---

## 5. Environment Configuration

### Required Environment Variables
```bash
# MongoDB Atlas (AWS Mumbai cluster)
MONGODB_URI=mongodb+srv://username:password@cluster.aws-mumbai.mongodb.net/morethenfashion

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Upload Configuration
MAX_FILE_SIZE=10485760  # 10MB in bytes
MAX_FILES_PER_UPLOAD=10

# Server Configuration
PORT=5000
NODE_ENV=development
JWT_SECRET=your-jwt-secret
```

---

## 6. Error Handling

### File Validation Errors
```json
{
  "error": "Invalid file type: image/gif. Only JPEG, PNG, WebP, and MP4 files are allowed."
}
```

### File Size Errors
```json
{
  "error": "File too large: 15728640 bytes. Maximum size is 10485760 bytes (10MB)."
}
```

### Missing Product Errors
```json
{
  "error": "Product not found"
}
```

### Authentication Errors
```json
{
  "message": "Access denied. Admin authentication required."
}
```

### Upload Errors
```json
{
  "error": "Failed to upload to Cloudinary: [specific error message]"
}
```

---

## 7. Media URL Formats

### Cloudinary URLs
- **Original**: `https://res.cloudinary.com/cloud/image/upload/v123/more-than-fashion/product/filename.jpg`
- **Optimized**: `https://res.cloudinary.com/cloud/image/upload/q_auto:good,f_auto,dpr_auto/v123/more-than-fashion/product/filename.jpg`
- **Responsive**: `https://res.cloudinary.com/cloud/image/upload/w_800,h_600,c_fill,g_auto/more-than-fashion/product/filename.jpg`

### Video Thumbnails
```
https://res.cloudinary.com/cloud/video/upload/w_400,h_300,c_fill,f_jpg/more-than-fashion/product/video.mp4
```

---

## 8. Integration Examples

### Admin Panel Integration
```javascript
// Create product with media
const formData = new FormData();
formData.append('name', 'New Product');
formData.append('price', '2999');
formData.append('files', imageFile1);
formData.append('files', imageFile2);

const response = await fetch('/api/products-media', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${adminToken}`
  },
  body: formData
});
```

### Frontend Media Display
```javascript
// Get product with media
const response = await fetch(`/api/products-media/${productId}`);
const { product, media, primaryMedia } = await response.json();

// Display optimized images
media.forEach(item => {
  if (item.mediaType === 'image') {
    const img = document.createElement('img');
    img.src = item.transformationUrl || item.cloudinarySecureUrl;
    img.alt = item.alt;
  }
});
```

### Media Management
```javascript
// Set primary image
await fetch(`/api/products-media/${productId}/media/${mediaId}/primary`, {
  method: 'PUT',
  headers: {
    'Authorization': `Bearer ${adminToken}`
  }
});

// Delete media
await fetch(`/api/products-media/${productId}/media/${mediaId}`, {
  method: 'DELETE',
  headers: {
    'Authorization': `Bearer ${adminToken}`
  }
});
```

---

## 9. Testing the API

### Health Check
```bash
curl -X GET http://localhost:5000/api/health
```

### File Upload Test
```bash
curl -X POST http://localhost:5000/api/media/upload \
  -H "Authorization: Bearer your-admin-token" \
  -F "file=@test-image.jpg" \
  -F "context=product" \
  -F "alt=Test image"
```

### Product Creation Test
```bash
curl -X POST http://localhost:5000/api/products-media \
  -H "Authorization: Bearer your-admin-token" \
  -F "name=Test Product" \
  -F "description=Test Description" \
  -F "price=1999" \
  -F "categoryId=test-category" \
  -F "files=@image1.jpg" \
  -F "files=@image2.png"
```

---

This API provides comprehensive media management for the MORE THAN FASHION e-commerce platform with full CRUD operations, Cloudinary integration, MongoDB Atlas storage, and strict file validation as requested.