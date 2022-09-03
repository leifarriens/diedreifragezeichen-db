import Axios from 'axios';

import type { FolgeType, Rating, User } from '@/types';

const API = Axios.create({
  baseURL: '/api',
});

export async function getUserRatings() {
  const { data } = await API.get<Rating[]>('/user/ratings');
  return data;
}

export async function getUserRating(folgeId: string): Promise<number> {
  const { data } = await API.get<Rating>(`/folgen/${folgeId}/rating`);
  return data.value;
}

export async function postUserRating({
  folgeId,
  rating,
}: {
  folgeId: string;
  rating: number;
}): Promise<number> {
  const { data } = await API.post(`/folgen/${folgeId}/rating`, {
    rating,
  });
  return data.value;
}

export async function postFolgeList(folgeId: string): Promise<string> {
  const { data } = await API.post(`/user/list`, {
    folge: folgeId,
  });
  return data;
}

export async function removeFolgeList(folgeId: string): Promise<string> {
  const { data } = await API.delete(`/user/list/${folgeId}`);
  return data;
}

export async function getUser(): Promise<User> {
  const { data } = await API.get('/user');
  return data;
}

export async function getAltFolgen(folgeId: string) {
  const { data } = await API.get<FolgeType[]>(`/folgen/${folgeId}/alts`, {
    params: {
      fields: 'images',
    },
  });
  return data;
}
