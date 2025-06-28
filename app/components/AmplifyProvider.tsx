'use client';

import { useEffect } from 'react';
import { Amplify } from 'aws-amplify';
import awsExports from '../aws-exports';

// Configure Amplify immediately when this module loads
console.log('🚀 Configuring Amplify immediately...');
console.log('User Pool ID:', awsExports.aws_user_pools_id);
console.log('API key from aws-exports:', awsExports.aws_appsync_apiKey);
console.log('GraphQL endpoint:', awsExports.aws_appsync_graphqlEndpoint);
console.log('Region:', awsExports.aws_appsync_region);

// Configure Amplify with User Pool authentication and API settings
Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId: awsExports.aws_user_pools_id,
      userPoolClientId: awsExports.aws_user_pools_web_client_id,
      signUpVerificationMethod: 'code',
      loginWith: {
        email: true,
        username: true,
      },
    },
  },
  API: {
    GraphQL: {
      endpoint: awsExports.aws_appsync_graphqlEndpoint,
      region: awsExports.aws_appsync_region,
      defaultAuthMode: 'apiKey',
      apiKey: awsExports.aws_appsync_apiKey,
    }
  },
  Storage: {
    S3: {
      bucket: awsExports.aws_user_files_s3_bucket,
      region: awsExports.aws_user_files_s3_bucket_region,
    }
  }
});

console.log('✅ Amplify configuration complete');

export default function AmplifyProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    console.log('🔄 AmplifyProvider mounted - configuration already done');
  }, []);

  return <>{children}</>;
} 