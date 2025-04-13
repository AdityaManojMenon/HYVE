#!/bin/bash

# Check if virtual environment exists, create if not
if [ ! -d "venv_hyve" ]; then
    echo "Creating virtual environment..."
    python -m venv venv_hyve
fi

# Activate virtual environment
echo "Activating virtual environment..."
source venv_hyve/bin/activate

# Install requirements
echo "Installing requirements..."
pip install -r requirements.txt

# Run the app
echo "Starting Streamlit app..."
python -m streamlit run app.py 