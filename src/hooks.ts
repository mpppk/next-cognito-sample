import React, { useMemo } from 'react';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import { ActionCreatorsMapObject, bindActionCreators } from 'redux';
import { AppDispatch, RootState } from './store';
import {
  AuthStateHandler,
  onAuthUIStateChange,
} from '@aws-amplify/ui-components';
import { Session, User } from './models/models';
import { sessionSlice } from './features/session/sessionSlice';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function useActions<T extends ActionCreatorsMapObject>(
  actions: T,
  deps?: unknown[]
) {
  const dispatch = useDispatch();
  return useMemo(
    () => {
      return bindActionCreators(actions, dispatch);
    },
    deps ? [dispatch, ...deps] : [dispatch]
  );
}

// Use throughout your app instead of plain `useDispatch` and `useSelector`
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export const useCognito = (): Session => {
  const actions = useActions(sessionSlice.actions);
  const onChangeAuthState: AuthStateHandler = (nextAuthState, data) => {
    const payload =
      data === undefined
        ? { authState: nextAuthState, user: null }
        : {
            authState: nextAuthState,
            user: { username: (data as User)?.username ?? null },
          };
    actions.update(payload);
  };
  React.useEffect(() => onAuthUIStateChange(onChangeAuthState), []);
  return useAppSelector((s) => ({
    user: s.session.user,
    authState: s.session.authState,
  }));
};
