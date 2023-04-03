import classNames from 'classnames';
import type { GetServerSidePropsContext } from 'next/types';
import { signOut } from 'next-auth/react';
import { useRef } from 'react';
import { toast } from 'react-hot-toast';
import { FiCopy } from 'react-icons/fi';
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
  const deleteMutation = trpc.user.delete.useMutation({
    onSuccess: () => signOut(),
  });

  function handleDelete() {
    const confirm = prompt(
      'Bitte geben Sie "Löschen" ein um ihren Account unwiderruflich zu löschen',
      '',
    );
    if (confirm === 'Löschen') deleteMutation.mutate();
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
        <SectionBox>
          <h3>API key</h3>
          <div className="split">
            <Apikey />
          </div>
        </SectionBox>
      </ProfilLayout>
    </>
  );
};

const Apikey = () => {
  const ref = useRef<HTMLInputElement | null>(null);
  const apikeyMutation = trpc.user.apikey.useMutation();

  async function handleCopyClick() {
    if (apikeyMutation.data?.token) {
      await navigator.clipboard.writeText(apikeyMutation.data.token);
      toast('API key copied to clipboard');
    }
  }

  return (
    <>
      <div className="flex items-center gap-2">
        <input
          ref={ref}
          type="text"
          value={apikeyMutation.data?.token ?? ''}
          disabled={!apikeyMutation.isSuccess}
          className={classNames(
            'w-[36ch] rounded bg-neutral-800 bg-opacity-60 py-1 text-center',
          )}
          onFocus={(e) => e.target.select()}
        />
        <button
          type="button"
          disabled={!apikeyMutation.isSuccess}
          onClick={handleCopyClick}
        >
          <FiCopy size={22} />
        </button>
      </div>

      <Button
        onClick={() => apikeyMutation.mutate({})}
        color={colors.lightblue}
      >
        Generieren
      </Button>
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
