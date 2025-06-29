'use client';

import React, { useEffect, useState } from 'react';
import { getEvent } from '../../../src/graphql/queries';
import { useAmplifyClient } from '../../hooks/useAmplifyClient';
import Link from 'next/link';
import { FormattedContent } from '../../components/FormattedContent';

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
  registrationLink?: string;
  registrationType?: string;
  owner?: string;
}

export default function EventDetailPage() {
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const client = useAmplifyClient();

  // Parse YYYY-MM-DD as local date (no timezone conversion)
  const parseLocalDate = (dateString: string): Date => {
    const match = dateString.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
    if (!match) {
      throw new Error(`Invalid date format: ${dateString}`);
    }
    const year = parseInt(match[1]);
    const month = parseInt(match[2]) - 1; // Month is 0-indexed
    const day = parseInt(match[3]);
    return new Date(year, month, day);
  };

  const calculateDuration = (startTime: string, endTime: string): string => {
    const start = new Date(`2000-01-01T${startTime}`);
    const end = new Date(`2000-01-01T${endTime}`);
    const diffMs = end.getTime() - start.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    
    if (diffHours > 0) {
      return `${diffHours}h ${diffMinutes > 0 ? `${diffMinutes}m` : ''}`;
    }
    return `${diffMinutes}m`;
  };

  useEffect(() => {
    const fetchEvent = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const pathSegments = window.location.pathname.split('/');
        const eventId = pathSegments[pathSegments.length - 1];
        
        const result = await client.graphql({
          query: getEvent,
          variables: { id: eventId },
          authMode: 'apiKey'
        });
        
        if ('data' in result && result.data?.getEvent) {
          setEvent(result.data.getEvent);
        } else {
          setError('Event not found');
        }
      } catch (err: any) {
        console.error('Error fetching event:', err);
        setError('Failed to load event');
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [client]);

  const downloadICal = (event: Event) => {
    const formatDateForICal = (date: string, time?: string): string => {
      const dateObj = parseLocalDate(date);
      if (time) {
        const [hours, minutes] = time.split(':');
        dateObj.setHours(parseInt(hours), parseInt(minutes), 0, 0);
      }
      return dateObj.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    };

    const startDate = formatDateForICal(event.date, event.startTime);
    const endDate = event.endDate 
      ? formatDateForICal(event.endDate, event.endTime)
      : event.startTime && event.endTime
        ? formatDateForICal(event.date, event.endTime)
        : formatDateForICal(event.date, '23:59');

    const icalContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Hawaii Republican Party//Event//EN',
      'BEGIN:VEVENT',
      `UID:${event.id}@hawaiigop.org`,
      `DTSTART:${startDate}`,
      `DTEND:${endDate}`,
      `SUMMARY:${event.title}`,
      `DESCRIPTION:${event.aboutEvent || ''}`,
      `LOCATION:${event.location}`,
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\r\n');

    const blob = new Blob([icalContent], { type: 'text/calendar' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${event.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.ics`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex items-center px-4 py-2 font-semibold leading-6 text-gray-600 shadow rounded-xl">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Loading event...
          </div>
        </div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="bg-white rounded-3xl shadow-xl p-12 border border-gray-100 max-w-md">
            <svg className="mx-auto h-12 w-12 text-red-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Event Not Found</h3>
            <p className="text-gray-600 mb-6">{error || 'The event you are looking for does not exist.'}</p>
            <Link 
              href="/events"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-xl text-white bg-[#C62828] hover:bg-[#B71C1C] transition-colors"
            >
              Back to Events
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const formattedDate = parseLocalDate(event.date).toLocaleDateString('en-US', { 
    weekday: 'long',
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  const formattedTime = event.startTime 
    ? `${event.startTime}${event.endTime ? ` - ${event.endTime}` : ''}`
    : 'All day';

  const getRegistrationButtonText = (type?: string) => {
    switch (type?.toLowerCase()) {
      case 'rsvp': return 'RSVP Now';
      case 'signup': return 'Sign Up';
      case 'register': return 'Register';
      case 'get tickets': return 'Get Tickets';
      default: return 'Register';
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumb Navigation */}
      <section className="bg-gray-50 border-b border-gray-200 py-4">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <nav className="flex items-center space-x-2 text-sm text-gray-600">
              <Link 
                href="/" 
                className="hover:text-red-600 transition-colors"
              >
                Home
              </Link>
              <span>/</span>
              <Link 
                href="/events" 
                className="hover:text-red-600 transition-colors"
              >
                Events
              </Link>
              <span>/</span>
              <span className="text-gray-900 font-medium truncate">
                {event.title}
              </span>
            </nav>
          </div>
        </div>
      </section>

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-red-600 to-red-800 text-white rounded-2xl shadow-lg p-8 mb-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center space-x-4 mb-4">
            <Link href="/events" className="text-red-100 hover:text-white transition-colors">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </Link>
            <span className="text-red-100">Events</span>
            <span className="text-red-100">/</span>
            <span>{event.title}</span>
          </div>
          
          <h1 className="text-4xl font-bold mb-4">{event.title}</h1>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="flex items-center space-x-3">
              <svg className="h-6 w-6 text-red-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="text-red-100">{formattedDate}</span>
              {event.endDate && event.endDate !== event.date && (
                <span className="text-red-100">
                  - {parseLocalDate(event.endDate).toLocaleDateString('en-US', { 
                    month: 'long', 
                    day: 'numeric',
                    year: 'numeric' 
                  })}
                </span>
              )}
            </div>
            
            <div className="flex items-center space-x-3">
              <svg className="h-6 w-6 text-red-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span className="text-red-100">{event.location}</span>
            </div>
            
            {event.startTime && (
              <div className="flex items-center space-x-3">
                <svg className="h-6 w-6 text-red-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-red-100">
                  {event.startTime}
                  {event.endTime && ` - ${event.endTime}`}
                </span>
              </div>
            )}
            
            {event.organizer && (
              <div className="flex items-center space-x-3">
                <svg className="h-6 w-6 text-red-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span className="text-red-100">Organized by {event.organizer}</span>
              </div>
            )}
          </div>
          
          <div className="mt-6 flex space-x-4">
            <button
              onClick={() => downloadICal(event)}
              className="px-6 py-3 bg-white text-red-600 font-semibold rounded-full hover:bg-red-50 transition-colors duration-200"
            >
              Add to Calendar
            </button>
            {event.contactDetails && (
              <a
                href={`mailto:${event.contactDetails}`}
                className="px-6 py-3 border border-white text-white font-semibold rounded-full hover:bg-white hover:text-red-600 transition-colors duration-200"
              >
                Contact Organizer
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <section className="bg-gradient-to-br from-gray-50 to-gray-100 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="grid lg:grid-cols-[2fr_1.2fr] gap-8">
              {/* Main Content */}
              <div className="">
                <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
                  <h1 className="text-4xl font-bold text-gray-900 mb-4">{event.title}</h1>
                  
                  {event.organizer && (
                    <p className="text-lg text-gray-600 mb-6">
                      By <span className="font-semibold">{event.organizer}</span>
                    </p>
                  )}

                  {/* Event Details */}
                  <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Event Details</h2>
                    
                    {event.aboutEvent && (
                      <div className="mb-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">About This Event</h3>
                        <FormattedContent content={event.aboutEvent} />
                      </div>
                    )}
                    
                    {event.hostingOrganization && (
                      <div className="mb-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">Hosting Organization</h3>
                        <FormattedContent content={event.hostingOrganization} />
                      </div>
                    )}
                    
                    {event.details && (
                      <div className="mb-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">Additional Information</h3>
                        <FormattedContent content={event.details} />
                      </div>
                    )}
                    
                    {event.contactDetails && (
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">Contact Information</h3>
                        <a 
                          href={`mailto:${event.contactDetails}`}
                          className="inline-flex items-center text-red-600 hover:text-red-700 transition-colors"
                        >
                          <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                          {event.contactDetails}
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Sidebar */}
              <div className="">
                <div className="bg-white rounded-3xl shadow-xl p-6 border border-gray-100 sticky top-6 max-w-md w-full mx-auto">
                  {/* Back to Events Button */}
                  <div className="mb-6">
                    <Link 
                      href="/events"
                      className="inline-flex items-center text-[#C62828] hover:text-[#B71C1C] font-medium transition-colors"
                    >
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                      </svg>
                      Back to Events
                    </Link>
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Event Details</h3>
                  <div className="space-y-6 mb-6">
                    <div>
                      <div className="text-sm text-gray-500 font-medium mb-1">Date</div>
                      <div className="font-semibold text-gray-900 text-base">{formattedDate}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500 font-medium mb-1">Time</div>
                      <div className="font-semibold text-gray-900 text-base">{formattedTime}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500 font-medium mb-1">Location</div>
                      <div className="font-semibold text-gray-900 text-base whitespace-pre-line">{event.location}</div>
                    </div>
                  </div>

                  <div className="border-t border-gray-200 pt-6">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">Organizer</h4>
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-[#FDEAEA] rounded-full flex items-center justify-center">
                        <svg className="w-5 h-5 text-[#C62828]" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          {event.organizer || 'Hawaii Republican Party'}
                        </p>
                        <p className="text-sm text-gray-600">Event Organizer</p>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="px-6 py-5 border-t border-gray-100/50 bg-gray-50/30">
                    <div className="space-y-3">
                      <button 
                        onClick={() => downloadICal(event)}
                        className="w-full bg-[#C62828] text-white px-4 py-3 rounded-xl font-medium hover:bg-[#B71C1C] transition-all duration-200 shadow-sm flex items-center justify-center space-x-2"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span>Add to Calendar</span>
                      </button>
                      
                      {event.contactDetails ? (
                        <a
                          href={`mailto:${event.contactDetails}?subject=Question about ${event.title}`}
                          className="w-full bg-white border border-gray-200 text-gray-700 px-4 py-3 rounded-xl font-medium hover:bg-gray-50 transition-all duration-200 shadow-sm flex items-center justify-center space-x-2"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                          <span>Contact Organizer</span>
                        </a>
                      ) : (
                        <button className="w-full bg-gray-100 text-gray-400 px-4 py-3 rounded-xl font-medium cursor-not-allowed flex items-center justify-center space-x-2">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                          <span>Contact Organizer</span>
                        </button>
                      )}
                      
                      {event.registrationLink && (
                        <a
                          href={event.registrationLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full bg-[#C62828] text-white px-4 py-3 rounded-xl font-medium hover:bg-[#B71C1C] transition-all duration-200 shadow-sm flex items-center justify-center text-base"
                        >
                          <span>{getRegistrationButtonText(event.registrationType)}</span>
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
} 