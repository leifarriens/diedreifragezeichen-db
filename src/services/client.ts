import Axios from 'axios';

import type { FolgeType, Rating } from '@/types';

const API = Axios.create({
  baseURL: '/api',
});

export async function getUserRatings() {
  const { data } = await API.get<Rating[]>('/user/ratings');
  return data;
}

export async function getUserRating(folgeId: string): Promise<number> {
  const { data } = await API.get(`/folgen/${folgeId}/rating`);
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

export async function getAltFolgen(folgeId: string) {
  const { data } = await API.get<FolgeType[]>(`/folgen/${folgeId}/alts`, {
    params: {
      fields: 'images',
    },
  });
  return data;
}
