import { defineConfig } from 'vite';
import { resolve } from 'node:path';

const cleanRoutes = new Map([
  ['/home', '/index.html'],
  ['/about', '/about.html'],
  ['/services', '/services.html'],
  ['/contact', '/contact.html'],
  ['/thanks', '/thanks.html'],
]);

function cleanRoutePlugin() {
  function rewrite(request, _response, next) {
    if (!request.url || (request.method !== 'GET' && request.method !== 'HEAD')) return next();

    const url = new URL(request.url, 'http://localhost');
    const pathname = url.pathname.length > 1 ? url.pathname.replace(/\/+$/, '') : url.pathname;
    const file = cleanRoutes.get(pathname);
    if (file) {
      request.url = `${file}${url.search}`;
    } else if (pathname !== url.pathname) {
      request.url = `${pathname}${url.search}`;
    }
    next();
  }

  return {
    name: 'webliz-clean-routes',
    configureServer(server) {
      server.middlewares.use(rewrite);
    },
    configurePreviewServer(server) {
      server.middlewares.use(rewrite);
    },
  };
}

export default defineConfig({
  appType: 'mpa',
  plugins: [cleanRoutePlugin()],
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        home: resolve(import.meta.dirname, 'index.html'),
        about: resolve(import.meta.dirname, 'about.html'),
        services: resolve(import.meta.dirname, 'services.html'),
        contact: resolve(import.meta.dirname, 'contact.html'),
        thanks: resolve(import.meta.dirname, 'thanks.html'),
        notFound: resolve(import.meta.dirname, '404.html'),
      },
    },
  },
});
