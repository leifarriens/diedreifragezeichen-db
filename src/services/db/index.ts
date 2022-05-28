import Folge from '../../models/folge';

import type { FolgeType } from '../../types';

export async function getNextFolgen(
  refFolge: FolgeType,
  field: string
): Promise<FolgeType[]> {
  return await Folge.find({
    [field]: { $gt: refFolge[field as keyof typeof refFolge] },
  })
    .sort({ release_date: 1 })
    .limit(6);
}

export async function getPreviousFolgen(
  refFolge: FolgeType,
  field: string
): Promise<FolgeType[]> {
  return await Folge.find({
    [field]: { $lt: refFolge[field as keyof typeof refFolge] },
  })
    .sort({ release_date: -1 })
    .limit(6);
}
