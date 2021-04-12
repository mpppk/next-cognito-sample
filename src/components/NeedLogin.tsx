import React from 'react';
import { AuthState } from '@aws-amplify/ui-components';
import { Session } from '../models/models';
import { AmplifyAuthenticator } from '@aws-amplify/ui-react';

export const NeedLogin: React.FC<Session> = (props) => {
  return props.authState === AuthState.SignedIn && props.user ? (
    <>{props.children}</>
  ) : (
    <AmplifyAuthenticator />
  );
};
