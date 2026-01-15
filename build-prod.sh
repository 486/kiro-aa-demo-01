#!/bin/bash

# AWS re:Invent Sessions - Production Build Script

echo "=========================================="
echo "AWS re:Invent Sessions"
echo "Production Build"
echo "=========================================="
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Error: Node.js is not installed"
    exit 1
fi

echo "✓ Node.js version: $(node --version)"
echo ""

# Install backend dependencies
echo "📦 Installing backend dependencies..."
npm install --production
echo "✓ Backend dependencies installed"
echo ""

# Install frontend dependencies and build
echo "📦 Building frontend..."
cd frontend
npm install
npm run build
cd ..
echo "✓ Frontend built successfully"
echo ""

# Check build output
if [ -d "frontend/dist" ]; then
    echo "✓ Frontend build output: frontend/dist/"
    echo "  Files:"
    ls -lh frontend/dist/
    echo ""
fi

echo "=========================================="
echo "Build Complete!"
echo "=========================================="
echo ""
echo "To run in production mode:"
echo "  1. Set environment: export NODE_ENV=production"
echo "  2. Start server: npm start"
echo ""
echo "The application will:"
echo "  - Serve API at /api/*"
echo "  - Serve frontend from /frontend/dist"
echo "  - Run on http://localhost:3000"
echo ""
echo "Or deploy the built files to your hosting provider:"
echo "  - Backend: Copy all files except frontend/"
echo "  - Frontend: Deploy frontend/dist/ to CDN/static host"
echo ""
