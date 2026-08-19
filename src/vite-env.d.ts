/// <reference types="vite/client" />

interface Window {
  projectNoir?: {
    getAppInfo: () => Promise<{
      name: string;
      version: string;
      platform: string;
    }>;
  };
}
