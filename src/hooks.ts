import React, { useMemo } from 'react';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import { ActionCreatorsMapObject, bindActionCreators } from 'redux';
import { AppDispatch, RootState } from './store';
import { Session } from './models/models';
import { sessionSlice } from './features/session/sessionSlice';
import { Auth } from '@aws-amplify/auth';
import {
  QueryFunction,
  useQuery,
  UseQueryOptions,
  UseQueryResult,
} from 'react-query';
import {
  isProblemDetailsResponseError,
  ProblemDetailsResponseError,
} from './models/api';
import { Primitive } from './models/error';

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

export type ApiQueryKey = [string, { [key: string]: unknown }];
export type WithToken<T extends ApiQueryKey> = [T[0], T[1] & { token: string }];
export type UseApiQueryResult<TData> = UseQueryResult<
  TData,
  ProblemDetailsResponseError
>;
export const useApiQuery = <
  // eslint-disable-next-line @typescript-eslint/ban-types
  TQueryFnData extends Primitive | object,
  TData = TQueryFnData,
  TApiQueryKey extends ApiQueryKey = ApiQueryKey
>(
  queryKey: TApiQueryKey,
  queryFn: QueryFunction<
    TQueryFnData | ProblemDetailsResponseError,
    WithToken<TApiQueryKey>
  >,
  options?: UseQueryOptions<
    TQueryFnData,
    ProblemDetailsResponseError,
    TData,
    WithToken<TApiQueryKey>
  >
): UseApiQueryResult<TData> => {
  const token = useAppSelector((s) =>
    s.session.session.user === null ? null : s.session.session.accessToken
  );
  let enabled = token !== null;
  if (options?.enabled === false) {
    enabled = false;
  }
  const queryKey2: WithToken<TApiQueryKey> = [
    queryKey[0],
    {
      ...(queryKey as [string, { [key: string]: unknown }])[1],
      token: token as string,
    },
  ];
  return useQuery<
    TQueryFnData,
    ProblemDetailsResponseError,
    TData,
    WithToken<TApiQueryKey>
  >(
    queryKey2,
    async (queryFnContext) => {
      const res = await queryFn(queryFnContext);
      if (isProblemDetailsResponseError(res)) {
        throw res;
      }
      return res;
    },
    { ...options, enabled }
  );
};
