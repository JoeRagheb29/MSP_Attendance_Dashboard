// Lightweight Vite env types to avoid requiring the dev-only `vite` types during CI/builds.
declare interface ImportMetaEnv {
  readonly VITE_API_BASE?: string;
}

declare interface ImportMeta {
  readonly env: ImportMetaEnv;
}

// Allow importing static assets and CSS in TSX files
declare module '*.png'
declare module '*.jpg'
declare module '*.jpeg'
declare module '*.svg'
declare module '*.css'
