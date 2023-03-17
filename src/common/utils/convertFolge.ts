import type { Folge } from '@/models/folge';
import type { SpotifyAlbum } from '@/types';

export default function convertFolge({
  name,
  images,
  id,
  release_date,
}: SpotifyAlbum) {
  const folge = {
    images,
    release_date,
    spotify_id: id,
  } as Folge;

  if (name.includes('/')) {
    folge.type = 'regular';
    folge.name = name.split('/')[1].trim();
  } else if (name.includes(':')) {
    folge.type = 'regular';
    folge.name = name.split(':')[1].trim();
  } else {
    folge.type = 'special';
    folge.name = name;
  }

  folge.number = name.match(/\d/g)?.join('') || '';

  return folge;
}
