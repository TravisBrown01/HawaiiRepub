'use client';

import { useEffect } from 'react';
import { Amplify } from 'aws-amplify';
import awsExports from '../aws-exports';

export default function AmplifyProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Configure Amplify with multiple authentication types
    Amplify.configure({
      ...awsExports,
      API: {
        GraphQL: {
          endpoint: awsExports.aws_appsync_graphqlEndpoint,
          region: awsExports.aws_appsync_region,
          defaultAuthMode: 'apiKey',
          apiKey: awsExports.aws_appsync_apiKey,
        }
      }
    });
  }, []);

  return <>{children}</>;
} 