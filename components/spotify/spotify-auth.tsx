"use client";

import React from 'react';

const clientId = 'bd6e665b447f475285d6ff6f6dccea71';
const redirectUri = 'http://localhost:3000/loggedin/callback'; // Update this to your redirect URI
const scopes = [
  'user-follow-read', // The scope you need to get followed artists
  'user-read-private',
  // Add other scopes as needed
].join('%20');

const AUTH_URL = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&redirect_uri=${encodeURIComponent(
  redirectUri
)}&scope=${scopes}`;

const SpotifyLogin = () => {
  const handleLogin = () => {
    window.location.href = AUTH_URL; // Redirects to Spotify authentication
  };

  return (
    <div className="login-page">
      <button onClick={handleLogin} className="mx-2 text-white py-3 px-2 p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-purple-400 to-orange-400 group-hover:from-purple-400 group-hover:to-orange-400 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800">Log in with Spotify</button>
    </div>
  );
};

export default SpotifyLogin;
