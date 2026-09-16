import type { Project } from "./types";

/**
 * PROJECT LAB
 *
 * Every entry below is a REAL deployment from ZUN's Cloudflare account
 * (name, URL, repository and last-deploy date are verified).
 *
 * `problem` / `build` / `result` are written ONLY from what the deploy's own
 * commit message states. Where a project has no commit message on record, the
 * fields stay as TODO and `draft: true` so the UI shows a draft state instead
 * of pretending the entry is complete.
 *
 * RULE (never broken): no invented users, metrics, awards or outcomes.
 */
export const projects: Project[] = [
  {
    id: "zunran",
    title: "ZUNRAN",
    tagline: "야간 알바를 버티는 웨이브 게임 — 업적 40종, 전 세계 같은 데일리",
    role: "기획 · 엔진 · 밸런스 · 테스트 전부",
    stack: ["TypeScript", "Canvas", "Vitest", "Playwright", "Cloudflare Pages"],
    problem:
      "한 판이 끝나면 아무것도 남지 않았다. 다시 켤 이유를 만들려면 '데이터 → 한 판 기록 → 누적 저장'이 한 방향으로 흘러야 했다.",
    build:
      "엔진·UI·밸런스는 손대지 않고 누적 레이어만 얹었다. 업적 40종(진행·수집·기록·사건·밈 5그룹, 밈 10종은 달성 전까지 제목을 가린다)은 RunStats와 이번 판 반영 전 SaveData만 보는 순수 함수라 엔진을 몰라도 테스트된다. 데일리는 날짜 문자열 → FNV-1a seed → 기존 RNG라 같은 날이면 전 세계가 같은 판을 받는다. 규칙은 새 시스템이 아니라 ChallengeSpec 하나로 다섯 군데에서만 읽는다. 저장은 v1 → v2 키를 유지한 채 없는 필드만 채우고, 로드 시 구버전이면 즉시 새 형식으로 다시 써서 반쯤 마이그레이션된 상태를 남기지 않는다.",
    result:
      "실제 저장 크기 1.8KB(runHistory 30개 / daily 14일치로 상한). vitest 54개 통과(확장분 20개 신규), Playwright 종단 19항목 전부 통과, 콘솔 에러 0. 밸런스는 확장 전후 동일 — 정리형 35 / 막뽑기 27 / 저축형 26 / 합성안함 24. 연출용으로도 Math.random을 쓰지 않는다는 규칙을 지켜야 시뮬레이터 재현이 깨지지 않는다는 걸 배웠다.",
    demo: { label: "zunran.pages.dev", href: "https://zunran.pages.dev/" },
    github: { label: "djkdb/zunran", href: "https://github.com/djkdb/zunran" },
    year: "2026",
    themes: ["software", "product", "experiment"],
    pose: "night",
  },
  {
    id: "k-history",
    title: "자격증 학습 플랫폼",
    tagline: "한국사 · SQLD · 컴활 등 5개 시험을 한 코드베이스에서 배포",
    role: "기획 · 구현 · 테스트 전부",
    stack: ["TypeScript", "SVG", "Playwright", "Cloudflare Pages"],
    problem:
      "응시 기록이 쉰 회까지 쌓이는데 목록으로만 보여주고 있었다. 숫자를 눈으로 견주어서는 '오르는 중인지'를 알 수 없다. 틀린 개념은 복습 큐로 들어가지만 복습은 '오늘 볼 차례'만 꺼내 주기 때문에, 몇 번을 되풀이해 틀렸는지는 어디에도 드러나지 않았다.",
    build:
      "평균선 하나만 그리면 '무엇을 더 해야 하나'가 안 나오므로 과목별 선을 겹쳐 그리고 40점(과락)과 60점(합격)에 기준선을 넣었다. 그래야 '평균은 오르는데 데이터베이스만 제자리'가 보인다. 선 몇 개를 위해 첫 화면을 무겁게 할 이유가 없어서 차트 라이브러리 없이 SVG로 직접 그렸다. 실기에는 없던 '틀린 것만 다시 적기' 거르개를 넣고, 되틀린 횟수로 줄을 세운 '자주 틀리는 곳'을 홈에서 바로 가게 했다.",
    result:
      "한 저장소에서 k-history · SQLD · 컴활 · zunic · zuneip 다섯 배포를 굴린다. 검사를 쓰면서 두 번 헛걸렸다 — 포인터 문항은 물음이 '다음 C 프로그램의 출력 결과는?'이라 낱말로 가려낼 수 없었고, 적는 칸 안내말은 placeholder라 innerText에 잡히지 않았다. 둘 다 멀쩡한 화면을 실패로 적었다. 데이터에서 기대 집합을 뽑아 대조하도록 고쳤다.",
    demo: { label: "k-history.pages.dev", href: "https://k-history.pages.dev/" },
    github: { label: "djkdb/k-history", href: "https://github.com/djkdb/k-history" },
    year: "2026",
    themes: ["web", "product", "software"],
    pose: "books",
  },
  {
    id: "zunto",
    title: "ZUNTO",
    tagline: "A/B 토론 진행 도구 — 반박 배정 버그를 시뮬레이션으로 잡아냈다",
    role: "기획 · 구현 · 검증",
    stack: ["TypeScript", "Cloudflare Workers"],
    problem:
      "A와 B가 번갈아 말하도록 지그재그로 세운 뒤 '바로 앞 사람'을 반박 대상으로 잡고 있었다. 인원이 반반이면 앞 사람이 곧 반대편이라 맞지만, 한쪽으로 쏠리면 지그재그가 꼬리에서 깨져 같은 편끼리 반박하게 된다.",
    build:
      "2~8명 × 편 구성 전부를 돌려서 문제 규모부터 쟀다. 그다음 반대편에서만 고르도록 바꾸고, 편마다 커서를 따로 돌려 반대편 사람들에게 고르게 분배했다(4명 2:2 → 각자 1회씩). 전원이 같은 편이라 반대편이 아예 없을 때만 앞 사람으로 물러난다.",
    result:
      "수정 전 반박 배정 659건 중 같은 편을 반박 156건(23.7%), 자기 자신을 반박 66건(10.0%). 눈으로는 안 보이던 버그였고, 전 조합을 돌려보지 않았다면 못 찾았다.",
    demo: { label: "zunto.tjdwns2121.workers.dev", href: "https://zunto.tjdwns2121.workers.dev/" },
    github: { label: "djkdb/zunto", href: "https://github.com/djkdb/zunto" },
    year: "2026",
    themes: ["web", "product"],
    pose: "present",
  },
  {
    id: "ailab",
    title: "AI LAB",
    tagline: "AI를 배우는 앱이 아니라 내 AI 레벨을 올리는 앱",
    role: "기획 · 구현 · 배포 · 인스타 유입 설계",
    stack: ["TypeScript", "PWA", "Cloudflare Pages"],
    problem:
      "인스타 DM으로 링크를 받고 들어오는 사람이 기준이다. 그 사람은 이게 뭔지도, 뭘 눌러야 하는지도 모른 채 도착한다. 게다가 인스타·카톡 인앱 브라우저는 저장소가 기본 브라우저와 분리돼 있어서 창을 닫으면 기록이 사라진다 — 인스타 배포에서 기록이 날아가는 가장 흔한 원인이다.",
    build:
      "첫 방문 배너에 한 줄 정의 + 3단계 사용법 + 기능 8종을 칩으로 넣고, 390px 화면에 배너가 통째로 들어가도록(508px) 맞췄다. 한 번 닫으면 다시 안 뜬다. 인앱 브라우저는 UA로 감지해 iOS/안드로이드 문구를 나눠 안내하고 주소 복사 버튼을 준다. 기록은 JSON으로 내보내고 다시 불러올 수 있게 했고, 잘못된 파일은 이유를 알려주되 기존 기록은 건드리지 않는다.",
    result:
      "CSS 변경 / 화면 JS 변경 / 상태 스키마 확장 세 가지로 업데이트를 재현해 레벨·XP·레슨·배지·오답노트·스트릭이 전부 보존되는 걸 확인했다. 백업 → 초기화 → 복원 왕복도 값이 정확히 일치한다. UX 검사 23/23.",
    demo: { label: "ailab-dwi.pages.dev", href: "https://ailab-dwi.pages.dev/" },
    github: { label: "djkdb/ailab", href: "https://github.com/djkdb/ailab" },
    year: "2026",
    themes: ["ai", "product", "content"],
    pose: "idea",
  },
  {
    id: "zunme",
    title: "ZUNME",
    tagline: "멀티플레이 서바이벌 — 떨어져도 아무 일도 없던 12초를 고쳤다",
    role: "기획 · 구현 · 서버 판정",
    stack: ["TypeScript", "Cloudflare Workers", "WebSocket"],
    problem:
      "용암 탈출에서 떨어지는 데 아무 대가가 없었다. 타워 바닥 원반이 나선에서 떨어진 사람을 받아냈고, 용암은 그 바닥보다 3.5m '아래'에서 시작했다. 첫 12초 동안은 추락이 곧 단단한 땅에 서 있는 것이었다 — 소리도, 탈락도, 질 방법도 없었다.",
    build:
      "낙하 판정을 바닥이 아니라 탈락 평면 기준으로 옮기고, 클라이언트가 같은 추락을 계속 호스트에 다시 보내던 흐름을 끊었다. 옥상 러너에도 같은 판정을 적용했다.",
    result: "TODO — 수정 후 실제 플레이에서 확인한 것 한 줄",
    demo: { label: "zunme.tjdwns2121.workers.dev", href: "https://zunme.tjdwns2121.workers.dev/" },
    github: { label: "djkdb/zunme", href: "https://github.com/djkdb/zunme" },
    year: "2026",
    themes: ["software", "product"],
    pose: "run",
  },
  {
    id: "star-movie",
    title: "STAR MOVIE",
    tagline: "하늘 전체가 한 화면에 들어오는 거리를 계산해서 줌 한계를 정했다",
    role: "기획 · 3D 구현",
    stack: ["TypeScript", "Three.js", "Cloudflare Pages"],
    problem:
      "줌 한계가 900에서 멈췄는데 바깥 배경 구가 반지름 950~1020이었다. 가장 먼 별이 항상 카메라 뒤에 있었고, 우주를 통째로 볼 수 있는 자리가 아예 없었다.",
    build:
      "반지름 R인 구가 수직 60° 시야에 들어오려면 최소 2R 떨어져야 하고, 이 하늘에서는 약 2040이다. 한계를 2200으로 올리고 실루엣 둘레에 여유를 뒀다. far plane도 따라 올렸다 — 구의 뒷면은 카메라 거리 + 자기 반지름에 있으므로 2000이었다면 하늘 전체를 보려는 바로 그 순간에 반이 잘렸을 것이다.",
    result:
      "줌은 곱셈이라 2.4배 먼 한계에 도달하는 데 스크롤 1초도 더 안 걸린다 — 휠 감각은 그대로다. 그리고 비행 테스트가 상수가 아니라 900을 하드코딩해 검증하고 있었다. 아무도 강제하지 않는 경계를 계속 통과시키고 있었던 셈이다.",
    demo: { label: "star-movie.pages.dev", href: "https://star-movie.pages.dev/" },
    github: { label: "djkdb/star-movie", href: "https://github.com/djkdb/star-movie" },
    year: "2026",
    themes: ["web", "experiment", "software"],
    pose: "telescope",
  },
  {
    id: "zunge",
    title: "ZUNGE",
    tagline: "홈 화면에 추가했더니 상단이 다이나믹 아일랜드에 가려 있었다",
    role: "기획 · 구현",
    stack: ["TypeScript", "PWA", "Cloudflare Workers"],
    problem:
      "홈 화면에서 실행하면 viewport-fit=cover와 black-translucent 때문에 화면이 상태바 아래까지 넓어진다. 그런데 안전 영역을 처리하는 건 하단바뿐이어서 상단바의 자금·사용자·레벨이 시계와 다이나믹 아일랜드에 그대로 가려 있었다.",
    build:
      "env()를 :root 변수로 한 번 받고 상단바에 위쪽 안전 영역을 준다. 배경은 여전히 화면 끝까지 채워 상태바 뒤를 덮고 내용만 아래로 밀린다. 가로 모드의 좌우 노치도 함께 처리했고, 모달과 공간 소개는 안전 영역과 기본 여백 중 큰 쪽을 쓰게 했다.",
    result: "TODO — 실제 기기에서 확인한 결과 한 줄",
    demo: { label: "zunge.tjdwns2121.workers.dev", href: "https://zunge.tjdwns2121.workers.dev/" },
    github: { label: "djkdb/zunge", href: "https://github.com/djkdb/zunge" },
    year: "2026",
    themes: ["web", "product"],
    pose: "phone",
  },
  {
    id: "travle",
    title: "TRAVLE",
    tagline: "연수 일정표 PWA — 이미 설치된 기기까지 갱신이 닿게",
    role: "기획 · 구현 · 운영 반영",
    stack: ["TypeScript", "PWA", "Service Worker", "Cloudflare Pages"],
    problem:
      "일정표에는 08:30으로 적혀 있었지만 운영진 공지로 8시 출발이 확정됐다. 종이 일정표와 달리 앱은 이미 설치된 기기에도 바뀐 시각이 닿아야 한다.",
    build:
      "일정 카드 시각을 앞당기고, 연수 중 가장 이른 출발이라는 안내와 변경 출처를 카드 설명에 남겼다. 팀 규칙 문구도 같은 시각으로 맞췄다. 서비스워커와 version.json 빌드값을 함께 올려 업데이트가 전파되게 했다.",
    result: "TODO — 실제로 몇 명이 썼는지 / 반응 한 줄",
    demo: { label: "travle.pages.dev", href: "https://travle.pages.dev/" },
    github: { label: "djkdb/travle", href: "https://github.com/djkdb/travle" },
    year: "2026",
    themes: ["web", "product"],
    pose: "backpack",
  },
  {
    id: "zun-portfolio",
    title: "이 포트폴리오",
    tagline: "코드 에디터 바닥 위를 달리는 /play를 얹은 개인 사이트",
    role: "기획 · 디자인 · 구현 전부",
    stack: ["Next.js", "TypeScript", "Three.js", "R3F", "Tailwind", "Cloudflare Pages"],
    problem: "나를 설명할 공간이 필요했다. 배포된 것들은 흩어져 있고, 왜 그렇게 만들었는지는 커밋 메시지에만 남아 있었다.",
    build:
      "/play의 바닥을 하나의 거대한 에디터로 만들었다. 2048px 캔버스 텍스처가 줄 번호와 문법 강조가 들어간 zun.ts를 그리고, 모든 줄이 주행 차선이 된다. 강조된 ZONE 줄로 올라가면 그 줄이 실행되며 해당 카드가 열린다.",
    result:
      "빌드·ESLint·타입체크 통과, axe 위반 0건, 390px에서 가로 넘침 없음, Lighthouse 모바일 94 / 데스크톱 100. 만들고 나서 '프로젝트 사이를 차로 달리기'가 원본 포크 1,000개짜리 클리셰라는 걸 알았다 — 참신함 예산을 먼저 확인했어야 했다.",
    demo: { label: "zun-1vu.pages.dev", href: "https://zun-1vu.pages.dev/" },
    github: { label: "djkdb/zun", href: "https://github.com/djkdb/zun" },
    year: "2026",
    themes: ["web", "software", "experiment"],
    pose: "code",
  },

  /* ---- 배포는 확인됐지만 설명이 아직 없는 것들 ---- */
  {
    id: "zunfood",
    title: "ZUNFOOD",
    tagline: "TODO: 한 줄 소개",
    role: "TODO: 역할",
    stack: ["Cloudflare Workers"],
    problem: "TODO: 어떤 문제에서 출발했는지",
    build: "TODO: 무엇을 어떻게 만들었는지",
    result: "TODO: 결과 / 배운 점",
    demo: { label: "zunfood.tjdwns2121.workers.dev", href: "https://zunfood.tjdwns2121.workers.dev/" },
    github: { label: "djkdb/zunfood", href: "https://github.com/djkdb/zunfood" },
    year: "2026",
    themes: ["web", "experiment"],
    draft: true,
    pose: "tea",
  },
  {
    id: "zunrpg",
    title: "ZUNRPG",
    tagline: "TODO: 한 줄 소개",
    role: "TODO: 역할",
    stack: ["Cloudflare Workers"],
    problem: "TODO: 어떤 문제에서 출발했는지",
    build: "TODO: 무엇을 어떻게 만들었는지",
    result: "TODO: 결과 / 배운 점",
    demo: { label: "zunrpg.tjdwns2121.workers.dev", href: "https://zunrpg.tjdwns2121.workers.dev/" },
    github: { label: "djkdb/zunrpg", href: "https://github.com/djkdb/zunrpg" },
    year: "2026",
    themes: ["software", "experiment"],
    draft: true,
    pose: "experiment",
  },
  {
    id: "cavero",
    title: "CAVERO",
    tagline: "TODO: 한 줄 소개 (커밋에 남은 단서: 성장 기록)",
    role: "TODO: 역할",
    stack: ["Cloudflare Workers"],
    problem: "TODO: 어떤 문제에서 출발했는지",
    build: "성장 기록 저장이 실패해도 화면 전체가 죽지 않도록 분리했다. (TODO: 나머지)",
    result: "TODO: 결과 / 배운 점",
    demo: { label: "cavero.tjdwns2121.workers.dev", href: "https://cavero.tjdwns2121.workers.dev/" },
    github: { label: "djkdb/zunall", href: "https://github.com/djkdb/zunall" },
    year: "2026",
    themes: ["web", "product"],
    draft: true,
    pose: "write",
  },
  {
    id: "zungong",
    title: "ZUNGONG",
    tagline: "TODO: 한 줄 소개",
    role: "TODO: 역할",
    stack: ["Cloudflare Workers"],
    problem: "TODO: 어떤 문제에서 출발했는지",
    build: "TODO: 무엇을 어떻게 만들었는지",
    result: "TODO: 결과 / 배운 점",
    demo: { label: "zungong.tjdwns2121.workers.dev", href: "https://zungong.tjdwns2121.workers.dev/" },
    github: { label: "djkdb/zungong", href: "https://github.com/djkdb/zungong" },
    year: "2026",
    themes: ["web"],
    draft: true,
    pose: "search",
  },
  {
    id: "zuntudy",
    title: "ZUNTUDY",
    tagline: "TODO: 한 줄 소개",
    role: "TODO: 역할",
    stack: [],
    problem: "TODO: 어떤 문제에서 출발했는지",
    build: "TODO: 무엇을 어떻게 만들었는지",
    result: "TODO: 결과 / 배운 점",
    demo: { label: "zuntudy.pages.dev", href: "https://zuntudy.pages.dev/" },
    year: "2026",
    themes: ["web", "product"],
    draft: true,
    pose: "book",
  },
  {
    id: "capme",
    title: "CAPME",
    tagline: "TODO: 한 줄 소개",
    role: "TODO: 역할",
    stack: ["Node 22"],
    problem: "TODO: 어떤 문제에서 출발했는지",
    build:
      "Cloudflare Pages · Netlify · Vercel 모두 .node-version을 읽으므로 GitHub Actions와 같은 버전으로 고정했다. 호스트가 옛 Node로 기본 설정돼 있어도 CI와 다른 빌드가 나오지 않는다.",
    result: "TODO: 결과 / 배운 점",
    demo: { label: "capme.pages.dev", href: "https://capme.pages.dev/" },
    github: { label: "djkdb/capme", href: "https://github.com/djkdb/capme" },
    year: "2026",
    themes: ["web", "software"],
    draft: true,
    pose: "tablet",
  },
];
