import './globals.css';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Navbar from './components/Navbar';

export const metadata = {
  title: 'Jesterium',
  description: 'Jesterium – crypto that brings a smile!',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <header>
          <Navbar />
        </header>
        <main>{children}</main>
        <footer>
          <div className="footer-content">
            <p>Contact us: info@jesterium.com</p>
            <div className="social-links">
              <a href="https://discord.com/" target="_blank" rel="noopener noreferrer">Discord</a>
              <a href="https://twitter.com/" target="_blank" rel="noopener noreferrer">Twitter</a>
              <a href="https://telegram.org/" target="_blank" rel="noopener noreferrer">Telegram</a>
            </div>
            <p>
              &copy; 2025 Jesterium. All rights reserved.{' '}
              <a href="/whitepaper.pdf" target="_blank" rel="noopener noreferrer">
                Whitepaper
              </a>
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}