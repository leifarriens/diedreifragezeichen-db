import { GetServerSidePropsContext } from 'next';
import { getSession, signOut } from 'next-auth/react';
import { useMutation, useQueryClient } from 'react-query';
import styled from 'styled-components';

import ProfilLayout from '@/components/Profil/Layout';
import Seo from '@/components/Seo/Seo';
import Button from '@/components/shared/Button';
import Switch from '@/components/shared/Switch';
import Toast, { useToast } from '@/components/shared/Toast';
import { colors } from '@/constants/theme';
import { useUser } from '@/hooks';
import { deleteAccount, updateUser } from '@/services/client';

function AccountPage() {
  const { toasted, show, hide } = useToast();
  const { data: user } = useUser();
  const queryClient = useQueryClient();
  const { mutate: mutateUpdate } = useMutation(updateUser, {
    onMutate: (update) => {
      const updatedUser = {
        ...user,
        ...update,
      };
      queryClient.setQueryData(['user', user?._id], updatedUser);
    },
    onSuccess: () => {
      show();
    },
  });
  const { mutate: mutateDeletion } = useMutation(deleteAccount, {
    onSuccess: () => {
      signOut();
    },
  });

  function handleNotificationChange(checked: boolean) {
    mutateUpdate({
      notifications: checked,
    });
  }

  function handleDelete() {
    const confirm = prompt(
      'Bitte geben Sie "Löschen" ein um ihren Account unwiderruflich zu löschen',
      '',
    );
    if (confirm === 'Löschen') mutateDeletion();
  }

  return (
    <>
      <Seo title="Account" canonicalpath="/profil/account" />

      <ProfilLayout>
        <SectionBox>
          <h3>Email Benachrichtigungen</h3>
          {/* <div className="split">
            <p>Allgemeine Neuigkeiten zur Die Drei Fragezeichen DB erhalten</p>
            <Switch id="emailNews" />
          </div> */}
          <div className="split">
            <p>Benachrichtigungen über neue Folgen erhalten</p>
            <Switch
              id="emailFolgen"
              checked={user?.notifications || false}
              onChange={handleNotificationChange}
            />
          </div>
        </SectionBox>
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

      {toasted && (
        <Toast onFadeOut={hide} color={colors.green}>
          Benachrichtigungseinstellungen wurden gespeichert
        </Toast>
      )}
    </>
  );
}

export const getServerSideProps = async ({
  req,
}: GetServerSidePropsContext) => {
  const session = await getSession({ req });

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
    margin-top: 1.25em;
    gap: 1em;
  }
`;

export default AccountPage;
