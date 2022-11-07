import Link from 'next/link';
import { signIn, useSession } from 'next-auth/react';
import toast from 'react-hot-toast';
import { BsBookmark, BsBookmarkFill } from 'react-icons/bs';
import { useMutation, useQueryClient } from 'react-query';

import { colors } from '@/constants/theme';
import { useUser } from '@/hooks';
import { postFolgeList, removeFolgeList } from '@/services/client';

import { SpinningLoader } from './shared/Loader';

type ListButtonProps = {
  folgeId: string;
  folgeName: string;
  iconSize?: string | number;
};

function ListButton({ folgeId, folgeName, iconSize = 20 }: ListButtonProps) {
  const { data: session, status } = useSession();
  const { data: user, isLoading: userLoading } = useUser();
  const queryClient = useQueryClient();

  const isOnUserList = !user
    ? false
    : user.list.map((id) => id.toString()).includes(folgeId);

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
        toast.success(
          <span>
            <i>{folgeName}</i> zur <MerklistenLink /> hinzugefügt
          </span>,
        );
      },
    },
  );

  const { mutate: mutateRemove, isLoading: removeIsLoading } = useMutation(
    removeFolgeList,
    {
      onMutate: () => {
        queryClient.setQueryData(['user', user?._id], {
          ...user,
          list: user?.list.filter((id) => id.toString() !== folgeId),
        });
      },
      onSuccess: () => {
        toast(
          <span>
            <i>{folgeName}</i> von der <MerklistenLink /> entfernt
          </span>,
          { style: { backgroundColor: colors.red } },
        );
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
    <button
      type="button"
      onClick={handleClick}
      disabled={isLoading}
      aria-label={`${folgeName} ${
        isOnUserList
          ? 'von der Merkliste entfernen'
          : 'zur Merkliste hinzufügen'
      }`}
    >
      {isOnUserList ? (
        <BsBookmarkFill size={iconSize} />
      ) : (
        <BsBookmark size={iconSize} />
      )}
    </button>
  );
}

const MerklistenLink = () => (
  // eslint-disable-next-line no-inline-styles/no-inline-styles
  <Link href="/profil/list" style={{ textDecoration: 'underline' }}>
    Merkliste
  </Link>
);

export default ListButton;
