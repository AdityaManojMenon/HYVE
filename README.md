# Ideal Living Location Finder

A data-driven tool that helps users find the perfect place to live based on their rent budget and job preferences.

## Features

- Find top 5 ideal locations based on rent budget and job opportunities
- Customizable weighting system for rent vs. job importance
- Interactive visualizations of results
- Dark-themed, modern UI with Streamlit

## Data Sources

The application uses two main datasets:
- `avg_rent.csv`: Contains average rent data for various cities across the United States
- `jobs.csv`: Contains job listings with locations and titles

## System Requirements

- Python 3.9+ (Python 3.12+ requires the updated dependencies in requirements.txt)
- Virtual environment recommended

## Installation and Running

### Option 1: Using the setup script (Recommended)

1. Make the setup script executable:
   ```
   chmod +x setup.sh
   ```

2. Run the setup script:
   ```
   ./setup.sh
   ```

This will:
- Create a virtual environment if it doesn't exist
- Install the dependencies
- Start the Streamlit app

### Option 2: Manual setup

1. Create and activate a virtual environment:
   ```
   python -m venv venv_hyve
   source venv_hyve/bin/activate  # On Windows: venv_hyve\Scripts\activate
   ```

2. Install the required dependencies:
   ```
   pip install -r requirements.txt
   ```

3. Run the Streamlit app:
   ```
   python -m streamlit run app.py
   ```

## Troubleshooting

- **numpy installation error**: If you're using Python 3.12+, ensure you're using the updated requirements.txt which specifies numpy>=1.26.0
- **streamlit not found**: Make sure to activate the virtual environment before running or use `python -m streamlit run app.py`

## Usage

1. Enter your monthly rent budget
2. Enter the job title you're looking for
3. (Optional) Adjust advanced parameters:
   - Importance of rent match vs. job opportunities
   - Budget flexibility percentage
4. Click "Find Ideal Locations" to see your results

## Project Structure

- `model.py`: Contains the recommendation logic
- `app.py`: Streamlit web interface
- `avg_rent.csv`: Dataset with average rent by city
- `jobs.csv`: Dataset with job listings
- `setup.sh`: Script to set up and run the application

## Screenshots

[Screenshots will be added here after the app is running]
