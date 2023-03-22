import type { GetServerSidePropsContext } from 'next/types';
import { signOut } from 'next-auth/react';
import styled from 'styled-components';

import { Seo } from '@/components/Seo';
import {
  Button,
  // Switch
} from '@/components/shared';
import { colors } from '@/constants/theme';
import { getServerAuthSesion } from '@/lib/getServerAuthSesion';
import { ProfilLayout } from '@/modules/Profil';
import { trpc } from '@/utils/trpc';

const AccountPage = () => {
  const { mutate } = trpc.user.delete.useMutation({
    onSuccess: () => signOut(),
  });

  function handleDelete() {
    const confirm = prompt(
      'Bitte geben Sie "Löschen" ein um ihren Account unwiderruflich zu löschen',
      '',
    );
    if (confirm === 'Löschen') mutate();
  }

  return (
    <>
      <Seo title="Account" canonicalpath="/profil/account" />

      <ProfilLayout>
        {/* <SectionBox>
          <h3>Email Benachrichtigungen</h3>
          <div className="split">
            <p>Allgemeine Neuigkeiten zur Die Drei Fragezeichen DB erhalten</p>
            <Switch id="emailNews" />
          </div>
          <div className="split">
            <p>Benachrichtigungen über neue Folgen erhalten</p>
            <Switch id="emailFolgen" />
          </div>
        </SectionBox> */}
        <SectionBox>
          <h3>Authentifizierung</h3>
          <div className="split">
            <p>Derzeitige Session abmelden</p>
            <Button onClick={() => signOut()} color={colors.red}>
              Abmelden
            </Button>
          </div>
        </SectionBox>
        <SectionBox>
          <h3>Account löschen</h3>
          <div className="split">
            <p>Account unwiderruflich löschen</p>
            <Button onClick={handleDelete} color={colors.red}>
              Löschen
            </Button>
          </div>
        </SectionBox>
      </ProfilLayout>
    </>
  );
};

export const getServerSideProps = async ({
  req,
  res,
}: GetServerSidePropsContext) => {
  const session = await getServerAuthSesion(req, res);

  if (!session) {
    return {
      redirect: {
        destination: '/api/auth/signin',
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
};

const SectionBox = styled.div`
  padding: 1.5em 2em;
  border: 1px solid #38444d;
  border-bottom: none;

  &:first-of-type {
    border-top-left-radius: 12px;
    border-top-right-radius: 12px;
  }

  &:last-of-type {
    border-bottom-left-radius: 12px;
    border-bottom-right-radius: 12px;
    border-bottom: 1px solid #38444d;
  }

  .split {
    color: ${colors.gray};
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 1em;
    gap: 1em;
  }
`;

export default AccountPage;
