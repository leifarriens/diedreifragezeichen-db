/* eslint-disable no-var */

/* only "var" works for global type */
declare global {
  var mongoose: typeof mongoose;
  var _mongoClientPromise: Promise<MongoClient>;
}

export {};
