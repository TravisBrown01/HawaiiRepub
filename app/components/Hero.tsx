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
      <a href="https://thehawaiirepublicanparty.us7.list-manage.com/subscribe?u=845fb1aa8ab3a817a0be98519&id=d918fb2428" target="_blank" rel="noopener noreferrer" className="cta">Join the Team</a>
    </section>
  );
} 