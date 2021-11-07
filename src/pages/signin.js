import { getProviders, getSession, signIn } from 'next-auth/client';
import { FaFacebook, FaSpotify } from 'react-icons/fa';
import { FcGoogle } from 'react-icons/fc';
import { HiOutlineMail } from 'react-icons/hi';
import styled from 'styled-components';

import Header from '../components/Header';

const FormContainer = styled.div`
  @media screen and (min-width: 640px) {
    border: 2px solid #fff;
    border-radius: 16px;
    padding: 64px 48px;
  }

  h1 {
    margin-bottom: 1rem;
  }
`;

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
        style={{ maxWidth: '520px', textAlign: 'center' }}
      >
        <FormContainer>
          <div>
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
        </FormContainer>
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
          fontWeight: 400,
          backgroundColor: bgColor,
          borderColor: bgColor,
          color: color,
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <span
          style={{ marginRight: '6px', display: 'flex', alignItems: 'center' }}
        >
          {icon}
        </span>
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
