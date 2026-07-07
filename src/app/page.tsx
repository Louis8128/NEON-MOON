import type { Metadata } from "next";
import HomeContent from "@/components/HomeContent";

export const metadata: Metadata = {
  title: "NEON MOON",
  description:
    "NEON MOON is a quiet island in the online ocean for writing, photos, media notes, and small thoughts.",
};

export default function Home() {
  return <HomeContent />;
}
