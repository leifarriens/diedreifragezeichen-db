import { getSession, getProviders, signIn } from 'next-auth/client';

export default function SignIn({ providers }) {
  return (
    <div className="wrapper">
      {Object.values(providers).map((provider) => (
        <div key={provider.name}>
          <button className="button" onClick={() => signIn(provider.id)}>
            Sign in with {provider.name}
          </button>
        </div>
      ))}
    </div>
  );
}

export async function getServerSideProps(context) {
  const { req, res } = context;
  const session = await getSession({ req });

  if (session && res && session.user) {
    res.writeHead(302, {
      Location: '/',
    });
    return res.end();
  }

  const providers = await getProviders();

  return {
    props: { providers },
  };
}
