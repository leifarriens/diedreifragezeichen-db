import Axios from 'axios';

import type { Folge, FolgeWithId } from '@/models/folge';
import type { Rating } from '@/models/rating';
import type { UserWithId } from '@/models/user';

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
}) {
  const { data } = await API.post<{ value: number }>(
    `/folgen/${folgeId}/rating`,
    {
      rating,
    },
  );
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

export async function getUser() {
  const { data } = await API.get<UserWithId>('/user');
  return data;
}

export async function getAltFolgen(folgeId: string) {
  const { data } = await API.get<Folge[]>(`/folgen/${folgeId}/alts`, {
    params: {
      fields: 'images,name,community_rating,number_of_community_ratings',
    },
  });
  return data;
}

// Admin

export async function getFolge(folgeId: string) {
  const { data } = await API.get<Folge>(`/folgen/${folgeId}`);
  return data;
}

export async function updateFolge(folge: Partial<FolgeWithId>) {
  const { data } = await API.patch<Folge>(`/folgen/${folge._id}`, folge);
  return data;
}
