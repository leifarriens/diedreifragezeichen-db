import * as Dialog from '@radix-ui/react-dialog';
import classNames from 'classnames';
import type { FormEvent } from 'react';
import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { FiCopy, FiTrash } from 'react-icons/fi';

import { Button, Input } from '@/common/components/shared';
import { colors } from '@/constants/theme';
import { trpc } from '@/utils/trpc';

import dayjs from '../../lib/dayjs';

export function Apikey() {
  const apiKeysQuery = trpc.user.apikeys.useQuery();
  const utils = trpc.useUtils();

  const deleteMutation = trpc.user.deleteApikey.useMutation({
    async onSuccess() {
      toast.error('API key entfernt');
      await utils.user.apikeys.refetch();
    },
  });

  async function handleCopyClick(token: string) {
    await navigator.clipboard.writeText(token);
    toast('API in im clipboard gespeichert');
  }

  function handleDeleteClick(keyId: string) {
    deleteMutation.mutate({ keyId });
  }

  return (
    <>
      <div className="mb-6 flex w-full items-center gap-2">
        <table
          className={classNames('table-auto text-left text-sm', {
            'pointer-events-none opacity-50': apiKeysQuery.isFetching,
          })}
        >
          <thead className="uppercase">
            <tr className="border-b border-b-slate-700">
              <th className="px-4 py-2">name</th>
              <th className="px-4 py-2">key</th>
              <th className="px-4 py-2">erstellt</th>
            </tr>
          </thead>
          <tbody>
            {apiKeysQuery.data?.map((key) => (
              <tr key={key.token} className="border-b border-b-slate-700">
                <td className="px-4 py-2">{key.name}</td>
                <td className="px-4 py-2">{key.token}</td>
                <td className="px-4 py-2">
                  {dayjs(key.created_at).format('D MMM YYYY')}
                </td>
                <td className="flex gap-x-2 px-4 py-2">
                  <button
                    type="button"
                    onClick={() => handleDeleteClick(key._id.toString())}
                  >
                    <FiTrash size={18} />
                  </button>
                  {!key.token.includes('.') && (
                    <button
                      type="button"
                      onClick={() => handleCopyClick(key.token)}
                    >
                      <FiCopy size={18} />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <CreateDialog />
    </>
  );
}

function CreateDialog() {
  const [name, setName] = useState('');
  const utils = trpc.useUtils();

  const createApikeyMutation = trpc.user.createApikey.useMutation({
    async onSuccess() {
      toast('Neuer API key generiert');
      await utils.user.apikeys.refetch();
    },
  });

  function handleCreate(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    createApikeyMutation.mutate(
      { name },
      {
        onSuccess() {
          setName('');
        },
      },
    );
  }

  async function handleCopyClick(token: string) {
    await navigator.clipboard.writeText(token);
    toast('API in im clipboard gespeichert');
  }

  function reset() {
    setName('');
    createApikeyMutation.reset();
  }

  return (
    <Dialog.Root onOpenChange={(open) => !open && reset()}>
      <Dialog.Trigger asChild>
        <Button color={colors.lightblue}>Generieren</Button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black opacity-40" />
        <Dialog.Content className="fixed left-[50%] top-[50%] max-h-[85vh] w-[90vw] max-w-[480px] translate-x-[-50%] translate-y-[-50%] rounded-xl bg-black p-8 focus:outline-none">
          <Dialog.Title className="mb-2 text-lg font-semibold">
            Neuen API key generieren
          </Dialog.Title>
          {!createApikeyMutation.isSuccess ? (
            <form onSubmit={handleCreate}>
              <label>
                <span className="text-sm">Name</span>
                <Input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </label>

              <div className="flex justify-end gap-4 pt-4">
                <Dialog.Close asChild>
                  <Button type="button" aria-label="Close">
                    Abbrechen
                  </Button>
                </Dialog.Close>
                <Button
                  type="submit"
                  color={colors.lightblue}
                  disabled={createApikeyMutation.isLoading}
                >
                  API key erstellen
                </Button>
              </div>
            </form>
          ) : (
            <>
              <div className="flex gap-2">
                <Input value={createApikeyMutation.data.token} readOnly />
                <Button
                  color={colors.lightblue}
                  onClick={() =>
                    handleCopyClick(createApikeyMutation.data.token)
                  }
                >
                  <FiCopy />
                </Button>
              </div>
              <div className="flex justify-end pt-4">
                <Dialog.Close asChild>
                  <Button color={colors.lightblue}>Fertig</Button>
                </Dialog.Close>
              </div>
            </>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
