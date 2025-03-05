"use client";
import { useEffect, useState } from 'react';

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState('');

  async function fetchProfile() {
    try {
      const token = localStorage.getItem("token");
      console.log("Токен з localStorage:", token);
      
      const res = await fetch(process.env.NEXT_PUBLIC_API_URL + '/users/profile', {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Не вдалося завантажити профіль");
      }
      
      const data = await res.json();
      setProfile(data.user || data);
    } catch (err) {
      setError(err.message);
    }
  }

  useEffect(() => {
    fetchProfile();
  }, []);

  return (
    <div className="profile-container">
      <h1>User Profile</h1>
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}
      {profile ? (
        <>
          <p><strong>Login:</strong> {profile.login || 'N/A'}</p>
          <p><strong>Email:</strong> {profile.email || 'N/A'}</p>
          <p><strong>Status:</strong> {profile.status || 'N/A'}</p>
        </>
      ) : (
        <p>Loading profile...</p>
      )}
      <style jsx>{`
        .profile-container {
          padding: 40px;
          text-align: center;
        }
      `}</style>
    </div>
  );
}