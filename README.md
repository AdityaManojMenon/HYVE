# Ideal Living Location Finder

A Next.js application that helps users find the perfect place to live based on their rent budget and job preferences.

## Project Structure

- **Backend**: Python FastAPI server that provides location recommendations
  - `model.py`: Contains the recommendation logic using data from avg_rent.csv and jobs.csv
  - `backend.py`: FastAPI server that exposes the model via an API

- **Frontend**: Next.js web application
  - `my-app/`: Contains the Next.js application
  - Modern UI with charts and visual representation of recommendations

## Features

- Find top 5 ideal locations based on rent budget and job opportunities
- Customizable weighting system for rent vs. job importance
- Interactive visualizations with Chart.js
- Responsive, modern UI with dark mode support
- City cards with images and descriptions

## Prerequisites

- Python 3.8+ with pip
- Node.js 16+ with npm

## Quick Start

1. Clone the repository
2. Set up the environment and install dependencies:
   ```bash
   # Create Python virtual environment
   python3 -m venv venv
   
   # Activate the virtual environment
   source venv/bin/activate
   
   # Install Python dependencies
   pip install fastapi uvicorn pandas numpy
   
   # Install frontend dependencies
   cd my-app
   npm install
   cd ..
   ```

3. Start the application:
   ```bash
   # Start the backend server (in a separate terminal)
   ./start-backend.sh
   
   # Start the frontend server (in another terminal)
   ./start-frontend.sh
   ```

4. Open your browser and visit http://localhost:3000

## Manual Setup (Alternative)

### Backend Setup

1. Install the Python dependencies:
   ```bash
   python3 -m venv venv
   source venv/bin/activate
   pip install fastapi uvicorn pandas numpy
   ```

2. Start the backend server:
   ```bash
   python backend.py
   ```
   The server will run at http://localhost:8000

### Frontend Setup

1. Navigate to the Next.js app directory:
   ```bash
   cd my-app
   ```

2. Install the dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```
   The frontend will run at http://localhost:3000

## Usage

1. Enter your monthly rent budget
2. Enter the job title you're looking for
3. (Optional) Adjust advanced parameters:
   - Importance of rent match vs. job opportunities
   - Budget flexibility percentage
4. Click "Find Ideal Locations" to see your results

## Troubleshooting

If you encounter any issues with the backend:
- Make sure you've activated the virtual environment (`source venv/bin/activate`)
- Ensure all Python dependencies are installed
- Check that ports 8000 (backend) and 3000 (frontend) are not being used by other applications

## Data Sources

The application uses two main datasets:
- `avg_rent.csv`: Contains average rent data for various cities across the United States
- `jobs.csv`: Contains job listings with locations and titles 