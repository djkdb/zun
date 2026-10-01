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
    tagline: "편의점 야간근무 — 새벽 3시, 혼자 남았다. 업적 40종, 전 세계 같은 데일리",
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
  },
  {
    id: "k-history",
    title: "자격증 학습 플랫폼",
    tagline: "한국사 · SQLD · 컴활 · 토익 · 정보처리기사 — 다섯 시험을 한 코드베이스에서",
    role: "기획 · 구현 · 테스트 전부",
    stack: ["TypeScript", "SVG", "Playwright", "Cloudflare Pages"],
    problem:
      "응시 기록이 쉰 회까지 쌓이는데 목록으로만 보여주고 있었다. 숫자를 눈으로 견주어서는 '오르는 중인지'를 알 수 없다. 틀린 개념은 복습 큐로 들어가지만 복습은 '오늘 볼 차례'만 꺼내 주기 때문에, 몇 번을 되풀이해 틀렸는지는 어디에도 드러나지 않았다.",
    build:
      "평균선 하나만 그리면 '무엇을 더 해야 하나'가 안 나오므로 과목별 선을 겹쳐 그리고 40점(과락)과 60점(합격)에 기준선을 넣었다. 그래야 '평균은 오르는데 데이터베이스만 제자리'가 보인다. 선 몇 개를 위해 첫 화면을 무겁게 할 이유가 없어서 차트 라이브러리 없이 SVG로 직접 그렸다. 실기에는 없던 '틀린 것만 다시 적기' 거르개를 넣고, 되틀린 횟수로 줄을 세운 '자주 틀리는 곳'을 홈에서 바로 가게 했다.",
    result:
      "한 저장소에서 한국사 레전드 마스터 · SQLD 마스터 · 컴활 마스터 · 토익 마스터 · 정보처리기사 마스터 다섯 배포를 굴린다. 검사를 쓰면서 두 번 헛걸렸다 — 포인터 문항은 물음이 '다음 C 프로그램의 출력 결과는?'이라 낱말로 가려낼 수 없었고, 적는 칸 안내말은 placeholder라 innerText에 잡히지 않았다. 둘 다 멀쩡한 화면을 실패로 적었다. 데이터에서 기대 집합을 뽑아 대조하도록 고쳤다.",
    demo: { label: "k-history.pages.dev", href: "https://k-history.pages.dev/" },
    github: { label: "djkdb/k-history", href: "https://github.com/djkdb/k-history" },
    year: "2026",
    themes: ["web", "product", "software"],
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
  },

  /* ---- 배포는 확인됐지만 설명이 아직 없는 것들 ---- */
  {
    id: "zunterview",
    title: "INTERVIEW//AI",
    tagline: "질문만 하지 않는다 — 내 답변을 듣고 다시 파고드는 모의면접실",
    role: "기획 · 데이터 설계 · 구현 전부",
    stack: ["React", "Vite", "TypeScript", "Tailwind", "Framer Motion", "Anthropic SDK"],
    problem:
      "모의면접 서비스는 질문을 순서대로 읽어 줄 뿐이라, 실제 면접에서 제일 무서운 꼬리질문이 없다. 그리고 개발 직무 질문만 있어서 회계·간호·생산관리를 준비하는 사람은 쓸 수가 없다.",
    build:
      "직무를 51개 도메인 · 72개 직군 · 256개 직무로 나누고 질문 7,989개를 직무별 설계도에 맞춰 붙였다. 꼬리질문은 답변에서 실제로 말한 표현을 집어 다시 묻고, 파고드는 방향이 직무마다 다르다 — 개발은 기술 선택→트레이드오프→장애, 회계는 업무→기준→오류→처리. 기업 54곳 1,547문항은 인재상·전형과 함께 넣었고, 이력서를 올리면 면접관이 그 주장을 검증하는 질문을 던진다.",
    result:
      "어떤 질문도 '기출'로 표시하지 않고 공개후기 기반 · 공식자료 기반 · 공고기반 · 직무기반으로 출처를 밝힌다. 연습용 재구성과 실제 기출은 다른 것이고, 그 구분을 흐리면 쓰는 사람이 잘못된 기대를 갖는다.",
    demo: { label: "zunterview.pages.dev", href: "https://zunterview.pages.dev/" },
    github: { label: "djkdb/zunterview", href: "https://github.com/djkdb/zunterview" },
    year: "2026",
    themes: ["ai", "product", "web"],
  },
  {
    id: "zuncam",
    title: "Campus OS",
    tagline: "'무엇이 있는지'가 아니라 '그래서 지금 뭘 해야 하지'에 답하는 대학생활 OS",
    role: "기획 · 구현 · 우선순위 엔진 설계",
    stack: ["Next.js", "React", "TypeScript", "Tailwind", "Anthropic SDK", "Cloudflare Workers"],
    problem:
      "시간표 앱, 과제 앱, 캘린더를 따로 쓰면 각각은 맞는데 '지금 이 순간 뭘 해야 하는가'는 아무도 안 알려준다. 마감까지 7시간 남은 과제와 2시간 뒤 풋살과 이동 시간을 머릿속에서 합쳐야 한다.",
    build:
      "시간표·과제·일정을 하나의 컨텍스트로 합치고, 우선순위·플래너·충돌 계산은 전부 결정론적 코드로 짰다. AI 는 그 결과를 설명하는 데만 쓴다 — 계산은 코드, 설명은 AI.",
    result:
      "AI 에게 숫자를 맡기면 그럴듯하지만 재현되지 않는 답이 나온다. 계산을 코드로 내리니 테스트가 가능해졌고, 같은 상황에서 같은 추천이 나온다.",
    demo: { label: "zuncam.tjdwns2121.workers.dev", href: "https://zuncam.tjdwns2121.workers.dev/" },
    github: { label: "djkdb/zuncam", href: "https://github.com/djkdb/zuncam" },
    year: "2026",
    themes: ["ai", "product", "software"],
  },
  {
    id: "zun2o",
    title: "12%",
    tagline: "새벽 2시, 폐교 앞 전화부스에서 주운 휴대폰 — 배터리 12%",
    role: "기획 · 시나리오 · 구현 전부",
    stack: ["React", "Vite", "TypeScript", "Web Audio", "PWA"],
    problem:
      "주운 휴대폰 호러(Simulacra 계열)를 웹에서 하려면 보통 영상과 음원을 잔뜩 받아야 한다. 그러면 모바일에서 열자마자 수십 MB 를 쓰고, 저작권도 따라붙는다.",
    build:
      "화면 전체가 실종된 유튜버의 휴대폰이다. 잠금을 풀고 메시지·사진·녹음·통화·브라우저를 뒤지며 챕터 5개를 지나 엔딩 3개 중 하나에 닿는다. 외부 음원을 하나도 쓰지 않았다 — 소리는 Web Audio 로 합성하고, 목소리는 브라우저 음성 합성에 음절마다 숨소리를 입혔다. 홈 화면에 추가하면 오프라인으로 돈다.",
    result:
      "실제 시각과 무관하게 플레이할 수 있게 하되, 진짜 새벽 2시에 끝까지 가면 대사 한 줄이 더 나온다. 조건을 강제하지 않으면서 보상만 숨겨 두는 쪽이 낫다고 판단했다.",
    demo: { label: "zun2o.pages.dev", href: "https://zun2o.pages.dev/" },
    github: { label: "djkdb/zun2o", href: "https://github.com/djkdb/zun2o" },
    year: "2026",
    themes: ["web", "experiment", "product"],
  },
  {
    id: "zunbeat",
    title: "BEAT//SHIFT",
    tagline: "곡 9개를 전부 코드로 작곡한 4레인 리듬게임",
    role: "기획 · 작곡 · 구현 전부",
    stack: ["React", "Vite", "TypeScript", "Web Audio"],
    problem:
      "리듬게임의 진짜 장벽은 게임 로직이 아니라 음원이다. 외부 음원을 쓰면 배포할 수 없고, 무료 음원을 쓰면 판정 타이밍을 내가 통제할 수 없다.",
    build:
      "곡 9개를 Web Audio 로 합성해 직접 작곡했다. 리드 음색은 슈퍼소우·칩튠 펄스·FM 벨 중에서 고르고, 킥 디스토션·하이햇 레벨·사이드체인 양으로 장르를 낸다. 난이도 3단계로 차트 27개. 키보드(D F J K)와 모바일 터치를 같이 받는다.",
    result:
      "외부 음원·샘플 파일이 0개라 저작권 문제가 없고, 곡 간 음량은 마스터 단계에서 맞췄다. 기록은 localStorage 에만 저장해 서버가 필요 없다.",
    demo: { label: "zunbeat.pages.dev", href: "https://zunbeat.pages.dev/" },
    github: { label: "djkdb/zunbeat", href: "https://github.com/djkdb/zunbeat" },
    year: "2026",
    themes: ["web", "experiment"],
  },
  {
    id: "zunho",
    title: "THE LAST ROOM",
    tagline: "잠긴 서재 — 모든 사물이 누군가 남긴 문장이다",
    role: "기획 · 퍼즐 설계 · 구현 전부",
    stack: ["React", "Vite", "TypeScript", "SVG", "Web Audio"],
    problem:
      "방탈출 게임은 보통 이미지 에셋 덩어리라 로딩이 길고, 세로 화면에서 깨진다.",
    build:
      "퍼즐 6개가 사슬처럼 이어지고, 주의 깊게 보면 두 번째 엔딩이 있다. 그림은 전부 손으로 쓴 SVG/CSS 이고 소리는 Web Audio 로 실시간 합성해 외부 파일이 하나도 없다. 한국어·영어를 지원하고 9:16 세로 화면(화면 녹화 포함)에서도 동작한다.",
    result: "TODO — 플레이한 사람들 반응 한 줄",
    demo: { label: "zunho.pages.dev", href: "https://zunho.pages.dev/" },
    github: { label: "djkdb/zunho", href: "https://github.com/djkdb/zunho" },
    year: "2026",
    themes: ["web", "experiment"],
  },
  {
    id: "zunsic",
    title: "MARKET//30",
    tagline: "30일 · 100만원 · 하나의 시장 — 가상 주식 투자 게임",
    role: "기획 · 시뮬레이션 설계 · 구현",
    stack: ["React", "Vite", "TypeScript", "Tailwind", "Zustand"],
    problem:
      "투자를 연습해 보고 싶은데 실제 계좌로 배우면 수업료가 너무 비싸다. 반대로 '모의투자'를 표방하면서 실제 종목을 쓰면 투자 권유로 읽힐 수 있다.",
    build:
      "가상 기업·가격·뉴스로만 이루어진 닫힌 시장을 만들었다. 매일 아침 뉴스가 나오고 가격이 움직이며 30일 뒤 성적이 나온다. 실제 주가 API 를 쓰지 않고 증권 계좌 연결·주문·결제 기능도 넣지 않았다.",
    result:
      "README 와 앱 안에 '완전히 가상이며 투자 추천이 아니다'를 먼저 적었다. 재미있게 만드는 것보다 오해하지 않게 만드는 게 먼저인 종류의 소재가 있다.",
    demo: { label: "zunsic.pages.dev", href: "https://zunsic.pages.dev/" },
    github: { label: "djkdb/zunsic", href: "https://github.com/djkdb/zunsic" },
    year: "2026",
    themes: ["web", "product", "experiment"],
  },
  {
    id: "zunmal",
    title: "말랑 뽑기방",
    tagline: "말랑이 32종을 모으는 모바일 우선 수집 게임",
    role: "기획 · 캐릭터 디자인 · 구현 전부",
    stack: ["React", "Vite", "TypeScript", "Three.js", "Zustand", "SVG"],
    problem:
      "수집형 게임은 캐릭터 에셋이 전부인데, 이미지를 쓰면 종수를 늘릴수록 용량이 늘고 등급별 연출을 바꾸기 어렵다.",
    build:
      "말랑이 32종을 전부 SVG 로 직접 그렸다(일반 10 · 레어 7 · 에픽 6 · 전설 4 · 신화 2 · 약 2000분의 1 시크릿 3). 등급마다 캡슐 색·효과음·결과 연출이 다르고 시크릿이 나올 때는 머신이 이상해진다. 꾹 누르면 찌그러지고 당기면 늘어나는 촉감은 찰박이는 소리까지 WebAudio 로 합성했다.",
    result: "TODO — 실제로 몇 명이 뽑아봤는지 / 반응 한 줄",
    demo: { label: "zunmal.pages.dev", href: "https://zunmal.pages.dev/" },
    github: { label: "djkdb/zunmal", href: "https://github.com/djkdb/zunmal" },
    year: "2026",
    themes: ["web", "experiment"],
  },
  {
    id: "zun-board",
    title: "zun-board",
    tagline: "서포터즈·대외활동 8개를 동시에 굴리기 위한 개인용 대시보드",
    role: "기획 · CLI · 파싱 · 대시보드 전부",
    stack: ["Node.js", "Supabase", "Claude Code CLI", "Cloudflare Pages"],
    problem:
      "서포터즈를 여러 개 하면 운영진 안내문이 카톡·메일·노션으로 흩어져 들어온다. 그걸 매번 손으로 옮겨 적는 게 활동 자체보다 번거로웠다.",
    build:
      "안내문 원문을 그대로 CLI 에 던지면 파싱해서 Supabase 에 넣는다. 쓰기는 CLI, 읽기와 진행상태 토글은 웹 대시보드로 역할을 갈랐다. 파싱은 Anthropic API 종량과금 대신 구독 중인 Claude Code CLI 를 서브프로세스로 호출해 처리한다.",
    result:
      "실제로 내 활동 8개를 이걸로 굴리고 있다. 대시보드는 CDN 만 쓰는 단일 HTML 파일이라 빌드 단계가 없다.",
    demo: { label: "zun-activity-management.pages.dev", href: "https://zun-activity-management.pages.dev/" },
    github: { label: "djkdb/zun_activity_management", href: "https://github.com/djkdb/zun_activity_management" },
    year: "2026",
    themes: ["product", "ai", "software"],
  },
  {
    id: "songbang",
    title: "셋리.",
    tagline: "노래방에서 '뭐 부르지' 하는 시간을 없애는 랜덤 선곡기",
    role: "기획 · 구현",
    stack: ["JavaScript", "GitHub Pages"],
    problem:
      "노래방에서 인기차트를 한참 뒤지다 시간을 버린다. 정작 내가 부를 수 있는 노래는 따로 있는데 그게 어디에도 정리돼 있지 않다.",
    build:
      "내 노래 목록에 제목·가수·TJ/금영 번호·태그를 저장해 두고, 버튼 하나로 뽑는다. 내 노래 / 인기차트 / 둘 다 중에 고르고 장르로 거를 수 있으며, 오늘 이미 뽑은 곡은 제외한다.",
    result: "TODO — 실제로 노래방에서 써본 결과 한 줄",
    demo: { label: "djkdb.github.io/songbang", href: "https://djkdb.github.io/songbang/" },
    github: { label: "djkdb/songbang", href: "https://github.com/djkdb/songbang" },
    year: "2026",
    themes: ["web", "product"],
  },
  {
    id: "youju",
    title: "YOUJU",
    tagline: "당신이라는 우주 — 하루가 달이 되고, 한 달이 행성이 되고, 한 해가 우주가 된다",
    role: "기획 · 3D 구현",
    stack: ["React", "Vite", "TypeScript", "Three.js", "R3F", "Zustand"],
    problem:
      "일기 앱은 쓸수록 목록만 길어진다. 1년을 썼는데 1년이 어땠는지는 여전히 안 보인다.",
    build: "1년을 하나의 태양계로, 열두 달을 행성으로 띄운다. 하루의 기록이 달이 되어 그 달 행성 주위를 돈다.",
    result: "TODO — 결과 / 배운 점",
    github: { label: "djkdb/youju", href: "https://github.com/djkdb/youju" },
    year: "2026",
    themes: ["web", "experiment"],
  },
  {
    id: "zunvis",
    title: "JUNVIS",
    tagline: "macOS 개인 AI OS — 개발 비서가 아니라 CTO·콘텐츠 매니저·PM",
    role: "기획 · 구현",
    stack: ["Shell", "macOS"],
    problem:
      "AI 비서 도구는 많은데 전부 개발 보조에 머문다. 나에게 필요한 건 코드를 짜 주는 것보다 무엇을 만들지 같이 정하는 쪽이었다.",
    build:
      "Finder 에서 더블클릭하면 터미널이 열리고 코드 최신화부터 알아서 진행한다. 새 AI 비서를 처음부터 만들지 않고, 최고 수준 오픈소스를 분석해 장점만 흡수하는 방향으로 잡았다.",
    result: "TODO — 결과 / 배운 점",
    github: { label: "djkdb/zunvis", href: "https://github.com/djkdb/zunvis" },
    year: "2026",
    themes: ["ai", "software", "experiment"],
  },
  {
    id: "zunmorrow",
    title: "내일, 내 일",
    tagline: "잠들기 전 한 번의 이야기로 일정 · 준비물 · 이동을 연결하는 AI 일상 준비 에이전트",
    role: "기획 · 구현",
    stack: ["Cloudflare Workers"],
    problem:
      "내일 할 일을 알아도 준비물과 출발 시각은 따로 생각해야 한다. 그 사이에서 빠지는 것들이 아침을 망친다.",
    build:
      "잠들기 전에 내일 일정을 한 번 말하면 준비물과 이동을 함께 엮어 준다. (저장소가 비공개라 공개된 배포본에서 확인한 범위까지만 적습니다.)",
    result: "TODO — 결과 / 배운 점",
    demo: { label: "zunmorrow.tjdwns2121.workers.dev", href: "https://zunmorrow.tjdwns2121.workers.dev/" },
    github: { label: "비공개 저장소", href: "https://github.com/djkdb/zunmorrow", todo: true },
    year: "2026",
    themes: ["ai", "product"],
  },
  {
    id: "zun18",
    title: "18개월",
    tagline: "군생활 시뮬레이션",
    role: "기획 · 구현",
    stack: ["Cloudflare Pages"],
    problem: "TODO — 어떤 문제에서 출발했는지",
    build:
      "18개월을 시뮬레이션으로 겪게 하는 웹 게임입니다. (저장소가 비공개라 공개된 배포본에서 확인한 범위까지만 적습니다.)",
    result: "TODO — 결과 / 배운 점",
    demo: { label: "zun18.pages.dev", href: "https://zun18.pages.dev/" },
    github: { label: "비공개 저장소", href: "https://github.com/djkdb/zun18", todo: true },
    year: "2026",
    themes: ["web", "experiment"],
    draft: true,
  },
  {
    id: "zunfood",
    title: "MEALGAME",
    tagline: "오늘 뭐 먹지 — 고민하지 말고 게임으로 정하는 밥집 결정기",
    role: "기획 · 구현 · 배포 전부",
    stack: ["React", "Vite", "TypeScript", "Zustand", "Framer Motion", "Cloudflare Workers"],
    problem:
      "밥집을 못 정하는 시간이 밥 먹는 시간보다 길 때가 있다. 목록을 띄워 주는 앱은 이미 많은데, 목록을 봐도 결정은 여전히 안 된다. 결정을 대신 해 줄 게 아니라 결정을 재미있게 만들어야 했다.",
    build:
      "2~8명이 방을 만들고 링크·QR로 모여 각자 폰에서 플레이하는 모드와, 혼자서 룰렛·오늘의 운명·카테고리 뽑기·조건 추천·근처 인기로 뽑는 모드를 나눴다. 회원가입은 없다. 설정 없이도 돌아가도록 로컬 모드(같은 기기의 탭끼리 동기화)와 목업 식당 데이터를 넣어, 탭 네 개를 열면 혼자서 4인 플레이를 테스트할 수 있다.",
    result:
      "참가자 신원을 sessionStorage에 두니 탭이 곧 사람이 되어 멀티플레이 테스트에 서버가 필요 없어졌다. 설정 없이 바로 뜨는 것이 프로토타입에서는 기능 하나보다 크다.",
    demo: { label: "zunfood.tjdwns2121.workers.dev", href: "https://zunfood.tjdwns2121.workers.dev/" },
    github: { label: "djkdb/zunfood", href: "https://github.com/djkdb/zunfood" },
    year: "2026",
    themes: ["web", "product", "experiment"],
  },
  {
    id: "zunrpg",
    title: "STUDY CORP",
    tagline: "공부한 과목이 직원이 되는 학습 경영 RPG",
    role: "기획 · 구현 · 데이터 설계",
    stack: ["Next.js", "React 19", "TypeScript", "Zustand", "Framer Motion", "Cloudflare Workers"],
    problem:
      "공부 타이머는 시간을 재 주지만 쌓이는 느낌이 없다. 숫자가 늘어나는 것과 무언가가 자라는 것은 다르다.",
    build:
      "과목 이름을 넣으면 이수구분과 담당 직책을 자동으로 추천해 직원으로 만든다(운영체제 → 전공 · 시스템 조교). 학교를 고르면 그 학과의 표준 커리큘럼 과목이, 검색하면 정보처리기사·SQLD 등 5개 분야 50여 종 자격증이 자동완성된다. 공부 타이머가 곧 업무 수행이고, 1분 = 1 XP에 연속·목표·집중·시험기간·7일 보너스가 붙는다.",
    result:
      "학과별 과목은 실제 개설 과목이 아니라 표준 커리큘럼 추천이라, 그 사실을 앱 안에 그대로 적고 직접 입력으로 보완하게 했다. 데이터가 완벽하지 않을 때 숨기는 것보다 한계를 적는 쪽이 낫다.",
    demo: { label: "zunrpg.tjdwns2121.workers.dev", href: "https://zunrpg.tjdwns2121.workers.dev/" },
    github: { label: "djkdb/zunrpg", href: "https://github.com/djkdb/zunrpg" },
    year: "2026",
    themes: ["web", "product", "experiment"],
  },
  {
    id: "cavero",
    title: "Cavero — AI Career OS",
    tagline: "스펙을 관리하지 않는다. 많이 하는 것보다 맞는 것을 하게 한다",
    role: "기획 · 구현 · 점수 모델 설계",
    stack: ["Next.js", "React 19", "TypeScript", "Drizzle ORM", "Anthropic SDK", "Cloudflare Workers"],
    problem:
      "대외활동을 모아 두는 도구는 많지만, 모아 두기만 하면 다음에 뭘 해야 할지는 여전히 모른다. 그리고 AI에게 점수를 매기게 하면 그럴듯한 숫자가 나오지만 왜 그 숫자인지는 아무도 모른다.",
    build:
      "준비도 점수를 AI가 아니라 규칙이 계산한다 — 목표 스킬 충족도 55 + 실전 경험 15 + 검증 근거 15 + 기본기 15, 모든 항목에 산출 근거를 펼쳐 보여준다. 스킬 점수도 프로젝트·수상·활동 근거의 가중 합산(수확 체감)이라 점수를 열면 무엇이 얼마나 기여했는지 보인다. AI는 공고에서 요구 역량을 추출하는 데까지만 쓰고, 내 프로필과 비교하는 계산은 규칙 레이어가 한다.",
    result:
      "가장 마음에 드는 기능은 지원을 말리는 기능이다 — 준비 시간 대비 Gap 감소 효과가 낮으면 지원하지 말라고 하고 더 효과적인 대안을 준다. 추천하는 도구는 많아도 말리는 도구는 없었다.",
    demo: { label: "cavero.tjdwns2121.workers.dev", href: "https://cavero.tjdwns2121.workers.dev/" },
    github: { label: "djkdb/zunall", href: "https://github.com/djkdb/zunall" },
    year: "2026",
    themes: ["ai", "product", "web"],
  },
  {
    id: "zungong",
    title: "STUDYUP",
    tagline: "친구와 함께, 게임처럼 — 공부 시간을 공유하는 스터디 SNS",
    role: "기획 · 구현 · 실시간 동기화",
    stack: ["Next.js", "React 19", "Supabase Realtime", "TypeScript", "Zustand", "Cloudflare Workers"],
    problem:
      "혼자 재는 공부 시간은 사흘이면 그만둔다. 기록이 남는 것과 누가 보고 있는 것은 지속력이 다르다.",
    build:
      "타이머는 서버 타임스탬프 기준으로 기록해 새로고침·중복 실행에도 어긋나지 않게 했다. 친구가 지금 무엇을 공부 중인지 Supabase Realtime으로 보이고, 오늘·주간·시간·목표 네 가지 대결과 리더보드를 붙였다. 끝나면 1080×1920 인스타 스토리용 인증 카드를 Canvas로 그려 준다 — 공유가 다음 사람을 데려오는 고리다.",
    result:
      "공부 종료 → 카드 생성 → 스토리 공유 → 친구 유입 → 대결 → 다시 공유. 기능을 늘리는 대신 이 한 바퀴가 끊기지 않는지를 기준으로 붙일 것과 뺄 것을 정했다.",
    demo: { label: "zungong.tjdwns2121.workers.dev", href: "https://zungong.tjdwns2121.workers.dev/" },
    github: { label: "djkdb/zungong", href: "https://github.com/djkdb/zungong" },
    year: "2026",
    themes: ["web", "product"],
  },
  {
    id: "zuntudy",
    title: "ZUNTUDY",
    tagline: "AI에게 코드를 시키는 법이 아니라, AI와 함께 서비스를 만드는 법",
    role: "기획 · 모집 · 운영 · 구현",
    stack: ["Cloudflare Pages"],
    problem:
      "바이브코딩을 배우고 싶은 사람은 늘었는데, 대부분의 자료가 '프롬프트 잘 쓰는 법'에서 끝난다. 아이디어를 배포까지 끌고 가 본 경험이 없으면 거기서 멈춘다.",
    build:
      "만드는 법을 배우는 바이브코딩 스터디와 기록하는 법을 배우는 개발자 블로그 스터디, 두 갈래로 모집 페이지를 만들었다. 아이디어 하나를 들고 오면 배포까지 같이 가는 것이 기준이고, AI 구독이 없어도 처음이어도 들어올 수 있게 조건을 낮췄다.",
    result: "TODO — 실제 모집 결과 / 운영하며 배운 것 한 줄",
    demo: { label: "zuntudy.pages.dev", href: "https://zuntudy.pages.dev/" },
    year: "2026",
    themes: ["web", "product", "content"],
  },
  {
    id: "capme",
    title: "CAPME",
    tagline: "TODO: 한 줄 소개",
    role: "TODO: 역할",
    stack: ["Node 22"],
    problem: "TODO — 비공개 저장소라 아직 설명을 옮기지 못했습니다.",
    build:
      "Cloudflare Pages · Netlify · Vercel 모두 .node-version을 읽으므로 GitHub Actions와 같은 버전으로 고정했다. 호스트가 옛 Node로 기본 설정돼 있어도 CI와 다른 빌드가 나오지 않는다.",
    result: "TODO: 결과 / 배운 점",
    demo: { label: "capme.pages.dev", href: "https://capme.pages.dev/" },
    github: { label: "비공개 저장소", href: "https://github.com/djkdb/capme", todo: true },
    year: "2026",
    themes: ["web", "software"],
    draft: true,
  },
];
