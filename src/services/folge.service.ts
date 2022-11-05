import { UpdateQuery } from 'mongoose';

import { Folge, FolgeWithId } from '@/models/folge';
import { Rating } from '@/models/rating';

type FolgenOptions = {
  fields?: string[];
  limit?: number;
  specials?: boolean;
};

export async function getAllFolgenIds() {
  return Folge.find({}).select('_id');
}

export async function getFolgen(options: FolgenOptions = {}) {
  const { fields = [], specials = true } = options;

  const type = !specials ? 'regular' : null;

  const folgen = await Folge.find({
    ...(type && { type }),
  })
    .select(fields)
    .sort('-release_date');

  return folgen;
}

export async function getFolge(folgeId: string, options: FolgenOptions = {}) {
  const { fields = [] } = options;

  const folge = await Folge.findById(folgeId).select(fields);

  return folge;
}

export async function updateFolge(
  folgeId: string,
  update: UpdateQuery<Partial<FolgeWithId>>,
) {
  const folge = await Folge.findByIdAndUpdate(folgeId, update, { new: true });

  return folge;
}

export async function deleteFolge(folgeId: string) {
  await Rating.deleteMany({ folge: folgeId });

  return Folge.deleteOne({ _id: folgeId });
}

export async function getRelatedFolgen(
  id: string,
  options: FolgenOptions = {},
) {
  const { fields = [], specials = false, limit = 20 } = options;

  fields.push('release_date');

  const type = !specials ? 'regular' : null;
  const current = await Folge.findById(id).select(fields);

  if (!current) {
    throw Error('Folge not found');
  }

  const previous = await Folge.find({
    release_date: { $lt: current.release_date },
    type,
  })
    .sort({ release_date: -1 })
    .limit(limit / 2)
    .select(fields);

  const next = await Folge.find({
    release_date: { $gt: current.release_date },
    type,
  })
    .sort({ release_date: 1 })
    .limit(limit / 2)
    .select(fields);

  return [...previous.reverse(), current, ...next];
}
