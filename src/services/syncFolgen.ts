import { ObjectId } from 'mongodb';

import { Folge as FolgeModel } from '@/models/folge';
import convertFolge from '@/utils/convertFolge';

import blacklist from '../../config/blacklist.json';
import { getAllInhalte } from './inhalt.service';
import * as DeezerApi from './streaming/deezer';
import * as SpotifyApi from './streaming/spotify';

export async function syncFolgen() {
  const allAlbums = await SpotifyApi.getAllAlbums();
  const dbFolgen = await FolgeModel.find({}).select('spotify_id');

  if (!allAlbums) {
    throw Error('Invalid item response from spotify');
  }

  const notInDbAlbums = allAlbums.filter((album) => {
    const isInDb = dbFolgen.find((folge) => folge.spotify_id === album.id);

    if (
      isInDb ||
      blacklist.includes(album.id) ||
      album.name.match(/liest|Kopfhörer/g)
    ) {
      return false;
    }
    return true;
  });

  const addToDb = notInDbAlbums.map((album) => convertFolge(album));

  await FolgeModel.deleteMany({ spotify_id: { $in: blacklist } });

  const result = await FolgeModel.insertMany(addToDb);

  return result;
}

export async function syncInhalte() {
  const inhalte = await getAllInhalte();

  const folgen = await FolgeModel.find({});

  const writes = folgen
    .filter((folge) => !folge.inhalt)
    .map((folge) => {
      const inhtaltExp = folge.name
        .replace('und', '')
        .replace('???', '')
        .trim();
      const inhalt = inhalte.find(({ name }) =>
        new RegExp(inhtaltExp, 'i').test(name),
      );

      return {
        updateOne: {
          filter: { _id: new ObjectId(folge._id) },
          update: {
            ...(inhalt && { inhalt: inhalt.body }),
          },
        },
      };
    });

  const result = FolgeModel.bulkWrite(writes);

  return result;
}

export async function syncDeezer() {
  const deezerAlbums = await DeezerApi.getAllAlbums();

  const folgen = await FolgeModel.find({});

  const writes = folgen
    .filter((folge) => !folge.deezer_id)
    .map((folge) => {
      const deezerAlbum = deezerAlbums.find((album) =>
        album.title
          .replaceAll(' ', '')
          .match(new RegExp(folge.name.replaceAll(' ', ''), 'i')),
      );

      return {
        updateOne: {
          filter: { _id: new ObjectId(folge._id) },
          update: {
            ...(deezerAlbum && { deezer_id: deezerAlbum.id }),
          },
        },
      };
    });

  const result = await FolgeModel.bulkWrite(writes);

  return result;
}
