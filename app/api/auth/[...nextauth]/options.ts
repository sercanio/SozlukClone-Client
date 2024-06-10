import type { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { GroupId } from '@/types/next-auth';

export const options: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text', placeholder: 'example@email.com' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        // Step 1: Authenticate user and get access token
        const res = await fetch('http://localhost:60805/api/Auth/Login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: credentials?.email,
            password: credentials?.password,
            authenticatorCode: 'string',
          }),
        });

        const data = await res.json();

        if (res.ok && data.accessToken) {
          const accessToken = data.accessToken.token;

          // Step 2: Fetch user data using the access token
          const userRes = await fetch('http://localhost:60805/api/Users/GetFromAuth', {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${accessToken}`,
              'Content-Type': 'application/json',
            },
            credentials: 'include',
          });

          const user = await userRes.json();

          if (userRes.ok && user) {
            const autherRes = await fetch(`http://localhost:60805/api/Authors/${user.author.id}`, {
              method: 'GET',
              headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
              },
              credentials: 'include',
            });

            const author = await autherRes.json();
            return {
              id: user.id,
              authorId: author.id,
              email: user.email,
              name: author.userName,
              groupId: author.authorGroupId,
              biography: author.biography,
              image: author.profilePictureUrl,
              accessToken: data.accessToken.token,
            };
          }
        }
        return null;
      },
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/auth/signin',
    signOut: '/auth/signout',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id as string;
        token.authorId = user.authorId as number;
        token.email = user.email;
        token.name = user.name;
        token.groupId = user.groupId as GroupId;
        token.accessToken = user.accessToken;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id;
      session.user.authorId = token.authorId as number;
      session.user.name = token.name;
      session.user.email = token.email;
      session.user.groupId = token.groupId as GroupId;
      session.user.accessToken = token.accessToken as string;
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET, // Ensure the secret is set here
};
