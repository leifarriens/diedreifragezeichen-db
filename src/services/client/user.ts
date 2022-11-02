import type { RatingWithId } from '@/models/rating';
import type { UserWithId } from '@/models/user';

import { API } from './';

export async function getUser() {
  const { data } = await API.get<UserWithId>('/user');
  return data;
}

export async function deleteAccount() {
  await API.delete('/user');
}

export async function getUserRatings() {
  const { data } = await API.get<RatingWithId[]>('/user/ratings');
  return data;
}

export async function getUserRating(folgeId: string) {
  const { data } = await API.get<RatingWithId>(`/user/ratings`, {
    params: { folgeId },
  });
  return data;
}

export async function postFolgeList(folgeId: string) {
  return API.post(`/user/list`, { folge: folgeId });
}

export async function removeFolgeList(folgeId: string) {
  return API.delete(`/user/list/${folgeId}`);
}

export const user = {
  get: getUser,
  delte: deleteAccount,
  ratings: {
    getAll: getUserRatings,
    getByFolge: getUserRating,
  },
  list: {
    addFolge: postFolgeList,
    delteFolge: removeFolgeList,
  },
};
