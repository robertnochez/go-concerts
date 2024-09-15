"use client"
import React, { useEffect } from 'react';
import { useRouter } from "next/navigation";


const Callback = () => {
  const router = useRouter();
  const hash = window.location.hash.substring(1);
  const params = new URLSearchParams(hash);
  const accessToken = params.get('access_token');

  if (accessToken) {
    // Save the access token to localStorage or state management
    localStorage.setItem('spotifyAccessToken', accessToken);

    // Redirect the user to the homepage or another page
    router.push(`/loggedin/profile`);
  }

  return <div>Logging you in...</div>;
};

export default Callback;
