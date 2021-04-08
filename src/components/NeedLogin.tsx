import React from 'react';
import { AuthState, onAuthUIStateChange } from '@aws-amplify/ui-components';
import { User } from '../models/models';
import { AmplifyAuthenticator } from '@aws-amplify/ui-react';

export const NeedLogin: React.FC = ({ children }) => {
  const [authState, setAuthState] = React.useState<AuthState>();
  const [user, setUser] = React.useState<User | undefined>();
  React.useEffect(() => {
    return onAuthUIStateChange((nextAuthState, authData) => {
      setAuthState(nextAuthState);
      setUser(authData as User | undefined);
    });
  }, []);
  return authState === AuthState.SignedIn && user ? (
    <>{children}</>
  ) : (
    <AmplifyAuthenticator />
  );
};
