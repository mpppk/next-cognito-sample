import { NextPage } from 'next';
import { AmplifyAuthenticator } from '@aws-amplify/ui-react';
import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import {
  AuthStateHandler,
  onAuthUIStateChange,
} from '@aws-amplify/ui-components';
import { useActions, useAppSelector } from '../hooks';
import { Session, User } from '../models/models';
import { sessionSlice } from '../features/session/sessionSlice';
import { CognitoUser } from 'amazon-cognito-identity-js';

export const Login: NextPage = () => {
  const router = useRouter();
  const user = useAppSelector((s) => s.session.session.user);
  const actions = useActions(sessionSlice.actions);
  const onChangeAuthState: AuthStateHandler = (_nextAuthState, data) => {
    const cognitoUser = data as CognitoUser | undefined;
    let payload: Session = { user: null };
    if (cognitoUser !== undefined) {
      const signInSession = cognitoUser.getSignInUserSession();
      if (signInSession !== null) {
        payload = {
          user: { username: (data as User)?.username ?? null },
          accessToken: signInSession.getAccessToken().getJwtToken(),
        };
      }
    }
    actions.update(payload);
  };

  useEffect(() => {
    onAuthUIStateChange(onChangeAuthState);
  }, []);

  useEffect(() => {
    if (user !== null) {
      setTimeout(() => router.push('/'), 2000);
    }
  }, [user]);

  if (user !== null) {
    return (
      <>You already logged in. Moves to the top page after a few seconds...</>
    );
  }
  return <AmplifyAuthenticator />;
};

export default Login;
