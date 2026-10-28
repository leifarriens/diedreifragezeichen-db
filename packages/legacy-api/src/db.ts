import { MongoClient, type MongoClientOptions } from "mongodb";

declare global {
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}
const uri = process.env.MONGODB_URI;

if (!uri) {
  throw new Error("MONGODB_URI must be configured");
}

const options: MongoClientOptions = {};

if (!uri) {
  throw new Error("Please add your Mongo URI to .env.local");
}

const client = new MongoClient(uri, options);
const clientPromise = client.connect();

export default clientPromise;
