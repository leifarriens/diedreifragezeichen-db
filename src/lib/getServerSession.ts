import {
  GetServerSidePropsContext,
  NextApiRequest,
  NextApiResponse,
} from 'next/types';
import { unstable_getServerSession } from 'next-auth/next';

import { authOptions } from '../pages/api/auth/[...nextauth]';

export function getServerSession(
  req: GetServerSidePropsContext['req'] | NextApiRequest,
  res: GetServerSidePropsContext['res'] | NextApiResponse,
) {
  return unstable_getServerSession(req, res, authOptions);
}
