'use client'; // Use client-side rendering

import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input'; // Input component
import { Button } from '@/components/ui/button'; // Button component
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"  // Card component
import { debounce } from 'lodash'; // Import lodash debounce function

// Define the type for the attractions data
interface Attraction {
  name: string;
  id: string;
  url: string;
  images: {
    ratio: string;
    url: string;
    width: number;
    height: number;
    fallback: boolean;
  }[];
}

const AttractionsPage = () => {
  const [keyword, setKeyword] = useState(''); // Stores user input
  const [attractions, setAttractions] = useState<Attraction[]>([]); // Stores the fetched attractions
  const [loading, setLoading] = useState(false); // Tracks loading state
  const [error, setError] = useState<string | null>(null); // Tracks errors
  const [showDropdown, setShowDropdown] = useState(false); // Controls dropdown visibility

  const fetchAttractions = async (searchKeyword: string) => {
    setLoading(true);
    setError(null);

    const baseUrl = 'https://app.ticketmaster.com/discovery/v2/attractions';
    const apiKey = '2SkTVj4HZ45flNjJiC8CrgfVJsnz5zV3';
    const url = `${baseUrl}?apikey=${apiKey}&keyword=${searchKeyword}`;

    try {
      const response = await fetch(url);
      const data = await response.json();

      // Extract the attractions data
      const fetchedAttractions = data._embedded?.attractions || [];
      setAttractions(fetchedAttractions);
      setShowDropdown(true); // Show dropdown after fetching
    } catch (error) {
      console.error('Error fetching attractions:', error);
      setError('Failed to fetch attractions. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Debounce the fetch call to prevent excessive API requests
  const debouncedFetch = debounce(fetchAttractions, 500);

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    setKeyword(input);

    if (input.trim()) {
      debouncedFetch(input);
    } else {
      setAttractions([]); // Clear results if input is empty
      setShowDropdown(false);
    }
  };

  // Handle selection from the dropdown
  const handleSelectAttraction = (attraction: Attraction) => {
    setKeyword(attraction.name); // Set input to the selected name
    setShowDropdown(false); // Hide dropdown after selection
    // Optionally, you can handle any additional logic after selection (e.g., showing more details)
  };

  return (
    <div className="flex flex-col items-center p-6 space-y-6">
      <h1 className="text-4xl font-bold text-center">Artist Search</h1>

      {/* Search Bar */}
      <div className="relative w-full max-w-lg">
        <Input
          placeholder="Enter artist or attraction..."
          value={keyword}
          onChange={handleInputChange} // Update keyword state and fetch attractions
          className="w-full"
        />

        {/* Dropdown for search results */}
        {showDropdown && attractions.length > 0 && (
          <div className="absolute z-10 w-full bg-white border border-gray-300 rounded-lg shadow-lg mt-2 max-h-60 overflow-y-auto">
            {attractions.map((attraction) => (
              <div
                key={attraction.id}
                onClick={() => handleSelectAttraction(attraction)} // Handle item click
                className="p-2 hover:bg-gray-200 cursor-pointer"
              >
                <p className="font-semibold">{attraction.name}</p>
              </div>
            ))}
          </div>
        )}

        {/* Loading and error handling */}
        {loading && <p className="text-blue-600 mt-2">Loading...</p>}
        {error && <p className="text-red-600 mt-2">{error}</p>}
      </div>

      {/* Display selected attraction details */}
      {keyword && (
        <div className="w-full max-w-lg mt-6">
          {attractions.find((attraction) => attraction.name === keyword) ? (
            <Card className="shadow-lg">
              <CardContent>
                <CardTitle>{keyword}</CardTitle>
                {/* Render the first available image */}
                {attractions
                  .find((attraction) => attraction.name === keyword)
                  ?.images?.[0]?.url && (
                  <img
                    src={
                      attractions.find((attraction) => attraction.name === keyword)
                        ?.images?.[0]?.url
                    }
                    alt={keyword}
                    className="mt-4 w-full h-auto rounded-lg"
                    style={{ maxHeight: '300px', objectFit: 'cover' }}
                  />
                )}

                <a
                  href={
                    attractions.find((attraction) => attraction.name === keyword)?.url
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline mt-2 block"
                >
                  View Details
                </a>
              </CardContent>
            </Card>
          ) : (
            <p className="text-center">No artist selected.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default AttractionsPage;
