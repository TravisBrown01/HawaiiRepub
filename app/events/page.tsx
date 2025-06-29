'use client';

import React, { useState, useEffect } from 'react';
import { createEvent, updateEvent, deleteEvent } from '../../src/graphql/mutations';
import { listEvents } from '../../src/graphql/queries';
import { signUp, confirmSignUp, resetPassword, confirmResetPassword, confirmSignIn } from 'aws-amplify/auth';
import { withAuthenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import Link from 'next/link';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useAuth } from '../contexts/AuthContext';
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
  registrationLink?: string;
  registrationType?: string;
  owner?: string;
}

function EventsPage() {
  const client = useAmplifyClient();
  const { isAuthenticated, isLoading: authLoading, signOut, signIn, refreshAuthState, validateSession, forceClearSession, debugSession } = useAuth();
  
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
    hostingOrganization: '',
    registrationLink: '',
    registrationType: ''
  });
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  
  // Authentication states
  const [showAuth, setShowAuth] = useState(false);
  const [authMode, setAuthMode] = useState<'signIn' | 'signUp' | 'confirm' | 'forgotPassword' | 'confirmReset' | 'changePassword'>('signIn');
  const [authForm, setAuthForm] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    confirmationCode: '',
    newPassword: ''
  });
  const [authError, setAuthError] = useState<string | null>(null);
  const [authFormLoading, setAuthFormLoading] = useState(false);
  const [authSuccess, setAuthSuccess] = useState<string | null>(null);
  
  // Filter and sorting states
  const [showPastEvents, setShowPastEvents] = useState(false);
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const EVENTS_PER_PAGE = 6;

  useEffect(() => {
    const initializeApp = async () => {
      console.log('Initializing app...');
      
      // Wait for authentication to be checked
      if (!authLoading) {
        await fetchEvents();
      }
    };
    
    initializeApp();
  }, [authLoading]);

  useEffect(() => {
    if (isAuthenticated && !authLoading) {
      // Refetch events when user becomes authenticated (for admin features)
      fetchEvents();
    }
  }, [isAuthenticated, authLoading]);

  const handleSignOut = async () => {
    try {
      console.log('Signing out...');
      await signOut();
      console.log('Sign out successful');
      setShowAuth(false);
      
      // Refetch events with public access (api-key) after sign out
      await fetchEvents();
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthFormLoading(true);
    setAuthError(null);
    
    try {
      console.log('Attempting sign in...');
      const signInResult = await signIn(authForm.username, authForm.password);
      
      // Check if the user needs to change their password
      if (signInResult.nextStep?.signInStep === 'CONFIRM_SIGN_IN_WITH_NEW_PASSWORD_REQUIRED') {
        // User is in FORCE_CHANGE_PASSWORD state
        setAuthMode('changePassword');
        setAuthSuccess('Please set a new password to continue.');
        return;
      }
      
      // Normal successful sign in
      setShowAuth(false);
      setAuthForm({ username: '', email: '', password: '', confirmPassword: '', confirmationCode: '', newPassword: '' });
      
      // Refresh auth state to ensure UI is updated
      await refreshAuthState();
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
      } else if (error.name === 'UserAlreadyAuthenticatedException') {
        setAuthError('You are already signed in. Please refresh the page or try signing out first.');
        // Automatically clear the session and refresh state
        await forceClearSession();
        await refreshAuthState();
      } else {
        setAuthError('Sign in failed. Please check your credentials and try again.');
      }
    } finally {
      setAuthFormLoading(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (authForm.newPassword !== authForm.confirmPassword) {
      setAuthError('Passwords do not match');
      return;
    }
    
    if (authForm.newPassword.length < 8) {
      setAuthError('Password must be at least 8 characters long');
      return;
    }
    
    setAuthFormLoading(true);
    setAuthError(null);
    
    try {
      // Complete the sign-in with the new password
      await confirmSignIn({ challengeResponse: authForm.newPassword });
      
      setShowAuth(false);
      setAuthForm({ username: '', email: '', password: '', confirmPassword: '', confirmationCode: '', newPassword: '' });
      setAuthSuccess('Password changed successfully! You are now signed in.');
    } catch (error: any) {
      console.error('Change password error:', error);
      
      if (error.name === 'InvalidPasswordException') {
        setAuthError('Password does not meet requirements. Please use at least 8 characters.');
      } else if (error.name === 'NotAuthorizedException') {
        setAuthError('Invalid password. Please try again.');
      } else if (error.name === 'TooManyRequestsException') {
        setAuthError('Too many attempts. Please wait a moment before trying again.');
      } else {
        setAuthError('Failed to change password. Please try again.');
      }
    } finally {
      setAuthFormLoading(false);
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
    
    setAuthFormLoading(true);
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
      setAuthFormLoading(false);
    }
  };

  const handleConfirmSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthFormLoading(true);
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
      setAuthFormLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthFormLoading(true);
    setAuthError(null);
    setAuthSuccess(null);
    
    try {
      await resetPassword({ username: authForm.username });
      setAuthMode('confirmReset');
      setAuthSuccess('Password reset code sent to your email. Please check your inbox.');
    } catch (error: any) {
      console.error('Forgot password error:', error);
      
      if (error.name === 'UserNotFoundException') {
        setAuthError('User not found. Please check your username.');
      } else if (error.name === 'TooManyRequestsException') {
        setAuthError('Too many attempts. Please wait a moment before trying again.');
      } else if (error.name === 'LimitExceededException') {
        setAuthError('Too many password reset attempts. Please try again later.');
      } else {
        setAuthError('Failed to send reset code. Please try again.');
      }
    } finally {
      setAuthFormLoading(false);
    }
  };

  const handleConfirmResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (authForm.newPassword !== authForm.confirmPassword) {
      setAuthError('Passwords do not match');
      return;
    }
    
    if (authForm.newPassword.length < 8) {
      setAuthError('Password must be at least 8 characters long');
      return;
    }
    
    setAuthFormLoading(true);
    setAuthError(null);
    
    try {
      await confirmResetPassword({
        username: authForm.username,
        confirmationCode: authForm.confirmationCode,
        newPassword: authForm.newPassword
      });
      setAuthMode('signIn');
      setAuthForm({ ...authForm, confirmationCode: '', newPassword: '', confirmPassword: '' });
      setAuthSuccess('Password reset successful! You can now sign in with your new password.');
    } catch (error: any) {
      console.error('Confirm reset password error:', error);
      
      if (error.name === 'CodeMismatchException') {
        setAuthError('Invalid reset code. Please check your email and try again.');
      } else if (error.name === 'ExpiredCodeException') {
        setAuthError('Reset code has expired. Please request a new code.');
      } else if (error.name === 'InvalidPasswordException') {
        setAuthError('Password does not meet requirements. Please use at least 8 characters.');
      } else if (error.name === 'TooManyRequestsException') {
        setAuthError('Too many attempts. Please wait a moment before trying again.');
      } else {
        setAuthError('Failed to reset password. Please try again.');
      }
    } finally {
      setAuthFormLoading(false);
    }
  };

  const fetchEvents = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('Fetching events...');
      
      const result = await client.graphql({
        query: listEvents,
        authMode: 'apiKey'
      });
      
      console.log('Events result:', result);
      
      if ('data' in result && result.data?.listEvents?.items) {
        const eventsData = result.data.listEvents.items;
        console.log('Raw events data:', eventsData);
        setEvents(eventsData);
        console.log('Events loaded:', eventsData);
      } else {
        console.log('No events data found');
        setEvents([]);
      }
      
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
      
      // Convert MM/DD/YYYY format to YYYY-MM-DD for storage
      const formattedDate = mmDdYyyyToYyyyMmDd(newEvent.date);
      const formattedEndDate = newEvent.endDate ? mmDdYyyyToYyyyMmDd(newEvent.endDate) : null;
      
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
        hostingOrganization: newEvent.hostingOrganization || null,
        registrationLink: newEvent.registrationLink || null,
        registrationType: newEvent.registrationType || null
      };
      await client.graphql({
        query: createEvent,
        variables: { input: formattedEvent },
        authMode: 'apiKey'
      });
      setNewEvent({ title: '', date: '', endDate: '', startTime: '', endTime: '', location: '', aboutEvent: '', details: '', organizer: '', contactDetails: '', hostingOrganization: '', registrationLink: '', registrationType: '' });
      setShowCreateForm(false);
      fetchEvents();
    } catch (error) {
      console.error('Error creating event:', JSON.stringify(error, null, 2));
      setError(error instanceof Error ? error.message : JSON.stringify(error));
    }
  };

  // Safe function to show auth modal
  const showAuthModal = async () => {
    // First validate the current session
    const isCurrentlyAuthenticated = await validateSession();
    
    // Only show auth modal if user is not authenticated
    if (!isCurrentlyAuthenticated) {
      setShowAuth(true);
    } else {
      // User is already authenticated, refresh state and don't show modal
      console.log('User is already authenticated, refreshing state');
      await refreshAuthState();
    }
  };

  const startEditingEvent = (event: Event) => {
    if (!isAuthenticated) {
      showAuthModal();
      return;
    }
    // Convert YYYY-MM-DD format to MM/DD/YYYY for the edit form
    const eventForEditing = {
      ...event,
      date: yyyyMmDdToMmDdYyyy(event.date),
      endDate: event.endDate ? yyyyMmDdToMmDdYyyy(event.endDate) : ''
    };
    setEditingEvent(eventForEditing);
  };

  const handleUpdateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingEvent) return;
    
    try {
      setError(null);
      
      // Convert MM/DD/YYYY format back to YYYY-MM-DD for storage
      const formattedDate = mmDdYyyyToYyyyMmDd(editingEvent.date);
      const formattedEndDate = editingEvent.endDate ? mmDdYyyyToYyyyMmDd(editingEvent.endDate) : null;
      
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
        hostingOrganization: editingEvent.hostingOrganization || null,
        registrationLink: editingEvent.registrationLink || null,
        registrationType: editingEvent.registrationType || null
      };
      
      console.log('Updating event:', formattedEvent);
      
      await client.graphql({
        query: updateEvent,
        variables: { input: formattedEvent },
        authMode: 'apiKey'
      });
      
      setEditingEvent(null);
      fetchEvents();
    } catch (error) {
      console.error('Error updating event:', JSON.stringify(error, null, 2));
      setError(error instanceof Error ? error.message : JSON.stringify(error));
    }
  };

  const handleDeleteEvent = async (id: string) => {
    if (!confirm('Are you sure you want to delete this event?')) return;
    
    try {
      setError(null);
      console.log('Deleting event:', id);
      
      await client.graphql({
        query: deleteEvent,
        variables: { input: { id } },
        authMode: 'apiKey'
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
    
    // Parse MM/DD/YYYY format as local date to avoid timezone issues
    const dateMatch = dateString.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
    if (!dateMatch) {
      throw new Error(`Please enter a valid date in MM/DD/YYYY format. Received: "${dateString}"`);
    }
    
    const month = parseInt(dateMatch[1]) - 1; // Month is 0-indexed
    const day = parseInt(dateMatch[2]);
    const year = parseInt(dateMatch[3]);
    
    // Create date using local values to avoid timezone issues
    const date = new Date(year, month, day);
    console.log('Parsed Date object:', date);
    console.log('Date.getTime():', date.getTime());
    console.log('isNaN(date.getTime()):', isNaN(date.getTime()));
    
    // Check if the date is valid
    if (isNaN(date.getTime())) {
      throw new Error(`Please enter a valid date. Received: "${dateString}"`);
    }
    
    // Format as YYYY-MM-DD for AWS (using local date components)
    const result = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    console.log('Final formatted result:', result);
    console.log('=== END DATE VALIDATION ===');
    return result;
  };

  // Convert YYYY-MM-DD to MM/DD/YYYY for display in forms
  const yyyyMmDdToMmDdYyyy = (dateString: string): string => {
    if (!dateString) return '';
    const match = dateString.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
    if (!match) return dateString;
    const year = match[1];
    const month = match[2];
    const day = match[3];
    return `${month}/${day}/${year}`;
  };

  // Convert MM/DD/YYYY to YYYY-MM-DD for storage
  const mmDdYyyyToYyyyMmDd = (dateString: string): string => {
    if (!dateString) return '';
    const match = dateString.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
    if (!match) return dateString;
    const month = match[1];
    const day = match[2];
    const year = match[3];
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
  };

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
      const dateObj = parseLocalDate(date);
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
    const date = parseLocalDate(dateString);
    const month = date.toLocaleDateString('en-US', { month: 'long' });
    const day = date.getDate();
    const year = date.getFullYear();
    return `${month} ${day} ${year}`;
  };

  const formatDateShort = (dateString: string): string => {
    const date = parseLocalDate(dateString);
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
        const eventDate = parseLocalDate(event.date);
        eventDate.setHours(0, 0, 0, 0);
        
        // If event has an end date, check if it ends in the future
        if (event.endDate) {
          const endDate = parseLocalDate(event.endDate);
          endDate.setHours(0, 0, 0, 0);
          return endDate >= today;
        }
        
        // Otherwise check if the event date is today or in the future
        return eventDate >= today;
      })
      .sort((a, b) => {
        const dateA = parseLocalDate(a.date);
        const dateB = parseLocalDate(b.date);
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

  // Debug function to help troubleshoot session issues
  const handleDebugSession = async () => {
    console.log('🔍 === DEBUGGING SESSION ===');
    await debugSession();
    console.log('🔍 === END DEBUGGING ===');
  };

  // Validate date in MM/DD/YYYY format (for form inputs)
  const validateDateInput = (dateString: string): boolean => {
    if (!dateString.trim()) return true; // Empty is valid for optional fields
    
    const dateMatch = dateString.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
    if (!dateMatch) return false;
    
    const month = parseInt(dateMatch[1]);
    const day = parseInt(dateMatch[2]);
    const year = parseInt(dateMatch[3]);
    
    // Basic validation
    if (month < 1 || month > 12) return false;
    if (day < 1 || day > 31) return false;
    if (year < 1900 || year > 2100) return false;
    
    // Create date to check if it's valid
    const date = new Date(year, month - 1, day);
    return date.getFullYear() === year && 
           date.getMonth() === month - 1 && 
           date.getDate() === day;
  };

  // Show loading only briefly while checking auth, then show events
  if (authLoading && loading) {
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

            {authSuccess && (
              <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6">
                <div className="flex items-center">
                  <svg className="h-5 w-5 text-green-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm text-green-700">{authSuccess}</span>
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
                  disabled={authFormLoading}
                  className="w-full bg-[#C62828] text-white px-6 py-3 rounded-xl font-medium hover:bg-[#B71C1C] transition-colors duration-200 shadow-sm disabled:opacity-50"
                >
                  {authFormLoading ? 'Signing In...' : 'Sign In'}
                </button>
                <div className="text-center space-y-2">
                  <button
                    type="button"
                    onClick={() => setAuthMode('forgotPassword')}
                    className="text-sm text-[#C62828] hover:text-[#B71C1C] transition-colors"
                  >
                    Forgot Password?
                  </button>
                  <p className="text-sm text-gray-500">
                    Contact the administrator to create an account
                  </p>
                  
                  {/* Debug section for authentication issues */}
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <p className="text-xs text-gray-400 mb-2">Having trouble signing in?</p>
                    <div className="space-y-2">
                      <button
                        type="button"
                        onClick={async () => {
                          try {
                            await forceClearSession();
                            await refreshAuthState();
                            setAuthError(null);
                            setAuthSuccess('Session cleared. Please try signing in again.');
                          } catch (error) {
                            console.error('Error clearing session:', error);
                            setAuthError('Failed to clear session. Please refresh the page.');
                          }
                        }}
                        className="text-xs text-gray-500 hover:text-gray-700 underline block"
                      >
                        Clear Session & Retry
                      </button>
                      <button
                        type="button"
                        onClick={handleDebugSession}
                        className="text-xs text-blue-500 hover:text-blue-700 underline block"
                      >
                        Debug Session (Check Console)
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            )}

            {authMode === 'forgotPassword' && (
              <form onSubmit={handleForgotPassword} className="space-y-6">
                <div>
                  <label htmlFor="forgot-username" className="block text-sm font-medium text-gray-700 mb-2">
                    Username
                  </label>
                  <input
                    id="forgot-username"
                    type="text"
                    value={authForm.username}
                    onChange={(e) => setAuthForm({ ...authForm, username: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#C62828] focus:border-transparent transition-all duration-200"
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={authFormLoading}
                  className="w-full bg-[#C62828] text-white px-6 py-3 rounded-xl font-medium hover:bg-[#B71C1C] transition-colors duration-200 shadow-sm disabled:opacity-50"
                >
                  {authFormLoading ? 'Sending Reset Code...' : 'Send Reset Code'}
                </button>
                <div className="text-center">
                  <button
                    type="button"
                    onClick={() => setAuthMode('signIn')}
                    className="text-sm text-[#C62828] hover:text-[#B71C1C] transition-colors"
                  >
                    Back to Sign In
                  </button>
                </div>
              </form>
            )}

            {authMode === 'confirmReset' && (
              <form onSubmit={handleConfirmResetPassword} className="space-y-6">
                <div>
                  <label htmlFor="reset-code" className="block text-sm font-medium text-gray-700 mb-2">
                    Reset Code
                  </label>
                  <input
                    id="reset-code"
                    type="text"
                    placeholder="Enter the code from your email"
                    value={authForm.confirmationCode}
                    onChange={(e) => setAuthForm({ ...authForm, confirmationCode: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#C62828] focus:border-transparent transition-all duration-200"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="new-password" className="block text-sm font-medium text-gray-700 mb-2">
                    New Password
                  </label>
                  <input
                    id="new-password"
                    type="password"
                    placeholder="Enter your new password"
                    value={authForm.newPassword}
                    onChange={(e) => setAuthForm({ ...authForm, newPassword: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#C62828] focus:border-transparent transition-all duration-200"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="confirm-new-password" className="block text-sm font-medium text-gray-700 mb-2">
                    Confirm New Password
                  </label>
                  <input
                    id="confirm-new-password"
                    type="password"
                    placeholder="Confirm your new password"
                    value={authForm.confirmPassword}
                    onChange={(e) => setAuthForm({ ...authForm, confirmPassword: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#C62828] focus:border-transparent transition-all duration-200"
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={authFormLoading}
                  className="w-full bg-[#C62828] text-white px-6 py-3 rounded-xl font-medium hover:bg-[#B71C1C] transition-colors duration-200 shadow-sm disabled:opacity-50"
                >
                  {authFormLoading ? 'Resetting Password...' : 'Reset Password'}
                </button>
                <div className="text-center space-y-2">
                  <button
                    type="button"
                    onClick={() => setAuthMode('forgotPassword')}
                    className="text-sm text-[#C62828] hover:text-[#B71C1C] transition-colors"
                  >
                    Resend Code
                  </button>
                  <div>
                    <button
                      type="button"
                      onClick={() => setAuthMode('signIn')}
                      className="text-sm text-[#C62828] hover:text-[#B71C1C] transition-colors"
                    >
                      Back to Sign In
                    </button>
                  </div>
                </div>
              </form>
            )}

            {authMode === 'changePassword' && (
              <form onSubmit={handleChangePassword} className="space-y-6">
                <div>
                  <label htmlFor="change-new-password" className="block text-sm font-medium text-gray-700 mb-2">
                    New Password
                  </label>
                  <input
                    id="change-new-password"
                    type="password"
                    placeholder="Enter your new password"
                    value={authForm.newPassword}
                    onChange={(e) => setAuthForm({ ...authForm, newPassword: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#C62828] focus:border-transparent transition-all duration-200"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="change-confirm-password" className="block text-sm font-medium text-gray-700 mb-2">
                    Confirm New Password
                  </label>
                  <input
                    id="change-confirm-password"
                    type="password"
                    placeholder="Confirm your new password"
                    value={authForm.confirmPassword}
                    onChange={(e) => setAuthForm({ ...authForm, confirmPassword: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#C62828] focus:border-transparent transition-all duration-200"
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={authFormLoading}
                  className="w-full bg-[#C62828] text-white px-6 py-3 rounded-xl font-medium hover:bg-[#B71C1C] transition-colors duration-200 shadow-sm disabled:opacity-50"
                >
                  {authFormLoading ? 'Changing Password...' : 'Change Password'}
                </button>
                <div className="text-center">
                  <button
                    type="button"
                    onClick={() => setAuthMode('signIn')}
                    className="text-sm text-[#C62828] hover:text-[#B71C1C] transition-colors"
                  >
                    Back to Sign In
                  </button>
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
                        onClick={() => showAuthModal()}
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
                            if (e.target.value && !validateDateInput(e.target.value)) {
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
                            if (e.target.value && !validateDateInput(e.target.value)) {
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
                        <div className="relative">
                          <select
                            id="hostingOrganization"
                            value={newEvent.hostingOrganization}
                            onChange={(e) => setNewEvent({ ...newEvent, hostingOrganization: e.target.value })}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 appearance-none bg-white cursor-pointer"
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
                          <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <label htmlFor="registrationLink" className="block text-sm font-medium text-gray-700 mb-2">
                          Registration Link (Optional)
                        </label>
                        <div className="flex space-x-3">
                          <div className="flex-1">
                            <input
                              id="registrationLink"
                              type="url"
                              placeholder="https://example.com/register"
                              value={newEvent.registrationLink}
                              onChange={(e) => setNewEvent({ ...newEvent, registrationLink: e.target.value })}
                              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                            />
                          </div>
                          <div className="w-32">
                            <div className="relative">
                              <select
                                id="registrationType"
                                value={newEvent.registrationType}
                                onChange={(e) => setNewEvent({ ...newEvent, registrationType: e.target.value })}
                                className="w-full px-3 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 appearance-none bg-white cursor-pointer text-sm"
                              >
                                <option value="">Type</option>
                                <option value="RSVP">RSVP</option>
                                <option value="Signup">Signup</option>
                                <option value="Register">Register</option>
                                <option value="Get Tickets">Get Tickets</option>
                              </select>
                              <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                                <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                              </div>
                            </div>
                          </div>
                        </div>
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
                      onChange={(e) => {
                        const formatted = formatDateInput(e.target.value);
                        // Store the MM/DD/YYYY format temporarily
                        setEditingEvent({ ...editingEvent, date: formatted });
                      }}
                      onBlur={(e) => {
                        if (e.target.value && !validateDateInput(e.target.value)) {
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
                        // Store the MM/DD/YYYY format temporarily
                        setEditingEvent({ ...editingEvent, endDate: formatted });
                      }}
                      onBlur={(e) => {
                        if (e.target.value && !validateDateInput(e.target.value)) {
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
                    <div className="relative">
                      <select
                        id="edit-hostingOrganization"
                        value={editingEvent.hostingOrganization || ''}
                        onChange={(e) => setEditingEvent({ ...editingEvent, hostingOrganization: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 appearance-none bg-white cursor-pointer"
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
                      <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="edit-registrationLink" className="block text-sm font-medium text-gray-700 mb-2">
                      Registration Link (Optional)
                    </label>
                    <div className="flex space-x-3">
                      <div className="flex-1">
                        <input
                          id="edit-registrationLink"
                          type="url"
                          placeholder="https://example.com/register"
                          value={editingEvent.registrationLink || ''}
                          onChange={(e) => setEditingEvent({ ...editingEvent, registrationLink: e.target.value })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        />
                      </div>
                      <div className="w-32">
                        <div className="relative">
                          <select
                            id="edit-registrationType"
                            value={editingEvent.registrationType || ''}
                            onChange={(e) => setEditingEvent({ ...editingEvent, registrationType: e.target.value })}
                            className="w-full px-3 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 appearance-none bg-white cursor-pointer text-sm"
                          >
                            <option value="">Type</option>
                            <option value="RSVP">RSVP</option>
                            <option value="Signup">Signup</option>
                            <option value="Register">Register</option>
                            <option value="Get Tickets">Get Tickets</option>
                          </select>
                          <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                            <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </div>
                        </div>
                      </div>
                    </div>
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
                    onClick={() => showAuthModal()}
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
                              const startDate = parseLocalDate(event.date);
                              const endDate = parseLocalDate(event.endDate);
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
      <Footer />
    </div>
  );
}

export default EventsPage; 