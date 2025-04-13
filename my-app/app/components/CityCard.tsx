"use client";

import { LocationRecommendation } from "../types";
import Image from "next/image";

// City-specific images
const cityImages: Record<string, string> = {
  "Atlanta, GA": "https://images.unsplash.com/photo-1575503802870-45de6a6217c8?q=80&w=500",
  "Austin, TX": "https://images.unsplash.com/photo-1531218150217-54595bc2b934?q=80&w=500",
  "Houston, TX": "https://images.unsplash.com/photo-1612896726387-7b96a2f7d83f?q=80&w=500",
  "Chicago, IL": "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?q=80&w=500",
  "Philadelphia, PA": "https://images.unsplash.com/photo-1601751839043-d7bc8b574912?q=80&w=500",
  "Seattle, WA": "https://images.unsplash.com/photo-1502175353174-a7a70e73b362?q=80&w=500",
  "Herndon, VA": "https://images.unsplash.com/photo-1570168389957-cafeb079341a?q=80&w=500",
  "Arlington, VA": "https://images.unsplash.com/photo-1594310698177-d8520b461a35?q=80&w=500",
  "San Diego, CA": "https://images.unsplash.com/photo-1538989256184-faf0853bfed8?q=80&w=500",
  "Rockland, MA": "https://images.unsplash.com/photo-1572722663111-e04237bd2996?q=80&w=500"
};

// Default city images (will be used if specific city images aren't found)
const defaultCityImages: string[] = [
  "https://images.unsplash.com/photo-1519501025264-65ba15a82390?q=80&w=500",
  "https://images.unsplash.com/photo-1518141532615-4305c9f914c9?q=80&w=500",
  "https://images.unsplash.com/photo-1525094764300-dac68f418263?q=80&w=500",
  "https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?q=80&w=500",
  "https://images.unsplash.com/photo-1470723710355-95304d8aece4?q=80&w=500"
];

interface CityCardProps {
  city: LocationRecommendation;
  rank: number;
}

export default function CityCard({ city, rank }: CityCardProps) {
  const cityState = `${city.city}, ${city.state}`;
  const imageUrl = cityImages[cityState] || defaultCityImages[rank % defaultCityImages.length];
  
  return (
    <div className="flex flex-col md:flex-row bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden mb-6 transition-transform duration-300 hover:translate-y-[-4px] hover:shadow-xl">
      <div className="relative w-full md:w-48 h-48 md:h-auto">
        <Image 
          src={imageUrl}
          alt={cityState}
          fill
          style={{ objectFit: 'cover' }}
          sizes="(max-width: 768px) 100vw, 33vw"
          className="w-full h-full"
        />
        <div className="absolute top-3 right-3 bg-blue-600 text-white font-bold rounded-full w-10 h-10 flex items-center justify-center text-lg">
          #{rank}
        </div>
      </div>
      
      <div className="flex-1 p-6">
        <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">
          {cityState}
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-md">
            <p className="text-sm text-gray-500 dark:text-gray-400">Average Rent</p>
            <p className="text-lg font-semibold text-blue-600 dark:text-blue-400">
              ${city.avg_rent.toLocaleString('en-US', { maximumFractionDigits: 2 })}
            </p>
          </div>
          
          <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-md">
            <p className="text-sm text-gray-500 dark:text-gray-400">Job Opportunities</p>
            <p className="text-lg font-semibold text-blue-600 dark:text-blue-400">
              {city.job_count}
            </p>
          </div>
          
          <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-md">
            <p className="text-sm text-gray-500 dark:text-gray-400">Match Score</p>
            <p className="text-lg font-semibold text-blue-600 dark:text-blue-400">
              {city.score_percentage}
            </p>
          </div>
        </div>
        
        <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-md italic text-gray-600 dark:text-gray-300 text-sm">
          {city.reason}
        </div>
      </div>
    </div>
  );
} 