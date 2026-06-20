declare namespace NodeJS {
  interface ProcessEnv {
    NEXT_PUBLIC_GOOGLE_MAPS_API_KEY?: string;
    NEXT_PUBLIC_SIMULATOR_URL?: string;
    DATABASE_URL?: string;
  }
}

declare const process: {
  env: NodeJS.ProcessEnv;
};
