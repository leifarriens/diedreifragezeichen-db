import type { Folge } from '@/models/folge';
import { SpotifyFolge } from '@/types';

export default function convertFolge({
  name,
  images,
  id,
  release_date,
}: SpotifyFolge) {
  const folge = {
    images,
    release_date,
    spotify_id: id,
  } as Folge;

  if (name.includes('/')) {
    folge.type = 'regular';
    // folge.number = name.split('/')[0];
    folge.name = name.split('/')[1].trim();
  } else if (name.includes(':')) {
    folge.type = 'regular';
    // folge.number = name.split(':')[0];
    folge.name = name.split(':')[1].trim();
  } else {
    folge.type = 'special';
    // folge.number = '';
    folge.name = name;
  }

  folge.number = name.match(/\d/g)?.join('') || '';

  return folge;
}
