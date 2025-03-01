"use client";
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function Navbar() {
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
        onClick={() => alert('Connect wallet clicked!')}
      >
        Connect Wallet
      </motion.button>
      <style jsx>{`
        .navbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: #222;
          color: #fff;
          padding: 10px 20px;
        }
        .logo {
          display: flex;
          align-items: center;
        }
        .site-name {
          font-size: 1.5rem;
          margin-left: 10px;
        }
        .menu {
          list-style: none;
          display: flex;
          gap: 15px;
          margin: 0;
          padding: 0;
        }
        .connectWallet {
          background: #ffcc00;
          border: none;
          padding: 8px 12px;
          cursor: pointer;
          font-weight: bold;
        }
      `}</style>
    </nav>
  );
}