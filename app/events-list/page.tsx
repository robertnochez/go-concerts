"use client";
import React, { useState } from 'react';

const ArtistEventSearch = () => {
  const [artistName, setArtistName] = useState('');
  const [events, setEvents] = useState([]);
  const [error, setError] = useState('');

  const fetchArtistId = async (artist: string) => {
    const apiKey = '2SkTVj4HZ45flNjJiC8CrgfVJsnz5zV3';
    const url = `https://app.ticketmaster.com/discovery/v2/attractions.json?keyword=${artist}&apikey=${apiKey}`;
    try {
      const response = await fetch(url);
      const data = await response.json();
      if (data && data._embedded && data._embedded.attractions.length > 0) {
        return data._embedded.attractions[0].id;  // Get the first matching artist's ID
      } else {
        setError('Artist not found');
        return null;
      }
    } catch (error) {
      console.error('Error fetching artist ID:', error);
      setError('Error fetching artist');
    }
  };

  const fetchArtistEvents = async (artistId: any) => {
    const apiKey = '2SkTVj4HZ45flNjJiC8CrgfVJsnz5zV3';
    const url = `https://app.ticketmaster.com/discovery/v2/events.json?attractionId=${artistId}&apikey=${apiKey}`;
    try {
      const response = await fetch(url);
      const data = await response.json();
      if (data && data._embedded && data._embedded.events) {
        setEvents(data._embedded.events);  // Set events data
        setError('');
      } else {
        setError('No events found for this artist');
      }
    } catch (error) {
      console.error('Error fetching events:', error);
      setError('Error fetching events');
    }
  };

  const handleSearch = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    const artistId = await fetchArtistId(artistName);
    if (artistId) {
      await fetchArtistEvents(artistId);
    }
  };

  return (
    <div className="flex h-full w-full flex-col items-center justify-center">
      <div className="text-2xl mt-12">
          Find your favorite artists performing
        </div>
      <div className="mt-8 flex flex-col gap-4">
        <form
          onSubmit={handleSearch}
          className="px-24"
        >
          <input
            type="text"
            className="py-2 px-4 w-96 rounded-sm mx-4 border-2 mb-12"
            value={artistName}
            onChange={(e) => setArtistName(e.target.value)}
            placeholder="Enter artist name"
          />
          <button type="submit" className="bg-blue-400 px-4 py-2 rounded-sm">Search Events</button>
        </form>
        {error && <p>{error}</p>}
      </div>

      

      <div>
        {events.length > 0 && (
          <table className="min-w-full bg-white">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b">Date of Event</th>
                <th className="py-2 px-4 border-b">Location</th>
                <th className="py-2 px-4 border-b">Venue</th>
                <th className="py-2 px-4 border-b">Buy Tickets</th>
              </tr>
            </thead>
            <tbody>
              {events.map((event) => (
                <tr key={event.id}>
                  <td className="py-2 px-4 border-b">{event.dates.start.localDate}</td>
                  <td className="py-2 px-4 border-b">{event._embedded.venues[0].city.name}, {event._embedded.venues[0].country.name}</td>
                  <td className="py-2 px-4 border-b">{event._embedded.venues[0].name}</td>
                  <td className="py-2 px-4 border-b">
                    <a href={event.url} target="_blank" rel="noopener noreferrer">
                      <button className="bg-blue-500 text-white px-4 py-2 rounded">Buy Tickets</button>
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default ArtistEventSearch;
