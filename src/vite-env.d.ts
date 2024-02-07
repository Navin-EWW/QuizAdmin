/// <reference types="vite/client" />
interface ImportMetaEnv {
  readonly VITE_REACT_APP_BACKEND_URL: string;
  readonly VITE_REACT_APP_ENV: string;
  readonly VITE_S3_LINK: string;
  // more env variables...
  readonly node: string;
  readonly env: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
