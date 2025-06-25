'use client';

import Link from 'next/link';

export default function Footer() {
  return (
    <footer>
      <div>Paid for by the Hawaii Republican Party. Not authorized by any candidate or candidate's committee.</div>
      <div>Contact: info@higop.org | 808-555-1234</div>
      <div className="social-links">
        <Link href="#"><i className="fab fa-facebook"></i></Link>
        <Link href="#"><i className="fab fa-twitter"></i></Link>
        <Link href="#"><i className="fab fa-instagram"></i></Link>
      </div>
    </footer>
  );
} 