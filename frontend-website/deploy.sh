#!/bin/bash

# ZENTHRA Frontend Deployment Script
echo "🚀 Starting ZENTHRA frontend deployment..."

# Clean previous build
echo "🧹 Cleaning previous build..."
rm -rf dist/
rm -rf node_modules/.cache/

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Build the project
echo "🔨 Building project..."
NODE_ENV=production npm run build

# Verify build output
echo "✅ Checking build output..."
if [ -d "dist" ]; then
    echo "✅ Build successful! Files in dist:"
    ls -la dist/
    echo "📊 Build size:"
    du -sh dist/
    echo "🎯 Ready for deployment to zenthra.fashion"
else
    echo "❌ Build failed - dist folder not found"
    exit 1
fi

echo "🎉 Frontend build complete!"