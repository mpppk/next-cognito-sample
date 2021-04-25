import { NextApiHandler } from 'next';

export type ApiHandler<Response> = NextApiHandler<
  Response | ProblemDetailsResponse
>;
export interface ProblemDetailsResponse {
  title: string;
  detail?: string;
}
