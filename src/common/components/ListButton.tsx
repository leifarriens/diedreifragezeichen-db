import Link from 'next/link';
import { signIn, useSession } from 'next-auth/react';
import { useState } from 'react';
import { BsBookmark, BsBookmarkFill } from 'react-icons/bs';
import { RotatingLines } from 'react-loader-spinner';
import { useMutation, useQueryClient } from 'react-query';

import { colors } from '@/constants/theme';
import { useUser } from '@/hooks';
import { postFolgeList, removeFolgeList } from '@/services/client';

import Toast from './shared/Toast';

type ListButtonProps = {
  folgeId: string;
  folgeName: string;
  iconSize?: string | number;
};

function ListButton({ folgeId, folgeName, iconSize = 18 }: ListButtonProps) {
  const { data: session } = useSession();
  const { data } = useUser();
  const queryClient = useQueryClient();
  const [toasted, setToasted] = useState(false);

  const isOnUserList = !data ? false : data.list.includes(folgeId);

  const { mutate: mutateAdd, isLoading: addIsLoading } = useMutation(
    postFolgeList,
    {
      onMutate: (folgeId) => {
        if (data) {
          const updatedUser = {
            ...data,
            list: [...data.list, folgeId],
          };
          queryClient.setQueryData(['user', data?._id], updatedUser);
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
      onMutate: (folgeId) => {
        const updatedUser = {
          ...data,
          list: data?.list.filter((id) => id !== folgeId),
        };
        queryClient.setQueryData(['user', data?._id], updatedUser);
      },
      onSuccess: () => {
        setToasted(true);
      },
    },
  );

  const isLoading = addIsLoading || removeIsLoading;

  function handleClick() {
    if (!session) return signIn();

    if (!isOnUserList) {
      return mutateAdd(folgeId);
    }

    return mutateRemove(folgeId);
  }

  if (isLoading) {
    return (
      <RotatingLines
        strokeColor="grey"
        strokeWidth="5"
        animationDuration="0.75"
        width={iconSize.toString()}
        visible={true}
      />
    );
  }

  return (
    <>
      <button onClick={handleClick} disabled={isLoading}>
        {!isOnUserList ? (
          <BsBookmark size={iconSize} />
        ) : (
          <BsBookmarkFill size={iconSize} />
        )}
      </button>
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
