'use client';

import React, { useState, useEffect } from 'react';
import { generateClient } from 'aws-amplify/api';
import { createEvent, updateEvent, deleteEvent } from '../../src/graphql/mutations';
import { listEvents } from '../../src/graphql/queries';
import { signOut, signIn, signUp, confirmSignUp, getCurrentUser, fetchAuthSession } from 'aws-amplify/auth';
import { withAuthenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import Link from 'next/link';
import Header from '../components/Header';

const client = generateClient();

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

function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [newEvent, setNewEvent] = useState({
    title: '',
    date: '',
    endDate: '',
    startTime: '',
    endTime: '',
    location: '',
    aboutEvent: '',
    details: '',
    organizer: '',
    contactDetails: '',
    hostingOrganization: ''
  });
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  
  // Authentication states
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [authMode, setAuthMode] = useState<'signIn' | 'signUp' | 'confirm'>('signIn');
  const [authForm, setAuthForm] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    confirmationCode: ''
  });
  const [authError, setAuthError] = useState<string | null>(null);
  const [authLoading, setAuthLoading] = useState(false);
  const [authChecking, setAuthChecking] = useState(true);
  
  // Filter and sorting states
  const [showPastEvents, setShowPastEvents] = useState(false);
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const EVENTS_PER_PAGE = 6;

  useEffect(() => {
    const initializeApp = async () => {
      console.log('Initializing app...');
      
      // Wait a bit for Amplify to be fully configured
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Check authentication status
      await checkAuthStatus();
      
      // Fetch events after auth check is complete
      await fetchEvents();
    };
    
    initializeApp();
  }, []);

  useEffect(() => {
    if (isAuthenticated && !authChecking) {
      // Only refetch if user becomes authenticated (for admin features)
      fetchEvents();
    }
  }, [isAuthenticated, authChecking]);

  const checkAuthStatus = async () => {
    try {
      setAuthChecking(true);
      
      // Add a small delay to ensure Amplify is properly initialized
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Check both current user and auth session
      const user = await getCurrentUser();
      const session = await fetchAuthSession();
      
      console.log('Auth check - User:', user, 'Session:', session);
      
      if (user && session.tokens) {
        console.log('User is authenticated');
        setIsAuthenticated(true);
        setShowAuth(false);
      } else {
        console.log('User is not authenticated');
        setIsAuthenticated(false);
        setShowAuth(false); // Don't show auth form by default
      }
    } catch (error) {
      console.log('Auth check failed:', error);
      setIsAuthenticated(false);
      setShowAuth(false); // Don't show auth form by default
    } finally {
      setAuthChecking(false);
    }
  };

  const handleSignOut = async () => {
    try {
      console.log('Signing out...');
      await signOut();
      console.log('Sign out successful');
      setIsAuthenticated(false);
      setShowAuth(false);
      setAuthChecking(false);
      
      // Clear any stored auth data
      localStorage.removeItem('amplify-authenticator-authToken');
      sessionStorage.clear();
      
      // Refetch events with public access (api-key) after sign out
      setTimeout(() => {
        fetchEvents();
      }, 100);
      
    } catch (error) {
      console.error('Error signing out:', error);
      // Even if sign out fails, clear the local state
      setIsAuthenticated(false);
      setShowAuth(false);
      setAuthChecking(false);
      
      // Still refetch events with public access
      setTimeout(() => {
        fetchEvents();
      }, 100);
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError(null);
    
    try {
      await signIn({ username: authForm.username, password: authForm.password });
      setIsAuthenticated(true);
      setShowAuth(false);
      setAuthForm({ username: '', email: '', password: '', confirmPassword: '', confirmationCode: '' });
    } catch (error: any) {
      console.error('Sign in error:', error);
      
      // Handle specific authentication errors with generic messages for security
      if (error.name === 'NotAuthorizedException' || error.name === 'UserNotFoundException') {
        setAuthError('Incorrect username or password. Please try again.');
      } else if (error.name === 'UserNotConfirmedException') {
        setAuthError('Please verify your email address before signing in.');
      } else if (error.name === 'TooManyRequestsException') {
        setAuthError('Too many failed attempts. Please wait a moment before trying again.');
      } else if (error.name === 'LimitExceededException') {
        setAuthError('Too many sign-in attempts. Please try again later.');
      } else {
        setAuthError('Sign in failed. Please check your credentials and try again.');
      }
    } finally {
      setAuthLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (authForm.password !== authForm.confirmPassword) {
      setAuthError('Passwords do not match');
      return;
    }
    
    if (authForm.password.length < 8) {
      setAuthError('Password must be at least 8 characters long');
      return;
    }
    
    setAuthLoading(true);
    setAuthError(null);
    
    try {
      await signUp({
        username: authForm.username,
        password: authForm.password,
        options: {
          userAttributes: {
            email: authForm.email
          }
        }
      });
      setAuthMode('confirm');
    } catch (error: any) {
      console.error('Sign up error:', error);
      
      // Handle specific sign-up errors
      if (error.name === 'UsernameExistsException') {
        setAuthError('Username already exists. Please choose a different username.');
      } else if (error.name === 'InvalidPasswordException') {
        setAuthError('Password does not meet requirements. Please use at least 8 characters.');
      } else if (error.name === 'InvalidParameterException') {
        if (error.message?.includes('email')) {
          setAuthError('Please enter a valid email address.');
        } else if (error.message?.includes('username')) {
          setAuthError('Username must be at least 3 characters and contain only letters, numbers, and underscores.');
        } else {
          setAuthError('Please check your input and try again.');
        }
      } else if (error.name === 'TooManyRequestsException') {
        setAuthError('Too many sign-up attempts. Please wait a moment before trying again.');
      } else {
        setAuthError('Failed to create account. Please try again.');
      }
    } finally {
      setAuthLoading(false);
    }
  };

  const handleConfirmSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError(null);
    
    try {
      await confirmSignUp({
        username: authForm.username,
        confirmationCode: authForm.confirmationCode
      });
      setAuthMode('signIn');
      setAuthForm({ ...authForm, confirmationCode: '' });
    } catch (error: any) {
      console.error('Confirmation error:', error);
      
      // Handle specific confirmation errors
      if (error.name === 'CodeMismatchException') {
        setAuthError('Invalid verification code. Please check your email and try again.');
      } else if (error.name === 'ExpiredCodeException') {
        setAuthError('Verification code has expired. Please request a new code.');
      } else if (error.name === 'NotAuthorizedException') {
        setAuthError('Account is already confirmed. Please sign in.');
      } else if (error.name === 'UserNotFoundException') {
        setAuthError('User not found. Please check your username.');
      } else if (error.name === 'TooManyRequestsException') {
        setAuthError('Too many attempts. Please wait a moment before trying again.');
      } else {
        setAuthError('Failed to verify account. Please try again.');
      }
    } finally {
      setAuthLoading(false);
    }
  };

  const fetchEvents = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('Fetching events...');
      
      // Add a small delay to ensure Amplify is ready
      await new Promise(resolve => setTimeout(resolve, 50));
      
      // Try with API key first
      try {
        const result = await client.graphql({
          query: listEvents,
          authMode: 'apiKey'
        });
        
        console.log('Events result (API key):', result);
        
        if ('data' in result && result.data?.listEvents?.items) {
          const eventsData = result.data.listEvents.items;
          console.log('Raw events data:', eventsData);
          setEvents(eventsData);
          console.log('Events loaded:', eventsData);
          return;
        }
      } catch (apiKeyError: any) {
        console.log('API key failed:', apiKeyError.message);
        
        // Wait a bit before trying the next method
        await new Promise(resolve => setTimeout(resolve, 100));
        
        // Try without specifying auth mode (should use default)
        try {
          const result = await client.graphql({
            query: listEvents
          });
          
          console.log('Events result (default auth):', result);
          
          if ('data' in result && result.data?.listEvents?.items) {
            const eventsData = result.data.listEvents.items;
            console.log('Raw events data:', eventsData);
            setEvents(eventsData);
            console.log('Events loaded:', eventsData);
            return;
          }
        } catch (defaultError: any) {
          console.log('Default auth failed:', defaultError.message);
          
          // Wait a bit before trying the next method
          await new Promise(resolve => setTimeout(resolve, 100));
          
          // Try with user pool if authenticated
          if (isAuthenticated) {
            try {
              const result = await client.graphql({
                query: listEvents,
                authMode: 'userPool'
              });
              
              console.log('Events result (user pool):', result);
              
              if ('data' in result && result.data?.listEvents?.items) {
                const eventsData = result.data.listEvents.items;
                console.log('Raw events data:', eventsData);
                setEvents(eventsData);
                console.log('Events loaded:', eventsData);
                return;
              }
            } catch (userPoolError: any) {
              console.log('User pool auth failed:', userPoolError.message);
            }
          }
        }
      }
      
      // If we get here, no method worked
      console.log('No events data found');
      setEvents([]);
      
    } catch (error: any) {
      console.error('Error fetching events:', JSON.stringify(error, null, 2));
      
      // Handle specific error types
      if (error.name === 'NoApiKey' || error.message?.includes('NoApiKey')) {
        console.log('API key error - trying alternative approach');
        setError('Unable to load events. Please try refreshing the page.');
      } else if (error.name === 'NoValidAuthTokens' || error.message?.includes('NoValidAuthTokens')) {
        console.log('Auth token error - this is expected for public access');
        setError('Unable to load events. Please try refreshing the page.');
      } else if (error.errors && error.errors.some((e: any) => e.message.includes('FieldUndefined'))) {
        setError('Database schema has been updated. Please try creating a new event to test the new features.');
      } else {
        setError('Unable to load events. Please try again later.');
      }
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setError(null);
      
      // Validate and format dates
      const formattedDate = validateAndFormatDate(newEvent.date);
      const formattedEndDate = newEvent.endDate ? validateAndFormatDate(newEvent.endDate) : null;
      
      // Format the event data
      const formattedEvent = {
        title: newEvent.title,
        date: formattedDate,
        endDate: formattedEndDate,
        startTime: newEvent.startTime || null,
        endTime: newEvent.endTime || null,
        location: newEvent.location,
        aboutEvent: newEvent.aboutEvent || null,
        details: newEvent.details || null,
        organizer: newEvent.organizer || null,
        contactDetails: newEvent.contactDetails || null,
        hostingOrganization: newEvent.hostingOrganization || null
      };
      await client.graphql({
        query: createEvent,
        variables: { input: formattedEvent },
        authMode: 'userPool' // Use Cognito for authenticated operations
      });
      setNewEvent({ title: '', date: '', endDate: '', startTime: '', endTime: '', location: '', aboutEvent: '', details: '', organizer: '', contactDetails: '', hostingOrganization: '' });
      setShowCreateForm(false);
      fetchEvents();
    } catch (error) {
      console.error('Error creating event:', JSON.stringify(error, null, 2));
      setError(error instanceof Error ? error.message : JSON.stringify(error));
    }
  };

  const startEditingEvent = (event: Event) => {
    if (!isAuthenticated) {
      setShowAuth(true);
      return;
    }
    setEditingEvent(event);
  };

  const handleUpdateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingEvent) return;
    
    try {
      setError(null);
      
      // Validate and format dates
      const formattedDate = validateAndFormatDate(editingEvent.date);
      const formattedEndDate = editingEvent.endDate ? validateAndFormatDate(editingEvent.endDate) : null;
      
      // Format the event data
      const formattedEvent = {
        id: editingEvent.id,
        title: editingEvent.title,
        date: formattedDate,
        endDate: formattedEndDate,
        startTime: editingEvent.startTime || null,
        endTime: editingEvent.endTime || null,
        location: editingEvent.location,
        aboutEvent: editingEvent.aboutEvent || null,
        details: editingEvent.details || null,
        organizer: editingEvent.organizer || null,
        contactDetails: editingEvent.contactDetails || null,
        hostingOrganization: editingEvent.hostingOrganization || null
      };
      
      console.log('Updating event:', formattedEvent);
      
      await client.graphql({
        query: updateEvent,
        variables: { input: formattedEvent },
        authMode: 'userPool' // Use Cognito for authenticated operations
      });
      
      setEditingEvent(null);
      fetchEvents();
    } catch (error) {
      console.error('Error updating event:', JSON.stringify(error, null, 2));
      setError(error instanceof Error ? error.message : JSON.stringify(error));
    }
  };

  const handleDeleteEvent = async (id: string) => {
    if (!isAuthenticated) {
      setShowAuth(true);
      return;
    }
    
    if (!confirm('Are you sure you want to delete this event?')) return;
    
    try {
      setError(null);
      console.log('Deleting event:', id);
      
      await client.graphql({
        query: deleteEvent,
        variables: { input: { id } },
        authMode: 'userPool' // Use Cognito for authenticated operations
      });
      
      fetchEvents();
    } catch (error) {
      console.error('Error deleting event:', JSON.stringify(error, null, 2));
      setError(error instanceof Error ? error.message : JSON.stringify(error));
    }
  };

  // Date parsing and validation functions
  const validateAndFormatDate = (dateString: string): string => {
    console.log('=== DATE VALIDATION DEBUG ===');
    console.log('Input dateString:', dateString);
    console.log('Type of dateString:', typeof dateString);
    console.log('Length of dateString:', dateString.length);
    
    if (!dateString.trim()) {
      throw new Error('Date is required');
    }
    
    // Try to parse the date using JavaScript's Date constructor
    const date = new Date(dateString);
    console.log('Parsed Date object:', date);
    console.log('Date.getTime():', date.getTime());
    console.log('isNaN(date.getTime()):', isNaN(date.getTime()));
    
    // Check if the date is valid
    if (isNaN(date.getTime())) {
      throw new Error(`Please enter a valid date. Received: "${dateString}"`);
    }
    
    // Format as YYYY-MM-DD for AWS
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    
    const result = `${year}-${month}-${day}`;
    console.log('Final formatted result:', result);
    console.log('=== END DATE VALIDATION ===');
    return result;
  };

  // Enhanced date/time formatting and validation
  const formatDateInput = (value: string): string => {
    // Remove all non-digits
    const digits = value.replace(/\D/g, '');
    
    // Auto-format as MM/DD/YYYY
    if (digits.length <= 2) {
      return digits;
    } else if (digits.length <= 4) {
      return `${digits.slice(0, 2)}/${digits.slice(2)}`;
    } else if (digits.length <= 8) {
      return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4, 8)}`;
    } else {
      return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4, 8)}`;
    }
  };

  const formatTimeInput = (value: string): string => {
    // Remove all non-digits and letters
    const cleaned = value.replace(/[^0-9a-zA-Z]/g, '').toUpperCase();
    
    // Auto-format as HH:MM AM/PM
    if (cleaned.length <= 2) {
      return cleaned;
    } else if (cleaned.length <= 4) {
      const hours = cleaned.slice(0, 2);
      const minutes = cleaned.slice(2, 4);
      return `${hours}:${minutes}`;
    } else if (cleaned.length <= 6) {
      const hours = cleaned.slice(0, 2);
      const minutes = cleaned.slice(2, 4);
      const ampm = cleaned.slice(4, 6);
      return `${hours}:${minutes} ${ampm}`;
    } else {
      return cleaned.slice(0, 6);
    }
  };

  const validateTime = (timeString: string): boolean => {
    if (!timeString.trim()) return true; // Empty is valid (optional)
    
    // Accept formats: HH:MM, HH:MM AM, HH:MM PM, H:MM AM, etc.
    const timeRegex = /^(\d{1,2}):(\d{2})\s*(AM|PM|am|pm)?$/;
    const match = timeString.match(timeRegex);
    
    if (!match) return false;
    
    const hours = parseInt(match[1]);
    const minutes = parseInt(match[2]);
    const ampm = match[3]?.toUpperCase();
    
    // Validate hours and minutes
    if (minutes < 0 || minutes > 59) return false;
    
    if (ampm) {
      // 12-hour format
      if (hours < 1 || hours > 12) return false;
    } else {
      // 24-hour format
      if (hours < 0 || hours > 23) return false;
    }
    
    return true;
  };

  // iCal generation function
  const generateICal = (event: Event): string => {
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

    return ical;
  };

  const downloadICal = (event: Event) => {
    const icalContent = generateICal(event);
    const blob = new Blob([icalContent], { type: 'text/calendar' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${event.title.replace(/[^a-zA-Z0-9]/g, '_')}.ics`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const month = date.toLocaleDateString('en-US', { month: 'long' });
    const day = date.getDate();
    const year = date.getFullYear();
    return `${month} ${day} ${year}`;
  };

  const formatDateShort = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  // Sort and filter events
  const getSortedAndFilteredEvents = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Start of today
    
    return events
      .filter(event => {
        if (showPastEvents) {
          return true; // Show all events
        }
        
        // Check if event is in the future
        const eventDate = new Date(event.date);
        eventDate.setHours(0, 0, 0, 0);
        
        // If event has an end date, check if it ends in the future
        if (event.endDate) {
          const endDate = new Date(event.endDate);
          endDate.setHours(0, 0, 0, 0);
          return endDate >= today;
        }
        
        // Otherwise check if the event date is today or in the future
        return eventDate >= today;
      })
      .sort((a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        return dateA.getTime() - dateB.getTime(); // Soonest first
      });
  };

  // Paginated events
  const paginatedEvents = () => {
    const allEvents = getSortedAndFilteredEvents();
    const startIdx = (currentPage - 1) * EVENTS_PER_PAGE;
    const endIdx = startIdx + EVENTS_PER_PAGE;
    return allEvents.slice(startIdx, endIdx);
  };

  const totalPages = Math.ceil(getSortedAndFilteredEvents().length / EVENTS_PER_PAGE);

  // Show loading only briefly while checking auth, then show events
  if (authChecking && loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex items-center px-4 py-2 font-semibold leading-6 text-gray-600 shadow rounded-xl">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Loading events...
          </div>
        </div>
      </div>
    );
  }

  // Authentication UI
  if (showAuth) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Exit Button */}
          <div className="text-center mb-8">
            <Link 
              href="/"
              className="inline-flex items-center text-gray-600 hover:text-gray-800 transition-colors duration-200"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Home
            </Link>
          </div>

          {/* Auth Card */}
          <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
            <div className="text-center mb-8">
              <img
                src="/images/hawaii-gop-logo.png"
                alt="Hawaii Republican Party Logo"
                className="w-16 h-16 mx-auto mb-4"
              />
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Admin Sign In
              </h1>
              <p className="text-gray-600">
                Sign in to manage events
              </p>
            </div>

            {authError && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
                <div className="flex items-center">
                  <svg className="h-5 w-5 text-red-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm text-red-700">{authError}</span>
                </div>
              </div>
            )}

            {authMode === 'signIn' && (
              <form onSubmit={handleSignIn} className="space-y-6">
                <div>
                  <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                    Username
                  </label>
                  <input
                    id="username"
                    type="text"
                    value={authForm.username}
                    onChange={(e) => setAuthForm({ ...authForm, username: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#C62828] focus:border-transparent transition-all duration-200"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                    Password
                  </label>
                  <input
                    id="password"
                    type="password"
                    value={authForm.password}
                    onChange={(e) => setAuthForm({ ...authForm, password: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#C62828] focus:border-transparent transition-all duration-200"
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={authLoading}
                  className="w-full bg-[#C62828] text-white px-6 py-3 rounded-xl font-medium hover:bg-[#B71C1C] transition-colors duration-200 shadow-sm disabled:opacity-50"
                >
                  {authLoading ? 'Signing In...' : 'Sign In'}
                </button>
                <div className="text-center">
                  <p className="text-sm text-gray-500">
                    Contact the administrator to create an account
                  </p>
                </div>
              </form>
            )}

            {/* Account creation is handled in the backend - only sign-in is available */}
          </div>
        </div>
      </div>
    );
  }

  // Main Events Page
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Header />
      
      {/* Breadcrumb Navigation */}
      <section className="bg-gray-50 border-b border-gray-200 py-4">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <nav className="flex items-center space-x-2 text-sm text-gray-600">
              <Link 
                href="/" 
                className="hover:text-[#C62828] transition-colors"
              >
                Home
              </Link>
              <span>/</span>
              <span className="text-gray-900 font-medium">Events</span>
            </nav>
          </div>
        </div>
      </section>

      {/* Hero Section */}
      <section className="hero hero--with-logo hero-blend relative">
        <div className="hero-logo-wrapper">
          <img
            src="/images/hawaii-gop-logo.png"
            alt="Hawaii Republican Party Logo"
            className="hero-logo"
          />
        </div>
        <div className="hero-content">
          <h1 className="hero-title">Event Management</h1>
          <p className="hero-subtitle">Create and manage your events with ease</p>
          <div className="hero-actions">
            {isAuthenticated && (
              <button
                onClick={() => setShowCreateForm(!showCreateForm)}
                className="cta cta--primary bg-[#C62828] hover:bg-[#B71C1C] text-white"
              >
                {showCreateForm ? 'Cancel' : 'Create New Event'}
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Error Display */}
      {error && (
        <div className="container mx-auto px-4 py-6">
          <div className="bg-red-50 border border-red-200 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Error</h3>
                <div className="mt-2 text-sm text-red-700">{error}</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create Event Form */}
      {showCreateForm && (
        <section className="py-12 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
                {!isAuthenticated ? (
                  <div className="text-center py-12">
                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    <h3 className="mt-2 text-sm font-medium text-gray-900">Authentication Required</h3>
                    <p className="mt-1 text-sm text-gray-500">You need to sign in to create events.</p>
                    <div className="mt-6">
                      <button
                        onClick={() => setShowAuth(true)}
                        className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-xl text-white bg-[#C62828] hover:bg-[#B71C1C] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#C62828]"
                      >
                        Sign In
                      </button>
                      <button
                        onClick={() => setShowCreateForm(false)}
                        className="ml-3 inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-xl text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#C62828]"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Create New Event</h2>
                    <form onSubmit={handleCreateEvent} className="space-y-6">
                      <div>
                        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                          Event Title
                        </label>
                        <input
                          id="title"
                          type="text"
                          placeholder="Enter event title"
                          value={newEvent.title}
                          onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                          required
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-2">
                          Date
                        </label>
                        <input
                          id="date"
                          type="text"
                          placeholder="MM/DD/YYYY (e.g., 12/25/2024)"
                          value={newEvent.date}
                          onChange={(e) => {
                            const formatted = formatDateInput(e.target.value);
                            setNewEvent({ ...newEvent, date: formatted });
                          }}
                          onBlur={(e) => {
                            if (e.target.value && !validateAndFormatDate(e.target.value)) {
                              setError('Please enter a valid date in MM/DD/YYYY format');
                            }
                          }}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                          required
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-2">
                          End Date (Optional)
                        </label>
                        <input
                          id="endDate"
                          type="text"
                          placeholder="MM/DD/YYYY (e.g., 12/26/2024)"
                          value={newEvent.endDate}
                          onChange={(e) => {
                            const formatted = formatDateInput(e.target.value);
                            setNewEvent({ ...newEvent, endDate: formatted });
                          }}
                          onBlur={(e) => {
                            if (e.target.value && !validateAndFormatDate(e.target.value)) {
                              setError('Please enter a valid date in MM/DD/YYYY format');
                            }
                          }}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="startTime" className="block text-sm font-medium text-gray-700 mb-2">
                          Start Time (Optional)
                        </label>
                        <input
                          id="startTime"
                          type="text"
                          placeholder="HH:MM AM/PM (e.g., 2:30 PM)"
                          value={newEvent.startTime}
                          onChange={(e) => {
                            const formatted = formatTimeInput(e.target.value);
                            setNewEvent({ ...newEvent, startTime: formatted });
                          }}
                          onBlur={(e) => {
                            if (e.target.value && !validateTime(e.target.value)) {
                              setError('Please enter a valid time in HH:MM AM/PM format');
                            }
                          }}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="endTime" className="block text-sm font-medium text-gray-700 mb-2">
                          End Time (Optional)
                        </label>
                        <input
                          id="endTime"
                          type="text"
                          placeholder="HH:MM AM/PM (e.g., 4:00 PM)"
                          value={newEvent.endTime}
                          onChange={(e) => {
                            const formatted = formatTimeInput(e.target.value);
                            setNewEvent({ ...newEvent, endTime: formatted });
                          }}
                          onBlur={(e) => {
                            if (e.target.value && !validateTime(e.target.value)) {
                              setError('Please enter a valid time in HH:MM AM/PM format');
                            }
                          }}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
                          Location
                        </label>
                        <input
                          id="location"
                          type="text"
                          placeholder="Enter event location"
                          value={newEvent.location}
                          onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                          required
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="aboutEvent" className="block text-sm font-medium text-gray-700 mb-2">
                          About Event (Optional)
                        </label>
                        <textarea
                          id="aboutEvent"
                          rows={4}
                          placeholder="Enter event description..."
                          value={newEvent.aboutEvent}
                          onChange={(e) => setNewEvent({ ...newEvent, aboutEvent: e.target.value })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="contactDetails" className="block text-sm font-medium text-gray-700 mb-2">
                          Contact Email (Optional)
                        </label>
                        <input
                          id="contactDetails"
                          type="email"
                          placeholder="organizer@example.com"
                          value={newEvent.contactDetails}
                          onChange={(e) => setNewEvent({ ...newEvent, contactDetails: e.target.value })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="hostingOrganization" className="block text-sm font-medium text-gray-700 mb-2">
                          Hosting Organization
                        </label>
                        <select
                          id="hostingOrganization"
                          value={newEvent.hostingOrganization}
                          onChange={(e) => setNewEvent({ ...newEvent, hostingOrganization: e.target.value })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        >
                          <option value="">Select hosting organization</option>
                          <option value="Hawaii Republican Party">Hawaii Republican Party</option>
                          <option value="Honolulu County Committee">Honolulu County Committee</option>
                          <option value="Maui County Committee">Maui County Committee</option>
                          <option value="Kauai County Committee">Kauai County Committee</option>
                          <option value="West Hawaii County Committee">West Hawaii County Committee</option>
                          <option value="East Hawaii County Committee">East Hawaii County Committee</option>
                          <option value="Oahu League of Republican Women">Oahu League of Republican Women</option>
                          <option value="Hawaii Federation of Republican Women">Hawaii Federation of Republican Women</option>
                          <option value="Hawaii Young Republicans">Hawaii Young Republicans</option>
                        </select>
                      </div>
                      
                      <div>
                        <label htmlFor="details" className="block text-sm font-medium text-gray-700 mb-2">
                          Event Details/Agenda (Optional)
                        </label>
                        <textarea
                          id="details"
                          rows={6}
                          placeholder="Enter event details, agenda, or additional information..."
                          value={newEvent.details}
                          onChange={(e) => setNewEvent({ ...newEvent, details: e.target.value })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
                        />
                      </div>
                      
                      <div className="flex space-x-4 pt-4">
                        <button
                          type="submit"
                          className="flex-1 bg-[#C62828] text-white px-6 py-3 rounded-xl font-medium hover:bg-[#B71C1C] transition-colors duration-200 shadow-sm"
                        >
                          Create Event
                        </button>
                        <button
                          type="button"
                          onClick={() => setShowCreateForm(false)}
                          className="flex-1 bg-gray-100 text-gray-700 px-6 py-3 rounded-xl font-medium hover:bg-gray-200 transition-colors duration-200"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  </>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Edit Event Form */}
      {editingEvent && (
        <section className="py-12 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Edit Event</h2>
                <form onSubmit={handleUpdateEvent} className="space-y-6">
                  <div>
                    <label htmlFor="edit-title" className="block text-sm font-medium text-gray-700 mb-2">
                      Event Title
                    </label>
                    <input
                      id="edit-title"
                      type="text"
                      placeholder="Enter event title"
                      value={editingEvent.title}
                      onChange={(e) => setEditingEvent({ ...editingEvent, title: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="edit-date" className="block text-sm font-medium text-gray-700 mb-2">
                      Date
                    </label>
                    <input
                      id="edit-date"
                      type="text"
                      placeholder="MM/DD/YYYY (e.g., 12/25/2024)"
                      value={editingEvent.date}
                      onChange={(e) => setEditingEvent({ ...editingEvent, date: e.target.value })}
                      onBlur={(e) => {
                        if (e.target.value && !validateAndFormatDate(e.target.value)) {
                          setError('Please enter a valid date in MM/DD/YYYY format');
                        }
                      }}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="edit-endDate" className="block text-sm font-medium text-gray-700 mb-2">
                      End Date (Optional)
                    </label>
                    <input
                      id="edit-endDate"
                      type="text"
                      placeholder="MM/DD/YYYY (e.g., 12/26/2024)"
                      value={editingEvent.endDate || ''}
                      onChange={(e) => {
                        const formatted = formatDateInput(e.target.value);
                        setEditingEvent({ ...editingEvent, endDate: formatted });
                      }}
                      onBlur={(e) => {
                        if (e.target.value && !validateAndFormatDate(e.target.value)) {
                          setError('Please enter a valid date in MM/DD/YYYY format');
                        }
                      }}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="edit-startTime" className="block text-sm font-medium text-gray-700 mb-2">
                      Start Time (Optional)
                    </label>
                    <input
                      id="edit-startTime"
                      type="text"
                      placeholder="HH:MM AM/PM (e.g., 2:30 PM)"
                      value={editingEvent.startTime || ''}
                      onChange={(e) => {
                        const formatted = formatTimeInput(e.target.value);
                        setEditingEvent({ ...editingEvent, startTime: formatted });
                      }}
                      onBlur={(e) => {
                        if (e.target.value && !validateTime(e.target.value)) {
                          setError('Please enter a valid time in HH:MM AM/PM format');
                        }
                      }}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="edit-endTime" className="block text-sm font-medium text-gray-700 mb-2">
                      End Time (Optional)
                    </label>
                    <input
                      id="edit-endTime"
                      type="text"
                      placeholder="HH:MM AM/PM (e.g., 4:00 PM)"
                      value={editingEvent.endTime || ''}
                      onChange={(e) => {
                        const formatted = formatTimeInput(e.target.value);
                        setEditingEvent({ ...editingEvent, endTime: formatted });
                      }}
                      onBlur={(e) => {
                        if (e.target.value && !validateTime(e.target.value)) {
                          setError('Please enter a valid time in HH:MM AM/PM format');
                        }
                      }}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="edit-location" className="block text-sm font-medium text-gray-700 mb-2">
                      Location
                    </label>
                    <input
                      id="edit-location"
                      type="text"
                      placeholder="Enter event location"
                      value={editingEvent.location}
                      onChange={(e) => setEditingEvent({ ...editingEvent, location: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="edit-aboutEvent" className="block text-sm font-medium text-gray-700 mb-2">
                      About Event (Optional)
                    </label>
                    <textarea
                      id="edit-aboutEvent"
                      rows={4}
                      placeholder="Enter event description..."
                      value={editingEvent.aboutEvent || ''}
                      onChange={(e) => setEditingEvent({ ...editingEvent, aboutEvent: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="edit-contactDetails" className="block text-sm font-medium text-gray-700 mb-2">
                      Contact Email (Optional)
                    </label>
                    <input
                      id="edit-contactDetails"
                      type="email"
                      placeholder="organizer@example.com"
                      value={editingEvent.contactDetails || ''}
                      onChange={(e) => setEditingEvent({ ...editingEvent, contactDetails: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="edit-hostingOrganization" className="block text-sm font-medium text-gray-700 mb-2">
                      Hosting Organization
                    </label>
                    <select
                      id="edit-hostingOrganization"
                      value={editingEvent.hostingOrganization || ''}
                      onChange={(e) => setEditingEvent({ ...editingEvent, hostingOrganization: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    >
                      <option value="">Select hosting organization</option>
                      <option value="Hawaii Republican Party">Hawaii Republican Party</option>
                      <option value="Honolulu County Committee">Honolulu County Committee</option>
                      <option value="Maui County Committee">Maui County Committee</option>
                      <option value="Kauai County Committee">Kauai County Committee</option>
                      <option value="West Hawaii County Committee">West Hawaii County Committee</option>
                      <option value="East Hawaii County Committee">East Hawaii County Committee</option>
                      <option value="Oahu League of Republican Women">Oahu League of Republican Women</option>
                      <option value="Hawaii Federation of Republican Women">Hawaii Federation of Republican Women</option>
                      <option value="Hawaii Young Republicans">Hawaii Young Republicans</option>
                    </select>
                  </div>
                  
                  <div>
                    <label htmlFor="edit-details" className="block text-sm font-medium text-gray-700 mb-2">
                      Event Details/Agenda (Optional)
                    </label>
                    <textarea
                      id="edit-details"
                      rows={6}
                      placeholder="Enter event details, agenda, or additional information..."
                      value={editingEvent.details || ''}
                      onChange={(e) => setEditingEvent({ ...editingEvent, details: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
                    />
                  </div>
                  
                  <div className="flex space-x-4 pt-4">
                    <button
                      type="submit"
                      className="flex-1 bg-[#C62828] text-white px-6 py-3 rounded-xl font-medium hover:bg-[#B71C1C] transition-colors duration-200 shadow-sm"
                    >
                      Update Event
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditingEvent(null)}
                      className="flex-1 bg-gray-100 text-gray-700 px-6 py-3 rounded-xl font-medium hover:bg-gray-200 transition-colors duration-200"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Events List */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900">Events</h2>
              <div className="flex gap-3">
                {isAuthenticated ? (
                  <>
                    <button
                      onClick={() => setShowCreateForm(true)}
                      className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-xl text-white bg-[#C62828] hover:bg-[#B71C1C] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#C62828]"
                    >
                      Create Event
                    </button>
                    <button
                      onClick={handleSignOut}
                      className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-xl text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#C62828]"
                    >
                      Sign Out
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => setShowAuth(true)}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-xl text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#C62828]"
                  >
                    Admin Sign In
                  </button>
                )}
              </div>
            </div>
            
            {loading ? (
              <div className="text-center py-12">
                <div className="inline-flex items-center px-4 py-2 font-semibold leading-6 text-gray-600 shadow rounded-xl">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Loading events...
                </div>
              </div>
            ) : events.length === 0 ? (
              <div className="text-center py-12">
                <div className="bg-white rounded-3xl shadow-xl p-12 border border-gray-100">
                  <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No events</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    {isAuthenticated 
                      ? "Get started by creating your first event." 
                      : "No events have been posted yet. Check back soon!"
                    }
                  </p>
                  {isAuthenticated && (
                    <div className="mt-6">
                      <button
                        onClick={() => setShowCreateForm(true)}
                        className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-xl text-white bg-[#C62828] hover:bg-[#B71C1C] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#C62828]"
                      >
                        Create Event
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="events-list">
                {paginatedEvents().map((event) => (
                  <div key={event.id} className="event-card flex flex-col h-full">
                    <div className="event-date">
                      {event.endDate && event.endDate !== event.date ? (
                        <>
                          <div>
                            {(() => {
                              const startDate = new Date(event.date);
                              const endDate = new Date(event.endDate);
                              const startMonth = startDate.getMonth();
                              const endMonth = endDate.getMonth();
                              const startYear = startDate.getFullYear();
                              const endYear = endDate.getFullYear();
                              
                              if (startMonth === endMonth && startYear === endYear) {
                                // Same month and year
                                const month = startDate.toLocaleDateString('en-US', { month: 'long' });
                                const startDay = startDate.getDate();
                                const endDay = endDate.getDate();
                                const year = startYear;
                                return `${month} ${startDay} - ${endDay} ${year}`;
                              } else {
                                // Different months or years
                                return `${formatDateShort(event.date)} - ${formatDateShort(event.endDate)}`;
                              }
                            })()}
                          </div>
                          <div className="text-sm text-gray-500 mt-1">
                            {event.startTime && event.startTime}
                          </div>
                        </>
                      ) : (
                        <>
                          <div>{formatDate(event.date)}</div>
                          <div className="text-sm text-gray-500 mt-1">
                            {event.startTime && event.startTime}
                          </div>
                        </>
                      )}
                    </div>
                    <div className="event-info flex-1 flex flex-col">
                      <h3>{event.title}</h3>
                      <div className="space-y-2 mb-3">
                        <div className="flex items-center text-gray-600 text-sm">
                          <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          <span>{event.location}</span>
                        </div>
                        {event.organizer && (
                          <div className="flex items-center text-gray-600 text-sm">
                            <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                            <span>{event.organizer}</span>
                          </div>
                        )}
                      </div>
                      {event.aboutEvent && (
                        <p className="text-gray-700 text-sm mb-3">{event.aboutEvent}</p>
                      )}
                      <div className="flex flex-wrap gap-2 mt-auto">
                        <Link
                          href={`/events/${event.id}`}
                          className="event-link"
                        >
                          View Details
                        </Link>
                        <button
                          onClick={() => downloadICal(event)}
                          className="event-link"
                        >
                          Add to Calendar
                        </button>
                        {isAuthenticated && (
                          <>
                            <button
                              onClick={() => startEditingEvent(event)}
                              className="event-link"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteEvent(event.id)}
                              className="event-link"
                            >
                              Delete
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-8">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className={`event-link px-4 py-2 ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  Previous
                </button>
                {[...Array(totalPages)].map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentPage(idx + 1)}
                    className={`event-link px-4 py-2 ${currentPage === idx + 1 ? 'bg-[#B71C1C] text-white' : ''}`}
                  >
                    {idx + 1}
                  </button>
                ))}
                <button
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className={`event-link px-4 py-2 ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

export default EventsPage; 