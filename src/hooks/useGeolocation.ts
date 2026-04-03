// 'use client';

// import { useState, useEffect } from 'react';

// export function useGeolocation() {
//  const [coords, setCoords] = useState<{lat: number; lon: number} | null>(null);
//  const [error, setError] = useState<string | null>(null);

//  useEffect(() => {
//    navigator.geolocation.getCurrentPosition(
//      (pos) => setCoords({ lat: pos.coords.latitude, lon: pos.coords.longitude }),
//      (err) => setError(err.message)
//    );
//  }, []);

//  return { coords, error };
// }