import Link from 'next/link';
import { signIn, useSession } from 'next-auth/react';
import toast from 'react-hot-toast';
import { BsBookmark, BsBookmarkFill } from 'react-icons/bs';

import { SpinningLoader } from '@/components/shared';
import { colors } from '@/constants/theme';
import { trpc } from '@/utils/trpc';

interface ListButtonProps {
  folgeId: string;
  folgeName: string;
  iconSize?: string | number;
}

export function ListButton({
  folgeId,
  folgeName,
  iconSize = 20,
}: ListButtonProps) {
  const { data: session, status } = useSession();
  const { data: list, isLoading: listLoading } = trpc.user.list.useQuery();
  const utils = trpc.useContext();

  const isOnUserList = list?.map((id) => id).includes(folgeId);

  const { mutate: mutateAdd, isLoading: addIsLoading } =
    trpc.user.addToList.useMutation({
      onMutate: () => {
        utils.user.list.setData(undefined, (curr) =>
          curr ? [...curr, folgeId] : [folgeId],
        );
      },
      onSuccess: async () => {
        toast.success(
          <span>
            <i>{folgeName}</i> zur <MerklistenLink /> hinzugefügt
          </span>,
        );
        await utils.user.listWithFolgen.invalidate();
      },
    });

  const { mutate: mutateRemove, isLoading: removeIsLoading } =
    trpc.user.removeFromList.useMutation({
      onMutate: () => {
        utils.user.list.setData(undefined, (curr) =>
          curr ? curr.filter((id) => id !== folgeId) : [],
        );
      },
      onSuccess: async () => {
        toast(
          <span>
            <i>{folgeName}</i> von der <MerklistenLink /> entfernt
          </span>,
          { style: { backgroundColor: colors.red } },
        );
        await utils.user.listWithFolgen.invalidate();
      },
    });

  const isLoading = listLoading || addIsLoading || removeIsLoading;

  function handleClick() {
    if (!session) return signIn();

    if (!isOnUserList) {
      return mutateAdd({ folgeId });
    }

    return mutateRemove({ folgeId });
  }

  if (status === 'loading' || listLoading) {
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

function MerklistenLink() {
  return (
    <Link href="/profil/list" className="underline">
      Merkliste
    </Link>
  );
}