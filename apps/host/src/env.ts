export const env = {
  isDev: import.meta.env.DEV,
  isProd: import.meta.env.PROD,
  mode: import.meta.env.MODE,

  baseUrl: import.meta.env.BASE_URL,

  apiBaseUrl: import.meta.env.VITE_API_BASE_URL,

  // MF Remote 地址
  webRemoteEntry: import.meta.env.VITE_WEB_REMOTE_ENTRY,
};
