import { ObjectId } from "mongodb";

import type { LegacyFolge } from "./types";

import clientPromise from "./db";

export async function getAllFolgen(
  offset: number,
  limit: number,
  sort: string,
  query?: string,
) {
  const folgenCollection = await getFolgenCollection();

  const filter = {
    $and: [
      { isHidden: { $ne: true } },
      query
        ? {
            $or: [
              { name: { $options: "i", $regex: query } },
              { number: { $options: "i", $regex: query } },
            ],
          }
        : {},
    ],
  };

  console.log("SORT", sort);

  const total = await folgenCollection.countDocuments(filter);

  const folgen = await folgenCollection
    .find(filter)
    .sort(
      Object.fromEntries(
        sort
          .trim()
          .split(/\s+/)
          .filter(Boolean)
          .map((field) => [
            field.replace(/^[+-]/, ""),
            field.startsWith("-") ? -1 : 1,
          ]),
      ),
    )
    .skip(offset)
    .limit(limit)
    .toArray();

  return { folgen, total };
}

export async function getFolgeByMongoId(uuid: string) {
  const folgenCollection = await getFolgenCollection();

  const folge = await folgenCollection.findOne({ _id: new ObjectId(uuid) });

  if (!folge || folge.isHidden) return null;

  return folge;
}

async function getFolgenCollection() {
  const client = await clientPromise;
  return client.db().collection<LegacyFolge>("folgen");
}
