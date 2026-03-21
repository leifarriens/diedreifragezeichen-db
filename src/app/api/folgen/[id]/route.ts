import { Types } from 'mongoose';
import { unstable_cache } from 'next/cache';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { z } from 'zod';

import { PUBLIC_API_CACHE_CONFIG } from '@/constants/api-caching';
import { dbConnect } from '@/db/connect';
import { validateApikey } from '@/lib/validateApikey';
import { getFolge } from '@/services/folge.service';

const queryParamsSchema = z.object({
  apikey: z.string().uuid('Malformed apikey'),
});

async function fetchFolge(id: string) {
  await dbConnect();

  const folge = await getFolge(id);

  if (!folge || folge.isHidden) return null;

  return JSON.parse(JSON.stringify(folge)) as typeof folge;
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
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

  if (!Types.ObjectId.isValid(id)) {
    return new NextResponse('Not Found', { status: 404 });
  }

  const { apikey } = result.data;

  const apikeyError = await validateApikey(apikey);
  if (apikeyError) return apikeyError;

  const getCachedFolge = unstable_cache(() => fetchFolge(id), ['folge', id], {
    revalidate: PUBLIC_API_CACHE_CONFIG.server.revalidate,
    tags: ['folgen-list', `folge-${id}`],
  });

  const folge = await getCachedFolge();

  if (!folge) {
    return new NextResponse('Not Found', { status: 404 });
  }

  return NextResponse.json(folge, {
    headers: {
      'Cache-Control': PUBLIC_API_CACHE_CONFIG.cdn['Cache-Control'],
    },
  });
}
