import { ObjectId } from 'mongodb';

import clientPromise from '@/db/authConn';
import type { FolgeWithId } from '@/models/folge';
import { User } from '@/models/user';

export async function getUserWithList(userId: string) {
  return User.findById(userId).populate<{ list: FolgeWithId[] }>({
    path: 'list',
    options: { sort: ['updated_at'] },
  });
}

export async function deleteUser(userId: string) {
  const client = await clientPromise;
  const db = client.db(process.env.MONGO_DATABASE);

  const id = new ObjectId(userId);

  await db.collection('sessions').deleteMany({ userId: id });
  await db.collection('accounts').deleteOne({ userId: id });
  await db.collection('users').deleteOne({ _id: id });
}
