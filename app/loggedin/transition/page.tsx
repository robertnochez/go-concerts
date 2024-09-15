"use client";
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const TransitionPage: React.FC = () => {
  const router = useRouter();
  const [artistName, setArtistName] = useState<string | null>(null);

  useEffect(() => {
    // Get artistName from query parameters
    const searchParams = new URLSearchParams(window.location.search);
    const artistName = searchParams.get('artistName');
    if (artistName) {
      setArtistName(artistName);
    } else {
      // Redirect or handle the case where artistName is missing
      router.push('/'); // Redirect to homepage or any other page
    }
  }, [router]);

  const handleGenerateMusic = () => {
    if (artistName) {
      router.push(`/loggedin/generate-music?artistName=${artistName}`);
    }
  };

  const handleFindConcerts = () => {
    if (artistName) {
      router.push(`/loggedin/find-concerts?artistName=${artistName}`);
    }
  };

  if (!artistName) {
    return <div className="text-center text-lg text-gray-600">Loading...</div>; // Or handle loading state
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-8">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
        <h1 className="text-4xl font-extrabold text-orange-500 mb-6">What would you like to do with this artist?</h1>
        <p className="text-lg text-gray-700 mb-8">Choose an option below to get started:</p>
        <div className="space-y-6"> 
          <button
            className="bg-orange-500 text-white py-3 px-6 rounded-lg shadow-md hover:bg-orange-600 transition-colors duration-300 w-full"
            onClick={handleGenerateMusic}
          >
            Generate Music
          </button>
          <button
            className="bg-orange-500 text-white py-3 px-6 rounded-lg shadow-md hover:bg-orange-600 transition-colors duration-300 w-full"
            onClick={handleFindConcerts}
          >
            Find Concerts
          </button>
        </div>
      </div>
    </div>
  );
};

export default TransitionPage;
