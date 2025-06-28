'use client';

import { useState, useEffect } from 'react';
import { generateClient } from 'aws-amplify/api';
import { getCurrentUser, fetchAuthSession } from 'aws-amplify/auth';
import { getEvent } from '../../../src/graphql/queries';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Header from '../../components/Header';
import { isValidS3Url } from '../../utils/s3Upload';

const client = generateClient({
  authMode: 'apiKey'
});

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

function EventDetailPage() {
  const params = useParams();
  const eventId = params.id as string;
  
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const calculateDuration = (startTime: string, endTime: string): string => {
    const start = new Date(`2000-01-01 ${startTime}`);
    const end = new Date(`2000-01-01 ${endTime}`);
    const diffMinutes = Math.round((end.getTime() - start.getTime()) / (1000 * 60));
    const hours = Math.floor(diffMinutes / 60);
    const minutes = diffMinutes % 60;
    
    if (hours > 0) {
      return `${hours}h ${minutes > 0 ? `${minutes}m` : ''}`.trim();
    }
    return `${diffMinutes}m`;
  };

  useEffect(() => {
    if (eventId) {
      fetchEvent();
    }
  }, [eventId]);

  const fetchEvent = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Fetching event with ID:', eventId);
      
      // Check authentication status
      try {
        const user = await getCurrentUser();
        const session = await fetchAuthSession();
        console.log('Auth status - User:', user, 'Session:', session);
      } catch (authError) {
        console.log('Auth check failed:', authError);
      }
      
      // Check if client is properly initialized
      if (!client) {
        throw new Error('Amplify client not initialized');
      }
      
      console.log('Making GraphQL request with variables:', { id: eventId });
      
      const result = await client.graphql({
        query: getEvent,
        variables: { id: eventId },
        authMode: 'apiKey'
      });
      
      console.log('GraphQL result:', result);
      console.log('Result type:', typeof result);
      console.log('Result keys:', Object.keys(result));
      
      if ('data' in result) {
        console.log('Result has data property');
        console.log('Data content:', result.data);
        
        if (result.data?.getEvent) {
          console.log('Event found:', result.data.getEvent);
          const eventData = result.data.getEvent;
          setEvent(eventData);
        } else {
          console.log('getEvent is null or undefined');
          console.log('Full data object:', JSON.stringify(result.data, null, 2));
          setError('Event not found - the event may not exist or you may not have permission to view it');
        }
      } else if ('errors' in result) {
        console.log('GraphQL errors:', result.errors);
        const errorMessage = Array.isArray(result.errors) && result.errors.length > 0 
          ? result.errors[0]?.message || 'GraphQL query failed'
          : 'GraphQL query failed';
        setError(errorMessage);
      } else {
        console.log('Unexpected result structure:', result);
        setError('Unexpected response format from server');
      }
    } catch (error) {
      console.error('Error fetching event:', error);
      console.error('Error details:', {
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : 'No stack trace',
        name: error instanceof Error ? error.name : 'Unknown error type'
      });
      
      // More specific error handling
      if (error instanceof Error) {
        if (error.message.includes('NoApiKey')) {
          setError('API configuration error - please contact support');
        } else if (error.message.includes('Unauthorized')) {
          setError('You are not authorized to view this event');
        } else if (error.message.includes('NotFound')) {
          setError('Event not found - it may have been deleted or moved');
        } else {
          setError(`Failed to load event: ${error.message}`);
        }
      } else {
        setError('Failed to load event - unknown error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  const downloadICal = (event: Event) => {
    const formatDateForICal = (date: string, time?: string): string => {
      const dateObj = new Date(date);
      if (time) {
        // Parse time and add to date
        const timeMatch = time.match(/^(\d{1,2}):(\d{2})\s*(AM|PM|am|pm)?$/);
        if (timeMatch) {
          let hours = parseInt(timeMatch[1]);
          const minutes = parseInt(timeMatch[2]);
          const ampm = timeMatch[3]?.toUpperCase();
          
          if (ampm === 'PM' && hours !== 12) hours += 12;
          if (ampm === 'AM' && hours === 12) hours = 0;
          
          dateObj.setHours(hours, minutes, 0, 0);
        }
      }
      
      return dateObj.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
    };

    const startDate = formatDateForICal(event.date, event.startTime);
    const endDate = event.endDate 
      ? formatDateForICal(event.endDate, event.endTime) 
      : formatDateForICal(event.date, event.endTime || '23:59');

    const ical = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Hawaii Republican Party//Event Calendar//EN',
      'BEGIN:VEVENT',
      `UID:${event.id}@hawaiirepublicanparty.com`,
      `DTSTART:${startDate}`,
      `DTEND:${endDate}`,
      `SUMMARY:${event.title}`,
      `DESCRIPTION:${event.aboutEvent || ''}`,
      `LOCATION:${event.location}`,
      `ORGANIZER:${event.organizer || 'Hawaii Republican Party'}`,
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\r\n');

    const blob = new Blob([ical], { type: 'text/calendar' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${event.title.replace(/[^a-zA-Z0-9]/g, '_')}.ics`;
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

  const eventDate = new Date(event.date);
  const formattedDate = eventDate.toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
  const formattedTime = eventDate.toLocaleTimeString('en-US', { 
    hour: 'numeric', 
    minute: '2-digit',
    hour12: true 
  });

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <Header />

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
                  - {new Date(event.endDate).toLocaleDateString('en-US', { 
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
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Main Content */}
              <div className="lg:col-span-2">
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
                        <p className="text-gray-700 leading-relaxed">{event.aboutEvent}</p>
                      </div>
                    )}
                    
                    {event.hostingOrganization && (
                      <div className="mb-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">Hosting Organization</h3>
                        <p className="text-gray-700 leading-relaxed">{event.hostingOrganization}</p>
                      </div>
                    )}
                    
                    {event.details && (
                      <div className="mb-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">Additional Information</h3>
                        <p className="text-gray-700 leading-relaxed">{event.details}</p>
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
              <div className="lg:col-span-1">
                <div className="bg-white rounded-3xl shadow-xl p-6 border border-gray-100 sticky top-6">
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
                  
                  <div className="space-y-4 mb-6">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Date</span>
                      <span className="font-medium">{formattedDate}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Time</span>
                      <span className="font-medium">{formattedTime}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Location</span>
                      <span className="font-medium text-right">{event.location}</span>
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

                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <button 
                      onClick={() => downloadICal(event)}
                      className="w-full bg-[#C62828] text-white px-6 py-3 rounded-xl font-medium hover:bg-[#B71C1C] transition-colors duration-200 shadow-sm mb-3"
                    >
                      Add to Calendar
                    </button>
                    {event.contactDetails ? (
                      <a
                        href={`mailto:${event.contactDetails}?subject=Question about ${event.title}`}
                        className="w-full bg-[#C62828] text-white px-6 py-3 rounded-xl font-medium hover:bg-[#B71C1C] transition-colors duration-200 shadow-sm block text-center"
                      >
                        Contact Organizer
                      </a>
                    ) : (
                      <button className="w-full bg-gray-400 text-white px-6 py-3 rounded-xl font-medium cursor-not-allowed">
                        Contact Organizer
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-50 border-t border-gray-200 py-8">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <p className="text-gray-600">
              © 2025 Hawaii Republican Party. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default EventDetailPage; 