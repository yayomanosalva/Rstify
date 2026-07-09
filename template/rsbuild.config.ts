import { defineConfig } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';

export default defineConfig({
  plugins: [
    pluginReact({
      fastRefresh: true,
    }),
  ],

  server: {
    port: Number(process.env.FRONTEND_PORT) || Number(process.env.PORT) || 3000,
    host: '0.0.0.0',
    proxy: {
      '/api/v1': {
        target: 'http://localhost:4000',
        changeOrigin: true,
      },
    },
  },

  output: {
    distPath: {
      root: 'dist',
      js: 'static/js',
      css: 'static/css',
    },
    assetPrefix: '/',
    target: 'web',
    filenameHash: false,
  },

  html: {
    title: 'App',
  },

  source: {
    entry: {
      index: './src/index.tsx',
    },
    define: {
      'process.env.NODE_ENV': JSON.stringify(
        process.env.NODE_ENV || 'development',
      ),
      'process.env.ROOT_PUBLIC_API_URL': JSON.stringify(
        process.env.ROOT_PUBLIC_API_URL || '/api/v1',
      ),
    },
  },

  resolve: {
    alias: {
      '@': './src',
      '@app': './src/app',
      '@lib': './src/shared/lib',
      '@shared': './src/shared',
      '@features': './src/features',
      '@components': './src/shared/components',
      '@styles': './src/shared/styles',
      '@utils': './src/shared/utils',
      '@hooks': './src/shared/hooks',
      '@config': './src/config',
    },
  },

  environments: {
    web: {
      source: {
        entry: {
          index: './src/index.tsx',
        },
      },
      output: {
        target: 'web',
      },
      resolve: {
        alias: {
          '~': './src',
        },
      },
    },
    server: {
      source: {
        entry: {
          server: './src/server.tsx',
        },
      },
      output: {
        target: 'node',
        distPath: {
          root: 'dist',
          js: '',
        },
      },
      resolve: {
        alias: {
          '~': './src',
        },
      },
    },
  },
});
