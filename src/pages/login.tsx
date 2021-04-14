import { NextPage } from 'next';
import { AmplifyAuthenticator } from '@aws-amplify/ui-react';
import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { AuthState } from '@aws-amplify/ui-components';
import { useAppSelector } from '../hooks';
import { Amplify } from '@aws-amplify/core';
import { awsconfig } from '../awsconfig';

Amplify.configure(awsconfig);

export const Login: NextPage = () => {
  const router = useRouter();
  const authState = useAppSelector((s) => s.session.authState);

  useEffect(() => {
    if (authState === AuthState.SignedIn) {
      setTimeout(() => router.push('/'), 2000);
    }
  }, [authState]);

  if (authState === AuthState.SignedIn) {
    return (
      <>You already logged in. Moves to the top page after a few seconds...</>
    );
  }
  return <AmplifyAuthenticator />;
};

export default Login;
