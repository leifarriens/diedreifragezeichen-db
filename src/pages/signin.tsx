import { GetServerSidePropsContext } from 'next';
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
      <NextSeo title="Anmelden &amp; Mitmachen" />

      <Wrapper maxWidth="720px">
        <LoginForm providers={providers} error={error} />
      </Wrapper>
    </>
  );
}

export const getServerSideProps = async ({
  req,
  query,
}: GetServerSidePropsContext) => {
  const session = await getSession({ req });

  const { callbackUrl } = query;

  if (session) {
    return {
      redirect: {
        destination: callbackUrl || process.env.NEXTAUTH_URL,
        permanent: false,
      },
    };
  }

  const providers = await getProviders();

  return {
    props: { providers },
  };
};
