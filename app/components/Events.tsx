"use client";

import React, { useEffect, useState } from 'react';
import { listEvents } from '../../src/graphql/queries';
import Link from 'next/link';
import { useAmplifyClient } from '../hooks/useAmplifyClient';

interface Event {
  id: string;
  title: string;
  date: string;
  endDate?: string;
  startTime?: string;
  endTime?: string;
  location: string;
  aboutEvent?: string;
  details?: string;
  organizer?: string;
  contactDetails?: string;
  hostingOrganization?: string;
  owner?: string;
}

export default function Events() {
  const client = useAmplifyClient();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await client.graphql({
          query: listEvents,
          variables: {
            filter: {},
            limit: 12 // fetch more than 3 to allow sorting/filtering
          },
          authMode: 'apiKey'
        });
        let items: Event[] = [];
        if ('data' in result && result.data?.listEvents?.items) {
          items = result.data.listEvents.items;
        }
        // Filter for upcoming events only
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        items = items.filter((event: Event) => {
          const eventDate = new Date(event.date);
          eventDate.setHours(0, 0, 0, 0);
          if (event.endDate) {
            const endDate = new Date(event.endDate);
            endDate.setHours(0, 0, 0, 0);
            return endDate >= today;
          }
          return eventDate >= today;
        });
        // Sort by soonest first
        items.sort((a: Event, b: Event) => new Date(a.date).getTime() - new Date(b.date).getTime());
        setEvents(items.slice(0, 4));
      } catch (err: any) {
        setError('Failed to load events');
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  if (!loading && !error && events.length === 0) {
    return null;
  }

  return (
    <section className="events-section">
      <h2 className="events-headline">Upcoming Events</h2>
      <div className="events-list">
        {loading ? (
          <div className="text-center py-8 text-gray-500">Loading events...</div>
        ) : error ? (
          <div className="text-center py-8 text-red-500">{error}</div>
        ) : (
          events.map((event) => (
            <div className="event-card" key={event.id}>
              <div className="event-date">
                {event.endDate && event.endDate !== event.date ? (
                  <>{formatDateRange(event.date, event.endDate)}</>
                ) : (
                  <>{formatDate(event.date)}</>
                )}
              </div>
              <div className="event-info">
                <h3>{event.title}</h3>
                <p>{event.aboutEvent}</p>
                <Link href={`/events/${event.id}`} className="event-link">Learn More</Link>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
}

function formatDate(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
}

function formatDateRange(start: string, end: string) {
  const startDate = new Date(start);
  const endDate = new Date(end);
  if (startDate.getMonth() === endDate.getMonth() && startDate.getFullYear() === endDate.getFullYear()) {
    // Same month/year
    return `${startDate.toLocaleDateString('en-US', { month: 'long' })} ${startDate.getDate()} - ${endDate.getDate()} ${endDate.getFullYear()}`;
  }
  return `${formatDate(start)} - ${formatDate(end)}`;
} 