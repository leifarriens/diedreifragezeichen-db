import NextAuth from 'next-auth';
import Providers from 'next-auth/providers';

export default NextAuth({
  // Configure one or more authentication providers
  providers: [
    // Providers.Google({
    //   clientId: process.env.GOOGLE_CLIENT_ID,
    //   clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    //   authorizationUrl:
    //     'https://accounts.google.com/o/oauth2/v2/auth?prompt=consent&access_type=offline&response_type=code',
    // }),
    Providers.Spotify({
      clientId: process.env.SPOTIFY_CLIENT_ID,
      clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
      async authorize(credentials) {
        console.log(credentials);
        // const user = (credentials) => {
        //   // You need to provide your own logic here that takes the credentials
        //   // submitted and returns either a object representing a user or value
        //   // that is false/null if the credentials are invalid.
        //   // e.g. return { id: 1, name: 'J Smith', email: 'jsmith@example.com' }
        //   return null
        // }
        // if (user) {
        //   console.log(user);
        //   // Any user object returned here will be saved in the JSON Web Token
        //   return user
        // } else {
        //   return null
        // }
      }
    }),
    Providers.Credentials({
      // The name to display on the sign in form (e.g. 'Sign in with...')
      name: 'Credentials',
      // The credentials is used to generate a suitable form on the sign in page.
      // You can specify whatever fields you are expecting to be submitted.
      // e.g. domain, username, password, 2FA token, etc.
      credentials: {
        username: { label: 'Username', type: 'text', placeholder: 'jsmith' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        // const user = (credentials) => {
        //   // You need to provide your own logic here that takes the credentials
        //   // submitted and returns either a object representing a user or value
        //   // that is false/null if the credentials are invalid.
        //   // return { id: 1, name: 'J Smith', email: 'jsmith@example.com' }
        //   return null
        // }

        const user = {
          id: '1',
          name: 'Testuser',
          email: 'leif.arriens@gmail.com',
          image: null,
        }

        if (user) {
          // Any user object returned here will be saved in the JSON Web Token
          return user
        } else {
          return null
        }
      },
    }),
  ],
  callbacks: {
    async signIn(user, account, profile) {
      console.log(user, account, profile);
      const isAllowedToSignIn = true
      if (isAllowedToSignIn) {
        return true
      } else {
        // Return false to display a default error message
        return false
        // Or you can return a URL to redirect to:
        // return '/unauthorized'
      }
    }
  },
  session: {
    // Use JSON Web Tokens for session instead of database sessions.
    // This option can be used with or without a database for users/accounts.
    // Note: `jwt` is automatically set to `true` if no database is specified.
    jwt: true,

    // Seconds - How long until an idle session expires and is no longer valid.
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  // A database is optional, but required to persist accounts in a database
  // database: process.env.MONGO_URI,
  // adapter: Adapters.TypeORM.Adapter({
  //   type: 'mongodb',
  //   database: ':users:',
  //   synchronize: true
  // }),
});
