// HMR helper for SSR dev mode
let serverInstance: any = null;

export function setServer(server: any) {
  serverInstance = server;
}

export function getServer() {
  return serverInstance;
}
