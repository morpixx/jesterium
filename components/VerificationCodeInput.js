'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function VerificationCodeInput({ email }) {
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  // Обробка зміни окремого поля коду
  const handleChange = (index, value) => {
    if (!/^\d*$/.test(value)) return; // Тільки цифри
    if (value.length > 1) return; // Максимум 1 символ

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    // Автоматичний перехід до наступного поля
    if (value && index < 5) {
      document.getElementById(`verification-input-${index + 1}`).focus();
    }
  };

  // Обробка натискання клавіш для навігації
  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      // Якщо поле порожнє і натиснуто Backspace, перейти до попереднього поля
      document.getElementById(`verification-input-${index - 1}`).focus();
    }
  };

  // Обробка вставки коду
  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').trim();
    
    if (/^\d{6}$/.test(pastedData)) {
      const digits = pastedData.split('');
      setCode(digits);
      // Фокус на останньому полі
      document.getElementById(`verification-input-5`).focus();
    }
  };

  // Відправка коду для перевірки
  const verifyCode = async (e) => {
    e.preventDefault();
    
    const verificationCode = code.join('');
    if (verificationCode.length !== 6) {
      setError('Будь ласка, введіть повний 6-значний код');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/verify-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, code: verificationCode }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Помилка перевірки коду');
      }

      // Успішна верифікація - перенаправлення на головну сторінку або сторінку входу
      router.push('/login?verified=true');
    } catch (err) {
      setError(err.message || 'Сталася помилка при перевірці коду');
    } finally {
      setLoading(false);
    }
  };

  // Повторне надсилання коду
  const resendCode = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/resend-verification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Не вдалося надіслати код повторно');
      }

      alert('Новий код підтвердження надіслано на вашу пошту');
    } catch (err) {
      setError(err.message || 'Помилка при надсиланні нового коду');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="verification-container">
      <h2>Підтвердження електронної пошти</h2>
      <p>
        Ми надіслали код підтвердження на адресу <strong>{email}</strong>.
        Будь ласка, введіть отриманий код нижче:
      </p>

      {error && <div className="error-message">{error}</div>}

      <form onSubmit={verifyCode}>
        <div className="code-inputs">
          {code.map((digit, index) => (
            <input
              key={index}
              id={`verification-input-${index}`}
              type="text"
              maxLength="1"
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              onPaste={index === 0 ? handlePaste : undefined}
              className="code-input"
              required
              autoFocus={index === 0}
            />
          ))}
        </div>

        <button 
          type="submit" 
          className="submit-button" 
          disabled={loading || code.join('').length !== 6}
        >
          {loading ? 'Перевірка...' : 'Підтвердити'}
        </button>
      </form>

      <div className="resend-code">
        <p>Не отримали код?</p>
        <button 
          onClick={resendCode} 
          disabled={loading}
          className="resend-button"
        >
          Надіслати повторно
        </button>
      </div>

      <style jsx>{`
        .verification-container {
          max-width: 500px;
          margin: 0 auto;
          padding: 2rem;
          background-color: #fff;
          border-radius: 8px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        
        h2 {
          text-align: center;
          margin-bottom: 1.5rem;
          font-size: 1.5rem;
          font-weight: bold;
          color: #333;
        }
        
        p {
          margin-bottom: 1.5rem;
          text-align: center;
          color: #666;
        }
        
        .code-inputs {
          display: flex;
          justify-content: space-between;
          margin-bottom: 1.5rem;
        }
        
        .code-input {
          width: 3rem;
          height: 3rem;
          text-align: center;
          font-size: 1.5rem;
          border: 2px solid #ddd;
          border-radius: 8px;
          margin: 0 0.25rem;
        }
        
        .code-input:focus {
          border-color: #0070f3;
          outline: none;
        }
        
        .submit-button {
          width: 100%;
          padding: 0.75rem;
          background-color: #0070f3;
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 1rem;
          cursor: pointer;
          transition: background-color 0.2s;
        }
        
        .submit-button:hover:not(:disabled) {
          background-color: #0060df;
        }
        
        .submit-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        
        .error-message {
          background-color: #fff2f2;
          color: #e00;
          padding: 0.75rem;
          border-radius: 8px;
          margin-bottom: 1.5rem;
          font-size: 0.9rem;
        }
        
        .resend-code {
          margin-top: 1.5rem;
          text-align: center;
        }
        
        .resend-code p {
          margin-bottom: 0.5rem;
          font-size: 0.9rem;
        }
        
        .resend-button {
          background: none;
          color: #0070f3;
          border: none;
          padding: 0;
          font: inherit;
          cursor: pointer;
          text-decoration: underline;
        }
        
        .resend-button:hover:not(:disabled) {
          color: #0060df;
        }
        
        .resend-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
      `}</style>
    </div>
  );
}
