/**
 * FlateDecode 스트림의 PNG 예측자(Predictor 10~15)를 되돌립니다.
 * pdf-lib 의 스트림 디코더는 예측자를 지원하지 않기 때문에 직접 구현합니다.
 * @returns 예측자가 제거된 원본 픽셀 바이트. 알 수 없는 필터가 있으면 null
 */
export function undoPngPredictor(
  data: Uint8Array,
  colors: number,
  bitsPerComponent: number,
  columns: number,
): Uint8Array | null {
  const bytesPerPixel = Math.max(1, Math.ceil((colors * bitsPerComponent) / 8));
  const rowLength = Math.ceil((colors * bitsPerComponent * columns) / 8);
  const rows = Math.floor(data.length / (rowLength + 1));
  const out = new Uint8Array(rows * rowLength);
  let prev = new Uint8Array(rowLength);

  for (let row = 0; row < rows; row++) {
    const src = row * (rowLength + 1);
    const filter = data[src];
    const cur = out.subarray(row * rowLength, (row + 1) * rowLength);
    for (let i = 0; i < rowLength; i++) {
      const raw = data[src + 1 + i];
      const left = i >= bytesPerPixel ? cur[i - bytesPerPixel] : 0;
      const up = prev[i];
      const upLeft = i >= bytesPerPixel ? prev[i - bytesPerPixel] : 0;
      let value: number;
      switch (filter) {
        case 0:
          value = raw;
          break;
        case 1:
          value = raw + left;
          break;
        case 2:
          value = raw + up;
          break;
        case 3:
          value = raw + ((left + up) >> 1);
          break;
        case 4: {
          const p = left + up - upLeft;
          const pa = Math.abs(p - left);
          const pb = Math.abs(p - up);
          const pc = Math.abs(p - upLeft);
          value = raw + (pa <= pb && pa <= pc ? left : pb <= pc ? up : upLeft);
          break;
        }
        default:
          return null;
      }
      cur[i] = value & 0xff;
    }
    prev = cur;
  }
  return out;
}
