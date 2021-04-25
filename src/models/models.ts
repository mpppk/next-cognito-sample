export interface User {
  username: string;
}

export type Session =
  | {
      user: User;
      accessToken: string;
    }
  | { user: null };
