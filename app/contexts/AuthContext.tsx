'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { getCurrentUser, fetchAuthSession, signOut, signIn as amplifySignIn } from 'aws-amplify/auth';
import { Hub } from 'aws-amplify/utils';

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: any;
  signOut: () => Promise<void>;
  signIn: (username: string, password: string) => Promise<any>;
  refreshAuthState: () => Promise<void>;
  validateSession: () => Promise<boolean>;
  cleanupSession: () => Promise<void>;
  forceClearSession: () => Promise<void>;
  debugSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  const debugSession = async () => {
    console.log('=== SESSION DEBUG ===');
    console.log('Local state - isAuthenticated:', isAuthenticated);
    console.log('Local state - isLoading:', isLoading);
    console.log('Local state - user:', user);
    
    try {
      console.log('Checking Amplify session...');
      const currentUser = await getCurrentUser();
      console.log('Amplify getCurrentUser result:', currentUser);
      
      const session = await fetchAuthSession();
      console.log('Amplify fetchAuthSession result:', session);
      console.log('Session tokens exist:', !!session.tokens);
      
      if (session.tokens) {
        console.log('Access token exists:', !!session.tokens.accessToken);
        console.log('ID token exists:', !!session.tokens.idToken);
      }
      
      const isValid = !!(currentUser && session.tokens);
      console.log('Session validation result:', isValid);
      console.log('=== END SESSION DEBUG ===');
    } catch (error) {
      console.error('Session debug error:', error);
      console.log('=== END SESSION DEBUG ===');
    }
  };

  const validateSession = async (): Promise<boolean> => {
    try {
      console.log('🔍 Validating session...');
      const currentUser = await getCurrentUser();
      const session = await fetchAuthSession();
      
      const isValid = !!(currentUser && session.tokens);
      console.log('✅ Session validation result:', isValid);
      console.log('   - Current user:', currentUser ? 'EXISTS' : 'NULL');
      console.log('   - Session tokens:', session.tokens ? 'EXISTS' : 'NULL');
      
      return isValid;
    } catch (error) {
      console.log('❌ Session validation failed:', error);
      return false;
    }
  };

  const cleanupSession = async () => {
    try {
      console.log('🧹 Cleaning up session state...');
      setIsAuthenticated(false);
      setUser(null);
      setIsLoading(false);
      console.log('✅ Session cleanup complete');
    } catch (error) {
      console.error('❌ Session cleanup error:', error);
    }
  };

  const forceClearSession = async () => {
    try {
      console.log('💥 Force clearing session...');
      
      // Try to sign out from Amplify
      try {
        await signOut();
        console.log('✅ Successfully signed out from Amplify');
      } catch (signOutError) {
        console.log('⚠️ Sign out error (expected if not signed in):', signOutError);
      }
      
      // Clear local state
      await cleanupSession();
      
      // Add a small delay to ensure Amplify state is cleared
      await new Promise(resolve => setTimeout(resolve, 100));
      
      console.log('✅ Session force cleared');
    } catch (error) {
      console.error('❌ Force clear session error:', error);
      await cleanupSession();
    }
  };

  const checkAuthState = async () => {
    try {
      console.log('🔄 Checking auth state...');
      setIsLoading(true);
      
      const isValid = await validateSession();
      
      if (isValid) {
        const currentUser = await getCurrentUser();
        console.log('✅ User is authenticated');
        setIsAuthenticated(true);
        setUser(currentUser);
      } else {
        console.log('❌ User is not authenticated');
        setIsAuthenticated(false);
        setUser(null);
      }
    } catch (error) {
      console.log('❌ Auth state check failed:', error);
      await cleanupSession();
    } finally {
      setIsLoading(false);
      console.log('🔄 Auth state check complete');
    }
  };

  const refreshAuthState = async () => {
    console.log('🔄 Refreshing auth state...');
    await checkAuthState();
  };

  const handleSignIn = async (username: string, password: string) => {
    try {
      console.log('🚀 === SIGN IN ATTEMPT ===');
      console.log('Username:', username);
      
      // First validate current session
      const isCurrentlyAuthenticated = await validateSession();
      console.log('Is currently authenticated:', isCurrentlyAuthenticated);
      
      if (isCurrentlyAuthenticated) {
        console.log('✅ User is already authenticated, returning current session');
        const currentUser = await getCurrentUser();
        // User is already authenticated, return the current session info
        return {
          isSignedIn: true,
          nextStep: { signInStep: 'DONE' },
          user: currentUser
        };
      }
      
      // User is not authenticated, proceed with sign in
      console.log('🔐 User not authenticated, proceeding with sign in');
      
      try {
        const result = await amplifySignIn({ username, password });
        console.log('✅ Sign in successful:', result);
        
        // Update auth state after successful sign in
        await checkAuthState();
        
        return result;
      } catch (signInError: any) {
        console.error('❌ Amplify sign in error:', signInError);
        console.error('Error name:', signInError.name);
        console.error('Error message:', signInError.message);
        
        // Handle UserAlreadyAuthenticatedException specifically
        if (signInError.name === 'UserAlreadyAuthenticatedException') {
          console.log('🔄 UserAlreadyAuthenticatedException caught, attempting to handle gracefully');
          
          try {
            // Try to get current user to confirm they are actually authenticated
            const currentUser = await getCurrentUser();
            const session = await fetchAuthSession();
            
            if (currentUser && session.tokens) {
              console.log('✅ User is indeed authenticated, updating state');
              setIsAuthenticated(true);
              setUser(currentUser);
              
              return {
                isSignedIn: true,
                nextStep: { signInStep: 'DONE' },
                user: currentUser
              };
            } else {
              console.log('❌ User is not actually authenticated, clearing state and retrying');
              await cleanupSession();
              throw signInError; // Re-throw the original error
            }
          } catch (validationError) {
            console.error('❌ Error validating session after UserAlreadyAuthenticatedException:', validationError);
            await cleanupSession();
            throw signInError; // Re-throw the original error
          }
        }
        
        throw signInError;
      }
    } catch (error) {
      console.error('❌ Sign in error:', error);
      // Clean up session state on error
      await cleanupSession();
      throw error;
    }
  };

  useEffect(() => {
    console.log('🚀 AuthProvider initializing...');
    
    // Add a small delay to ensure Amplify is fully configured
    const initializeAuth = async () => {
      try {
        // Wait a bit for Amplify to be fully configured
        await new Promise(resolve => setTimeout(resolve, 100));
        console.log('🔄 Starting auth state check...');
        await checkAuthState();
      } catch (error) {
        console.error('❌ Error initializing auth:', error);
      }
    };
    
    initializeAuth();

    // Listen for authentication events
    const unsubscribe = Hub.listen('auth', ({ payload }: { payload: any }) => {
      console.log('📡 Auth event received:', payload.event);
      
      switch (payload.event) {
        case 'signedIn':
          console.log('✅ User signed in event');
          checkAuthState();
          break;
        case 'signedOut':
          console.log('❌ User signed out event');
          cleanupSession();
          break;
        case 'tokenRefresh':
          console.log('🔄 Token refreshed event');
          checkAuthState();
          break;
        case 'tokenRefresh_failure':
          console.log('❌ Token refresh failed event');
          cleanupSession();
          break;
      }
    });

    return unsubscribe;
  }, []);

  const handleSignOut = async () => {
    try {
      console.log('🚪 Signing out...');
      await signOut();
      await cleanupSession();
      console.log('✅ Sign out complete');
    } catch (error) {
      console.error('❌ Sign out error:', error);
      await cleanupSession();
    }
  };

  const value = {
    isAuthenticated,
    isLoading,
    user,
    signOut: handleSignOut,
    signIn: handleSignIn,
    refreshAuthState,
    validateSession,
    cleanupSession,
    forceClearSession,
    debugSession,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 