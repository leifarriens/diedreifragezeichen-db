import type { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { type SessionProviderProps } from 'next-auth/react';
import { getProviders } from 'next-auth/react';

import { Background } from '@/common/components/Background';
import type { Image } from '@/common/models/folge';
import { Folge } from '@/common/models/folge';
import { Seo } from '@/components/Seo/Seo';
import dbConnect from '@/db/connect';
import Wrapper from '@/layout/Wrapper';
import { getServerAuthSesion } from '@/lib/getServerAuthSesion';
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
  const session = await getServerAuthSesion(req, res);

  const callbackUrl = parseQueryParam(query.callbackUrl);

  if (session) {
    return {
      redirect: {
        destination: callbackUrl || '/',
        permanent: false,
      },
    };
  }

  const providers = await getProviders();

  await dbConnect();

  const folge = await Folge.findOne({ type: 'regular' })
    .sort('-release_date')
    .select('images');

  const background = folge?.images[2];

  return {
    props: { providers, background },
  };
};
