import type { Activity } from "./types";

/**
 * ACTIVITIES — 학과 · 동아리 · 창업 · 서포터즈.
 *
 * 이름과 소속은 본인 확인 사항이며, `takeaway`가 TODO인 항목은 아직 한 줄을
 * 받지 못한 것입니다. 성과나 기간을 추정해 채우지 않습니다.
 */
export const activities: Activity[] = [
  {
    id: "major",
    title: "충북대학교 소프트웨어학부 · 인공지능 전공",
    category: "전공",
    description:
      "소프트웨어학부에서 인공지능을 전공하고 있습니다. 수업에서 배운 것을 그대로 두지 않고 배포까지 가는 것을 기본으로 삼습니다.",
    takeaway: "TODO: 전공에서 얻은 것 한 줄",
  },
  {
    id: "football",
    title: "학과 축구동아리 회장",
    category: "동아리 · 리더십",
    description: "학과 축구동아리를 맡아 운영하고 있습니다.",
    takeaway: "TODO: 회장을 맡으며 배운 것 한 줄 (인원·일정·갈등 조율 등)",
  },
  {
    id: "nestnet",
    title: "학술동아리 네스트넷 임원",
    category: "동아리 · 학술",
    description: "학술동아리 네스트넷에서 임원으로 활동하고 있습니다.",
    takeaway: "TODO: 어떤 활동을 맡았고 무엇을 얻었는지 한 줄",
  },
  {
    id: "startup-club",
    title: "교내 창업동아리",
    category: "창업",
    description: "학교 창업동아리에서 아이디어를 제품으로 만드는 과정을 연습하고 있습니다.",
    takeaway: "TODO: 어떤 아이템이었고 무엇을 배웠는지 한 줄",
  },
  {
    id: "modu-startup",
    title: "모두의창업 아이디어심사 — 신속심사 통과",
    category: "창업 · 심사 통과",
    description: "모두의창업 아이디어 심사에서 신속심사를 통과했습니다.",
    takeaway: "TODO: 어떤 아이디어로 통과했는지 한 줄",
  },
  {
    id: "naver-ai-digging",
    title: "네이버 AI 디깅 클럽",
    category: "서포터즈",
    description: "네이버 AI 디깅 클럽에서 활동했습니다.",
    takeaway: "TODO: 여기서 얻은 것 한 줄",
  },
  {
    id: "whatjob",
    title: "왓잡 서포터즈",
    category: "서포터즈",
    description: "왓잡 서포터즈로 활동했습니다.",
    takeaway: "TODO: 여기서 얻은 것 한 줄",
  },
  {
    id: "teazr",
    title: "teazr 서포터즈",
    category: "서포터즈",
    description: "teazr 서포터즈로 활동했습니다.",
    takeaway: "TODO: 여기서 얻은 것 한 줄",
  },
  {
    id: "public-ax",
    title: "청년 공공 AX 서포터즈",
    category: "서포터즈 · 공공",
    description: "청년 공공 AX 서포터즈로 활동했습니다.",
    takeaway: "TODO: 여기서 얻은 것 한 줄",
  },
  {
    id: "van-ai",
    title: "VAN AI 혁신부",
    category: "서포터즈 · AI",
    description: "VAN AI 혁신부에서 활동했습니다.",
    takeaway: "TODO: 여기서 얻은 것 한 줄",
  },
  {
    id: "eeworks",
    title: "이이웍스 대학생 크리에이터",
    category: "크리에이터",
    description: "이이웍스 대학생 크리에이터로 활동했습니다.",
    takeaway: "TODO: 여기서 얻은 것 한 줄",
  },
  {
    id: "codeit-10x",
    title: "코드잇 10x 체험단",
    category: "체험단",
    description: "코드잇 10x 체험단으로 활동했습니다.",
    takeaway: "TODO: 여기서 얻은 것 한 줄",
  },
];
