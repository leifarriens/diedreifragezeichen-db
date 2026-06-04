import { revalidateTag } from 'next/cache';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { dbConnect } from '@/db/connect';
import {
  syncDetails,
  syncFolgen,
  syncFolgenDetails,
  syncWeblinks,
} from '@/services/sync.service';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string[] }> },
) {
  const authorization = request.headers.get('authorization');

  if (!authorization) {
    return new NextResponse('No App Key provided', { status: 401 });
  }

  const { CRON_SECRET } = process.env;
  const token = authorization.split(' ')[1];

  if (token !== CRON_SECRET) {
    return new NextResponse('Invalid App Key provided', { status: 401 });
  }

  const { slug } = await params;
  const [action, detailsSlug] = slug;

  try {
    await dbConnect();

    if (action === 'folgen') {
      const result = await syncFolgen();
      revalidateTag('folgen-list');
      return NextResponse.json(result);
    }

    if (action === 'inhalte') {
      return NextResponse.redirect(
        new URL('/api/sync/details', request.url),
        301,
      );
    }

    if (action === 'weblinks') {
      const result = await syncWeblinks();
      return NextResponse.json(result);
    }

    if (action === 'details') {
      if (detailsSlug) {
        const result = await syncFolgenDetails(detailsSlug);

        if (!result) {
          return new NextResponse(null, { status: 404 });
        }

        revalidateTag('folgen-list');
        return NextResponse.json(result);
      }

      const result = await syncDetails();
      revalidateTag('folgen-list');
      return NextResponse.json(result);
    }

    return new NextResponse(null, { status: 404 });
  } catch (err) {
    console.error(err);
    return new NextResponse(null, { status: 500 });
  }
}
