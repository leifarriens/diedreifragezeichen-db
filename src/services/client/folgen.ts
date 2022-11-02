import type { Folge, FolgeWithId } from '@/models/folge';
import { RatingWithId } from '@/models/rating';

import { API } from './';

export async function postUserRating({
  folgeId,
  value,
  body,
}: {
  folgeId: string;
  value: number;
  body?: string;
}) {
  const { data } = await API.post<RatingWithId>(`/folgen/${folgeId}/ratings`, {
    value,
    body,
  });
  return data;
}

export async function getAltFolgen(folgeId: string) {
  const { data } = await API.get<Folge[]>(`/folgen/${folgeId}/alts`, {
    params: {
      fields: 'images,name,rating,number_of_ratings',
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

export async function deleteFolge(folgeId: string) {
  const { data } = await API.delete(`/folgen/${folgeId}`);
  return data;
}

export const folge = {
  get: getFolge,
  update: updateFolge,
  delte: deleteFolge,
  ratings: {
    postRating: postUserRating,
  },
  alts: {
    get: getAltFolgen,
  },
};
