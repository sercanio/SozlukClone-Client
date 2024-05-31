import { DefaultSession } from 'next-auth';

// Developer | SuperAdmin | Admin | SuperModerator | Moderator | Editor | Author | Noob
export type GroupId = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

declare module 'next-auth' {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface User {
    id: any;
    groupId: GroupId;
    authorId: number;
    accessToken: string;
  }
  interface Session {
    user: {
      id: any;
      groupId: GroupId;
      authorId: number;
      accessToken: string;
    } & DefaultSession['user'];
  }
}
