import type { UpdateQuery } from 'mongoose';

import type { FolgeWithId } from '@/models/folge';
import { Folge } from '@/models/folge';
import { Rating } from '@/models/rating';

interface FolgenOptions {
  fields?: string[];
  limit?: number;
  showSpecials?: boolean;
}

export async function getAllFolgenIds() {
  return Folge.find({}).select('_id');
}

export async function getFolgen(options: FolgenOptions = {}) {
  const { fields = [], showSpecials = true } = options;

  const type = !showSpecials ? 'regular' : null;

  const folgen = await Folge.find({
    ...(type && { type }),
  })
    .select(fields)
    .sort('-release_date')
    .lean();

  return folgen;
}

export async function getFolge(folgeId: string, options: FolgenOptions = {}) {
  const { fields = [] } = options;

  const folge = await Folge.findById(folgeId).select(fields).lean();

  return folge;
}

export async function updateFolge(
  folgeId: string,
  update: UpdateQuery<Partial<FolgeWithId>>,
) {
  const folge = await Folge.findByIdAndUpdate(folgeId, update, {
    new: true,
  }).lean();

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
  const { fields = [], showSpecials = false, limit = 20 } = options;

  fields.push('release_date');

  const type = !showSpecials ? 'regular' : null;
  const current = await Folge.findById(id).select(fields).lean();

  if (!current) {
    throw Error('Folge not found');
  }

  const previous = await Folge.find({
    release_date: { $lt: current.release_date },
    type,
  })
    .sort({ release_date: -1 })
    .limit(limit / 2)
    .select(fields)
    .lean();

  const next = await Folge.find({
    release_date: { $gt: current.release_date },
    type,
  })
    .sort({ release_date: 1 })
    .limit(limit / 2)
    .select(fields)
    .lean();

  return [...previous.reverse(), current, ...next];
}
