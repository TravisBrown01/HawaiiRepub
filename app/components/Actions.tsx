'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';

export default function Actions() {
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.3 }
    );

    cardsRef.current.forEach((card) => {
      if (card) {
        observer.observe(card);
      }
    });

    return () => observer.disconnect();
  }, []);

  const actions = [
    {
      icon: 'fa-regular fa-address-card',
      title: 'Register to Vote',
      description: 'Make your voice heard in Hawaii. Register to vote today and participate in our democracy.',
      link: 'https://olvr.hawaii.gov',
      linkText: 'Register Now'
    },
    {
      icon: 'fa-regular fa-handshake',
      title: 'Volunteer',
      description: 'Join our team of passionate volunteers and help make a difference in your community.',
      link: '#',
      linkText: 'Volunteer Today'
    },
    {
      icon: 'fa-regular fa-compass',
      title: 'Find Your Local GOP',
      description: 'Connect with your local Republican Party chapter and get involved at the county level.',
      link: '#',
      linkText: 'View Counties'
    },
    {
      icon: 'fa-regular fa-book-open',
      title: 'Election Education',
      description: 'Learn about the election process, your rights as a voter, and how to make your vote count.',
      link: '#',
      linkText: 'Learn More'
    },
    {
      icon: 'fa-regular fa-map-marker-alt',
      title: 'Where to Vote',
      description: 'Find your nearest polling place and get all the information you need to cast your ballot.',
      link: 'https://elections.hawaii.gov/voter-service-centers-and-places-of-deposit/',
      linkText: 'Find Polling Place'
    },
    {
      icon: 'fa-regular fa-donate',
      title: 'Donate',
      description: 'Support our mission and help us build a brighter future for Hawaii. Every contribution counts.',
      link: 'https://secure.winred.com/hawaiigop/donate',
      linkText: 'Donate Now'
    }
  ];

  return (
    <section className="actions">
      {actions.map((action, index) => (
        <div
          key={index}
          className="card"
          ref={(el) => {
            cardsRef.current[index] = el;
          }}
        >
          <span className="icon">
            <i className={action.icon}></i>
          </span>
          <h3>{action.title}</h3>
          <p>{action.description}</p>
          <Link href={action.link} className="action-btn">{action.linkText}</Link>
        </div>
      ))}
    </section>
  );
} 