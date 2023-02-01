import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { getProviders } from 'next-auth/react';
import { SessionProviderProps } from 'next-auth/react';

import { Background } from '@/common/components/Background';
import { Folge, Image } from '@/common/models/folge';
import { Seo } from '@/components/Seo/Seo';
import Wrapper from '@/layout/Wrapper';
import { getServerSession } from '@/lib/getServerSession';
import { LoginForm } from '@/modules/LoginForm';
import { parseQueryParam } from '@/utils/index';

export default function SignIn({
  providers,
  background,
}: {
  providers: SessionProviderProps;
  background: Image;
}) {
  const router = useRouter();
  const error = router.query?.error as string;

  return (
    <>
      <Seo title="Anmelden &amp; Mitmachen" canonicalpath="/signin" />

      <Wrapper maxWidth="720px">
        <LoginForm providers={providers} error={error} />
      </Wrapper>

      <Background
        style={{ backgroundImage: `url(${background.url})` }}
        bigCover={true}
      />
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async ({
  req,
  res,
  query,
}) => {
  const session = await getServerSession(req, res);

  const callbackUrl = parseQueryParam(query.callbackUrl);

  if (session) {
    return {
      redirect: {
        destination: callbackUrl || process.env.NEXTAUTH_URL || '/',
        permanent: false,
      },
    };
  }

  const providers = await getProviders();

  const folge = await Folge.findOne({ type: 'regular' })
    .sort('-release_date')
    .select('images');

  const background = folge?.images[2];

  return {
    props: { providers, background },
  };
};
