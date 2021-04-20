import React, { useMemo } from 'react';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import { ActionCreatorsMapObject, bindActionCreators } from 'redux';
import { AppDispatch, RootState } from './store';
import { Session } from './models/models';
import { sessionSlice } from './features/session/sessionSlice';
import { Auth } from '@aws-amplify/auth';

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
  React.useEffect(() => {
    Auth.currentUserInfo().then((userInfo) => {
      if (userInfo !== null) {
        actions.update({ user: { username: userInfo.username } });
      } else {
        actions.update({ user: null });
      }
    });
  }, []);
  return useAppSelector((s) => ({
    user: s.session.user,
  }));
};
