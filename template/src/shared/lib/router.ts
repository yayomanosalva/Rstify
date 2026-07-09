// Router helpers
export function buildRedirectPath(path: string): string {
  return `/login?redirect=${encodeURIComponent(path)}`;
}
