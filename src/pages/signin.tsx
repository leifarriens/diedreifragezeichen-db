import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { getProviders, getSession } from 'next-auth/react';
import { SessionProviderProps } from 'next-auth/react';

import Seo from '@/components/Seo/Seo';
import Wrapper from '@/layout/Wrapper';
import { LoginForm } from '@/modules/LoginForm';
import { parseQueryParam } from '@/utils/index';

export default function SignIn({
  providers,
}: {
  providers: SessionProviderProps;
}) {
  const router = useRouter();
  const error = router.query?.error as string;

  return (
    <>
      <Seo title="Anmelden &amp; Mitmachen" canonicalpath="/signin" />

      <Wrapper maxWidth="720px">
        <LoginForm providers={providers} error={error} />
      </Wrapper>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async ({
  req,
  query,
}) => {
  const session = await getSession({ req });

  const callbackUrl = parseQueryParam(query.callbackUrl);

  if (session) {
    return {
      redirect: {
        destination: callbackUrl || process.env.NEXTAUTH_URL || '',
        permanent: false,
      },
    };
  }

  const providers = await getProviders();

  return {
    props: { providers },
  };
};
