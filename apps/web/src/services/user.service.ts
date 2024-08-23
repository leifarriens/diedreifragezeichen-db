import { ObjectId } from 'mongodb';

import { clientPromise } from '@/db/authConn';

export async function deleteUser(userId: string) {
  const client = await clientPromise;

  if (!client) {
    throw new Error('DB cline unexpectedly null');
  }

  const db = client.db(process.env.MONGO_DATABASE);

  const id = new ObjectId(userId);

  await db.collection('sessions').deleteMany({ userId: id });
  await db.collection('accounts').deleteOne({ userId: id });
  await db.collection('users').deleteOne({ _id: id });
}
