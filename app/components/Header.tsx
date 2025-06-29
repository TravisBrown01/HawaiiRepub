'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isElectionDropdownOpen, setIsElectionDropdownOpen] = useState(false);
  const [isResourcesDropdownOpen, setIsResourcesDropdownOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleElectionDropdown = () => {
    setIsElectionDropdownOpen((open) => {
      if (!open) setIsResourcesDropdownOpen(false);
      return !open;
    });
  };

  const toggleResourcesDropdown = () => {
    setIsResourcesDropdownOpen((open) => {
      if (!open) setIsElectionDropdownOpen(false);
      return !open;
    });
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
      <Link href="/" className="logo desktop-only" aria-label="Hawaii Republican Party Home">
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
        <Link href="/" onClick={() => setIsMenuOpen(false)}>Home</Link>
        
        <div className="nav-dropdown">
          <button 
            className="nav-dropdown-btn"
            onClick={toggleElectionDropdown}
            aria-expanded={isElectionDropdownOpen}
          >
            Election
            <i className={`fas fa-chevron-down ${isElectionDropdownOpen ? 'rotate' : ''}`}></i>
          </button>
          <div className={`nav-dropdown-menu ${isElectionDropdownOpen ? 'show' : ''}`}>
            <Link href="/election-education" onClick={() => { setIsMenuOpen(false); setIsElectionDropdownOpen(false); }}>
              How to Vote
            </Link>
            <Link href="/election-integrity" onClick={() => { setIsMenuOpen(false); setIsElectionDropdownOpen(false); }}>
              Election Integrity
            </Link>
          </div>
        </div>
        
        <div className="nav-dropdown">
          <button 
            className="nav-dropdown-btn"
            onClick={toggleResourcesDropdown}
            aria-expanded={isResourcesDropdownOpen}
          >
            Resources
            <i className={`fas fa-chevron-down ${isResourcesDropdownOpen ? 'rotate' : ''}`}></i>
          </button>
          <div className={`nav-dropdown-menu ${isResourcesDropdownOpen ? 'show' : ''}`}>
            <Link href="/platform" onClick={() => { setIsMenuOpen(false); setIsResourcesDropdownOpen(false); }}>
              Platform
            </Link>
            <Link href="/counties" onClick={() => { setIsMenuOpen(false); setIsResourcesDropdownOpen(false); }}>
              Counties
            </Link>
            <Link href="/events" onClick={() => { setIsMenuOpen(false); setIsResourcesDropdownOpen(false); }}>
              Events
            </Link>
          </div>
        </div>
        
        <Link href="/about" onClick={() => setIsMenuOpen(false)}>About</Link>
        <Link href="https://secure.winred.com/hawaiigop/storefront/" target="_blank" rel="noopener noreferrer" onClick={() => setIsMenuOpen(false)}>Store</Link>
        <Link href="/donate" onClick={() => setIsMenuOpen(false)}>Donate</Link>
      </nav>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="mobile-overlay" onClick={() => setIsMenuOpen(false)}></div>
      )}
    </header>
  );
} 