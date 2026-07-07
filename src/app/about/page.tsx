import type { Metadata } from "next";
import AboutContent from "@/components/AboutContent";

export const metadata: Metadata = {
  title: "About | NEON MOON",
  description:
    "A personal introduction page for NEON MOON, including background, skills, languages, interests, and site sections.",
};

export default function AboutPage() {
  return <AboutContent />;
}
