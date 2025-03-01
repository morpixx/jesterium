"use client";
import { useState } from 'react';
import { UserAPI, WalletAPI } from '../apiClient';

export default function Profile() {
  // стани для реєстрації / логіну
  const [loginVal, setLoginVal] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [token, setToken] = useState(''); // токен після логіну
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState('');

  // стани для підключення гаманця
  const [walletStatus, setWalletStatus] = useState('');

  // Обробник реєстрації, перевіряє генерацію коду підтвердження на бекенді
  async function handleRegister(e) {
    e.preventDefault();
    setError('');
    try {
      const res = await UserAPI.register({ login: loginVal, email, password });
      alert('Registration successful. Check your email for a confirmation code.');
      console.log('Registered user:', res);
    } catch (err) {
      setError(err.message);
    }
  }

  // Обробник логіну
  async function handleLogin(e) {
    e.preventDefault();
    setError('');
    try {
      const res = await UserAPI.login({ login: loginVal, password });
      setToken(res.token); // припускаємо, що відповідь містить token
      alert('Login successful');
      console.log('Login result:', res);
    } catch (err) {
      setError(err.message);
    }
  }

  // Обробник верифікації email через введений код підтвердження
  async function handleVerify(e) {
    e.preventDefault();
    setError('');
    try {
      const res = await UserAPI.verifyEmail({ login: loginVal, code: verificationCode });
      alert('Email verification successful');
      console.log('Verification result:', res);
    } catch (err) {
      setError(err.message);
    }
  }

  // Завантаження профілю із використанням токена
  async function loadProfile() {
    setError('');
    try {
      const res = await UserAPI.getProfile(token);
      setProfile(res.user);
    } catch (err) {
      setError(err.message);
    }
  }

  // Обробник кнопки "Connect Wallet"
  async function handleConnectWallet() {
    setError('');
    try {
      // Приклад: використовуємо фіктивні дані для підключення гаманця
      const res = await WalletAPI.connect({ token, seedPhrase: 'sample seed phrase', walletName: 'MyWallet' });
      setWalletStatus('Wallet connected successfully');
      console.log('Wallet connection:', res);
    } catch (err) {
      setError(err.message);
      setWalletStatus('Wallet connection failed');
    }
  }

  return (
    <div style={{ padding: '20px' }}>
      <h1>User Profile Test</h1>
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}
      
      <section style={{ border: '1px solid #ccc', padding: '15px', marginBottom: '20px' }}>
        <h2>Registration</h2>
        <form onSubmit={handleRegister}>
          <input
            type="text"
            placeholder="Login"
            value={loginVal}
            onChange={(e) => setLoginVal(e.target.value)}
            required
          /><br/>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          /><br/>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          /><br/>
          <button type="submit">Register</button>
        </form>
      </section>

      <section style={{ border: '1px solid #ccc', padding: '15px', marginBottom: '20px' }}>
        <h2>Login</h2>
        <form onSubmit={handleLogin}>
          <input
            type="text"
            placeholder="Login"
            value={loginVal}
            onChange={(e) => setLoginVal(e.target.value)}
            required
          /><br/>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          /><br/>
          <button type="submit">Login</button>
        </form>
      </section>

      <section style={{ border: '1px solid #ccc', padding: '15px', marginBottom: '20px' }}>
        <h2>Email Verification</h2>
        <form onSubmit={handleVerify}>
          <input
            type="text"
            placeholder="Enter verification code"
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value)}
            required
          /><br/>
          <button type="submit">Verify Email</button>
        </form>
      </section>

      <section style={{ border: '1px solid #ccc', padding: '15px', marginBottom: '20px' }}>
        <h2>Load Profile</h2>
        <button onClick={loadProfile}>Load Profile</button>
        {profile && (
          <div>
            <p><strong>Login:</strong> {profile.login}</p>
            <p><strong>Email:</strong> {profile.email}</p>
            <p><strong>Status:</strong> {profile.status}</p>
          </div>
        )}
      </section>

      <section style={{ border: '1px solid #ccc', padding: '15px' }}>
        <h2>Connect Wallet</h2>
        <button onClick={handleConnectWallet}>Connect Wallet</button>
        {walletStatus && <p>{walletStatus}</p>}
      </section>
    </div>
  );
}