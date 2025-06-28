'use client';

import { useEffect } from 'react';
import { Amplify } from 'aws-amplify';
import awsExports from '../aws-exports';

export default function AmplifyProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    Amplify.configure(awsExports);
  }, []);

  return <>{children}</>;
} 