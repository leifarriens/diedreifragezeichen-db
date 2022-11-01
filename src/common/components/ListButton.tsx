import Link from 'next/link';
import { signIn, useSession } from 'next-auth/react';
import { useState } from 'react';
import { BsBookmark, BsBookmarkFill } from 'react-icons/bs';
import { useMutation, useQueryClient } from 'react-query';

import { colors } from '@/constants/theme';
import { useUser } from '@/hooks';
import { postFolgeList, removeFolgeList } from '@/services/client';

import { SpinningLoader } from './shared/Loader';
import Toast from './shared/Toast';

type ListButtonProps = {
  folgeId: string;
  folgeName: string;
  iconSize?: string | number;
};

function ListButton({ folgeId, folgeName, iconSize = 20 }: ListButtonProps) {
  const { data: session, status } = useSession();
  const { data: user, isLoading: userLoading } = useUser();
  const queryClient = useQueryClient();
  const [toasted, setToasted] = useState(false);

  const isOnUserList = !user ? false : user.list.includes(folgeId);

  const { mutate: mutateAdd, isLoading: addIsLoading } = useMutation(
    postFolgeList,
    {
      onMutate: () => {
        if (user) {
          queryClient.setQueryData(['user', user?._id], {
            ...user,
            list: [...user.list, folgeId],
          });
        }
      },
      onSuccess: () => {
        setToasted(true);
      },
    },
  );

  const { mutate: mutateRemove, isLoading: removeIsLoading } = useMutation(
    removeFolgeList,
    {
      onMutate: () => {
        queryClient.setQueryData(['user', user?._id], {
          ...user,
          list: user?.list.filter((id) => id !== folgeId),
        });
      },
      onSuccess: () => {
        setToasted(true);
      },
    },
  );

  const isLoading = userLoading || addIsLoading || removeIsLoading;

  function handleClick() {
    if (!session) return signIn();

    if (!isOnUserList) {
      return mutateAdd(folgeId);
    }

    return mutateRemove(folgeId);
  }

  if (status === 'loading' || userLoading) {
    return null;
  }

  if (isLoading) {
    return <SpinningLoader width={iconSize.toString()} />;
  }

  return (
    <>
      {!isOnUserList ? (
        <button
          onClick={handleClick}
          disabled={isLoading}
          aria-label={`${folgeName} zur Merkliste hinzufügen`}
        >
          <BsBookmark size={iconSize} />
        </button>
      ) : (
        <button
          onClick={handleClick}
          disabled={isLoading}
          aria-label={`${folgeName} von der Merkliste entfernen`}
        >
          <BsBookmarkFill size={iconSize} />
        </button>
      )}

      {toasted && (
        <Toast
          duration={3000}
          onFadeOut={() => setToasted(false)}
          color={isOnUserList ? colors.green : colors.red}
        >
          <i>{folgeName}</i>{' '}
          {isOnUserList ? (
            <span>
              zur <MerklistenLink /> hinzugefügt
            </span>
          ) : (
            <span>
              von der <MerklistenLink /> entfernt
            </span>
          )}
        </Toast>
      )}
    </>
  );
}

const MerklistenLink = () => (
  <Link href="/profil/list">
    {/* eslint-disable-next-line no-inline-styles/no-inline-styles */}
    <a style={{ textDecoration: 'underline' }}>Merkliste</a>
  </Link>
);

export default ListButton;
