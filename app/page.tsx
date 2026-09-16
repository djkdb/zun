import type { Metadata } from "next";
import { ZunOS } from "@/components/os";

export const metadata: Metadata = {
  title: "ZUN OS — Software × AI × Product",
  description:
    "ZUN의 포트폴리오를 하나의 운영체제로. 앱을 열고, 창을 옮기고, 터미널을 쓰면서 탐색합니다.",
};

/**
 * The site is an OS, not a page: boot → login → desktop → apps.
 * The scroll story still exists in full at /classic, rendered from the same /data.
 */
export default function Home() {
  return (
    <main id="main" className="h-full w-full">
      <ZunOS />
    </main>
  );
}
