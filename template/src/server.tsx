import { join } from 'path';
import { isDevelopment, serverConfig } from '@/config';
import type { ServerWebSocket } from 'bun';
import { config } from 'dotenv';
import { setServer } from './shared/lib/hmr';
import { logger } from './shared/utils/logger';

config({ path: join(process.cwd(), '../../.env') });

const PORT = Number(process.env['FRONTEND_PORT']) || 9400;
const IS_DEV = isDevelopment;

const wsClients = new Set<ServerWebSocket>();
const wsHandler = IS_DEV
  ? {
      message(ws: ServerWebSocket, message: string | Buffer) {
        if (message === 'ping') ws.send('pong');
      },
      open(ws: ServerWebSocket) {
        wsClients.add(ws);
        logger.info('[HMR] Client connected');
      },
      close(ws: ServerWebSocket) {
        wsClients.delete(ws);
        logger.info('[HMR] Client disconnected');
      },
    }
  : undefined;

function getContentType(pathname: string): string {
  if (pathname.endsWith('.css')) return 'text/css';
  if (pathname.endsWith('.js')) return 'application/javascript';
  if (pathname.endsWith('.json')) return 'application/json';
  if (pathname.endsWith('.png')) return 'image/png';
  if (pathname.endsWith('.jpg') || pathname.endsWith('.jpeg')) return 'image/jpeg';
  if (pathname.endsWith('.svg')) return 'image/svg+xml';
  return 'application/octet-stream';
}

async function handleRequest(request: Request, server: any) {
  const url = new URL(request.url);
  const pathname = url.pathname;

  if (
    pathname.startsWith('/static/') ||
    pathname.startsWith('/assets/') ||
    pathname.match(/\.(ico|png|jpg|jpeg|svg|webmanifest|css)$/)
  ) {
    try {
      let filePath: string;
      if (pathname.startsWith('/static/')) {
        const assetPath = pathname.replace(/^\/static\//, '');
        filePath = join(process.cwd(), 'dist', 'static', assetPath);
      } else {
        filePath = join(process.cwd(), 'dist', pathname);
      }

      const file = Bun.file(filePath);
      if (await file.exists()) {
        return new Response(file, {
          headers: {
            'Content-Type': getContentType(pathname),
            'Cache-Control': IS_DEV ? 'no-cache' : 'public, max-age=31536000',
          },
        });
      }
      return new Response('Not Found', { status: 404 });
    } catch {
      return new Response('Not Found', { status: 404 });
    }
  }

  if (pathname.startsWith('/api')) {
    const backendBase = process.env.ROOT_PUBLIC_API_URL;
    if (!backendBase) {
      return new Response(JSON.stringify({ error: 'API backend not configured' }), {
        status: 502,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    try {
      const target = `${backendBase.replace(/\/$/, '')}${pathname}${url.search}`;
      const forwardedHeaders = new Headers(request.headers);
      forwardedHeaders.set('x-forwarded-host', request.headers.get('host') || '');

      const resp = await fetch(target, {
        method: request.method,
        headers: forwardedHeaders,
        body: request.body,
        redirect: 'manual',
      });

      return new Response(resp.body, {
        status: resp.status,
        statusText: resp.statusText,
        headers: new Headers(resp.headers),
      });
    } catch (err) {
      logger.error('Error proxying API request:', err);
      return new Response(JSON.stringify({ error: 'Proxy error' }), {
        status: 502,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  }

  if (IS_DEV && pathname === '/__hmr') {
    const upgrade = request.headers.get('upgrade');
    if (upgrade?.toLowerCase() === 'websocket') {
      return new Response(null, { status: 101 });
    }
  }

  if (IS_DEV) {
    setServer(server);
  }

  const indexHtmlPath = join(process.cwd(), 'dist', 'index.html');
  const indexHtmlFile = Bun.file(indexHtmlPath);

  if (await indexHtmlFile.exists()) {
    let htmlContent = await indexHtmlFile.text();

    const clientEnvJson = JSON.stringify({
      ROOT_PUBLIC_API_URL: process.env.ROOT_PUBLIC_API_URL,
      ROOT_PUBLIC_ENV: process.env.ROOT_PUBLIC_ENV,
      NODE_ENV: process.env.NODE_ENV,
      FRONTEND_PORT: process.env['FRONTEND_PORT'],
    });

    const envPlaceholder = 'window.__APP_ENV__';
    if (htmlContent.includes(envPlaceholder)) {
      htmlContent = htmlContent.replace(
        `"${envPlaceholder} = {}"`,
        `"${envPlaceholder} = ${clientEnvJson}"`,
      );
    }

    return new Response(htmlContent, {
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': IS_DEV ? 'no-cache' : 'public, max-age=3600',
      },
    });
  }

  logger.error('[Server] index.html not found!');
  return new Response('Not Found', { status: 404 });
}

const server = IS_DEV && wsHandler
  ? Bun.serve({ port: PORT, development: IS_DEV, websocket: wsHandler, fetch: handleRequest })
  : Bun.serve({ port: PORT, development: IS_DEV, fetch: handleRequest });

logger.info(`Server ready at http://localhost:${server.port}`);

export { server };
