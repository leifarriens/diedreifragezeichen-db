import { getSession, getProviders, signIn } from 'next-auth/client';
import { FaSpotify, FaFacebook } from 'react-icons/fa';
import { FcGoogle } from 'react-icons/fc';

export default function SignIn(props) {
  return (
    <div className="wrapper" style={{ maxWidth: '420px' }}>
      <h1>Anmelden</h1>
      {Object.values(props.providers).map((provider) => {
        if (provider.id === 'spotify') {
          return (
            <SocialLoginButton
              key={provider.id}
              name={provider.name}
              icon={<FaSpotify />}
              bgColor="#1ED760"
              color="#fff"
              onClick={() => signIn(provider.id)}
            />
          );
        }

        if (provider.id === 'facebook') {
          return (
            <SocialLoginButton
              key={provider.id}
              name={provider.name}
              icon={<FaFacebook />}
              bgColor="#1877F2"
              color="#fff"
              onClick={() => signIn(provider.id)}
            />
          );
        }

        if (provider.id === 'google') {
          return (
            <SocialLoginButton
              key={provider.id}
              name={provider.name}
              icon={<FcGoogle />}
              bgColor="#fff"
              color="#000"
              onClick={() => signIn(provider.id)}
            />
          );
        }

        // return (
        //   <div key={provider.name}>
        //     <button className="button" onClick={() => signIn(provider.id)}>
        //       Mit {provider.name} anmelden
        //     </button>
        //   </div>
        // );
      })}
    </div>
  );
}

const SocialLoginButton = ({ name, icon, bgColor, color, onClick }) => {
  return (
    <div style={{ marginBottom: '12px' }}>
      <button
        className="button"
        onClick={onClick}
        style={{
          width: '100%',
          fontSize: '20px',
          backgroundColor: bgColor,
          borderColor: bgColor,
          color: color,
        }}
      >
        <span style={{ marginRight: '6px' }}>{icon}</span>
        Mit {name} anmelden
      </button>
    </div>
  );
};

export async function getServerSideProps(context) {
  const { res } = context;

  const session = await getSession(context);

  if (session && res) {
    res.writeHead(302, {
      Location: '/',
    });
    return res.end();
  }

  const providers = await getProviders();

  return {
    props: {
      session: session,
      providers: providers,
    },
  };
}
