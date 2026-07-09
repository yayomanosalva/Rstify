export const ASSETS = {
  IMAGES: {
    LOGO: '/assets/img/logo.png',
  },
  FAVICONS: {
    FAVICON_ICO: '/assets/img/favicon/favicon.ico',
    FAVICON_16: '/assets/img/favicon/favicon-16x16.png',
    FAVICON_32: '/assets/img/favicon/favicon-32x32.png',
    APPLE_TOUCH: '/assets/img/favicon/apple-touch-icon.png',
  },
} as const;

export type AssetPaths = typeof ASSETS;

export interface NavItem {
  label: string;
  href: string;
  children?: NavItem[];
}

export const NAV_ITEMS: NavItem[] = [
  { label: 'Home', href: '/' },
  { label: 'Dashboard', href: '/dashboard' },
  { label: 'Users', href: '/users' },
];
