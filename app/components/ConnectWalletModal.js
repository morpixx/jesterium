"use client";
import { useState } from 'react';
import { WalletAPI } from '../apiClient';

export default function ConnectWalletModal({ onClose, onSuccess }) {
  const walletOptions = ["Phantom", "TrustWallet", "Metamask"];
  const [selectedWallet, setSelectedWallet] = useState("");
  const [connectionType, setConnectionType] = useState(""); // "dapp" або "seedPhrase"
  const [seedPhrase, setSeedPhrase] = useState("");
  const [loading, setLoading] = useState(false);

  const handleWalletSelect = (wallet) => {
    setSelectedWallet(wallet);
    setConnectionType("");
  };

  const handleConnect = async () => {
    setLoading(true);
    try {
      // Отримання токена (наприклад, з localStorage)
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Будь ласка, увійдіть у свій акаунт");
        setLoading(false);
        return;
      }

      let payload = { walletName: selectedWallet, connectionType };
      if (connectionType === "seedPhrase") {
        payload.seedPhrase = seedPhrase;
      }
      
      let response;
      if (connectionType === "seedPhrase") {
        response = await WalletAPI.connect(payload, token);
      } else if (connectionType === "dapp") {
        response = await WalletAPI.connectDapp(payload, token);
      }
      
      if (response.success) {
        onSuccess(response.wallet);
        onClose();
      } else {
        alert("Помилка: " + response.error);
      }
    } catch (error) {
      console.error("Connection error:", error);
      alert("Connection error: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>Підключення гаманця</h2>
        <div>
          <p>Виберіть гаманець:</p>
          {walletOptions.map((wallet) => (
            <button
              key={wallet}
              onClick={() => handleWalletSelect(wallet)}
              style={{
                backgroundColor: selectedWallet === wallet ? 'lightblue' : ''
              }}
            >
              {wallet}
            </button>
          ))}
        </div>

        {selectedWallet && !connectionType && (
          <div>
            <p>Оберіть спосіб підключення:</p>
            <button onClick={() => setConnectionType("dapp")}>
              Dapp (без seed phrase)
            </button>
            <button onClick={() => setConnectionType("seedPhrase")}>
              Seed Phrase
            </button>
          </div>
        )}

        {connectionType === "seedPhrase" && (
          <div>
            <p>Введіть ваш Seed Phrase:</p>
            <textarea
              value={seedPhrase}
              onChange={(e) => setSeedPhrase(e.target.value)}
              placeholder="Введіть ваш seed phrase"
            />
          </div>
        )}

        <div className="modal-actions">
          <button onClick={onClose} disabled={loading}>
            Скасувати
          </button>
          <button
            onClick={handleConnect}
            disabled={
              loading ||
              !selectedWallet ||
              !connectionType ||
              (connectionType === "seedPhrase" && seedPhrase.trim() === "")
            }
          >
            {loading ? "Підключення..." : "Підключити"}
          </button>
        </div>
      </div>
      <style jsx>{`
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0,0,0,0.5);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .modal {
          background: #fff;
          padding: 20px;
          border-radius: 10px;
          width: 400px;
        }
        .modal-actions {
          display: flex;
          justify-content: flex-end;
          gap: 10px;
          margin-top: 20px;
        }
        textarea {
          width: 100%;
          height: 60px;
        }
      `}</style>
    </div>
  );
}