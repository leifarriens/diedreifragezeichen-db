import { GetServerSideProps } from 'next';
import { getProviders, getSession, signIn } from 'next-auth/react';
import { SessionProviderProps } from 'next-auth/react';
import { FaDiscord, FaFacebook, FaSpotify } from 'react-icons/fa';
import { FcGoogle } from 'react-icons/fc';
import { HiOutlineMail } from 'react-icons/hi';
import styled from 'styled-components';

import SocialLoginButton from '@/components/SocialLoginButton';
import Wrapper from '@/layout/Wrapper';

type ProviderButtons = {
  [name: string]: ProviderButton;
};

type ProviderButton = {
  icon: React.ReactElement;
  bgColor: string;
  color: string;
};

const providerButtons: ProviderButtons = {
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
  discord: {
    icon: <FaDiscord size={20} />,
    bgColor: '#5865f2',
    color: '#fff',
  },
};

export default function SignIn({
  providers,
}: {
  providers: SessionProviderProps;
}) {
  return (
    <Wrapper maxWidth="640px">
      <FormContainer>
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
      </FormContainer>
    </Wrapper>
  );
}

const FormContainer = styled.div`
  @media screen and (min-width: 640px) {
    border: 2px solid #001727;
    border-radius: 16px;
    padding: 64px 72px;
    background-color: #001e33;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
  }

  > * {
    margin-bottom: 12px;
  }

  h1 {
    text-align: center;
    margin-bottom: 1.8rem;
  }
`;

export const getServerSideProps: GetServerSideProps = async (context) => {
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
};
