import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import SpotifyProvider from 'next-auth/providers/spotify';

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
    ],
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
  });
}
