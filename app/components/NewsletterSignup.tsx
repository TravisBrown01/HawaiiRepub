'use client';
import { useState } from 'react';

export default function NewsletterSignup() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    // Here you would handle the actual signup logic
  };

  return (
    <section className="newsletter-section">
      <h2 className="newsletter-headline">Stay Connected</h2>
      <p className="newsletter-desc">Sign up for updates, news, and events from the Hawaii Republican Party.</p>
      {submitted ? (
        <div className="newsletter-success">Thank you for subscribing!</div>
      ) : (
        <form className="newsletter-form" onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Your email address"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            className="newsletter-input"
          />
          <button type="submit" className="newsletter-btn">Sign Up</button>
        </form>
      )}
    </section>
  );
} 