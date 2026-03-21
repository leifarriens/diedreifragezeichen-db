import { unstable_cache } from 'next/cache';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { z } from 'zod';

import { PUBLIC_API_CACHE_CONFIG } from '@/constants/api-caching';
import { dbConnect } from '@/db/connect';
import { validateApikey } from '@/lib/validateApikey';
import { Folge } from '@/models/folge';

const queryParamsSchema = z.object({
  offset: z.coerce.number().min(0).default(0),
  limit: z.coerce.number().min(1).max(20).default(20),
  sort: z
    .enum(['release_date', '-release_date', 'rating', '-rating'])
    .default('-release_date'),
  apikey: z.string().uuid('Malformed apikey'),
  query: z.string().optional(),
});

async function fetchFolgen(
  offset: number,
  limit: number,
  sort: string,
  query?: string,
) {
  await dbConnect();

  const filter = {
    $and: [
      { isHidden: { $ne: true } },
      query
        ? {
            $or: [
              { name: { $regex: query, $options: 'i' } },
              { number: { $regex: query, $options: 'i' } },
            ],
          }
        : {},
    ],
  };

  const total = await Folge.countDocuments(filter);

  const folgen = await Folge.find(filter).sort(sort).skip(offset).limit(limit);

  return {
    items: JSON.parse(JSON.stringify(folgen)) as typeof folgen,
    limit,
    offset,
    total,
  };
}

export async function GET(request: NextRequest) {
  const searchParams = Object.fromEntries(request.nextUrl.searchParams);
  const result = queryParamsSchema.safeParse(searchParams);

  if (!result.success) {
    const isUnauthorized = !!result.error.errors.find(({ path }) =>
      path.includes('apikey'),
    );

    return NextResponse.json(
      {
        errors: Object.fromEntries(
          result.error.issues.map(({ path, message }) => [
            path.join('.'),
            message,
          ]),
        ),
      },
      { status: isUnauthorized ? 401 : 400 },
    );
  }

  const { apikey, offset, limit, sort, query } = result.data;

  const apikeyError = await validateApikey(apikey);
  if (apikeyError) return apikeyError;

  const getCachedFolgen = unstable_cache(
    () => fetchFolgen(offset, limit, sort, query),
    ['folgen-list', String(offset), String(limit), sort, query ?? ''],
    {
      revalidate: PUBLIC_API_CACHE_CONFIG.server.revalidate,
      tags: ['folgen-list'],
    },
  );

  const data = await getCachedFolgen();

  return NextResponse.json(data, {
    headers: {
      'Cache-Control': PUBLIC_API_CACHE_CONFIG.cdn['Cache-Control'],
    },
  });
}
