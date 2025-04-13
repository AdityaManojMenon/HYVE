"use client";

import { useState } from "react";
import Header from "./components/Header";
import SearchForm from "./components/SearchForm";
import CityCard from "./components/CityCard";
import ChartSection from "./components/ChartSection";
import { LocationRecommendation, SearchParams } from "./types";

export default function Home() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [recommendations, setRecommendations] = useState<LocationRecommendation[]>([]);
  const [rentBudget, setRentBudget] = useState<number>(0);

  const handleSearch = async (params: SearchParams) => {
    setIsLoading(true);
    setError(null);
    setRentBudget(params.rent_budget);
    
    try {
      console.log("Fetching recommendations from backend...");
      // Use the correct backend URL and include a timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
      
      const response = await fetch('http://localhost:8000/api/recommendations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(params),
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        console.error(`Backend error: ${response.status} ${response.statusText}`);
        throw new Error(`Backend error: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log("Received data from backend:", data);
      setRecommendations(data);
    } catch (err) {
      console.error('Error fetching recommendations:', err);
      
      if (err instanceof Error) {
        if (err.name === 'AbortError') {
          setError('Request timed out. The backend server might not be running.');
        } else if (err.message.includes('Failed to fetch')) {
          setError('Could not connect to the backend server. Please make sure it is running on http://localhost:8000.');
        } else {
          setError(`Failed to fetch recommendations: ${err.message}`);
        }
      } else {
        setError('Failed to fetch recommendations. Please try again later.');
      }
      
      // For demo purposes, create mock data if backend is not available
      console.log('Using mock data for development');
      const mockData: LocationRecommendation[] = [
        {
          city: "Seattle",
          state: "WA",
          avg_rent: 1943.12,
          job_count: 1,
          score: 0.953,
          score_percentage: "95.3%",
          reason: "Seattle combines a strong tech job market with natural beauty and outdoor recreation. The city offers a thriving cultural scene, mild climate, and excellent public amenities despite the rainy reputation."
        },
        {
          city: "Herndon",
          state: "VA",
          avg_rent: 1906.35,
          job_count: 1,
          score: 0.922,
          score_percentage: "92.2%",
          reason: "Herndon offers excellent proximity to the Dulles Technology Corridor, making it ideal for tech professionals. With access to Washington DC metro area jobs, good schools, and lower housing costs than nearby Arlington, it's a practical choice for professionals."
        },
        {
          city: "Arlington",
          state: "VA",
          avg_rent: 2178.71,
          job_count: 1,
          score: 0.851,
          score_percentage: "85.1%",
          reason: "Arlington provides exceptional access to government and contractor jobs with an extensive public transit system connecting to DC. The area features excellent schools, vibrant urban villages, and numerous dining and entertainment options."
        },
        {
          city: "San Diego",
          state: "CA",
          avg_rent: 2342.01,
          job_count: 1,
          score: 0.715,
          score_percentage: "71.5%",
          reason: "San Diego offers an unbeatable combination of year-round perfect weather, beautiful beaches, and a growing tech and biotech industry. The city provides a more relaxed lifestyle than other California tech hubs while maintaining excellent career opportunities."
        },
        {
          city: "Rockland",
          state: "MA",
          avg_rent: 2450.00,
          job_count: 1,
          score: 0.625,
          score_percentage: "62.5%",
          reason: "Rockland combines affordable living with proximity to the Boston metro job market. It offers a small-town New England feel with historic charm while providing access to city amenities and coastal recreation options."
        }
      ];
      setRecommendations(mockData);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <SearchForm onSearch={handleSearch} isLoading={isLoading} />
        
        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-8 rounded-md">
            <p>{error}</p>
            <p className="mt-2 text-sm">
              <strong>Troubleshooting:</strong> Make sure the backend server is running with <code>python backend.py</code> in a separate terminal.
              The app is currently showing demo data.
            </p>
          </div>
        )}
        
        {recommendations.length > 0 && (
          <>
            <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
              Top Recommended Locations
            </h2>
            
            <ChartSection data={recommendations} rentBudget={rentBudget} />
            
            <div className="mt-6">
              <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
                Location Details
              </h2>
              
              {recommendations.map((city, index) => (
                <CityCard 
                  key={`${city.city}-${city.state}`} 
                  city={city} 
                  rank={index + 1} 
                />
              ))}
            </div>
          </>
        )}
      </main>
      
      <footer className="bg-white dark:bg-gray-800 py-6 border-t border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4 text-center text-gray-600 dark:text-gray-400 text-sm">
          <p>Powered by HYVE Location Recommendation System</p>
        </div>
      </footer>
    </div>
  );
}
