"use client";
import { useEffect, useState } from 'react';

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState('');

  // Для теста используем пример токена – в реальном случае его нужно получать через авторизацию
  const token = 'sample-token-for-testing';

  async function fetchProfile() {
    try {
      const res = await fetch(process.env.NEXT_PUBLIC_API_URL + '/users/profile', {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      if (!res.ok) {
        throw new Error('Failed to fetch profile');
      }
      const data = await res.json();
      setProfile(data);
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