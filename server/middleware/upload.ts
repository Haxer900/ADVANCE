import multer from 'multer';
import { Request, Response, NextFunction } from 'express';

// Configure multer for memory storage
const storage = multer.memoryStorage();

// File filter function to validate file types
const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  // Allowed MIME types
  const allowedMimeTypes = [
    'image/jpeg',
    'image/jpg', 
    'image/png',
    'image/webp',
    'video/mp4',
    'video/quicktime',
    'video/x-msvideo'
  ];

  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`Unsupported file type: ${file.mimetype}. Allowed types: ${allowedMimeTypes.join(', ')}`));
  }
};

// Configure multer
export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB limit
    files: 10 // Maximum 10 files per request
  }
});

// Single file upload middleware
export const uploadSingle = upload.single('file');

// Multiple files upload middleware  
export const uploadMultiple = upload.array('files', 10);

// Fields-based upload middleware for different types
export const uploadFields = upload.fields([
  { name: 'images', maxCount: 10 },
  { name: 'videos', maxCount: 5 }
]);

// Error handling middleware for multer errors
export const handleUploadError = (error: any, req: Request, res: Response, next: NextFunction) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        error: 'File too large. Maximum size is 50MB.'
      });
    }
    if (error.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({
        error: 'Too many files. Maximum is 10 files per request.'
      });
    }
    if (error.code === 'LIMIT_UNEXPECTED_FILE') {
      return res.status(400).json({
        error: 'Unexpected field name in file upload.'
      });
    }
  }
  
  if (error.message.includes('Unsupported file type')) {
    return res.status(400).json({
      error: error.message
    });
  }

  next(error);
};