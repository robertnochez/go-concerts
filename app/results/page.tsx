"use client";
import { useEffect, useState } from "react";
const ticketMasterAPI = "tIFMmGfVlsC4GUkeBLlBCOxtZ91xYiBE"

export const searchArtist = async (artistName: string ) => {
  artistName = "adele";
  const ticketMasterResponse = await fetch(`https://app.ticketmaster.com/discovery/v2/events.json?keyword=${encodeURIComponent(artistName)}&apikey=${ticketMasterAPI}`);
  console.log(ticketMasterResponse)
  const data = await ticketMasterResponse.json();
  return data;
};

const ArtistSearchPage = () => {
  const [artistData, setArtistData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchArtistData = async () => {
      try {
        const data = await searchArtist("adele");
        setArtistData(data);
      } catch (err) {
        setError("Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };

    fetchArtistData();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <h1>Artist Search Results</h1>
      <pre>{JSON.stringify(artistData, null, 2)}</pre>
    </div>
  );
};

export default ArtistSearchPage;