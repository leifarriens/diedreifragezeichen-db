import React from 'react';
import { providers, signin, getSession } from 'next-auth/client';
// import Providers from 'next-auth/providers';

export default function SignIn({ providers }) {
  return (
    <main className="wrapper" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      {Object.values(providers).map((provider) => {
        if (provider.name === 'Email') {
          return;
        }
        return (
          <div key={provider.name}>
            <button className="button" onClick={() => signin(provider.id)}>
              Sign in with {provider.name}
            </button>
          </div>
        );
      })}
    </main>
  );
}

SignIn.getInitialProps = async (context) => {
  const { req, res } = context;
  const session = await getSession({ req });

  if (session && res && session.accessToken) {
    res.writeHead(302, {
      Location: '/',
    });
    res.end();
    return;
  }

  return {
    session: undefined,
    providers: await providers(context)
  };
};
