import { NextResponse } from 'next/server';

import { dbConnect } from '@/db/connect';
import { Apikey } from '@/models/apikey';

export async function validateApikey(apikey: string) {
  await dbConnect();

  const exists = await Apikey.findOne({ token: apikey });

  if (!exists) {
    return NextResponse.json(
      { errors: { apikey: 'Invalid apikey' } },
      { status: 403 },
    );
  }

  return null;
}
