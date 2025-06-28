'use client';

import { useEffect } from 'react';
import { Amplify } from 'aws-amplify';
import awsExports from '../aws-exports';

export default function AmplifyProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    console.log('Configuring Amplify...');
    console.log('API key from aws-exports:', awsExports.aws_appsync_apiKey);
    console.log('GraphQL endpoint:', awsExports.aws_appsync_graphqlEndpoint);
    console.log('Region:', awsExports.aws_appsync_region);
    
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
    
    console.log('Amplify configuration complete');
  }, []);

  return <>{children}</>;
} 