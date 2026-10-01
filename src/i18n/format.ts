/**
 * "{n}쪽" 같은 템플릿의 {이름} 자리에 값을 채웁니다.
 * 브라우저 코드가 사전 전체를 끌어오지 않도록 사전 모듈과 분리해 둡니다.
 */
export function fmt(template: string, values: Record<string, string | number> = {}): string {
  return template.replace(/\{(\w+)\}/g, (match, key: string) => (key in values ? String(values[key]) : match));
}
