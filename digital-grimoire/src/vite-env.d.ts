/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_ROLES_API_URL: string
    readonly VITE_WEBSOCKET_SERVER: string
}

interface ImportMeta {
    readonly env: ImportMetaEnv
}