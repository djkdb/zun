import type { Metadata } from "next";
import { PlayClient } from "./PlayClient";

export const metadata: Metadata = {
  title: "Playground",
  description: "Drive around ZUN's world. Bump the blocks, find the zones.",
};

export default function PlayPage() {
  return (
    <main id="main" className="fixed inset-0 overflow-hidden">
      <PlayClient />
    </main>
  );
}
