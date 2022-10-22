import { GetServerSidePropsContext } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { getSession } from 'next-auth/react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useMutation } from 'react-query';

import Button from '@/components/shared/Button';
import { Form, Input, Select, Textarea } from '@/components/shared/Input';
import { colors } from '@/constants/theme';
import dbConnect from '@/db/connect';
import Wrapper from '@/layout/Wrapper';
import { FolgeWithId } from '@/models/folge';
import { deleteFolge, updateFolge } from '@/services/client';
import { getFolge } from '@/services/index';
import { parseMongo } from '@/utils/index';

type FormValues = {
  _id: string;
  name: string;
  number: string;
  type: string;
  inhalt: string;
};

export default function AdminFolge({ folge }: { folge: FolgeWithId }) {
  const router = useRouter();
  const { register, handleSubmit, formState } = useForm<FormValues>();
  const onSubmit: SubmitHandler<FormValues> = (data) => mutate(data);

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
        <input
          type="hidden"
          {...register('_id')}
          defaultValue={folge._id.toString()}
        />
        <label>
          <span>Name</span>
          <Input type="text" {...register('name')} defaultValue={folge.name} />
        </label>

        <label>
          <span>Number</span>
          <Input
            type="text"
            {...register('number')}
            defaultValue={folge.number}
          />
        </label>

        <label>
          <span>Type</span>
          <Select {...register('type')} defaultValue={folge.type}>
            <option value="regular">regular</option>
            <option value="special">special</option>
          </Select>
        </label>

        <label>
          <span>Inhalt</span>

          <Textarea
            {...register('inhalt')}
            // eslint-disable-next-line no-inline-styles/no-inline-styles
            style={{ height: '225px' }}
            defaultValue={folge.inhalt}
            spellCheck="true"
          />
        </label>

        <Button type="submit" disabled={!isTouched || isLoading}>
          Speichern
        </Button>
      </Form>

      <Link href={`/folge/${folge._id}`} target="_blank">
        <Button as="a">Öffnen</Button>
      </Link>

      <Button onClick={handleDelete} color={colors.red}>
        Löschen
      </Button>
    </Wrapper>
  );
}

type Params = {
  id: string;
};

export async function getServerSideProps({
  req,
  params,
}: GetServerSidePropsContext) {
  await dbConnect();

  const session = await getSession({ req });

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
