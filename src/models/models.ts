import { AuthState } from '@aws-amplify/ui-components';

export interface User {
  username: string;
}

export interface Session {
  user: User | null;
  authState: AuthState | null;
}
