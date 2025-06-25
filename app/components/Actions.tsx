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
      title: 'Register to Vote',
      description: 'Make sure you\'re registered to vote in Hawaii elections.',
      link: 'https://olvr.hawaii.gov',
      icon: 'fas fa-address-card',
    },
    {
      title: 'Join the Party',
      description: 'Become a member of the Hawaii Republican Party.',
      link: '#join-form',
      icon: 'fas fa-handshake',
    },
    {
      title: 'Get Involved',
      description: 'Find ways to volunteer and make a difference.',
      link: '#',
      icon: 'fas fa-compass',
    },
    {
      title: 'Learn More',
      description: 'Educate yourself about our platform and values.',
      link: '/about',
      icon: 'fas fa-book-open',
    },
    {
      title: 'Find Voting Locations',
      description: 'Locate your nearest polling place and ballot drop boxes.',
      link: 'https://elections.hawaii.gov/voter-service-centers-and-places-of-deposit/',
      icon: 'fas fa-map-marker-alt',
    },
    {
      title: 'Donate',
      description: 'Support our mission to keep Hawaii golden.',
      link: 'https://www.hawaiirepublicanparty.com/donate',
      icon: 'fas fa-donate',
    },
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
          <Link href={action.link} className="action-btn">
            {action.title === 'Register to Vote' ? 'Register Now' :
             action.title === 'Join the Party' ? 'Join Now' :
             action.title === 'Get Involved' ? 'Get Started' :
             action.title === 'Learn More' ? 'Learn More' :
             action.title === 'Find Voting Locations' ? 'Find Locations' :
             action.title === 'Donate' ? 'Donate Now' : 'Learn More'}
          </Link>
        </div>
      ))}
    </section>
  );
} 