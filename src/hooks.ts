import React, { useMemo } from 'react';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import { ActionCreatorsMapObject, bindActionCreators } from 'redux';
import { AppDispatch, RootState } from './store';
import { Session } from './models/models';
import { sessionSlice } from './features/session/sessionSlice';
import { Auth } from '@aws-amplify/auth';
import { ProblemDetailsResponseError } from './models/api';

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
    Auth.currentAuthenticatedUser().then(
      (authenticatedUser) => {
        actions.update({
          user: { username: authenticatedUser.getUsername() },
          accessToken: authenticatedUser
            .getSignInUserSession()
            .getAccessToken()
            .getJwtToken(),
        });
      },
      () => {
        actions.update({ user: null });
      }
    );
  }, []);
  return useAppSelector((s) => s.session.session);
};

const fetchWithToken = async (token: string, url: string) => {
  const headers = new Headers({
    Authorization: 'Bearer ' + token,
  });
  const req = new Request(url, { headers });
  return await fetch(req);
};

export const callApi = async <ApiResponse>(
  token: string,
  url: string
): Promise<ApiResponse | ProblemDetailsResponseError> => {
  let res: Response;
  try {
    res = await fetchWithToken(token, url);
  } catch (e) {
    return new ProblemDetailsResponseError({ title: e.message });
  }
  if (res.status !== 200) {
    return new ProblemDetailsResponseError(await res.json());
  }
  return res.json();
};
