// خفيف وآمن لبناء الإنتاج — لا يعتمد على vite/client types الخارجية
interface ImportMetaEnv {
  readonly VITE_API_BASE?: string;
  readonly VITE_OTHER?: string;
  // add other VITE_ vars you use
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

// declarations for static imports to avoid TS errors during build
declare module '*.png';
declare module '*.jpg';
declare module '*.jpeg';
declare module '*.svg';
declare module '*.css';