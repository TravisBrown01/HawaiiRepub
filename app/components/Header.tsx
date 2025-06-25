'use client';

import Link from 'next/link';
import Image from 'next/image';

export default function Header() {
  return (
    <header>
      <Link href="/" className="logo" aria-label="Hawaii Republican Party Home">
        <Image
          src="/images/hawaii-gop-logo.png"
          alt="Hawaii Republican Party Logo"
          width={60}
          height={60}
          priority
        />
      </Link>
      <nav>
        <Link href="/about">About</Link>
        <Link href="#">Election Integrity</Link>
        <Link href="#">Convention</Link>
        <Link href="#">Resources</Link>
        <Link href="#">Store</Link>
        <Link href="#">Contact</Link>
      </nav>
    </header>
  );
} 