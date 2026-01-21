#!/bin/bash

# AWS re:Invent Sessions - Development Startup Script

echo "=========================================="
echo "AWS re:Invent Sessions"
echo "Full Stack Application Startup"
echo "=========================================="
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Error: Node.js is not installed"
    echo "Please install Node.js from https://nodejs.org/"
    exit 1
fi

echo "✓ Node.js version: $(node --version)"
echo "✓ npm version: $(npm --version)"
echo ""

# Check if backend dependencies are installed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing backend dependencies..."
    npm install
    echo "✓ Backend dependencies installed"
    echo ""
fi

# Check if frontend dependencies are installed
if [ ! -d "frontend/node_modules" ]; then
    echo "📦 Installing frontend dependencies..."
    cd frontend
    npm install
    cd ..
    echo "✓ Frontend dependencies installed"
    echo ""
fi

# Check if database exists
if [ ! -f "reinvent_sessions.db" ]; then
    echo "⚠️  Warning: Database file not found"
    echo "Please run: python3 reinvent_database.py"
    exit 1
fi

echo "✓ Database file found"
echo ""

echo "=========================================="
echo "Starting Application"
echo "=========================================="
echo ""
echo "📡 Backend will run on: http://localhost:3000"
echo "🎨 Frontend will run on: http://localhost:5173"
echo ""
echo "Press Ctrl+C to stop both servers"
echo ""
echo "=========================================="
echo ""

# Function to cleanup background processes on exit
cleanup() {
    echo ""
    echo "Stopping servers..."
    kill $BACKEND_PID $FRONTEND_PID 2>/dev/null
    exit
}

trap cleanup EXIT INT TERM

# Start backend server
echo "Starting backend server..."
npm start &
BACKEND_PID=$!
sleep 3

# Start frontend server
echo "Starting frontend server..."
cd frontend
npm run dev &
FRONTEND_PID=$!
cd ..

# Wait for user to press Ctrl+C
echo ""
echo "✅ Both servers are running!"
echo ""
echo "Open your browser to: http://localhost:5173"
echo ""
echo "Press Ctrl+C to stop..."
echo ""

# Wait for both processes
wait
