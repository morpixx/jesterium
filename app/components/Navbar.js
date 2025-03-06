"use client";
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useState } from 'react';
import ConnectWalletModal from './ConnectWalletModal';

export default function Navbar() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <nav className="navbar">
      <div className="logo">
        <img src="/clown-logo.png" alt="Jesterium Logo" width="50" height="50" />
        <span className="site-name">Jesterium</span>
      </div>
      <ul className="menu">
        <li><Link href="/">Home</Link></li>
        <li><Link href="/about">About</Link></li>
        <li><Link href="/tokenomics">Tokenomics</Link></li>
        <li><Link href="/roadmap">Roadmap</Link></li>
        <li><Link href="/community">Community</Link></li>
        <li><Link href="/profile">Profile</Link></li>
        <li><Link href="/faq">FAQ</Link></li>
      </ul>
      <motion.button
        className="connectWallet"
        whileHover={{ scale: 1.1 }}
        onClick={() => setIsModalOpen(true)}
      >
        Connect Wallet
      </motion.button>
      {isModalOpen && (
        <ConnectWalletModal
          onClose={() => setIsModalOpen(false)}
          onSuccess={(wallet) => {
            console.log("Гаманець підключено:", wallet);
            // Виконайте додаткову логіку, якщо потрібно
          }}
        />
      )}
      <style jsx>{`
        .navbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 10px 20px;
          background-color: #f0f0f0;
        }
        .menu {
          list-style: none;
          display: flex;
          gap: 10px;
        }
        .connectWallet {
          padding: 8px 16px;
          border: none;
          background: #0070f3;
          color: #fff;
          border-radius: 4px;
          cursor: pointer;
        }
      `}</style>
    </nav>
  );
}