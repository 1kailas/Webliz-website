import { copyFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const files = ['_headers', 'robots.txt', 'sitemap.xml'];

await Promise.all(files.map((file) => copyFile(resolve(root, file), resolve(root, 'dist', file))));
await copyFile(resolve(root, 'dist', 'index.html'), resolve(root, 'dist', 'home.html'));
