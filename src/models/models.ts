export interface User {
  username: string;
}

export interface Session {
  user: User | null;
}
