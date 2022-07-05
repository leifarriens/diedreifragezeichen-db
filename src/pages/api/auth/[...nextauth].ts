import { MongoDBAdapter } from '@next-auth/mongodb-adapter';
import type { NextApiRequest, NextApiResponse } from 'next';
import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import SpotifyProvider from 'next-auth/providers/spotify';

import clientPromise from '../../../db/authConn';

const SESSION_MAX_AGE = 90 * 24 * 60 * 60; // 90 days

export default async function auth(req: NextApiRequest, res: NextApiResponse) {
  return await NextAuth(req, res, {
    providers: [
      SpotifyProvider({
        clientId: process.env.SPOTIFY_CLIENT_ID,
        clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
      }),
      GoogleProvider({
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      }),
    ],
    adapter: MongoDBAdapter(clientPromise),
    jwt: {
      secret: process.env.JWT_SECRET,
    },
    pages: {
      signIn: '/signin',
    },
    session: {
      // jwt: true,
      maxAge: SESSION_MAX_AGE,
    },
    callbacks: {
      session: async ({ session, user }) => {
        // append user id to req.session
        session.user.id = user.id;
        return Promise.resolve(session);
      },
    },
  });
}
