import type { LoopStep } from "./types";

export const loopSteps: LoopStep[] = [
  {
    key: "build",
    title: "BUILD",
    body: "무언가를 만든다. 완벽하지 않아도 일단 동작하는 버전을 만든다.",
  },
  {
    key: "fail",
    title: "FAIL",
    body: "문제에 부딪힌다. 예상과 다르게 동작하거나, 아무도 쓰지 않는다.",
  },
  {
    key: "learn",
    title: "LEARN",
    body: "원인을 이해한다. 기술 문제인지, 문제 정의가 틀렸는지 구분한다.",
  },
  {
    key: "again",
    title: "BUILD AGAIN",
    body: "더 나은 방식으로 다시 만든다. 그리고 다시 공개한다.",
  },
];
