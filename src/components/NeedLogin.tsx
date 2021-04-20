import React, { useEffect } from 'react';
import { Session } from '../models/models';
import { useRouter } from 'next/router';

interface Props {
  session: Session;
  isCheckedSignInState: boolean;
}

export const NeedLogin: React.FC<Props> = (props) => {
  const router = useRouter();
  useEffect(() => {
    if (props.session.user === null && props.isCheckedSignInState) {
      router.push('/login');
    }
  }, [props.session.user, props.isCheckedSignInState]);

  if (props.session.user === null) {
    return props.isCheckedSignInState ? (
      <span>You need to login</span>
    ) : (
      <span>Checking your login status...</span>
    );
  }
  return <>{props.children}</>;
};
