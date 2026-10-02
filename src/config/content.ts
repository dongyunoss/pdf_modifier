// 검색엔진에 "페이지 내용이 바뀌었다"고 알리는 설정입니다. 사용법은 docs/SEARCH.md 를 참고하세요.

/**
 * 페이지 내용(제목·설명·본문·구조화 데이터)을 크게 바꾼 날짜 (YYYY-MM-DD).
 * 사이트맵의 <lastmod> 로 들어가고, main 브랜치에서 이 값이 바뀌면 GitHub Actions 가 배포를 기다렸다가
 * IndexNow 로 모든 주소를 빙·네이버 등에 알립니다 (.github/workflows/indexnow.yml).
 * 오타 수정 같은 작은 변경에는 바꾸지 마세요. 구글은 lastmod 가 꾸준히 정확한 사이트의 값만 믿습니다.
 */
export const CONTENT_UPDATED = '2026-10-02';

/** IndexNow 키. 사이트 루트의 /<키>.txt 로 공개되어 이 사이트의 주소를 알릴 권한을 증명합니다 (공개되어도 되는 값). */
export const INDEXNOW_KEY = 'd7555b6909ead30eb670a9ba0309de3b';
