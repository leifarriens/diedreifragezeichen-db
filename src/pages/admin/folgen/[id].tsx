import { zodResolver } from '@hookform/resolvers/zod';
import type { GetServerSidePropsContext } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import type { SubmitHandler } from 'react-hook-form';
import { useForm } from 'react-hook-form';
import { trpc } from 'utils/trpc';

import Button from '@/components/shared/Button';
import { Form, Input, Select, Textarea } from '@/components/shared/Input';
import { colors } from '@/constants/theme';
import dbConnect from '@/db/connect';
import { getServerAuthSesion } from '@/lib/getServerAuthSesion';
import type { Folge, FolgeWithId } from '@/models/folge';
import { folgeValidator } from '@/models/folge/folge.validator';
import { getFolge } from '@/services/folge.service';
import { parseMongo } from '@/utils/index';

const validator = folgeValidator.pick({
  name: true,
  type: true,
  number: true,
  spotify_id: true,
  deezer_id: true,
  inhalt: true,
});

export default function AdminFolge({ folge }: { folge: FolgeWithId }) {
  const router = useRouter();
  const { register, handleSubmit, formState, watch } = useForm<Folge>({
    defaultValues: {
      name: folge.name,
      type: folge.type,
      number: folge.number,
      spotify_id: folge.spotify_id,
      deezer_id: folge.deezer_id,
      inhalt: folge.inhalt,
    },
    resolver: zodResolver(validator),
    mode: 'all',
  });

  const onSubmit: SubmitHandler<Folge> = (data) =>
    mutate({ folgeId: folge._id, update: data });

  const type = watch('type');

  const { mutate, isLoading } = trpc.folge.update.useMutation({
    onSuccess: () => {
      router.push('/admin/folgen');
    },
  });

  const deleteMutation = trpc.folge.delete.useMutation({
    onSuccess: () => {
      router.replace('/admin/folgen');
    },
  });

  function handleDelete() {
    const confirm = prompt(
      'Löschen durch eingeben des Folgennames bestätigen.',
      '',
    );
    if (confirm === folge.name) deleteMutation.mutate({ folgeId: folge._id });
  }

  const isTouched = Object.keys(formState.touchedFields).length > 0;

  const cover = folge.images[1];

  return (
    <div className="relative mx-auto mt-24 w-full max-w-3xl p-8 pt-64">
      <div className="absolute left-0 top-0 flex w-full -translate-y-24 justify-center">
        <img
          src={cover.url}
          width={cover.width}
          height={cover.height}
          alt=""
          className="shadow-xl"
        />
      </div>
      <div className="absolute inset-0 -z-10 overflow-hidden rounded-xl">
        <div
          className="absolute inset-0 -z-10 bg-none bg-cover bg-no-repeat blur-3xl brightness-50"
          style={{ backgroundImage: `url(${folge.images[2].url})` }}
        />
      </div>

      <Form onSubmit={handleSubmit(onSubmit)}>
        <label>
          <span>Id</span>
          <Input defaultValue={folge._id} disabled />
        </label>
        <label>
          <span>Name</span>
          <Input type="text" {...register('name')} />
        </label>

        <label>
          <span>Type</span>
          <Select {...register('type')}>
            <option value="regular">regular</option>
            <option value="special">special</option>
          </Select>
        </label>

        {type === 'regular' && (
          <label>
            <span>Number</span>
            <Input type="text" {...register('number')} />
          </label>
        )}

        <label>
          <span>Spotify Id</span>
          <Input type="text" {...register('spotify_id')} />
        </label>

        <label>
          <span>Deezer Id</span>
          <Input type="text" {...register('deezer_id')} />
        </label>

        <label>
          <span>Inhalt</span>

          <Textarea
            {...register('inhalt')}
            // eslint-disable-next-line no-inline-styles/no-inline-styles
            style={{ height: '225px' }}
            spellCheck="true"
          />
        </label>

        {Object.keys(formState.errors).length !== 0 &&
          Object.entries(formState.errors).map(([name, value]) => (
            <div key={name} style={{ color: colors.red }}>
              <>
                <b>{name}</b>: {value.message}
              </>
            </div>
          ))}

        <div className="flex justify-end gap-2">
          <Link href={`/folge/${folge._id}`} target="_blank" legacyBehavior>
            <Button type="button" as="a">
              Öffnen
            </Button>
          </Link>

          <Button type="button" onClick={handleDelete} color={colors.red}>
            Löschen
          </Button>

          <Button type="submit" disabled={!isTouched || isLoading}>
            Speichern
          </Button>
        </div>
      </Form>
    </div>
  );
}

type Params = {
  id: string;
};

export async function getServerSideProps({
  req,
  res,
  params,
}: GetServerSidePropsContext) {
  await dbConnect();

  const session = await getServerAuthSesion(req, res);

  if (!session || session.user.role !== 'Admin') {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }

  const { id } = params as Params;

  const folge = await getFolge(id);

  if (!folge) return { notFound: true };

  return {
    props: {
      folge: parseMongo(folge),
    },
  };
}
