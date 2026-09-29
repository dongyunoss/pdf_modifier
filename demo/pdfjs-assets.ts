// claude.ai 아티팩트는 .bcmap·.pfb 같은 바이너리 형식을 제공하지 않으므로, 체험판 빌드(scripts/build-demo.mjs)가
// 이 파일들을 base64 텍스트(<파일 이름>.b64.txt)로 바꿔 둡니다. pdf.js 가 요청하면 여기서 받아 원래 바이트로 풀어 줍니다.
// (CMap 이 없으면 글꼴을 내장하지 않은 한글·한자 PDF 의 글자가 미리보기에서 빠집니다.)
import { configurePdfjs, type PdfjsAssetUrls } from '../src/lib/pdfjs';

const ENCODED = /\.(bcmap|pfb)$/;
const ENCODED_SUFFIX = '.b64.txt';

function decodeBase64(text: string): Uint8Array {
  const binary = atob(text.trim());
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

class EncodedAssetFactory {
  private readonly urls: PdfjsAssetUrls;

  constructor(urls: PdfjsAssetUrls) {
    this.urls = urls;
  }

  async fetch({ kind, filename }: { kind: keyof PdfjsAssetUrls; filename: string }): Promise<Uint8Array> {
    const base = this.urls[kind];
    if (!base) throw new Error(`pdf.js ${kind} is not configured`);
    const encoded = ENCODED.test(filename);
    const url = `${base}${filename}${encoded ? ENCODED_SUFFIX : ''}`;
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Unable to load ${url} (${response.status})`);
    return encoded ? decodeBase64(await response.text()) : new Uint8Array(await response.arrayBuffer());
  }
}

// 색상 프로필(.icc)은 pdf.js 워커가 직접 동기 요청으로 읽어서 여기로 돌릴 수 없으므로 쓰지 않습니다 (기본 CMYK 변환 사용).
configurePdfjs({ BinaryDataFactory: EncodedAssetFactory, useIccProfile: false });
