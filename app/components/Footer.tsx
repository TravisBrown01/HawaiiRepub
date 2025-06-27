'use client';

import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="apple-footer">
      <div className="footer-main">
        <div className="footer-brand">
          <div className="footer-logo-text">Hawaii Republican Party</div>
          <div className="footer-meta">Paid for by the Hawaiʻi Republican Party<br />808-543-6469 | c/o 500 Ala Moana Blvd Suite 7400 Honolulu HI 96813<br />Not authorized by any candidate or candidate committee.</div>
        </div>
        <div className="footer-social">
          <a href="https://www.facebook.com/HawaiiRepublicanParty" target="_blank" rel="noopener noreferrer" aria-label="Facebook"><i className="fab fa-facebook"></i></a>
          <a href="https://x.com/thehawaiigop" target="_blank" rel="noopener noreferrer" aria-label="Twitter"><i className="fab fa-twitter"></i></a>
          <a href="https://www.instagram.com/republicanpartyhawaii/" target="_blank" rel="noopener noreferrer" aria-label="Instagram"><i className="fab fa-instagram"></i></a>
        </div>
      </div>
      <div className="footer-divider"></div>
      <div className="footer-bottom">
        <div>Copyright © 2025 The Hawaii Republican Party - All Rights Reserved.</div>
        <div>Powered by Kailua Media LLC.</div>
      </div>
    </footer>
  );
} 