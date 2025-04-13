"use client";

import { useState } from "react";
import { SearchParams } from "../types";

interface SearchFormProps {
  onSearch: (params: SearchParams) => void;
  isLoading: boolean;
}

export default function SearchForm({ onSearch, isLoading }: SearchFormProps) {
  const [rentBudget, setRentBudget] = useState<number>(2000);
  const [jobTitle, setJobTitle] = useState<string>("Data Scientist");
  const [showAdvanced, setShowAdvanced] = useState<boolean>(false);
  const [rentWeight, setRentWeight] = useState<number>(0.5);
  const [jobWeight, setJobWeight] = useState<number>(0.5);
  const [budgetThreshold, setBudgetThreshold] = useState<number>(0.3);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch({
      rent_budget: rentBudget,
      job_title: jobTitle,
      rent_weight: rentWeight,
      job_weight: jobWeight,
      budget_threshold: budgetThreshold,
    });
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
      <form onSubmit={handleSubmit}>
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <div>
            <label 
              htmlFor="rentBudget" 
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              Monthly Rent Budget ($)
            </label>
            <input
              type="number"
              id="rentBudget"
              min={500}
              max={10000}
              step={100}
              value={rentBudget}
              onChange={(e) => setRentBudget(Number(e.target.value))}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              required
            />
          </div>
          <div>
            <label 
              htmlFor="jobTitle" 
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              Job Title You're Looking For
            </label>
            <input
              type="text"
              id="jobTitle"
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              required
            />
          </div>
        </div>

        <div className="mb-6">
          <button
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="text-blue-600 dark:text-blue-400 hover:underline text-sm focus:outline-none"
          >
            {showAdvanced ? "Hide Advanced Options" : "Show Advanced Options"}
          </button>
          
          {showAdvanced && (
            <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-md">
              <div className="grid md:grid-cols-2 gap-6 mb-4">
                <div>
                  <label 
                    htmlFor="rentWeight" 
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                  >
                    Importance of Rent Match
                  </label>
                  <div className="flex items-center gap-4">
                    <input
                      type="range"
                      id="rentWeight"
                      min={0}
                      max={1}
                      step={0.01}
                      value={rentWeight}
                      onChange={(e) => setRentWeight(Number(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-600"
                    />
                    <span className="text-sm w-12 text-right">{rentWeight.toFixed(2)}</span>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Higher value prioritizes locations with rent closer to your budget
                  </p>
                </div>
                
                <div>
                  <label 
                    htmlFor="jobWeight" 
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                  >
                    Importance of Job Opportunities
                  </label>
                  <div className="flex items-center gap-4">
                    <input
                      type="range"
                      id="jobWeight"
                      min={0}
                      max={1}
                      step={0.01}
                      value={jobWeight}
                      onChange={(e) => setJobWeight(Number(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-600"
                    />
                    <span className="text-sm w-12 text-right">{jobWeight.toFixed(2)}</span>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Higher value prioritizes locations with more job opportunities
                  </p>
                </div>
              </div>
              
              <div>
                <label 
                  htmlFor="budgetThreshold" 
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                  Budget Flexibility (%)
                </label>
                <div className="flex items-center gap-4">
                  <input
                    type="range"
                    id="budgetThreshold"
                    min={0.05}
                    max={0.5}
                    step={0.05}
                    value={budgetThreshold}
                    onChange={(e) => setBudgetThreshold(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-600"
                  />
                  <span className="text-sm w-12 text-right">{Math.round(budgetThreshold * 100)}%</span>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  How much above or below your budget to consider
                </p>
              </div>
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-md transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? "Finding Ideal Locations..." : "Find Ideal Locations"}
        </button>
      </form>
    </div>
  );
} 