import { UserButton } from '@clerk/nextjs';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'; // Ensure import is correct
import ArtistCard from '@/components/spotify/artist-card'; // Import ArtistCard component

interface Artist {
  id: string;
  name: string;
  image: string;
}

const FollowedArtistsGrid: React.FC = () => {
  const [followedArtists, setFollowedArtists] = useState<Artist[]>([]);
  const [relatedArtists, setRelatedArtists] = useState<Artist[]>([]);
  const [loadingFollowed, setLoadingFollowed] = useState<boolean>(true);
  const [loadingRelated, setLoadingRelated] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null); // Added error state
  const accessToken = typeof window !== 'undefined' ? localStorage.getItem('spotifyAccessToken') : null; // Ensure localStorage is accessed only on client-side
  const router = useRouter(); // Correctly use the router hook
  
  const handleReturnHome = () => {
    router.push('/'); // Navigate back to home
  };
  
  useEffect(() => {
    if (!accessToken) return;

    const fetchFollowedArtists = async () => {
      try {
        const response = await fetch('https://api.spotify.com/v1/me/following?type=artist', {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        if (!response.ok) throw new Error('Failed to fetch followed artists');
        const data = await response.json();

        const artistsData = data.artists.items.map((artist: any) => ({
          id: artist.id,
          name: artist.name,
          image: artist.images[0]?.url || '',
        }));

        setFollowedArtists(artistsData);
        setLoadingFollowed(false);

        // Fetch related artists for the first followed artist
        if (artistsData.length > 0) {
          fetchRelatedArtists(artistsData.map((artist: { id: any; }) => artist.id));
        }
      } catch (error) {
        console.error('Error fetching followed artists:', error);
        setError('Error fetching followed artists'); // Set error state
        setLoadingFollowed(false);
      }
    };

    const fetchRelatedArtists = async (artistIds: string[]) => {
      try {
        const responses = await Promise.all(artistIds.map(id =>
          fetch(`https://api.spotify.com/v1/artists/${id}/related-artists`, {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          })
        ));

        const data = await Promise.all(responses.map(res => res.json()));

        const relatedArtistsData = data.flatMap((response: any) =>
          response.artists.map((artist: any) => ({
            id: artist.id,
            name: artist.name,
            image: artist.images[0]?.url || '',
          }))
        );

        setRelatedArtists(relatedArtistsData);
        setLoadingRelated(false);
      } catch (error) {
        console.error('Error fetching related artists:', error);
        setError('Error fetching related artists'); // Set error state
        setLoadingRelated(false);
      }
    };

    fetchFollowedArtists();
  }, [accessToken]);

  if (loadingFollowed || loadingRelated) {
    return <div className="text-center text-lg">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-lg text-red-500">{error}</div>; // Display error message
  }

  return (
    <div className="p-8 relative min-h-screen">
      <div className="flex justify-between items-center mb-10">
        <h2 className="text-5xl font-bold text-left text-orange-500">Your Top Artists</h2>
        <div className="transform scale-125">
          <UserButton />
        </div>
      </div>

      <div className="mb-16">
        <h2 className="text-4xl font-bold text-left text-orange-400 mb-8">Followed Artists</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {followedArtists.map((artist) => (
            <ArtistCard key={artist.id} artist={artist} />
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-4xl font-bold text-left text-orange-400 mb-8">You might also like...</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {relatedArtists.map((artist) => (
            <ArtistCard key={artist.id} artist={artist} />
          ))}
        </div>
      </div>

      {/* Return Home Button */}
      <button
        className="absolute bottom-8 right-8 bg-orange-500 text-white py-2 px-4 rounded-full shadow-lg hover:bg-orange-600 transition-transform transform hover:scale-105"
        onClick={handleReturnHome}
      >
        Return Home
      </button>
    </div>
  );
};

export default FollowedArtistsGrid;
