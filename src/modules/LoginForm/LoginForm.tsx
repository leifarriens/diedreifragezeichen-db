import { signIn } from 'next-auth/react';
import { SessionProviderProps } from 'next-auth/react';
import { FaApple, FaDiscord, FaFacebook, FaSpotify } from 'react-icons/fa';
import { FcGoogle } from 'react-icons/fc';
import { HiOutlineMail } from 'react-icons/hi';
import styled from 'styled-components';

import SocialLoginButton from '@/components/SocialLoginButton';
import { colors } from '@/constants/theme';

type ProviderButtons = {
  [name: string]: ProviderButton;
};

type ProviderButton = {
  icon: React.ReactElement;
  bgColor: string;
  color: string;
};

const size = 20;

const providerButtons: ProviderButtons = {
  spotify: {
    icon: <FaSpotify size={size} />,
    bgColor: '#1ED760',
    color: colors.white,
  },
  facebook: {
    icon: <FaFacebook size={size} />,
    bgColor: '#1877F2',
    color: colors.white,
  },
  google: {
    icon: <FcGoogle size={size} />,
    bgColor: colors.white,
    color: '#000',
  },
  email: {
    icon: <HiOutlineMail size={size} />,
    bgColor: '#000',
    color: colors.white,
  },
  discord: {
    icon: <FaDiscord size={size} />,
    bgColor: '#5865f2',
    color: colors.white,
  },
  apple: {
    icon: <FaApple size={size} />,
    bgColor: '#000',
    color: colors.white,
  },
};

export const LoginForm = ({
  providers,
  error,
}: {
  providers: SessionProviderProps;
  error: string;
}) => (
  <FormContainer>
    <h1>Anmelden</h1>
    {error && (
      <>
        {error === 'OAuthAccountNotLinked' ? (
          <FormError>
            Email Adresse ist bereits mit einem anderen Provider registriert!
          </FormError>
        ) : (
          <FormError>Fehler bei der der Anmeldung</FormError>
        )}
        <hr />
      </>
    )}
    {Object.values(providers).map((provider) => (
      <SocialLoginButton
        key={provider.id}
        name={provider.name}
        onClick={() => signIn(provider.id)}
        {...providerButtons[provider.id]}
      />
    ))}
  </FormContainer>
);

const FormContainer = styled.div`
  margin-top: 20vh;

  @media screen and (min-width: 640px) {
    border: 2px solid #001727;
    border-radius: 16px;
    padding: 64px 72px;
    padding-bottom: 82px;
    background-color: #001e33;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
  }

  > *:not(:last-of-type) {
    margin-bottom: 1em;
  }

  hr {
    margin-bottom: 1em;
    border: none;
    border-bottom: 1px solid ${colors.white};
    box-shadow: none;
  }

  h1 {
    text-align: center;
    font-size: 3em;
    margin-bottom: 0.8em;
  }
`;

const FormError = styled.div`
  text-align: center;
  background-color: ${colors.red};
  border-radius: 8px;
  padding: 1em;
  margin-bottom: 1em;
  font-weight: 600;
  font-size: 0.7em;
`;
