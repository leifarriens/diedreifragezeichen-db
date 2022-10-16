declare global {
  namespace NodeJS {
    interface ProcessEnv {
      SPOTIFY_CLIENT_ID: string;
      SPOTIFY_CLIENT_SECRET: string;
      GOOGLE_CLIENT_ID: string;
      GOOGLE_CLIENT_SECRET: string;
      MONGO_URI: string;
      MONGO_DATABASE: string;
    }
  }
}

/**
 * If this file has no import/export statements (i.e. is a script)
 * convert it into a module by adding an empty export statement
 */
export {};
