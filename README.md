# PDF Modifier

설치·회원가입 없이 쓰는 **무료 온라인 PDF 편집 사이트**입니다.
모든 PDF 처리가 **사용자의 브라우저 안에서** 이루어지기 때문에 파일을 서버로 올리지 않으며,
사이트는 **정적 파일만으로 운영**되어 서버 비용이 사실상 0원입니다. 수익은 Google AdSense 광고로 얻는 구조입니다.

- 13개 언어 지원(한국어·영어·일본어·중국어 간체/번체·스페인어·포르투갈어·프랑스어·독일어·이탈리아어·인도네시아어·베트남어·터키어), 도구별 SEO 페이지 자동 생성
- 처음 들어온 방문자는 **브라우저 언어에 맞는 페이지로 자동 이동** (검색엔진 크롤러는 제외, 언어 메뉴에서 고른 언어는 기억)
- 애드센스 광고 자리, `ads.txt`, 개인정보처리방침·이용약관·소개 페이지 포함 (애드센스 심사 대비)
- 사이트맵(`lastmod`), `robots.txt`, hreflang, Open Graph(언어별 공유 이미지), 구조화 데이터(JSON-LD) 자동 생성
- 제목·설명·본문에 **"모든 기능 무료 · 로그인 없음"** 을 강조하고, 내용을 바꾸면 IndexNow 로 빙·네이버 등에 자동 알림 ([docs/SEARCH.md](docs/SEARCH.md))

## 제공 기능 (13개 도구)

| 분류 | 도구 | 주소 |
| --- | --- | --- |
| 페이지 정리 | **PDF 합치기** — 여러 PDF를 원하는 순서로 병합, 암호 걸린 PDF 지원 | `/merge-pdf/` |
| | **PDF 분할** — 범위 지정 / N쪽씩 / 모든 페이지 분리, ZIP 다운로드 | `/split-pdf/` |
| | **PDF 페이지 편집** — 드래그로 순서 변경, 회전, 삭제, 복제, 빈 페이지 추가, 여러 PDF 섞기, 실행 취소 | `/organize-pdf/` |
| | **PDF 회전** — 페이지별/전체 회전 (책갈피·링크 유지) | `/rotate-pdf/` |
| | **PDF 페이지 삭제** — 클릭·범위 입력·홀수/짝수 선택 | `/delete-pdf-pages/` |
| | **PDF 페이지 추출** — 하나의 PDF 또는 페이지별 파일로 | `/extract-pdf-pages/` |
| 최적화 | **PDF 압축** — 이미지 재압축(텍스트 유지) / 최대 압축(페이지 이미지화) | `/compress-pdf/` |
| 변환 | **JPG → PDF** — JPG·PNG·WebP 등, 용지 크기·방향·여백, 사진 EXIF 방향 자동 반영 | `/jpg-to-pdf/` |
| | **PDF → JPG** — JPG/PNG, 72·150·300 DPI, ZIP 다운로드 | `/pdf-to-jpg/` |
| 편집 | **워터마크** — 한글 포함 모든 언어 문구·로고 이미지, 투명도·각도·바둑판 배치, 실시간 미리보기 | `/add-watermark-to-pdf/` |
| | **페이지 번호** — 6개 위치, 5가지 형식, 시작 번호, 표지 제외 | `/add-page-numbers-to-pdf/` |
| 보안 | **암호 설정** — AES-256 암호화, 인쇄·복사·편집 권한 제한 | `/protect-pdf/` |
| | **암호 해제** — 알고 있는 암호로 잠금 해제, 권한 제한 제거 | `/unlock-pdf/` |

한국어가 기본(루트 주소)이고, 다른 언어는 같은 주소 앞에 언어 코드가 붙습니다 (예: `/en/merge-pdf/`, `/ja/merge-pdf/`, `/zh-cn/merge-pdf/`).
작업을 마친 결과 파일은 **"이어서 작업하기"** 버튼으로 다른 도구에 바로 넘길 수 있어 한 방문당 페이지뷰(=광고 노출)가 늘어납니다.

## 서버 비용을 최소화한 구조

```
[사용자 브라우저]                                  [정적 호스팅: Cloudflare Pages 무료]
 ├─ Astro 로 미리 만든 HTML/CSS/JS  ◀─── 최초 1회 다운로드 ───  dist/ (HTML, JS, pdf.js 리소스)
 ├─ pdf.js (미리보기·이미지 변환)
 └─ Web Worker + pdf-lib (합치기·분할·압축·암호화 …)
        ▲
        └─ PDF 파일은 여기서만 처리됨 — 서버 업로드 없음
```

- **서버 연산 0**: 파일을 처리하는 백엔드가 없으므로 사용자가 늘어도 서버 비용이 늘지 않습니다.
- **정적 호스팅 무료**: Cloudflare Pages 무료 플랜은 요청 수·대역폭 무제한, 상업적 이용 가능.
- **트래픽 절감**: 무거운 라이브러리(pdf.js 약 0.5MB, pdf-lib 약 0.6MB)는 파일을 올릴 때만 내려받고,
  해시가 붙은 파일은 1년 캐시(`public/_headers`)되어 재방문 시 거의 전송되지 않습니다.
- **실제 비용**: 도메인 비용(연 1~2만 원 수준)만 발생합니다.

자세한 배포 방법은 **[docs/DEPLOY.md](docs/DEPLOY.md)**, 광고 수익화 방법은 **[docs/MONETIZATION.md](docs/MONETIZATION.md)**,
검색엔진 등록과 갱신 알림은 **[docs/SEARCH.md](docs/SEARCH.md)** 를 참고하세요.

## 빠른 시작

Node.js 22.13 이상이 필요합니다.

```bash
npm install
cp .env.example .env      # 사이트 주소, 애드센스 ID 등 설정 (비워 두어도 실행됨)
npm run dev               # http://localhost:4321
```

| 명령 | 설명 |
| --- | --- |
| `npm run dev` | 개발 서버 (광고 자리는 점선 상자로 표시) |
| `npm run build` | `dist/` 에 배포용 정적 사이트 생성 |
| `npm run preview` | 빌드 결과 미리 보기 |
| `npm test` | PDF 처리 로직 단위 테스트 (Vitest) |
| `npm run check` | 타입 검사 (astro check) |
| `npm run test:e2e` | 실제 브라우저로 모든 도구를 조작하는 E2E 테스트 (Playwright, 빌드 후 실행) |
| `npm run generate:images` | 문구나 사이트 이름을 바꾼 뒤 언어별 공유 이미지(`public/og/`)·아이콘 다시 생성 |
| `npm run indexnow` | 공개된 사이트맵의 모든 주소를 IndexNow 로 알림 (`main` 에서는 자동 실행, [docs/SEARCH.md](docs/SEARCH.md)) |
| `npm run build:demo` | 13개 도구를 한 페이지에 모은 체험판을 `dist-demo/` 에 생성 (샘플 문서 포함, claude.ai 아티팩트용 `artifact.html` 도 함께 생성) |

> E2E 테스트는 `npx playwright install chromium` 으로 브라우저를 설치한 뒤 실행하세요.
> 이미 설치된 크로미움을 쓰려면 `PW_CHROMIUM_PATH=/path/to/chrome npm run test:e2e`.

## 환경 변수

모두 빌드 시점에 적용됩니다. 주소·이름·문의 이메일·애드센스 게시자 ID·네이버 인증값은 비워 두면 pdfmodifier.app 기본값(`src/config/site.ts`)을 쓰고, 나머지는 비워 두면 해당 기능이 꺼질 뿐 사이트는 정상 동작합니다. ([.env.example](.env.example))

| 변수 | 설명 |
| --- | --- |
| `PUBLIC_SITE_URL` | 실제 도메인 (기본값: `https://pdfmodifier.app`). canonical·사이트맵·OG 태그에 사용 — **다른 도메인으로 배포할 때만 설정** |
| `PUBLIC_SITE_NAME` | 사이트 이름 |
| `PUBLIC_CONTACT_EMAIL` | 문의 이메일 (소개·개인정보처리방침에 표시) |
| `PUBLIC_ADSENSE_CLIENT` | 애드센스 게시자 ID `ca-pub-…` (설정 시 광고 스크립트와 `ads.txt` 자동 생성) |
| `PUBLIC_ADSENSE_SLOT_TOOL` / `_RESULT` / `_CONTENT` | 광고 단위 ID (도구 아래 / 완료 화면 / 본문·홈) |
| `PUBLIC_DONATION_URL` | 후원 링크 (푸터에 표시) |
| `PUBLIC_CF_ANALYTICS_TOKEN`, `PUBLIC_GA_ID` | 방문 통계 (Cloudflare Web Analytics / Google Analytics 4) |
| `PUBLIC_GOOGLE_SITE_VERIFICATION`, `PUBLIC_NAVER_SITE_VERIFICATION`, `PUBLIC_BING_SITE_VERIFICATION` | 검색엔진 소유 확인 메타 태그 |

## 프로젝트 구조

```
src/
├─ config/site.ts          사이트 설정 (환경 변수 → 설정값)
├─ config/content.ts       페이지 내용을 바꾼 날짜(사이트맵 lastmod·IndexNow), IndexNow 키
├─ i18n/
│  ├─ languages.ts         지원 언어 목록 (주소 접두사, hreflang, 로케일, 브라우저 언어 매칭)
│  ├─ ko.ts, en.ts, ja.ts …  언어별 UI 문구와 도구별 SEO 콘텐츠(제목·설명·사용법·FAQ) — ko.ts 가 기준
│  ├─ legal/               언어별 소개·개인정보처리방침·이용약관 문구
│  └─ auto-language.js     첫 방문자를 브라우저 언어 페이지로 옮기는 스크립트 (<head>에 인라인)
├─ tools/registry.ts       도구 목록 (주소, 분류, 추천 도구)
├─ lib/
│  ├─ pdf/                 PDF 처리 핵심 (Node 에서도 테스트 가능한 순수 함수)
│  │  ├─ ops.ts            합치기·분할·조합·회전·삭제·추출·번호·워터마크·이미지→PDF·암호
│  │  ├─ compress.ts       이미지 재압축 (JPEG/Flate, PNG 예측자 해제)
│  │  ├─ worker.ts         Web Worker 진입점 (화면이 멈추지 않도록 별도 스레드에서 처리)
│  │  └─ client.ts         메인 스레드 → 워커 작업 요청
│  ├─ pdfjs.ts             pdf.js 지연 로딩, 썸네일 렌더링 큐
│  ├─ images.ts            이미지 준비(EXIF·형식 변환), 워터마크 문구 렌더링
│  └─ handoff.ts           "이어서 작업하기" 결과 전달 (IndexedDB, 브라우저 안에서만)
├─ components/tools/       도구 화면 (Preact 아일랜드)
├─ views/, layouts/, pages/  Astro 페이지 (한국어: `/`, 그 밖의 언어: `/[언어]/` 동적 경로)
└─ styles/global.css       디자인 (라이트/다크 모드)
demo/                      체험판 (실제 도구 컴포넌트를 그대로 쓰는 단일 페이지, 샘플 문서 생성)
tests/
├─ unit/                   PDF 처리 단위 테스트
└─ e2e/                    실제 브라우저 E2E 테스트 (데스크톱 + 모바일)
```

### 도구 추가하기
1. `src/lib/pdf/ops.ts` 에 처리 함수를 만들고 `protocol.ts`·`worker.ts` 에 작업을 등록합니다.
2. `src/components/tools/` 에 화면 컴포넌트를 만듭니다 (기존 도구를 복사해 시작하면 쉽습니다).
3. `src/tools/registry.ts` 에 도구를 등록하고, 모든 언어 사전(`src/i18n/*.ts`)에 문구를 추가합니다. (빠진 언어가 있으면 타입 검사가 알려 줍니다.)
4. `src/views/ToolView.astro` 에 컴포넌트를 연결하면 모든 언어의 도구 페이지와 사이트맵이 자동 생성됩니다.

### 언어 추가하기
1. `src/i18n/languages.ts` 의 `LANGUAGES` 에 한 줄을 추가합니다 (이름, hreflang, 로케일, 브라우저 언어 매칭 접두사).
2. 같은 코드로 사전 `src/i18n/<코드>.ts`(기존 사전을 복사해 번역)와 법적 문서 `src/i18n/legal/<코드>.ts` 를 만들고,
   `src/i18n/index.ts`·`src/i18n/legal/index.ts` 에 등록합니다.
3. 페이지(`/<코드>/…`), hreflang, 사이트맵, 언어 메뉴, 자동 언어 이동은 저절로 반영됩니다.
   `npm test` 가 빠진 문구·자리표시자(`{n}` 등)·HTML 태그 짝을 검사합니다.

브라우저 언어가 지원 언어와 맞지 않는 방문자에게는 영어 페이지를 보여 줍니다 (`FALLBACK_LANG`, 검색엔진용 `x-default`).

## 사용한 오픈소스
[pdf-lib (@cantoo/pdf-lib)](https://github.com/cantoo-scribe/pdf-lib) (MIT), [PDF.js](https://github.com/mozilla/pdf.js) (Apache-2.0),
[fflate](https://github.com/101arrowz/fflate) (MIT), [Preact](https://preactjs.com) (MIT), [Astro](https://astro.build) (MIT).
