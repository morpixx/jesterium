"use client";
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function Home() {
  return (
    <div className="home-container">
      <motion.div
        className="banner"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <img src="/clown-juggling-coins.gif" alt="Juggling Clown" className="banner-img" />
        <h1>Have fun with Jesterium – crypto that brings a smile!</h1>
        <p>Experience the fusion of fun and blockchain technology.</p>
        <Link href="/about">
          <button className="learn-more">Learn More</button>
        </Link>
      </motion.div>
      <style jsx>{`
        .home-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 40px;
        }
        .banner {
          background: linear-gradient(135deg, #ffcc00, #ff9900);
          border-radius: 10px;
          padding: 20px;
          text-align: center;
          animation: bannerAnimation 5s ease-in-out infinite;
        }
        .banner-img {
          width: 300px;
          height: auto;
        }
        .learn-more {
          background: #222;
          color: #fff;
          border: none;
          padding: 10px 20px;
          margin-top: 20px;
          cursor: pointer;
        }
        @keyframes bannerAnimation {
          0% { filter: hue-rotate(0deg); }
          50% { filter: hue-rotate(180deg); }
          100% { filter: hue-rotate(360deg); }
        }
      `}</style>
    </div>
  );
}