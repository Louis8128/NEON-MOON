import type { Metadata } from "next";
import AboutContent from "@/components/AboutContent";

export const metadata: Metadata = {
  title: "About | NEON MOON",
  description:
    "A quiet introduction to Louis, his background, languages, interests, and the personal site he is building over time.",
};

export default function AboutPage() {
  return <AboutContent />;
}
