'use client';

import Image from 'next/image';

export default function Hero() {
  return (
    <section className="hero hero--with-logo hero-blend">
      <div className="hero-logo-wrapper">
        <Image
          src="/images/hawaii-gop-logo.png"
          alt="Hawaii Republican Party Logo"
          width={140}
          height={140}
          priority
        />
      </div>
      <h1>Hawaii Republican Party</h1>
      <p className="hero-subtitle">Help Keep Hawaii Golden! Join the movement for a brighter future.</p>
      <a href="#join" className="cta">Join the Team</a>
    </section>
  );
} 