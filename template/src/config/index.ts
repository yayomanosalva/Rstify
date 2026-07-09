import { z } from 'zod';

export { ASSETS } from './constants';

const loadEnvConfig = (): Record<string, any> => {
  if (typeof window !== 'undefined') {
    return (window as any).__APP_ENV__ || {};
  }
  return { ...process.env } as Record<string, any>;
};

const config: Record<string, any> = loadEnvConfig();

const serverSchema = z.object({
  port: z.coerce.number().default(9400),
}).strict();

const clientSchema = z.object({
  apiUrl: z.string().default('/api/v1'),
  apiDomain: z.string().url().optional(),
  env: z.enum(['development', 'production', 'test']).default('development'),
  assetsUrl: z.string().default('/static/'),
}).strict();

const serverConfigResult = serverSchema.safeParse({
  port: Number.parseInt(String(config.FRONTEND_PORT || 9400), 10),
});

const clientConfigResult = clientSchema.safeParse({
  apiUrl: config.ROOT_PUBLIC_API_URL || '/api/v1',
  apiDomain: config.API_DOMAIN,
  env: (config.NODE_ENV || 'development') as ClientConfig['env'],
  assetsUrl: config.ROOT_PUBLIC_ASSETS_URL,
});

export const serverConfig = serverConfigResult.success
  ? serverConfigResult.data
  : { port: 9400 };

export const clientConfig = clientConfigResult.success
  ? clientConfigResult.data
  : { apiUrl: '/api/v1', apiDomain: undefined, env: 'development', assetsUrl: '/static/' };

if (clientConfig.env === 'production' && !clientConfig.apiDomain) {
  throw new Error('API_DOMAIN is required in production');
}

export const apiUrl = clientConfig.apiUrl;
export const apiDomain = clientConfig.apiDomain || '';
export const isDevelopment = clientConfig.env === 'development';
export const isProduction = clientConfig.env === 'production';
export const port = serverConfig.port;
export type ServerConfig = z.infer<typeof serverSchema>;
export type ClientConfig = z.infer<typeof clientSchema>;

export const API_VERSION = 'v1';

type ApiService = 'auth' | 'api';

export function buildApiUrl(service: ApiService): string {
  const path = `/api/${API_VERSION}/${service}`;
  if (apiDomain) return `${apiDomain}${path}`;
  if (typeof window !== 'undefined') return `${window.location.origin}${path}`;
  return path;
}
