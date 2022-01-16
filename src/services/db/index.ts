import Folge from '../../models/folge';
import Rating from '../../models/rating';
import { FolgeType } from '../../types';

export async function getNextFolgen(
  refFolge: FolgeType,
  field: string
): Promise<FolgeType[]> {
  return await Folge.find({
    [field]: { $gt: refFolge[field] },
  })
    .sort({ release_date: 1 })
    .limit(6);
}

export async function getPreviousFolgen(
  refFolge: FolgeType,
  field: string
): Promise<FolgeType[]> {
  return await Folge.find({
    [field]: { $lt: refFolge[field] },
  })
    .sort({ release_date: -1 })
    .limit(6);
}
