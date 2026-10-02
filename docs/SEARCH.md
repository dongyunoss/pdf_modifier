# 검색엔진 등록과 갱신 알림

이 사이트의 가장 큰 강점은 **모든 기능 무료 · 로그인(회원가입) 없음 · 횟수 제한 없음 · 파일 업로드 없음**입니다.
이 약속이 검색 결과와 공유 미리보기에 그대로 보이도록 만들어 두었고, 내용을 바꿀 때마다 검색엔진에 알리는 장치도 들어 있습니다.

## 1. 검색엔진이 읽는 곳 (이미 적용됨)

| 위치 | 내용 | 고치는 곳 |
| --- | --- | --- |
| 제목 (`<title>`) | `PDF 합치기 - 로그인 없이 무료로 여러 PDF 병합` 처럼 **도구 이름 + 무료 + 로그인 없음** | 각 언어 사전 `src/i18n/*.ts` 의 `tools.*.title`, `home.title` |
| 설명 (`meta description`) | 도구 소개 한 문장 + 약속 문장 (`로그인·횟수 제한 없이 무료이며, 파일은 서버에 업로드되지 않습니다.`) | `tools.*.description` + `promise.sentence` (`withPromise()` 가 이어 붙임) |
| 본문 | 약속 배지 4개(홈 첫 화면·도구 제목 아래), 파일 선택 영역의 안내, 홈의 **흔한 PDF 사이트와 비교표**, FAQ「로그인이나 회원가입이 필요한가요?」 | `promise.points`, `ui.startPromise`, `home.compare`, `home.faq` |
| 구조화 데이터 | WebSite(사이트 이름·`alternateName`), WebApplication(`isAccessibleForFree`, 가격 0, `featureList`), FAQ, 빵 부스러기 | `src/views/HomeView.astro`, `src/views/ToolView.astro` |
| 공유 미리보기 이미지 | 언어별 `public/og/<언어>.png` (제목 + 약속 배지) | 문구를 바꾼 뒤 `npm run generate:images` |

`npm test` 가 13개 언어의 모든 제목에 "무료"와 "로그인/가입 없음"에 해당하는 말이 들어 있는지 검사합니다.

## 2. 처음 한 번: 검색엔진에 사이트 등록

소유 확인은 끝났으므로, 사이트맵이 제출되어 있는지만 확인하세요.

| 검색엔진 | 할 일 |
| --- | --- |
| [Google Search Console](https://search.google.com/search-console) | **Sitemaps** → `sitemap-index.xml` 제출 (상태가 "성공"인지 확인) |
| [네이버 서치어드바이저](https://searchadvisor.naver.com) | 웹마스터 도구 → 사이트 선택 → **요청 → 사이트맵 제출** → `https://pdfmodifier.app/sitemap-0.xml` |
| [Bing Webmaster Tools](https://www.bing.com/webmasters) | **Sitemaps** → `https://pdfmodifier.app/sitemap-index.xml` 제출 |

## 3. 내용을 바꾼 뒤: 검색엔진에 알리기

제목·설명·본문·구조화 데이터를 바꿨다면 아래 순서로 알립니다.

### ① 날짜 바꾸기 → 빙·네이버 등은 자동

[`src/config/content.ts`](../src/config/content.ts) 의 `CONTENT_UPDATED` 를 오늘 날짜(`YYYY-MM-DD`)로 바꿔 `main` 에 올리면:

1. 사이트맵의 모든 주소에 `<lastmod>` 가 그 날짜로 들어갑니다 → 구글·네이버·빙이 다시 읽어 갈 페이지를 고를 때 씁니다.
2. GitHub Actions 의 **IndexNow** 워크플로(`.github/workflows/indexnow.yml`)가 Cloudflare 배포가 끝나기를 기다렸다가
   사이트맵의 모든 주소(지금은 13개 언어 221개)를 [IndexNow](https://www.indexnow.org) 로 보냅니다.
   한 번 보내면 **빙·네이버·얀덱스·Seznam·Yep** 이 함께 받습니다.
   - 결과: GitHub 저장소 → **Actions → IndexNow** 실행 기록 (`IndexNow 에 주소 221개를 보냈습니다`)
   - 키를 처음 쓸 때는 검색엔진이 키 파일을 확인하는 동안 `403 SiteVerificationNotCompleted` 가 올 수 있습니다.
     스크립트가 몇 분 간격으로 다시 보내므로 그대로 두면 됩니다.
   - 다시 보내기: 같은 화면의 **Run workflow**
   - 직접 보내기: `npm run indexnow` (지금 공개된 사이트맵 기준, `npm run indexnow -- --dry-run` 이면 주소만 출력)

> 오타 수정 같은 작은 변경에는 날짜를 바꾸지 마세요. 실제로 바뀐 것이 없는데 날짜만 바뀌면
> 검색엔진이 이 사이트의 `lastmod` 를 믿지 않게 됩니다.

### ② 구글은 직접 요청 (IndexNow 를 쓰지 않음)

[Google Search Console](https://search.google.com/search-console) 에서:

1. **Sitemaps** → 이미 제출한 `sitemap-index.xml` 을 한 번 더 제출합니다 (마지막으로 읽은 날짜가 갱신됨).
2. **URL 검사** → 주소 입력 → **색인 생성 요청**. 하루에 요청할 수 있는 수가 정해져 있으니 중요한 페이지부터 나눠서 요청하세요.
   1. `https://pdfmodifier.app/` (한국어 홈), `https://pdfmodifier.app/en/`
   2. 검색이 많은 도구: `/merge-pdf/`, `/compress-pdf/`, `/jpg-to-pdf/`, `/pdf-to-jpg/`, `/split-pdf/`
   3. 나머지 도구와 다른 언어 홈(`/ja/`, `/es/` …)은 사이트맵으로 차례로 다시 읽어 갑니다.

### ③ 네이버는 필요할 때만 수동 요청

IndexNow 로 자동 전달되지만, 빨리 반영하고 싶은 페이지는 서치어드바이저 → **요청 → 웹 페이지 수집** 에 주소를 넣으세요.

### ④ 반영 확인

- 빙: Bing Webmaster Tools → **IndexNow** 메뉴에서 받은 주소 확인
- 구글: Search Console → **페이지** 보고서, 또는 검색창에 `site:pdfmodifier.app`
- 새 제목·설명이 검색 결과에 보이기까지 보통 며칠에서 몇 주가 걸립니다. 검색엔진이 제목을 줄이거나 바꿔 보여 줄 수도 있습니다.

## 4. 참고

- **IndexNow 키**: `src/config/content.ts` 의 `INDEXNOW_KEY` 이고, 사이트 루트의 `/<키>.txt` 로 공개됩니다.
  공개되어도 되는 값이며(이 사이트의 주소만 알릴 수 있음), 바꿀 필요가 없습니다.
- **Cloudflare Crawler Hints**(선택): Cloudflare 대시보드 → 도메인 → **Caching → Configuration → Crawler Hints** 를 켜면
  Cloudflare 가 바뀐 페이지를 IndexNow 로 알려 줍니다. Workers 정적 자산에는 적용되지 않을 수 있어, 위 워크플로를 기본으로 씁니다.
- 구글 검색 결과의 사이트 이름은 홈의 WebSite 구조화 데이터(`name: PDF Modifier`)를 참고해 정해집니다.
