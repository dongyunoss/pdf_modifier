// 테스트용 정적 서버: dist/ 를 배포 환경(Cloudflare)처럼 내보냅니다.
// astro preview 는 public/_headers 를 읽지 않아, Word·PPT 변환 화면과 엔진(보조 스레드 포함)에 필요한
// 교차 출처 격리 헤더를 붙이지 못하므로 E2E 테스트는 이 서버를 씁니다.  node scripts/serve-dist.mjs [포트]
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';

const dist = fileURLToPath(new URL('../dist/', import.meta.url));
const port = Number(process.argv[2] ?? 4321);
const TYPES = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.mjs': 'text/javascript', '.css': 'text/css',
  '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png', '.txt': 'text/plain; charset=utf-8',
  '.xml': 'application/xml', '.wasm': 'application/wasm', '.bcmap': 'application/octet-stream', '.pfb': 'application/octet-stream',
};

/** public/_headers 의 규칙 중 변환에 필요한 것 */
function headersFor(path) {
  if (/^\/([a-z-]+\/)?convert\//.test(path)) {
    return { 'Cross-Origin-Opener-Policy': 'same-origin', 'Cross-Origin-Embedder-Policy': 'require-corp' };
  }
  if (path.startsWith('/office/engine/')) {
    return { 'Cross-Origin-Resource-Policy': 'same-origin', 'Cross-Origin-Embedder-Policy': 'require-corp' };
  }
  return {};
}

async function resolve(path) {
  const file = normalize(join(dist, path));
  if (!file.startsWith(dist)) return null;
  try {
    const info = await stat(file);
    if (info.isDirectory()) return resolve(join(path, 'index.html'));
    return file;
  } catch {
    return null;
  }
}

createServer(async (req, res) => {
  const path = decodeURIComponent(new URL(req.url ?? '/', 'http://x').pathname);
  const file = await resolve(path);
  if (!file) {
    res.writeHead(404, { 'Content-Type': TYPES['.html'] }).end(await readFile(join(dist, '404.html')).catch(() => 'Not found'));
    return;
  }
  res.writeHead(200, { 'Content-Type': TYPES[extname(file)] ?? 'application/octet-stream', ...headersFor(path) });
  res.end(req.method === 'HEAD' ? undefined : await readFile(file));
}).listen(port, () => console.log(`serving dist on http://localhost:${port}`));
