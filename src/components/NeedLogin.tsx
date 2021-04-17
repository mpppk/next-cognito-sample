import React, { useEffect } from 'react';
import { AuthState } from '@aws-amplify/ui-components';
import { Session } from '../models/models';
import { useRouter } from 'next/router';

export const NeedLogin: React.FC<Session> = (props) => {
  const isSignedIn = props.authState === AuthState.SignedIn && props.user;
  const router = useRouter();
  useEffect(() => {
    const isSignedIn = props.authState === AuthState.SignedIn && props.user;
    if (!isSignedIn) {
      router.push('/login');
    }
  }, [props.user, props.authState]);

  return isSignedIn ? <>{props.children}</> : <span>You need to login</span>;
};
