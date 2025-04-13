import numpy as np
import pandas as pd
import re

# Load datasets
df_rent = pd.read_csv("avg_rent.csv")
df_jobs = pd.read_csv("jobs.csv")

def clean_city_name(city_name):
    """
    Clean city names by removing state information and other common patterns
    """
    if pd.isna(city_name):
        return ""
        
    # Remove everything after a comma (typically state/zip info)
    city_name = re.sub(r',.*$', '', city_name)
    
    # Remove common suffixes
    city_name = re.sub(r'\s+(City|Town|Village|CDP)$', '', city_name)
    
    # Remove extra whitespace and convert to title case
    city_name = city_name.strip().title()
    
    return city_name

def recommend_locations(rent_budget, job_title, rent_weight=0.5, job_weight=0.5, budget_threshold=0.3):
    """
    Recommends the top 5 ideal places to live based on rent budget and job opportunities.
    
    Parameters:
    rent_budget (float): The amount the user is willing to spend on rent
    job_title (str): The job title the user is looking for
    rent_weight (float): Weight for rent score in final ranking (0-1)
    job_weight (float): Weight for job score in final ranking (0-1)
    budget_threshold (float): How much above/below budget to consider (as percentage)
    
    Returns:
    DataFrame: Top 5 recommended locations with their scores
    """
    # Step 1: Clean and prepare the datasets
    
    # Clean job data - extract city name
    df_jobs_cleaned = df_jobs.copy()
    df_jobs_cleaned['City_Cleaned'] = df_jobs_cleaned['City'].apply(clean_city_name)
    
    # Clean rent data - standardize city names
    df_rent_cleaned = df_rent.copy()
    df_rent_cleaned['City_Cleaned'] = df_rent_cleaned['RegionName'].apply(clean_city_name)
    
    # Step 2: Filter jobs by job title (case-insensitive partial match)
    relevant_jobs = df_jobs_cleaned[df_jobs_cleaned['Job_Title'].str.lower().str.contains(job_title.lower(), na=False)]
    
    # Step 3: Aggregate job counts by city and state
    job_counts = relevant_jobs.groupby(['City_Cleaned', 'State']).size().reset_index(name='job_count')
    
    # Step 4: Filter rent data by budget threshold
    budget_min = rent_budget * (1 - budget_threshold)
    budget_max = rent_budget * (1 + budget_threshold)
    df_rent_filtered = df_rent_cleaned[(df_rent_cleaned['avg_rent'] >= budget_min) & 
                                     (df_rent_cleaned['avg_rent'] <= budget_max)]
    
    # If we have too few results, expand the filter
    if len(df_rent_filtered) < 10:
        df_rent_filtered = df_rent_cleaned
    
    # Step 5: Calculate rent score (inverted distance from budget)
    df_rent_filtered['rent_diff'] = abs(df_rent_filtered['avg_rent'] - rent_budget)
    
    # Normalize rent difference to be between 0 and 1 (inverted so closer to budget = higher score)
    max_diff = df_rent_filtered['rent_diff'].max()
    if max_diff > 0:
        df_rent_filtered['rent_score'] = 1 - (df_rent_filtered['rent_diff'] / max_diff)
    else:
        df_rent_filtered['rent_score'] = 1.0
    
    # Step 6: Merge rent and job data
    locations = df_rent_filtered[['City_Cleaned', 'RegionName', 'State', 'avg_rent', 'rent_score']].copy()
    
    # Merge job data with locations
    merged_data = pd.merge(locations, job_counts, on=['City_Cleaned', 'State'], how='left')
    
    # Replace NaN values with 0 for job_count
    merged_data['job_count'] = merged_data['job_count'].fillna(0)
    
    # Step 7: Calculate job score (normalized job count)
    max_job_count = merged_data['job_count'].max()
    if max_job_count > 0:
        merged_data['job_score'] = merged_data['job_count'] / max_job_count
    else:
        merged_data['job_score'] = 0
    
    # Step 8: Calculate total score with weights
    merged_data['total_score'] = (rent_weight * merged_data['rent_score'] + 
                                job_weight * merged_data['job_score'])
    
    # Step 9: Sort by total score and get top 5
    top_locations = merged_data.sort_values('total_score', ascending=False).head(5)
    
    # Format the result
    result = top_locations[['RegionName', 'State', 'avg_rent', 'job_count', 'total_score']]
    result = result.rename(columns={'RegionName': 'City'})
    result = result.reset_index(drop=True)
    
    return result

def main():
    print("Ideal Living Location Recommender")
    print("--------------------------------")
    
    # Get user input
    rent_budget = float(input("Enter your monthly rent budget ($): "))
    job_title = input("Enter the job title you're looking for: ")
    
    # Using default weights (0.5 each)
    recommendations = recommend_locations(rent_budget, job_title)
    
    # Display recommendations
    print("\nTop 5 Recommended Locations:")
    print(recommendations.to_string(index=False))

if __name__ == "__main__":
    main()




