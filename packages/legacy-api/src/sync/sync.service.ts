import type { LegacyFolge } from "../types";

import clientPromise from "../db";
import * as SpotifyApi from "./spotify";
import ignorelist from "./spotify-ignore.json";

export function convertFolge({
  id,
  images,
  name,
  release_date,
}: SpotifyApi.SpotifyAlbum) {
  const folge = {
    images,
    release_date,
    spotify_id: id,
  } as LegacyFolge;

  if (name.includes("/")) {
    folge.type = "regular";
    folge.name = name.split("/")[1]?.trim() ?? "";
  } else if (name.includes(":")) {
    folge.type = "regular";
    folge.name = name.split(":")[1]?.trim() ?? "";
  } else {
    folge.type = "special";
    folge.name = name;
  }

  folge.number = name.match(/\d/g)?.join("") ?? "";

  return folge;
}

/**
 * The `syncFolgen` service adds all folgen from the spotify api
 * that are not in the ddfdb.
 */
export async function syncFolgen() {
  const allAlbums = await SpotifyApi.getAllAlbums();
  const client = await clientPromise;

  const db = client.db("test");

  const dbFolgen = await db
    .collection<LegacyFolge>("folgen")
    .find()
    // TODO only select the spotify_id field
    // .project({ spotify_id: 1 }) does this do it?
    .toArray();

  const notInDbAlbums = allAlbums.filter((album) => {
    const isInDb = dbFolgen.find((folge) => folge.spotify_id === album.id);

    if (
      isInDb ||
      ignorelist.includes(album.id) ||
      album.name.match(/liest|Kopfhörer/g)
    ) {
      return false;
    }
    return true;
  });

  const addToDb = notInDbAlbums.map((album) => convertFolge(album));

  await db.collection<LegacyFolge>("folgen").deleteMany({
    spotify_id: { $in: ignorelist },
  });

  if (addToDb.length === 0) {
    return { insertedCount: 0, insertedIds: {} };
  }

  const result = await db.collection<LegacyFolge>("folgen").insertMany(addToDb);

  return result;
}
