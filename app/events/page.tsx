'use client';

import { useState, useEffect } from 'react';
import { generateClient } from 'aws-amplify/api';
import { signOut, signIn, signUp, confirmSignUp, getCurrentUser, fetchAuthSession } from 'aws-amplify/auth';
import { createEvent, updateEvent, deleteEvent } from '../../src/graphql/mutations';
import { listEvents } from '../../src/graphql/queries';
import Link from 'next/link';
import { uploadFileToS3, deleteMultipleFilesFromS3 } from '../utils/s3Upload';
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
  photos?: string[];
  attachments?: string[];
  owner?: string;
  photoUrls?: string[];
  attachmentUrls?: string[];
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
    contactDetails: ''
  });
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [editingPhotos, setEditingPhotos] = useState<(File | null)[]>([null, null, null]);
  const [editingAttachments, setEditingAttachments] = useState<File[]>([]);
  const [existingPhotoUrls, setExistingPhotoUrls] = useState<string[]>([]);
  const [existingAttachmentUrls, setExistingAttachmentUrls] = useState<string[]>([]);
  const [photosToDelete, setPhotosToDelete] = useState<string[]>([]);
  const [attachmentsToDelete, setAttachmentsToDelete] = useState<string[]>([]);
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

  // Photo upload state
  const [photos, setPhotos] = useState<(File | null)[]>([null, null, null]);
  const [attachments, setAttachments] = useState<File[]>([]);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  useEffect(() => {
    if (isAuthenticated && !authChecking) {
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
      
      if (user && session.tokens) {
        setIsAuthenticated(true);
        setShowAuth(false);
      } else {
        setIsAuthenticated(false);
        setShowAuth(true);
      }
    } catch (error) {
      console.log('Auth check failed:', error);
      setIsAuthenticated(false);
      setShowAuth(true);
    } finally {
      setAuthChecking(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      setIsAuthenticated(false);
      setShowAuth(true);
      setEvents([]);
      setAuthChecking(false);
    } catch (error) {
      console.error('Error signing out:', error);
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
    } catch (error) {
      console.error('Sign in error:', error);
      setAuthError(error instanceof Error ? error.message : 'Failed to sign in');
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
    } catch (error) {
      console.error('Sign up error:', error);
      setAuthError(error instanceof Error ? error.message : 'Failed to sign up');
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
    } catch (error) {
      console.error('Confirmation error:', error);
      setAuthError(error instanceof Error ? error.message : 'Failed to confirm sign up');
    } finally {
      setAuthLoading(false);
    }
  };

  const fetchEvents = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('Fetching events...');
      
      const result = await client.graphql({
        query: listEvents
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
      
      // Check if this is a schema migration error
      if (error.errors && error.errors.some((e: any) => e.message.includes('FieldUndefined'))) {
        setError('Database schema has been updated. Please try creating a new event to test the new features.');
        setEvents([]);
      } else {
        setError(error instanceof Error ? error.message : JSON.stringify(error));
      }
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
      
      // Upload photos to S3 and get URLs
      const photoUrls: string[] = [];
      for (const photo of photos.filter(Boolean)) {
        const url = await uploadFileToS3(photo as File, 'event-photos');
        photoUrls.push(String(url));
      }
      // Upload attachments to S3 and get URLs
      const attachmentUrls: string[] = [];
      for (const file of attachments) {
        const url = await uploadFileToS3(file, 'event-attachments');
        attachmentUrls.push(String(url));
      }
      // Format the event data
      const formattedEvent = {
        ...newEvent,
        date: formattedDate,
        endDate: formattedEndDate,
        startTime: newEvent.startTime || null,
        endTime: newEvent.endTime || null,
        photoUrls,
        attachmentUrls
      };
      await client.graphql({
        query: createEvent,
        variables: { input: formattedEvent }
      });
      setNewEvent({ title: '', date: '', endDate: '', startTime: '', endTime: '', location: '', aboutEvent: '', details: '', organizer: '', contactDetails: '' });
      setPhotos([null, null, null]);
      setAttachments([]);
      setShowCreateForm(false);
      fetchEvents();
    } catch (error) {
      console.error('Error creating event:', JSON.stringify(error, null, 2));
      setError(error instanceof Error ? error.message : JSON.stringify(error));
    }
  };

  const startEditingEvent = (event: Event) => {
    setEditingEvent(event);
    setExistingPhotoUrls(event.photoUrls || []);
    setExistingAttachmentUrls(event.attachmentUrls || []);
    setEditingPhotos([null, null, null]);
    setEditingAttachments([]);
    setPhotosToDelete([]);
    setAttachmentsToDelete([]);
  };

  const handleUpdateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingEvent) return;
    
    try {
      setError(null);
      
      // Validate and format dates
      const formattedDate = validateAndFormatDate(editingEvent.date);
      const formattedEndDate = editingEvent.endDate ? validateAndFormatDate(editingEvent.endDate) : null;
      
      // Upload new photos to S3
      const newPhotoUrls: string[] = [];
      for (const photo of editingPhotos.filter(Boolean)) {
        const url = await uploadFileToS3(photo as File, 'event-photos');
        newPhotoUrls.push(String(url));
      }
      
      // Upload new attachments to S3
      const newAttachmentUrls: string[] = [];
      for (const file of editingAttachments) {
        const url = await uploadFileToS3(file, 'event-attachments');
        newAttachmentUrls.push(String(url));
      }
      
      // Combine existing URLs (minus deleted ones) with new URLs
      const finalPhotoUrls = [
        ...existingPhotoUrls.filter(url => !photosToDelete.includes(url)),
        ...newPhotoUrls
      ];
      
      const finalAttachmentUrls = [
        ...existingAttachmentUrls.filter(url => !attachmentsToDelete.includes(url)),
        ...newAttachmentUrls
      ];
      
      // Delete files that were marked for deletion
      if (photosToDelete.length > 0) {
        await deleteMultipleFilesFromS3(photosToDelete);
      }
      if (attachmentsToDelete.length > 0) {
        await deleteMultipleFilesFromS3(attachmentsToDelete);
      }
      
      // Format the event data
      const formattedEvent = {
        ...editingEvent,
        date: formattedDate,
        endDate: formattedEndDate,
        startTime: editingEvent.startTime || null,
        endTime: editingEvent.endTime || null,
        photoUrls: finalPhotoUrls,
        attachmentUrls: finalAttachmentUrls
      };
      
      console.log('Updating event:', formattedEvent);
      
      await client.graphql({
        query: updateEvent,
        variables: { input: formattedEvent }
      });
      
      setEditingEvent(null);
      setEditingPhotos([null, null, null]);
      setEditingAttachments([]);
      setExistingPhotoUrls([]);
      setExistingAttachmentUrls([]);
      setPhotosToDelete([]);
      setAttachmentsToDelete([]);
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
      
      // Find the event to get its file URLs
      const eventToDelete = events.find(event => event.id === id);
      if (eventToDelete) {
        // Delete associated files from S3
        const filesToDelete: string[] = [];
        if (eventToDelete.photoUrls) filesToDelete.push(...eventToDelete.photoUrls);
        if (eventToDelete.attachmentUrls) filesToDelete.push(...eventToDelete.attachmentUrls);
        
        if (filesToDelete.length > 0) {
          await deleteMultipleFilesFromS3(filesToDelete);
        }
      }
      
      await client.graphql({
        query: deleteEvent,
        variables: { input: { id } }
      });
      
      fetchEvents();
    } catch (error) {
      console.error('Error deleting event:', JSON.stringify(error, null, 2));
      setError(error instanceof Error ? error.message : JSON.stringify(error));
    }
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file size (8MB limit)
      if (file.size > 8 * 1024 * 1024) {
        alert('File size must be less than 8MB');
        return;
      }
      
      // Check file type
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }
      
      const newPhotos = [...photos];
      newPhotos[index] = file;
      setPhotos(newPhotos);
    }
  };

  const handleAttachmentUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      // Check file sizes (10MB limit per file)
      const validFiles = files.filter(file => {
        if (file.size > 10 * 1024 * 1024) {
          alert(`File ${file.name} is too large. Maximum size is 10MB.`);
          return false;
        }
        return true;
      });
      
      setAttachments(prev => [...prev, ...validFiles]);
    }
  };

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
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

  // Show loading while checking authentication
  if (authChecking) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex items-center px-4 py-2 font-semibold leading-6 text-gray-600 shadow rounded-xl">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Checking authentication...
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
                {authMode === 'signIn' && 'Welcome Back'}
                {authMode === 'signUp' && 'Create Account'}
                {authMode === 'confirm' && 'Verify Email'}
              </h1>
              <p className="text-gray-600">
                {authMode === 'signIn' && 'Sign in to manage your events'}
                {authMode === 'signUp' && 'Create an account to get started'}
                {authMode === 'confirm' && 'Enter the verification code sent to your email'}
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
                  <button
                    type="button"
                    onClick={() => setAuthMode('signUp')}
                    className="text-[#C62828] hover:text-[#B71C1C] text-sm font-medium transition-colors"
                  >
                    Don't have an account? Sign up
                  </button>
                </div>
              </form>
            )}

            {authMode === 'signUp' && (
              <form onSubmit={handleSignUp} className="space-y-6">
                <div>
                  <label htmlFor="signup-username" className="block text-sm font-medium text-gray-700 mb-2">
                    Username
                  </label>
                  <input
                    id="signup-username"
                    type="text"
                    value={authForm.username}
                    onChange={(e) => setAuthForm({ ...authForm, username: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#C62828] focus:border-transparent transition-all duration-200"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="signup-email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    id="signup-email"
                    type="email"
                    value={authForm.email}
                    onChange={(e) => setAuthForm({ ...authForm, email: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#C62828] focus:border-transparent transition-all duration-200"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="signup-password" className="block text-sm font-medium text-gray-700 mb-2">
                    Password
                  </label>
                  <input
                    id="signup-password"
                    type="password"
                    value={authForm.password}
                    onChange={(e) => setAuthForm({ ...authForm, password: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#C62828] focus:border-transparent transition-all duration-200"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="signup-confirm-password" className="block text-sm font-medium text-gray-700 mb-2">
                    Confirm Password
                  </label>
                  <input
                    id="signup-confirm-password"
                    type="password"
                    value={authForm.confirmPassword}
                    onChange={(e) => setAuthForm({ ...authForm, confirmPassword: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#C62828] focus:border-transparent transition-all duration-200"
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={authLoading}
                  className="w-full bg-[#C62828] text-white px-6 py-3 rounded-xl font-medium hover:bg-[#B71C1C] transition-colors duration-200 shadow-sm disabled:opacity-50"
                >
                  {authLoading ? 'Creating Account...' : 'Create Account'}
                </button>
                <div className="text-center">
                  <button
                    type="button"
                    onClick={() => setAuthMode('signIn')}
                    className="text-[#C62828] hover:text-[#B71C1C] text-sm font-medium transition-colors"
                  >
                    Already have an account? Sign in
                  </button>
                </div>
              </form>
            )}

            {authMode === 'confirm' && (
              <form onSubmit={handleConfirmSignUp} className="space-y-6">
                <div>
                  <label htmlFor="confirmation-code" className="block text-sm font-medium text-gray-700 mb-2">
                    Verification Code
                  </label>
                  <input
                    id="confirmation-code"
                    type="text"
                    value={authForm.confirmationCode}
                    onChange={(e) => setAuthForm({ ...authForm, confirmationCode: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#C62828] focus:border-transparent transition-all duration-200"
                    placeholder="Enter the code sent to your email"
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={authLoading}
                  className="w-full bg-[#C62828] text-white px-6 py-3 rounded-xl font-medium hover:bg-[#B71C1C] transition-colors duration-200 shadow-sm disabled:opacity-50"
                >
                  {authLoading ? 'Verifying...' : 'Verify Email'}
                </button>
                <div className="text-center">
                  <button
                    type="button"
                    onClick={() => setAuthMode('signIn')}
                    className="text-[#C62828] hover:text-[#B71C1C] text-sm font-medium transition-colors"
                  >
                    Back to Sign In
                  </button>
                </div>
              </form>
            )}
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
            <button
              onClick={() => setShowCreateForm(!showCreateForm)}
              className="cta cta--primary bg-[#C62828] hover:bg-[#B71C1C] text-white"
            >
              {showCreateForm ? 'Cancel' : 'Create New Event'}
            </button>
          </div>
        </div>
        
        {/* Sign Out Button - Top Right */}
        <button
          onClick={handleSignOut}
          className="absolute top-6 right-6 px-4 py-2 text-sm font-medium text-[#C62828] hover:text-[#B71C1C] transition-colors duration-200"
        >
          Sign Out
        </button>
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
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto">
              <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
                <h2 className="text-2xl font-semibold text-gray-900 mb-6">Create New Event</h2>
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
                        // Temporarily disable auto-formatting for debugging
                        setNewEvent({ ...newEvent, date: e.target.value });
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
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Photos (Optional - Up to 3)
                    </label>
                    <div className="space-y-4">
                      {[1, 2, 3].map((index) => (
                        <div key={index}>
                          {photos[index - 1] ? (
                            <div className="border-2 border-gray-300 rounded-xl p-4">
                              <div className="flex items-center space-x-4">
                                <img 
                                  src={URL.createObjectURL(photos[index - 1] as File)} 
                                  alt={`Photo ${index}`}
                                  className="w-16 h-16 object-cover rounded-lg"
                                />
                                <div className="flex-1">
                                  <p className="text-sm font-medium text-gray-900">{photos[index - 1]?.name}</p>
                                  <p className="text-xs text-gray-500">{photos[index - 1] ? (photos[index - 1]!.size / 1024 / 1024).toFixed(2) : '0'} MB</p>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => {
                                    const newPhotos = [...photos];
                                    newPhotos[index - 1] = null;
                                    setPhotos(newPhotos);
                                  }}
                                  className="text-red-600 hover:text-red-800"
                                >
                                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                  </svg>
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div 
                              className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-blue-400 transition-colors cursor-pointer"
                              onClick={() => document.getElementById(`photo-${index}`)?.click()}
                            >
                              <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                                <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                              </svg>
                              <p className="mt-2 text-sm text-gray-600">Upload photo {index}</p>
                              <p className="text-xs text-gray-500">PNG, JPG, GIF up to 8MB</p>
                              <input
                                id={`photo-${index}`}
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => handlePhotoUpload(e, index - 1)}
                              />
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Attachments (Optional)
                    </label>
                    {attachments.length > 0 && (
                      <div className="mb-4 space-y-2">
                        {attachments.map((file, index) => (
                          <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            <div className="flex-1">
                              <p className="text-sm font-medium text-gray-900">{file.name}</p>
                              <p className="text-xs text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                            </div>
                            <button
                              type="button"
                              onClick={() => removeAttachment(index)}
                              className="text-red-600 hover:text-red-800"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                    <div 
                      className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-blue-400 transition-colors cursor-pointer"
                      onClick={() => document.getElementById('attachments')?.click()}
                    >
                      <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                        <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      <p className="mt-2 text-sm text-gray-600">Upload PDF agenda or other documents</p>
                      <p className="text-xs text-gray-500">PDF, DOC, DOCX up to 10MB</p>
                      <input
                        id="attachments"
                        type="file"
                        accept=".pdf,.doc,.docx"
                        multiple
                        className="hidden"
                        onChange={handleAttachmentUpload}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="organizer" className="block text-sm font-medium text-gray-700 mb-2">
                      Organizer (Optional)
                    </label>
                    <input
                      id="organizer"
                      type="text"
                      placeholder="Event organizer name"
                      value={newEvent.organizer}
                      onChange={(e) => setNewEvent({ ...newEvent, organizer: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    />
                  </div>
                  
                  <div className="flex space-x-4 pt-4">
                    <button
                      type="submit"
                      className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-blue-700 transition-colors duration-200 shadow-sm"
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
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Events List */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Your Events</h2>
            
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
                  <p className="mt-1 text-sm text-gray-500">Get started by creating your first event.</p>
                  <div className="mt-6">
                    <button
                      onClick={() => setShowCreateForm(true)}
                      className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-xl text-white bg-[#C62828] hover:bg-[#B71C1C] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#C62828]"
                    >
                      Create Event
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="grid gap-6">
                {events.map((event) => (
                  <div key={event.id} className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
                    {editingEvent?.id === event.id ? (
                      <div className="p-8">
                        <h3 className="text-xl font-semibold text-gray-900 mb-6">Edit Event</h3>
                        <form onSubmit={handleUpdateEvent} className="space-y-6">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Event Title</label>
                            <input
                              type="text"
                              value={editingEvent.title}
                              onChange={(e) => setEditingEvent({ ...editingEvent, title: e.target.value })}
                              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                            <input
                              type="text"
                              placeholder="MM/DD/YYYY (e.g., 12/25/2024)"
                              value={editingEvent.date}
                              onChange={(e) => setEditingEvent({ ...editingEvent, date: e.target.value })}
                              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
                            <input
                              type="text"
                              placeholder="MM/DD/YYYY (e.g., 12/26/2024)"
                              value={editingEvent.endDate || ''}
                              onChange={(e) => setEditingEvent({ ...editingEvent, endDate: e.target.value })}
                              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Start Time</label>
                            <input
                              type="text"
                              placeholder="HH:MM AM/PM (e.g., 2:30 PM)"
                              value={editingEvent.startTime || ''}
                              onChange={(e) => setEditingEvent({ ...editingEvent, startTime: e.target.value })}
                              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">End Time</label>
                            <input
                              type="text"
                              placeholder="HH:MM AM/PM (e.g., 4:00 PM)"
                              value={editingEvent.endTime || ''}
                              onChange={(e) => setEditingEvent({ ...editingEvent, endTime: e.target.value })}
                              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                            <input
                              type="text"
                              value={editingEvent.location}
                              onChange={(e) => setEditingEvent({ ...editingEvent, location: e.target.value })}
                              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                            <textarea
                              rows={4}
                              value={editingEvent.aboutEvent || ''}
                              onChange={(e) => setEditingEvent({ ...editingEvent, aboutEvent: e.target.value })}
                              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Organizer</label>
                            <input
                              type="text"
                              value={editingEvent.organizer || ''}
                              onChange={(e) => setEditingEvent({ ...editingEvent, organizer: e.target.value })}
                              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                          </div>
                          <div className="flex space-x-4 pt-4">
                            <button
                              type="submit"
                              className="flex-1 bg-[#C62828] text-white px-6 py-3 rounded-xl font-medium hover:bg-[#B71C1C] transition-colors"
                            >
                              Save Changes
                            </button>
                            <button
                              type="button"
                              onClick={() => setEditingEvent(null)}
                              className="flex-1 bg-gray-100 text-gray-700 px-6 py-3 rounded-xl font-medium hover:bg-gray-200 transition-colors"
                            >
                              Cancel
                            </button>
                          </div>
                        </form>
                      </div>
                    ) : (
                      <div className="p-8">
                        <div className="flex justify-between items-start mb-4">
                          <h3 className="text-2xl font-bold text-gray-900">{event.title}</h3>
                          <div className="flex gap-3 mt-6">
                            <Link
                              href={`/events/${event.id}`}
                              className="rounded-full px-6 py-2 font-semibold text-[#C62828] bg-white border border-[#C62828] shadow-sm hover:bg-[#FDEAEA] hover:text-[#B71C1C] transition-all duration-150 text-base focus:outline-none focus:ring-2 focus:ring-[#C62828] focus:ring-offset-2"
                            >
                              View Details
                            </Link>
                            <button
                              onClick={() => downloadICal(event)}
                              className="rounded-full px-6 py-2 font-semibold text-[#C62828] bg-white border border-[#C62828] shadow-sm hover:bg-[#FDEAEA] hover:text-[#B71C1C] transition-all duration-150 text-base focus:outline-none focus:ring-2 focus:ring-[#C62828] focus:ring-offset-2"
                              title="Add to Calendar"
                            >
                              Add to Calendar
                            </button>
                            <button
                              onClick={() => startEditingEvent(event)}
                              className="rounded-full px-6 py-2 font-semibold text-[#C62828] bg-white border border-[#C62828] shadow-sm hover:bg-[#FDEAEA] hover:text-[#B71C1C] transition-all duration-150 text-base focus:outline-none focus:ring-2 focus:ring-[#C62828] focus:ring-offset-2"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteEvent(event.id)}
                              className="rounded-full px-6 py-2 font-semibold text-[#C62828] bg-white border border-[#C62828] shadow-sm hover:bg-[#FDEAEA] hover:text-[#B71C1C] transition-all duration-150 text-base focus:outline-none focus:ring-2 focus:ring-[#C62828] focus:ring-offset-2"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                        
                        {/* Event Photo */}
                        {event.photoUrls && event.photoUrls.length > 0 && (
                          <div className="mb-4">
                            <img
                              src={event.photoUrls[0]}
                              alt={event.title}
                              className="w-full h-48 object-cover rounded-xl shadow-md"
                              onError={(e) => {
                                console.error('Failed to load event card image:', event.photoUrls?.[0]);
                                e.currentTarget.style.display = 'none';
                              }}
                            />
                          </div>
                        )}
                        
                        <div className="space-y-4">
                          <div className="flex items-center text-gray-600">
                            <svg className="h-5 w-5 mr-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span className="font-medium">
                              {new Date(event.date).toLocaleDateString('en-US', { 
                                weekday: 'long', 
                                year: 'numeric', 
                                month: 'long', 
                                day: 'numeric' 
                              })}
                              {event.endDate && event.endDate !== event.date && (
                                ` - ${new Date(event.endDate).toLocaleDateString('en-US', { 
                                  month: 'long', 
                                  day: 'numeric',
                                  year: 'numeric' 
                                })}`
                              )}
                              {event.startTime && ` at ${event.startTime}`}
                              {event.endTime && ` - ${event.endTime}`}
                            </span>
                          </div>
                          
                          <div className="flex items-center text-gray-600">
                            <svg className="h-5 w-5 mr-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            <span className="font-medium">{event.location}</span>
                          </div>
                          
                          {event.organizer && (
                            <div className="flex items-center text-gray-600">
                              <svg className="h-5 w-5 mr-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                              </svg>
                              <span className="font-medium">Organized by {event.organizer}</span>
                            </div>
                          )}
                          
                          {event.contactDetails && (
                            <div className="flex items-center text-gray-600">
                              <svg className="h-5 w-5 mr-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                              </svg>
                              <a 
                                href={`mailto:${event.contactDetails}`}
                                className="font-medium text-[#C62828] hover:text-[#B71C1C] transition-colors"
                              >
                                {event.contactDetails}
                              </a>
                            </div>
                          )}
                          
                          {event.aboutEvent && (
                            <div className="pt-4 border-t border-gray-100">
                              <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">
                                {event.aboutEvent}
                              </p>
                            </div>
                          )}
                        </div>
                        
                        {event.attachmentUrls && event.attachmentUrls.length > 0 && (
                          <div className="mt-2">
                            {event.attachmentUrls.map((url, idx) => (
                              <a
                                key={idx}
                                href={url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-block text-[#C62828] hover:text-[#B71C1C] text-xs mr-2"
                                download
                              >
                                Attachment {idx + 1}
                              </a>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

export default EventsPage; 