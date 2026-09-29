// 파일 다운로드, 이름, 크기 표시 등 브라우저 공용 유틸리티

function saveWithLink(blob: Blob, filename: string): Promise<void> {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.rel = 'noopener';
  link.style.display = 'none';
  document.body.appendChild(link);
  link.click();
  link.remove();
  // 일부 브라우저는 클릭 직후 URL 을 해제하면 다운로드가 실패하므로 여유를 둡니다.
  setTimeout(() => URL.revokeObjectURL(url), 60_000);
  return Promise.resolve();
}

function openInNewTab(blob: Blob) {
  const url = URL.createObjectURL(blob);
  const opened = window.open(url, '_blank', 'noopener');
  if (!opened) window.location.assign(url);
  setTimeout(() => URL.revokeObjectURL(url), 5 * 60_000);
}

export interface FileActions {
  /** 결과 파일 저장 */
  save: (blob: Blob, filename: string) => Promise<void>;
  /** 결과 PDF 미리 보기. null 이면 미리 보기 버튼을 숨깁니다. */
  preview: ((blob: Blob) => void) | null;
}

const fileActions: FileActions = { save: saveWithLink, preview: openInNewTab };

/**
 * 파일 저장/미리 보기 방식을 바꿉니다. 새 창이나 다운로드 링크를 쓸 수 없는
 * 환경(다른 서비스에 임베드된 체험판 등)에서 사용합니다.
 */
export function configureFileActions(overrides: Partial<FileActions>) {
  Object.assign(fileActions, overrides);
}

export const downloadBlob = (blob: Blob, filename: string) => fileActions.save(blob, filename);

export const canPreview = () => fileActions.preview !== null;

export function previewBlob(blob: Blob) {
  fileActions.preview?.(blob);
}

export const pdfBlob = (bytes: Uint8Array) => new Blob([bytes as BlobPart], { type: 'application/pdf' });

export function formatBytes(bytes: number, locale: string): string {
  const units = ['B', 'KB', 'MB', 'GB'];
  let value = bytes;
  let unit = 0;
  while (value >= 1024 && unit < units.length - 1) {
    value /= 1024;
    unit++;
  }
  const digits = unit === 0 || value >= 100 ? 0 : 1;
  return `${value.toLocaleString(locale, { maximumFractionDigits: digits, minimumFractionDigits: 0 })} ${units[unit]}`;
}

/** 확장자를 뗀 파일 이름 */
export function baseName(name: string): string {
  return name.replace(/\.[^./\\]+$/, '') || 'document';
}

/** 파일 이름에 쓸 수 없는 문자를 바꿉니다. */
export function safeFileName(name: string): string {
  const cleaned = name
    .replace(/[\\/:*?"<>|\u0000-\u001f]+/g, '_')
    .replace(/\s+/g, ' ')
    .trim();
  return cleaned.slice(0, 180) || 'document';
}

/** 중복된 이름에 (2), (3)… 을 붙입니다. */
export function uniqueNames(names: string[]): string[] {
  const used = new Map<string, number>();
  return names.map((name) => {
    const key = name.toLowerCase();
    const count = used.get(key) ?? 0;
    used.set(key, count + 1);
    if (count === 0) return name;
    const dot = name.lastIndexOf('.');
    return dot > 0 ? `${name.slice(0, dot)} (${count + 1})${name.slice(dot)}` : `${name} (${count + 1})`;
  });
}

/** 파일 앞부분에서 %PDF- 시그니처를 찾습니다 (확장자만으로 판단하지 않음). */
export async function looksLikePdf(file: Blob): Promise<boolean> {
  const head = new Uint8Array(await file.slice(0, 1024).arrayBuffer());
  const text = String.fromCharCode(...head);
  return text.includes('%PDF-');
}

let idCounter = 0;
export const uid = (prefix = 'id') => `${prefix}-${Date.now().toString(36)}-${(idCounter++).toString(36)}`;
