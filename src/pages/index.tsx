import { NextPage } from 'next';
import React from 'react';
// import { useActions, useAppSelector } from "../hooks";
// import { counterSlice, incrementLater, selectCount } from "../features/counter/counterSlice";
import { AuthState, onAuthUIStateChange } from '@aws-amplify/ui-components';
import { User } from '../models/models';
import { awsconfig } from '../awsconfig';
import { AmplifyAuthenticator, AmplifySignOut } from '@aws-amplify/ui-react';
import { Amplify } from '@aws-amplify/core';

Amplify.configure(awsconfig);

// tslint:disable-next-line variable-name
export const Index: NextPage = () => {
  // const handlers = useActions({
  //   ...counterSlice.actions,
  //   incrementLater,
  // });
  // const count = useAppSelector(selectCount);

  const [authState, setAuthState] = React.useState<AuthState>();
  const [user, setUser] = React.useState<User | undefined>();

  React.useEffect(() => {
    return onAuthUIStateChange((nextAuthState, authData) => {
      setAuthState(nextAuthState);
      setUser(authData as User | undefined);
    });
  }, []);

  return authState === AuthState.SignedIn && user ? (
    <div className="App">
      <div>Hello, {user.username}</div>
      <AmplifySignOut />
    </div>
  ) : (
    <AmplifyAuthenticator />
  );
};

export default Index;
