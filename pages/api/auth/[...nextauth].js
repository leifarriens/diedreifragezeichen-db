import NextAuth from 'next-auth';
import Providers from 'next-auth/providers';

const options = {
  providers: [
    Providers.Spotify({
      clientId: process.env.SPOTIFY_CLIENT_ID,
      clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
    }),
    Providers.Facebook({
      clientId: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
    }),
    Providers.Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    // Providers.Email({
    //   server: 'smtp://username:password@smtp.example.com:587',
    //   from: 'noreply@dreifragezeichen-db.de'
    // }),
  ],
  pages: {
    signIn: '/signin',
  },
  callbacks: {
    redirect: async (url, baseUrl) => {
      return Promise.resolve(url);
    },
    // redirect: async (url, baseUrl) => {
    //   // return url.startsWith(baseUrl)
    //   //   ? Promise.resolve(url)
    //   //   : Promise.resolve(baseUrl);
    // },
  },
  session: {
    jwt: true,
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
};

export default (req, res) => NextAuth(req, res, options);
