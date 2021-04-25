import { NextApiHandler } from 'next';
import { BaseError, isErr, Primitive } from './error';

export type ApiHandler<Response> = NextApiHandler<
  Response | OmitErrType<ProblemDetailsResponse>
>;

export interface ProblemDetailsResponse {
  title: string;
  detail?: string;
}

export type OmitErrType<T> = Omit<T, 'errType'>;

export class ProblemDetailsResponseError extends BaseError {
  constructor(
    public problemDetailsResponse: ProblemDetailsResponse,
    e?: string
  ) {
    super(e);
    this.errType = 'ProblemDetailsResponse';
  }
}

export const isProblemDetailsResponseError = (
  // eslint-disable-next-line @typescript-eslint/ban-types
  e: Primitive | object
): e is ProblemDetailsResponseError => {
  return isErr(e) && e.errType === 'ProblemDetailsResponse';
};

const fetchWithToken = async (token: string, url: string) => {
  const headers = new Headers({
    Authorization: 'Bearer ' + token,
  });
  const req = new Request(url, { headers });
  return await fetch(req);
};

export const getApi = async <ApiResponse>(
  token: string,
  url: string,
  queryParams?: { [key: string]: string }
): Promise<ApiResponse | ProblemDetailsResponseError> => {
  const query = Object.entries(queryParams ?? {})
    .map((k, v) => k + '=' + v)
    .join('&');
  const urlWithQueryParams = query.length > 0 ? `${url}?${query}` : url;
  let res: Response;
  try {
    res = await fetchWithToken(token, urlWithQueryParams);
  } catch (e) {
    return new ProblemDetailsResponseError({ title: e.message });
  }
  if (res.status !== 200) {
    return new ProblemDetailsResponseError(await res.json());
  }
  return res.json();
};
