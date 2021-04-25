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
