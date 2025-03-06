import { useState } from 'react';

export default function VerifyEmailForm() {
  const [login, setLogin] = useState('');
  const [code, setCode] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleVerify = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');
    try {
      const response = await fetch('/api/users/verify-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ login, code }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Verification failed');
      }
      setMessage(data.message || 'Email successfully verified!');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="verify-email-form">
      <h2>Підтвердження Email</h2>
      <form onSubmit={handleVerify}>
        <label>
          Login:
          <input
            type="text"
            value={login}
            onChange={(e) => setLogin(e.target.value)}
            required
          />
        </label>
        <br />
        <label>
          Код підтвердження:
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            required
          />
        </label>
        <br />
        <button type="submit" disabled={loading}>
          {loading ? 'Перевірка...' : 'Підтвердити'}
        </button>
      </form>
      {message && <p style={{ color: 'green' }}>{message}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <style jsx>{`
        .verify-email-form {
          max-width: 400px;
          margin: 20px auto;
          padding: 20px;
          border: 1px solid #ccc;
          border-radius: 8px;
        }
        label {
          display: block;
          margin-bottom: 10px;
        }
        input {
          width: 100%;
          padding: 8px;
          margin-top: 4px;
          box-sizing: border-box;
        }
        button {
          padding: 10px 20px;
          background: #0070f3;
          color: #fff;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }
        button:disabled {
          background: #aaa;
        }
      `}</style>
    </div>
  );
}