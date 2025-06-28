'use client';

import { useMemo } from 'react';
import { generateClient } from 'aws-amplify/api';

export function useAmplifyClient() {
  const client = useMemo(() => {
    return generateClient({
      authMode: 'apiKey'
    });
  }, []);

  return client;
} 