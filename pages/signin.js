import { getProviders, getSession, signIn } from 'next-auth/client';
import { FaFacebook, FaSpotify } from 'react-icons/fa';
import { FcGoogle } from 'react-icons/fc';
import { HiOutlineMail } from 'react-icons/hi';

import Header from '../components/Header';

export default function SignIn({ providers }) {
  const providerButtons = {
    spotify: {
      icon: <FaSpotify size={20} />,
      bgColor: '#1ED760',
      color: '#fff',
    },
    facebook: {
      icon: <FaFacebook size={20} />,
      bgColor: '#1877F2',
      color: '#fff',
    },
    google: {
      icon: <FcGoogle size={20} />,
      bgColor: '#fff',
      color: '#000',
    },
    email: {
      icon: <HiOutlineMail size={20} />,
      bgColor: '#000',
      color: '#fff',
    },
  };

  return (
    <>
      <Header simple={true} />
      <div
        className="wrapper"
        style={{ maxWidth: '420px', textAlign: 'center' }}
      >
        <h1>Anmelden</h1>
        {Object.values(providers).map((provider) => {
          return (
            <SocialLoginButton
              key={provider.id}
              name={provider.name}
              onClick={() => signIn(provider.id)}
              {...providerButtons[provider.id]}
            />
          );
        })}
      </div>
    </>
  );
}

const SocialLoginButton = ({ name, icon, bgColor, color, onClick }) => {
  return (
    <div style={{ marginBottom: '12px' }}>
      <button
        aria-label={`${name} Login`}
        className="button"
        onClick={onClick}
        style={{
          width: '100%',
          fontSize: '1.1rem',
          backgroundColor: bgColor,
          borderColor: bgColor,
          color: color,
        }}
      >
        <span style={{ marginRight: '6px' }}>{icon}</span>
        <span>Mit {name} anmelden</span>
      </button>
    </div>
  );
};

export async function getServerSideProps(context) {
  const { res, query } = context;
  const session = await getSession(context);

  const { callbackUrl } = query;

  if (session && res) {
    res.writeHead(302, {
      Location: callbackUrl || process.env.NEXTAUTH_URL,
    });
    res.end();
    return {
      props: {},
    };
  }

  const providers = await getProviders();

  return {
    props: { providers },
  };
}
