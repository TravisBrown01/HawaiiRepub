'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.classList.add('menu-open');
    } else {
      document.body.classList.remove('menu-open');
    }

    // Cleanup on unmount
    return () => {
      document.body.classList.remove('menu-open');
    };
  }, [isMenuOpen]);

  return (
    <header className="header">
      <Link href="/" className="logo" aria-label="Hawaii Republican Party Home">
        <Image
          src="/images/hawaii-gop-logo.png"
          alt="Hawaii Republican Party Logo"
          width={60}
          height={60}
          priority
        />
      </Link>
      
      {/* Mobile Menu Button */}
      <button 
        className="mobile-menu-btn"
        onClick={toggleMenu}
        aria-label="Toggle navigation menu"
      >
        <span className={`hamburger ${isMenuOpen ? 'open' : ''}`}></span>
      </button>

      {/* Navigation */}
      <nav className={`nav ${isMenuOpen ? 'nav-open' : ''}`}>
        <Link href="/about" onClick={() => setIsMenuOpen(false)}>About</Link>
        <Link href="/election-integrity" onClick={() => setIsMenuOpen(false)}>Election Integrity</Link>
        <Link href="#" onClick={() => setIsMenuOpen(false)}>Convention</Link>
        <Link href="#" onClick={() => setIsMenuOpen(false)}>Resources</Link>
        <Link href="#" onClick={() => setIsMenuOpen(false)}>Store</Link>
        <Link href="#" onClick={() => setIsMenuOpen(false)}>Contact</Link>
      </nav>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="mobile-overlay" onClick={() => setIsMenuOpen(false)}></div>
      )}
    </header>
  );
} 