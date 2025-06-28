'use client';

import React, { useEffect, useState } from 'react';
import { getCurrentUser, fetchAuthSession } from 'aws-amplify/auth';

interface AuthWrapperProps {
  children: React.ReactNode;
  onAuthStateChange?: (isAuthenticated: boolean) => void;
}

export default function AuthWrapper({ children, onAuthStateChange }: AuthWrapperProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuthState();
  }, []);

  const checkAuthState = async () => {
    try {
      setIsLoading(true);
      
      // Add a small delay to ensure Amplify is initialized
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const user = await getCurrentUser();
      const session = await fetchAuthSession();
      
      console.log('AuthWrapper - User:', user, 'Session:', session);
      
      const authenticated = !!(user && session.tokens);
      setIsAuthenticated(authenticated);
      
      if (onAuthStateChange) {
        onAuthStateChange(authenticated);
      }
      
    } catch (error) {
      console.log('AuthWrapper - Auth check failed:', error);
      setIsAuthenticated(false);
      
      if (onAuthStateChange) {
        onAuthStateChange(false);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
} 