from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import uvicorn
import pandas as pd
from model import recommend_locations, clean_city_name

app = FastAPI(title="Location Recommendation API")

# Add CORS middleware to allow requests from Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001", "http://localhost:3002", "http://localhost:3003"],
    allow_credentials=True,
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)

# City descriptions with reasons to live there
city_reasons = {
    "Atlanta, GA": "Atlanta offers a strong job market, particularly in tech and finance, with a reasonable cost of living compared to other major cities. The city boasts diverse neighborhoods, rich cultural attractions, and excellent food scene.",
    
    "Austin, TX": "Austin combines a thriving tech scene with a vibrant cultural atmosphere. The city is known for its strong job growth, no state income tax, and a reputation for quality of life with numerous outdoor activities.",
    
    "Houston, TX": "Houston provides exceptional value with its combination of job opportunities and affordable housing. The city offers diverse communities, world-class dining, no state income tax, and a growing economy centered on energy, healthcare, and aerospace.",
    
    "Chicago, IL": "Chicago delivers big-city amenities with more reasonable living costs than coastal cities. It features world-class dining, diverse neighborhoods, excellent public transportation, and abundant cultural institutions and entertainment options.",
    
    "Philadelphia, PA": "Philadelphia combines historical charm with modern urban living at a more affordable price point than nearby NYC. The city offers walkable neighborhoods, diverse culinary scene, and proximity to other East Coast hubs.",
    
    "New York, NY": "New York City offers unparalleled career opportunities across industries with exceptional cultural amenities, diverse communities, and comprehensive public transportation. Despite high costs, it delivers a unique urban experience.",
    
    "San Francisco, CA": "San Francisco remains a global tech hub with some of the highest salaries in the country. The city features breathtaking views, diverse neighborhoods, excellent food, and access to beautiful outdoor spaces despite its high cost of living.",
    
    "Seattle, WA": "Seattle combines a strong tech job market with natural beauty and outdoor recreation. The city offers a thriving cultural scene, mild climate, and excellent public amenities despite the rainy reputation.",
    
    "Washington, DC": "Washington DC features a stable job market with government and related industries, excellent public transportation, diverse neighborhoods, and unmatched access to free museums and cultural institutions.",
    
    "Denver, CO": "Denver provides an exceptional balance of urban amenities and outdoor lifestyle. The city features a strong job market, especially in tech and healthcare, with 300+ days of sunshine and proximity to world-class mountain recreation.",
    
    "Boston, MA": "Boston excels in education, healthcare, and technology sectors with historic charm, walkable neighborhoods, and excellent public transportation. The city offers cultural richness despite higher living costs.",
    
    "Dallas, TX": "Dallas offers a robust job market with no state income tax and a lower cost of living than many major cities. The metropolitan area provides diverse communities, excellent dining, and a central location for business travel.",
    
    "Los Angeles, CA": "Los Angeles combines career opportunities in entertainment, tech, and design with year-round sunshine and diverse neighborhoods. The sprawling city offers something for everyone despite traffic challenges.",
    
    "Herndon, VA": "Herndon offers excellent proximity to the Dulles Technology Corridor, making it ideal for tech professionals. With access to Washington DC metro area jobs, good schools, and lower housing costs than nearby Arlington, it's a practical choice for professionals.",
    
    "Arlington, VA": "Arlington provides exceptional access to government and contractor jobs with an extensive public transit system connecting to DC. The area features excellent schools, vibrant urban villages, and numerous dining and entertainment options.",
    
    "San Diego, CA": "San Diego offers an unbeatable combination of year-round perfect weather, beautiful beaches, and a growing tech and biotech industry. The city provides a more relaxed lifestyle than other California tech hubs while maintaining excellent career opportunities.",
    
    "Rockland, MA": "Rockland combines affordable living with proximity to the Boston metro job market. It offers a small-town New England feel with historic charm while providing access to city amenities and coastal recreation options.",
}

def get_city_reason(city_state):
    """Get a reason why a city is good to live in. If none exists, return a default reason."""
    if city_state in city_reasons:
        return city_reasons[city_state]
    return "This location provides a good balance of housing costs and job opportunities based on your preferences."

class SearchParams(BaseModel):
    """Model for search parameters sent from the frontend."""
    rent_budget: float
    job_title: str
    rent_weight: Optional[float] = 0.5
    job_weight: Optional[float] = 0.5
    budget_threshold: Optional[float] = 0.3

class LocationRecommendation(BaseModel):
    """Model for a location recommendation sent to the frontend."""
    city: str
    state: str
    avg_rent: float
    job_count: int
    score: float
    score_percentage: str
    reason: str

@app.post("/api/recommendations", response_model=List[LocationRecommendation])
async def get_recommendations(params: SearchParams):
    """Get location recommendations based on search parameters."""
    try:
        print(f"Received request: {params}")
        recommendations = recommend_locations(
            rent_budget=params.rent_budget,
            job_title=params.job_title,
            rent_weight=params.rent_weight,
            job_weight=params.job_weight,
            budget_threshold=params.budget_threshold
        )
        
        # Format scores as percentages and convert to list of dictionaries
        result = []
        for _, row in recommendations.iterrows():
            city_state = f"{row['City']}, {row['State']}"
            result.append(LocationRecommendation(
                city=row["City"],
                state=row["State"],
                avg_rent=float(row["avg_rent"]),
                job_count=int(row["job_count"]),
                score=float(row["total_score"]),
                score_percentage=f"{float(row['total_score'])*100:.1f}%",
                reason=get_city_reason(city_state)
            ))
        
        print(f"Returning {len(result)} recommendations")
        return result
    except Exception as e:
        print(f"Error in get_recommendations: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/health")
async def health_check():
    """Health check endpoint."""
    return {"status": "healthy"}

if __name__ == "__main__":
    uvicorn.run("backend:app", host="0.0.0.0", port=8000, reload=True) 