import { withAuth } from 'next-auth/middleware';

export default withAuth({
  callbacks: {
    authorized: ({ token }: any) => {
      if (!token) return false;
      return token.groupId && token.groupId < 5;
    },
  },
});

export const config = { matcher: ['/yonetim/panel'] };
