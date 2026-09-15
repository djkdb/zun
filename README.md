# ZUN — Software × AI × Product

ZUN(성준)의 개인 포트폴리오. 이력서형 페이지가 아니라, 픽셀아트 ZUN 캐릭터가 안내하는
스크롤 기반 스토리(DISCOVER → BUILD → SHARE → LEARN → BUILD AGAIN)로 구성된 인터랙티브 사이트입니다.

## 실행

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # 정적 export → ./out (Cloudflare Pages 업로드용)
npm run preview:static   # ./out 을 로컬에서 미리보기
npm run lint     # ESLint
```

Node 20+ 권장. Next.js 16 · TypeScript · Tailwind CSS v4 · Framer Motion · Lenis.

## 배포 (Cloudflare Pages)

사이트는 서버가 필요 없는 완전 정적 사이트입니다. `next.config.ts` 의 `output: "export"` 로
`npm run build` 가 `out/` 폴더(HTML · JS · OG 이미지 · 파비콘 · robots · sitemap)를 만들고, 그대로 Cloudflare Pages에 올립니다.

### 방법 A — GitHub 연동 (권장, 푸시하면 자동 배포)

1. https://dash.cloudflare.com → **Workers & Pages → Create → Pages → Connect to Git** → `djkdb/zun` 선택
2. 빌드 설정
   - Framework preset: **Next.js (Static HTML Export)** (없으면 None)
   - Build command: `npm run build`
   - Build output directory: `out`
   - Environment variables: `NODE_VERSION` = `22`
3. **Save and Deploy** → `https://zun.pages.dev` 같은 주소가 생깁니다. 이후 브랜치에 푸시할 때마다 자동 재배포되고,
   다른 브랜치는 프리뷰 URL로 배포됩니다.
4. 커스텀 도메인: Pages 프로젝트 → **Custom domains → Set up a domain**. 도메인이 Cloudflare DNS에 있으면 자동으로 연결됩니다.
5. 도메인이 정해지면 `data/profile.ts` 의 `siteUrl` 을 실제 주소로 바꿔주세요(OG 이미지·sitemap URL에 쓰입니다).

### 방법 B — 터미널에서 직접 올리기

```bash
npx wrangler login          # 최초 1회, 브라우저에서 Cloudflare 로그인
npm run deploy              # next build → wrangler pages deploy out
```

처음 실행하면 프로젝트 `zun` 을 만들지 물어봅니다. 이후에는 같은 명령으로 재배포됩니다.

### 포함된 설정

- `public/_headers` — 보안 헤더와 캐시 정책(`/_next/static/*` 는 1년 immutable). Pages가 자동으로 읽습니다.
- `out/404.html` — Next의 not-found 페이지가 그대로 404 응답으로 쓰입니다.
- `wrangler.jsonc` — 방법 B용 Pages 설정.

로컬에서 배포 결과물을 미리 보려면 `npm run build && npm run preview:static` 을 실행하세요.

## 3D 플레이그라운드 (`/play`)

Three.js + React Three Fiber로 만든 드라이빙 월드입니다. 화살표/WASD(Shift 부스트, 모바일은 화면 패드)로 차를 몰고
ABOUT · PROJECTS · CONTENT · CONTACT 존에 들어가면 정보 카드가 뜨고, Z·U·N 블록은 밀 수 있습니다.

- `components/play/zones.ts` — 존 위치·색·포즈·연결 섹션, 타일 길, 나무 배치
- `components/play/Car.tsx` — 아케이드 차량 모델(가속·마찰·조향·바디 롤). 물리 엔진 없이 튜닝된 값
- `components/play/World.tsx` — 바닥, 큐브 나무, 빌보드(캔버스 텍스처), HOW TO PLAY 3D 텍스트
- `components/play/Overlay.tsx` — 존 카드, Reset, 모바일 패드
- 3D 텍스트 폰트: `public/fonts/Silkscreen-Regular.ttf` (ASCII만 사용 — 다른 글자를 쓰면 troika가 CDN에서 대체 폰트를 받아옵니다)
- 콘솔에서 `__zunPlay.car.position.set(x, 0, z)` 로 순간이동할 수 있습니다.

## 콘텐츠 수정 위치 (여기만 고치면 됩니다)

모든 문구·프로젝트·활동 데이터는 `data/` 폴더에 있습니다. 컴포넌트에는 내용을 하드코딩하지 않습니다.

| 파일 | 내용 |
| --- | --- |
| `data/profile.ts` | 브랜드명, 슬로건, 역할, 학교, 소개 문구, 관심사, 연락 링크(`links`), 사이트 URL |
| `data/projects.ts` | PROJECT LAB 목록 — title / tagline / role / stack / problem / build / result / demo / github / pose |
| `data/journey.ts` | MY JOURNEY 타임라인 |
| `data/activities.ts` | BEYOND CODE 활동 목록 |
| `data/content.ts` | WHAT I SHARE — Instagram 브랜드 정보, 콘텐츠 갤러리, "What worked?" 인사이트 |
| `data/now.ts` | WHAT I'M BUILDING NOW — 상태 단어만 사용(퍼센트 없음), `nowUpdated` 날짜 |
| `data/loop.ts` | BUILD → FAIL → LEARN → BUILD AGAIN 문구 |
| `data/future.ts` | WHERE I'M GOING 문구 |
| `data/types.ts` | 위 데이터의 타입 정의 |

### TODO 규칙

확인되지 않은 정보는 절대 지어내지 않았습니다. 아직 채우지 않은 값은 `TODO:` 로 시작하거나 `draft: true` /
`todo: true` 로 표시되어 있고, 화면에서는 노란 `TODO` 태그로 보입니다. 실제 내용으로 바꾸면서 해당 플래그를 지우세요.

- 프로젝트 5개(CLASS FC, Travel Companion, ZUN Food, Asteron, EV-SafePark)는 제목만 확인되어 `draft` 상태입니다.
- `data/profile.ts` 의 GitHub / Email 링크, `siteUrl` 을 채워주세요.
- 콘텐츠 갤러리 썸네일은 `public/content/` 에 넣고 `image` 필드에 경로를 적으면 됩니다. 조회수(`views`)는 확인된 값만 적습니다.

## ZUN 캐릭터

`components/character/`

- `poses.ts` — 24×36 픽셀 그리드로 정의된 캐릭터. `HEAD`(공통) + `EYES`(시선/깜빡임) + 포즈별 `BODY`/오버레이.
  현재 포즈: idle, think, walk(2프레임), build, phone, book, point, telescope, wave, surprise, experiment.
- `palette.ts` — 색상표(한 글자 = 한 색).
- `PixelSprite.tsx` — 그리드를 SVG path로 렌더링(이미지 파일 불필요, 어떤 크기에서도 선명).
- `ZunCharacter.tsx` — 눈 깜빡임, idle bob, 마우스 시선 추적, 프레임 애니메이션. `prefers-reduced-motion` 시 모두 비활성.

### 공식 32포즈 스프라이트 시트 적용

1. 8×4 시트(01~32)를 `public/character/zun-sheet.png` 로 저장 (투명 배경 권장, 체커보드가 박힌 파일도 처리됨)
2. `npm run character:split` 실행
   → 각 칸의 번호 라벨 제거, 배경 투명화, 여백 트리밍 후 `public/character/poses/01.png … 32.png` 생성
   → `data/character-manifest.ts` 가 `available: true` 로 재생성되어 사이트 전체가 자동으로 실제 스프라이트를 사용
3. 포즈 이름 ↔ 칸 번호 매핑은 `data/character.ts` (`SHEET_CELLS`). 시트가 없으면 SVG 폴백이 그려지며,
   시트 전용 포즈(idea, present, search, celebrate …)는 `SVG_FALLBACK` 으로 가장 가까운 SVG 포즈로 대체됩니다.

포즈 이름은 32칸 전부 정의되어 있습니다 (`data/types.ts` 의 `PoseName`):
idle · laptop-desk · mug · think · laptop-lap · idea · walk · build · headphones · book · beanbag · ok · coffee ·
celebrate · tired · run · desk-plant · sunglasses · phone · cat · backpack · code · tea · night · books · sleep ·
write · present · search · tablet · cheers · laptop-floor

## 구조

```
app/                  layout(폰트·메타데이터), page, icon, opengraph-image, robots, sitemap
components/
  play/               3D 플레이그라운드 (R3F)
  layout/             SmoothScroll(Lenis), Section
  navigation/         Navbar(플로팅 내비 + 전체 메뉴)
  hero/               Hero, TerminalIntro
  character/          ZUN 픽셀 캐릭터 시스템
  sections/           About, Journey, BuildLoop, Activities, Content, Now, Future, Contact …
  projects/           ProjectCard, ProjectModal
  timeline/           JourneyTimeline
  interactions/       Reveal, PixelTransition(픽셀 dissolve), CustomCursor
  ui/                 SectionHeader, PixelButton, Tag, Panel
data/                 모든 콘텐츠
lib/                  utils, hooks, scroll
```

## 접근성 / 성능

- `prefers-reduced-motion` 시 모든 장식 애니메이션과 스무스 스크롤 비활성
- 키보드 조작 가능, 포커스 링 표시, 시맨틱 HTML, 스킵 링크
- 커스텀 커서는 데스크톱(정밀 포인터)에서만 활성
- 캐릭터는 SVG라 이미지 요청이 없고, 폰트는 next/font 로 셀프 호스팅
