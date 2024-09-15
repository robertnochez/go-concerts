"use client";
import React, { useState, useEffect } from 'react';

interface Event {
  id: string;
  dates: {
    start: {
      localDate: string;
    };
  };
  _embedded: {
    venues: {
      name: string;
      city: {
        name: string;
      };
      country: {
        name: string;
      };
    }[];
  };
  url: string; // Assuming event URL is part of the event object
}

const ArtistEventSearch = () => {
  const [artistName, setArtistName] = useState('');
  const [events, setEvents] = useState<Event[]>([]);
  const [error, setError] = useState('');

  const fetchArtistId = async (artist: string) => {
    const apiKey = '2SkTVj4HZ45flNjJiC8CrgfVJsnz5zV3';
    const url = `https://app.ticketmaster.com/discovery/v2/attractions.json?keyword=${artist}&apikey=${apiKey}`;
    try {
      const response = await fetch(url);
      const data = await response.json();
      if (data && data._embedded && data._embedded.attractions.length > 0) {
        return data._embedded.attractions[0].id; // Get the first matching artist's ID
      } else {
        setError('Artist not found');
        return null;
      }
    } catch (error) {
      console.error('Error fetching artist ID:', error);
      setError('Error fetching artist');
      return null;
    }
  };

  const fetchArtistEvents = async (artistId: string) => {
    const apiKey = '2SkTVj4HZ45flNjJiC8CrgfVJsnz5zV3';
    const url = `https://app.ticketmaster.com/discovery/v2/events.json?attractionId=${artistId}&apikey=${apiKey}`;
    try {
      const response = await fetch(url);
      const data = await response.json();
      if (data && data._embedded && data._embedded.events) {
        setEvents(data._embedded.events); // Set events data
        setError('');
      } else {
        setError('No events found for this artist');
      }
    } catch (error) {
      console.error('Error fetching events:', error);
      setError('Error fetching events');
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    const artistId = await fetchArtistId(artistName);
    if (artistId) {
      await fetchArtistEvents(artistId);
    }
  };

  // Function to generate a random price between $50 and $200
  const getRandomPrice = () => {
    const min = 50;
    const max = 200;
    return (Math.random() * (max - min) + min).toFixed(2);
  };

  return (
    <div>
      <form onSubmit={handleSearch}>
        <input
          type="text"
          value={artistName}
          onChange={(e) => setArtistName(e.target.value)}
          placeholder="Enter artist name"
        />
        <button type="submit">Search Events</button>
      </form>

      {error && <p>{error}</p>}

      <div>
        {events.length > 0 && (
          <table className="min-w-full bg-white">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b">Date of Event</th>
                <th className="py-2 px-4 border-b">Location</th>
                <th className="py-2 px-4 border-b">Venue</th>
                <th className="py-2 px-4 border-b">Price</th>
              </tr>
            </thead>
            <tbody>
              {events.map((event) => (
                <tr key={event.id}>
                  <td className="py-2 px-4 border-b">{event.dates.start.localDate}</td>
                  <td className="py-2 px-4 border-b">
                    {event._embedded.venues[0].city.name}, {event._embedded.venues[0].country.name}
                  </td>
                  <td className="py-2 px-4 border-b">{event._embedded.venues[0].name}</td>
                  <td className="py-2 px-4 border-b">
                    <a
                      href={event.url} // Use the event URL for the button's link
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <button className="bg-blue-500 text-white px-4 py-2 rounded">
                        Buy Tickets: ${getRandomPrice()}
                      </button>
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
