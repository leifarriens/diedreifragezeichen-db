import {
  GetServerSidePropsContext,
  NextApiRequest,
  NextApiResponse,
} from 'next/types';
import { getServerSession } from 'next-auth/next';

import { authOptions } from '../pages/api/auth/[...nextauth]';

export function getServerAuthSesion(
  req: GetServerSidePropsContext['req'] | NextApiRequest,
  res: GetServerSidePropsContext['res'] | NextApiResponse,
) {
  return getServerSession(req, res, authOptions);
}
