import NextAuth from 'next-auth';
import Providers from 'next-auth/providers';

const SESSION_MAX_AGE = 90 * 24 * 60 * 60; // 90 days

const options = {
  providers: [
    Providers.Spotify({
      clientId: process.env.SPOTIFY_CLIENT_ID,
      clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
    }),
    // Providers.Facebook({
    //   clientId: process.env.FACEBOOK_CLIENT_ID,
    //   clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
    // }),
    Providers.Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  pages: {
    signIn: '/signin',
  },
  callbacks: {
    // redirect: async (url, baseUrl) => {
    //   return Promise.resolve(url);
    // },
  },
  session: {
    jwt: true,
    maxAge: SESSION_MAX_AGE,
  },
};

export default (req, res) => NextAuth(req, res, options);
