import { MongoDBAdapter } from '@next-auth/mongodb-adapter';
import NextAuth from 'next-auth';
import DiscordProvider from 'next-auth/providers/discord';
import GoogleProvider from 'next-auth/providers/google';
import SpotifyProvider from 'next-auth/providers/spotify';
import clientPromise from 'src/db/authConn';

const SESSION_MAX_AGE = 90 * 24 * 60 * 60; // 90 days

export default async function auth(req, res) {
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
      DiscordProvider({
        clientId: process.env.DISCORD_CLIENT_ID,
        clientSecret: process.env.DISCORD_CLIENT_SECRET,
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
      jwt: true,
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
