# 배포 가이드 — 서버 비용 0원으로 운영하기

이 사이트는 빌드하면 `dist/` 폴더에 **HTML·CSS·JS 정적 파일만** 만들어집니다. PDF 처리는 방문자의 브라우저에서 이루어지므로
파일을 처리할 서버가 필요 없고, 정적 파일 호스팅만 있으면 됩니다.

## 어디에 배포할까?

| 호스팅 | 무료 한도 | 광고 수익 사이트 | 추천 |
| --- | --- | --- | --- |
| **Cloudflare Pages** | 요청·대역폭 무제한, 월 500회 빌드, 파일 2만 개·파일당 25MB | 가능 | ✅ **권장** |
| GitHub Pages | 대역폭 월 100GB(소프트 한도), 사이트 1GB | 약관상 상업 목적 운영에 제약이 있을 수 있음 | △ |
| Netlify | 무료 한도를 넘으면 사이트 중지 또는 과금 | 가능 | △ |
| Vercel (Hobby) | — | 개인·비상업 용도만 허용 → 광고 사이트는 유료 플랜 필요 | ✕ |

트래픽이 늘어도 요금이 오르지 않는 **Cloudflare Pages** 를 권장합니다. 아래는 Cloudflare Pages 기준 설명입니다.

## Cloudflare Pages 배포 (Git 연동, 약 10분)

1. [Cloudflare](https://dash.cloudflare.com/sign-up) 에 가입합니다 (무료 플랜).
2. 대시보드에서 **Workers & Pages → Create → Pages → Connect to Git(Import an existing Git repository)** 를 선택하고
   GitHub 계정을 연결한 뒤 이 저장소를 고릅니다.
   > Cloudflare 화면 구성은 자주 바뀝니다. Pages 탭이 보이지 않으면 Workers & Pages 화면에서 "Pages" 또는 "Import a repository"를 찾으세요.
3. 빌드 설정을 입력합니다.

   | 항목 | 값 |
   | --- | --- |
   | Production branch | `main` (배포할 브랜치) |
   | Framework preset | `Astro` |
   | Build command | `npm run build` |
   | Build output directory | `dist` |

4. **Environment variables(환경 변수)** 에 최소한 아래 값을 넣습니다. 나머지는 [.env.example](../.env.example) 참고.

   | 이름 | 예시 |
   | --- | --- |
   | `PUBLIC_SITE_URL` | `https://pdf.example.com` (처음엔 `https://프로젝트명.pages.dev`) |
   | `PUBLIC_SITE_NAME` | `PDF Modifier` |
   | `NODE_VERSION` | `22` (저장소의 `.nvmrc` 로도 지정되어 있음) |

5. **Save and Deploy** 를 누르면 1~2분 뒤 `https://프로젝트명.pages.dev` 로 사이트가 열립니다.
6. 이후 `main` 브랜치에 푸시할 때마다 자동으로 다시 배포되고, 다른 브랜치·PR 은 미리보기 주소가 따로 생깁니다.

### 직접 업로드로 배포하기 (Git 연동 없이)

```bash
npm run build
npx wrangler pages deploy dist --project-name pdf-modifier
```

## 도메인 연결 (애드센스 신청 전 필수)

애드센스에는 **본인 소유 도메인**을 등록해야 하므로 `*.pages.dev` 주소로는 신청할 수 없습니다.

1. 도메인을 구입합니다. `.com` 은 [Cloudflare Registrar](https://www.cloudflare.com/products/registrar/) 에서 원가(연 약 10달러)에,
   `.kr`·`.co.kr` 은 국내 등록 대행사(가비아 등)에서 살 수 있습니다.
2. Pages 프로젝트 → **Custom domains → Set up a custom domain** 에서 도메인을 입력하고 안내에 따라 DNS 를 설정합니다.
   도메인이 Cloudflare DNS 를 쓰면 자동으로 설정됩니다. HTTPS 인증서도 무료로 자동 발급됩니다.
3. 환경 변수 `PUBLIC_SITE_URL` 을 새 도메인(예: `https://pdf.example.com`)으로 바꾸고 **다시 배포**합니다.
   (canonical 주소·사이트맵·공유 이미지 주소가 이 값으로 만들어집니다.)

## 비용 정리

| 항목 | 비용 |
| --- | --- |
| 호스팅 (Cloudflare Pages Free) | 0원 — 방문자가 늘어도 동일 |
| PDF 처리 서버 | 없음 (방문자 브라우저에서 처리) |
| 방문 통계 (Cloudflare Web Analytics) | 0원 |
| 도메인 | 연 1~2만 원 수준 |

무료 플랜에서 신경 쓸 한도는 **월 500회 빌드**(= 배포 횟수) 정도입니다. 여러 커밋을 모아서 푸시하면 충분합니다.

## 비용을 더 줄이는 장치 (이미 적용됨)

- **지연 로딩**: pdf.js(약 0.5MB)와 PDF 처리 워커(약 0.6MB)는 사용자가 파일을 올릴 때만 내려받습니다. 첫 화면은 가볍게 유지됩니다.
- **장기 캐시**: 파일 이름에 해시가 붙는 `/_astro/*` 는 1년, pdf.js 리소스 `/pdfjs/*` 는 30일 캐시하도록 `public/_headers` 에 설정되어 있어
  재방문자는 거의 아무것도 다시 내려받지 않습니다.
- **필요한 리소스만 요청**: 한글 CMap·표준 폰트·디코더(wasm)는 해당 PDF 를 열 때만 요청됩니다.

## 배포 후 확인할 것

- [ ] `https://도메인/robots.txt`, `https://도메인/sitemap-index.xml` 이 열리는지
- [ ] `https://도메인/ads.txt` 에 게시자 ID 가 보이는지 (애드센스 설정 후)
- [ ] PDF 합치기 등 도구가 PC·휴대폰에서 동작하는지
- [ ] 페이지 공유 시 미리보기 이미지가 나오는지 (카카오톡·페이스북 등)
