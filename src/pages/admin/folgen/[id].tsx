import { zodResolver } from '@hookform/resolvers/zod';
import { GetServerSidePropsContext } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useMutation } from 'react-query';

import Button from '@/components/shared/Button';
import { Form, Input, Select, Textarea } from '@/components/shared/Input';
import { colors } from '@/constants/theme';
import dbConnect from '@/db/connect';
import Wrapper from '@/layout/Wrapper';
import { getServerSession } from '@/lib/getServerSession';
import type { Folge, FolgeWithId } from '@/models/folge';
import { folgeValidator } from '@/models/folge/folge.validator';
import { deleteFolge, updateFolge } from '@/services/client';
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
  });
  const onSubmit: SubmitHandler<Folge> = (data) =>
    mutate({ _id: folge._id.toString(), ...data });

  const type = watch('type');

  const { mutate, isLoading } = useMutation(updateFolge, {
    onSuccess: () => {
      router.push('/admin/folgen');
    },
  });

  const deleteMutation = useMutation(deleteFolge, {
    onSuccess: () => {
      router.replace('/admin/folgen');
    },
  });

  function handleDelete() {
    const confirm = prompt(
      'Löschen durch eingeben des Folgennames bestätigen.',
      '',
    );
    if (confirm === folge.name) deleteMutation.mutate(folge._id.toString());
  }

  const isTouched = Object.keys(formState.touchedFields).length > 0;

  return (
    <Wrapper maxWidth="720px">
      <Form onSubmit={handleSubmit(onSubmit)}>
        <label>
          <span>Id</span>
          <Input defaultValue={folge._id.toString()} disabled />
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

        <Button type="submit" disabled={!isTouched || isLoading}>
          Speichern
        </Button>
      </Form>

      <Link href={`/folge/${folge._id}`} target="_blank" legacyBehavior>
        <Button as="a">Öffnen</Button>
      </Link>

      <Button onClick={handleDelete} color={colors.red}>
        Löschen
      </Button>
      {JSON.stringify(formState.errors)}
    </Wrapper>
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

  const session = await getServerSession(req, res);

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
