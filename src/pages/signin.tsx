import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { getProviders, getSession } from 'next-auth/react';
import { SessionProviderProps } from 'next-auth/react';
import { NextSeo } from 'next-seo';

import Wrapper from '@/layout/Wrapper';
import { LoginForm } from '@/modules/LoginForm';

export default function SignIn({
  providers,
}: {
  providers: SessionProviderProps;
}) {
  const router = useRouter();
  const error = router.query?.error as string;

  return (
    <>
      <NextSeo title="Anmelden & Mitmachen" />

      <Wrapper maxWidth="720px">
        <LoginForm providers={providers} error={error} />
      </Wrapper>
    </>
  );
}

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
