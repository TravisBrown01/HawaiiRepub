'use client';

import Link from 'next/link';

export default function Footer() {
  return (
    <footer>
      <div>Paid for by the Hawaii Republican Party. Not authorized by any candidate or candidate's committee.</div>
      <div>Contact: info@higop.org | 808-555-1234</div>
      <div className="socials">
        <Link href="#"><i className="fa-regular fa-facebook"></i></Link>
        <Link href="#"><i className="fa-regular fa-twitter"></i></Link>
        <Link href="#"><i className="fa-regular fa-instagram"></i></Link>
      </div>
    </footer>
  );
} 