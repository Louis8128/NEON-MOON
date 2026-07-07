"use client";

import type { ReactNode } from "react";
import Image from "next/image";
import { useI18n } from "@/components/I18nProvider";

const skillGradientClasses = [
  "from-[#90e0ef] to-[#48cae4]",
  "from-[#caf0f8] to-[#00b4d8]",
  "from-[#48cae4] to-[#0096c7]",
  "from-[#ade8f4] to-[#0077b6]",
] as const;

const interestClasses = [
  "border-[#caf0f8]/30 bg-[#caf0f8]/10 text-[#eaf8ff]",
  "border-[#90e0ef]/30 bg-[#90e0ef]/10 text-[#eaf8ff]",
  "border-[#48cae4]/30 bg-[#48cae4]/10 text-[#eaf8ff]",
] as const;

export default function AboutContent() {
  const { t } = useI18n();
  const about = t.about;

  return (
    <main className="min-h-screen overflow-hidden bg-[#0077b6] text-white">
      <section className="border-b border-[#caf0f8]/20 bg-[#0077b6]">
        <div className="mx-auto grid max-w-6xl gap-10 px-6 py-20 lg:grid-cols-[1.15fr_0.85fr] lg:items-center lg:py-24">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.32em] text-[#caf0f8]">
              {about.eyebrow}
            </p>

            <h1 className="mt-5 text-5xl font-bold tracking-tight text-white sm:text-6xl lg:text-7xl">
              {about.heroTitle}
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-[#eaf8ff]">
              {about.heroSubtitle}
            </p>

            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              {about.identity.map((item) => (
                <div
                  key={item.label}
                  className="rounded-2xl border border-[#caf0f8]/25 bg-[#023e8a]/75 p-4"
                >
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#caf0f8]/75">
                    {item.label}
                  </p>
                  <p className="mt-2 text-sm font-semibold leading-6 text-white">
                    {item.value}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <aside className="rounded-2xl border border-[#caf0f8]/25 bg-[#023e8a]/75 p-6 shadow-xl shadow-[#023e8a]/25">
            <div className="flex flex-col items-center text-center">
              <Image
                src="/images/neon-moon-avatar.png"
                alt={about.avatarLabel}
                width={144}
                height={144}
                priority
                className="size-32 rounded-full border border-[#caf0f8]/50 bg-[#caf0f8] object-cover shadow-lg shadow-[#023e8a]/25"
              />

              <h2 className="mt-6 text-2xl font-bold text-white">
                {about.profileName}
              </h2>
              <p className="mt-2 max-w-sm text-sm leading-6 text-[#caf0f8]">
                {about.profileLine}
              </p>
            </div>
          </aside>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-6 py-16">
        <section className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <SectionIntro eyebrow={about.introEyebrow} title={about.introTitle} />

          <div className="rounded-2xl border border-[#caf0f8]/25 bg-[#023e8a]/75 p-6 shadow-xl shadow-[#023e8a]/20">
            {about.introParagraphs.map((paragraph) => (
              <p
                key={paragraph}
                className="mb-4 text-base leading-8 text-[#eaf8ff] last:mb-0"
              >
                {paragraph}
              </p>
            ))}
          </div>
        </section>

        <section className="mt-12 grid gap-6 lg:grid-cols-2">
          <Panel title={about.educationTitle} description={about.educationIntro}>
            <div className="space-y-4">
              {about.education.map((item) => (
                <article
                  key={`${item.school}-${item.program}`}
                  className="rounded-2xl border border-[#caf0f8]/20 bg-[#0077b6]/35 p-5"
                >
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-white">
                        {item.school}
                      </h3>
                      <p className="mt-1 text-sm font-medium text-[#caf0f8]">
                        {item.program}
                      </p>
                    </div>
                    <span className="rounded-full border border-[#caf0f8]/25 px-3 py-1 text-xs font-semibold text-[#caf0f8]">
                      {item.years}
                    </span>
                  </div>
                  <p className="mt-4 text-sm leading-6 text-[#eaf8ff]/85">
                    {item.note}
                  </p>
                </article>
              ))}
            </div>
          </Panel>

          <Panel title={about.languagesTitle} description={about.languagesIntro}>
            <div className="space-y-4">
              {about.languages.map((language) => (
                <div key={language.name}>
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="font-semibold text-white">
                        {language.name}
                      </p>
                      <p className="text-sm text-[#caf0f8]/80">
                        {language.note}
                      </p>
                    </div>
                    <span className="text-sm font-semibold text-[#caf0f8]">
                      {language.level}
                    </span>
                  </div>
                  <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-[#0077b6]/45">
                    <div
                      className="h-full rounded-full bg-[#90e0ef]"
                      style={{ width: `${language.value}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Panel>
        </section>

        <section className="mt-12">
          <Panel title={about.skillsTitle} description={about.skillsIntro}>
            <div className="grid gap-5 lg:grid-cols-2">
              {about.skillGroups.map((group, groupIndex) => (
                <article
                  key={group.title}
                  className="rounded-2xl border border-[#caf0f8]/20 bg-[#0077b6]/35 p-5"
                >
                  <h3 className="text-lg font-semibold text-white">
                    {group.title}
                  </h3>

                  <div className="mt-5 space-y-4">
                    {group.items.map((skill) => (
                      <div key={skill.name}>
                        <div className="flex items-center justify-between gap-4">
                          <span className="text-sm font-semibold text-white">
                            {skill.name}
                          </span>
                          <span className="text-xs text-[#caf0f8]/80">
                            {skill.note}
                          </span>
                        </div>
                        <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-[#0077b6]/35">
                          <div
                            className={`h-full rounded-full bg-gradient-to-r ${
                              skillGradientClasses[
                                groupIndex % skillGradientClasses.length
                              ]
                            }`}
                            style={{ width: `${skill.level}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          </Panel>
        </section>

        <section className="mt-12 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <Panel title={about.interestsTitle} description={about.interestsIntro}>
            <div className="flex flex-wrap gap-3">
              {about.interests.map((interest, index) => (
                <span
                  key={interest}
                  className={`rounded-full border px-4 py-2 text-sm font-semibold ${
                    interestClasses[index % interestClasses.length]
                  }`}
                >
                  {interest}
                </span>
              ))}
            </div>
          </Panel>

          <Panel title={about.quoteTitle} description={about.quoteIntro}>
            <blockquote className="rounded-2xl border border-[#caf0f8]/20 bg-[#0077b6]/35 p-6">
              <p className="text-2xl font-semibold leading-10 text-white">
                &ldquo;{about.quote}&rdquo;
              </p>
              <footer className="mt-4 text-sm font-semibold text-[#caf0f8]">
                &mdash; {about.quoteAuthor}
              </footer>
            </blockquote>
          </Panel>
        </section>
      </div>
    </main>
  );
}

function SectionIntro({
  eyebrow,
  title,
}: {
  eyebrow: string;
  title: string;
}) {
  return (
    <div>
      <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[#90e0ef]">
        {eyebrow}
      </p>
      <h2 className="mt-4 text-3xl font-bold leading-tight text-white sm:text-4xl">
        {title}
      </h2>
    </div>
  );
}

function Panel({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-[#caf0f8]/25 bg-[#023e8a]/75 p-6 shadow-xl shadow-[#023e8a]/20">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white">{title}</h2>
        <p className="mt-2 text-sm leading-6 text-[#caf0f8]/80">
          {description}
        </p>
      </div>
      {children}
    </section>
  );
}
