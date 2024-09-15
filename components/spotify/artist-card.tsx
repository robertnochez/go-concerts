import React from 'react';
import { useRouter } from 'next/navigation';

interface Artist {
  id: string;
  name: string;
  image: string;
}

const ArtistCard: React.FC<{ artist: Artist }> = ({ artist }) => {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/loggedin/transition?artistName=${artist.name}`); // Navigate to the transition page with artist ID
  };

  return (
    <div onClick={handleClick} className="flex flex-col items-center text-center cursor-pointer">
      <div className="w-28 h-28 rounded-full overflow-hidden shadow-lg transition-transform duration-300 transform hover:scale-110">
        <img src={artist.image} alt={artist.name} className="w-full h-full object-cover" />
      </div>
      <p className="mt-3 text-sm font-semibold truncate w-28 text-orange-300 hover:text-orange-400">
        {artist.name}
      </p>
    </div>
  );
};

export default ArtistCard;
