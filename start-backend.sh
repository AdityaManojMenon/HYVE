#!/bin/bash

echo "Starting backend server..."

# Check if port 8000 is already in use
if lsof -i :8000 >/dev/null; then
  echo "Port 8000 is already in use. There may already be a backend server running."
  echo "You can kill the existing process with: kill $(lsof -t -i:8000)"
  echo "Or use a different port by editing backend.py"
  echo ""
  echo "Continuing with existing server..."
else
  # Activate the virtual environment
  if [ -d "venv" ]; then
    source venv/bin/activate
    echo "Activated virtual environment."
  else
    echo "Virtual environment not found. Creating a new one..."
    python3 -m venv venv
    source venv/bin/activate
    pip install fastapi uvicorn pandas numpy
    echo "Installed required packages."
  fi

  # Start the backend server
  echo "Starting backend server on http://localhost:8000..."
  python backend.py
fi 