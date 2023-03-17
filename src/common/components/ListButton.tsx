import Link from 'next/link';
import { signIn, useSession } from 'next-auth/react';
import toast from 'react-hot-toast';
import { BsBookmark, BsBookmarkFill } from 'react-icons/bs';
import { trpc } from 'utils/trpc';

import { colors } from '@/constants/theme';
import { useUser } from '@/hooks';

import { SpinningLoader } from './shared/Loader';

interface ListButtonProps {
  folgeId: string;
  folgeName: string;
  iconSize?: string | number;
}

function ListButton({ folgeId, folgeName, iconSize = 20 }: ListButtonProps) {
  const { data: session, status } = useSession();
  const { data: user, isLoading: userLoading } = useUser();
  const utils = trpc.useContext();

  const isOnUserList =
    user?.list && user.list.map((id) => id).includes(folgeId);

  const { mutate: mutateAdd, isLoading: addIsLoading } =
    trpc.user.addToList.useMutation({
      onMutate: () => {
        if (user) {
          utils.user.self.setData(undefined, {
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
    });

  const { mutate: mutateRemove, isLoading: removeIsLoading } =
    trpc.user.removeFromList.useMutation({
      onMutate: () => {
        if (user) {
          utils.user.self.setData(undefined, {
            ...user,
            list: user.list.filter((id) => id !== folgeId),
          });
        }
      },
      onSuccess: () => {
        toast(
          <span>
            <i>{folgeName}</i> von der <MerklistenLink /> entfernt
          </span>,
          { style: { backgroundColor: colors.red } },
        );
      },
    });

  const isLoading = userLoading || addIsLoading || removeIsLoading;

  function handleClick() {
    if (!session) return signIn();

    if (!isOnUserList) {
      console.log(folgeId);
      return mutateAdd({ folgeId });
    }

    return mutateRemove({ folgeId });
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
