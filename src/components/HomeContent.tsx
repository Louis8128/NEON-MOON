"use client";

import { useI18n } from "@/components/I18nProvider";

export default function HomeContent() {
  const { t } = useI18n();

  return (
    <main className="min-h-screen bg-[#0077b6] text-white">
      <style>{`
        @keyframes home-caustics-drift {
          0% {
            background-position:
              0% 0%,
              80% 8%,
              28% 0%;
            transform: translate3d(-2%, -1%, 0) rotate(0deg) scale(1);
          }
          100% {
            background-position:
              14% 12%,
              68% 22%,
              42% 10%;
            transform: translate3d(2%, 2%, 0) rotate(0.6deg) scale(1.05);
          }
        }

        @keyframes home-current-drift {
          0% {
            transform: translate3d(-6%, 0, 0);
          }
          100% {
            transform: translate3d(6%, -2%, 0);
          }
        }

        @keyframes home-moonbeam-drift {
          0% {
            opacity: 0.34;
            transform: translate3d(-2%, -2%, 0) rotate(-5deg);
          }
          100% {
            opacity: 0.52;
            transform: translate3d(3%, 2%, 0) rotate(-2deg);
          }
        }

        @keyframes home-background-drift {
          0% {
            transform: translate3d(-1%, 0, 0) scale(1.14);
          }
          100% {
            transform: translate3d(1%, -1%, 0) scale(1.18);
          }
        }

        @keyframes home-bubble-rise {
          0% {
            opacity: 0;
            transform: translate3d(0, 3rem, 0) scale(0.72);
          }
          16% {
            opacity: var(--bubble-opacity);
          }
          82% {
            opacity: calc(var(--bubble-opacity) * 0.86);
          }
          100% {
            opacity: 0;
            transform: translate3d(var(--bubble-drift), -46rem, 0) scale(1);
          }
        }

        @keyframes home-card-rise {
          0% {
            opacity: 0;
            transform: translateY(1rem);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes home-card-float {
          0% {
            transform: translate3d(0, 0, 0);
          }
          100% {
            transform: translate3d(0, -0.55rem, 0);
          }
        }

        .home-underwater-backdrop {
          animation: home-background-drift 32s ease-in-out infinite alternate;
        }

        .home-poem-serif {
          font-family: "Noto Serif SC", "Source Han Serif SC", "Songti SC", "SimSun", serif;
        }

        .home-underwater-fade {
          -webkit-mask-image: linear-gradient(to bottom, transparent 0%, transparent 12%, rgba(0, 0, 0, 0.6) 32%, #000 48%);
          mask-image: linear-gradient(to bottom, transparent 0%, transparent 12%, rgba(0, 0, 0, 0.6) 32%, #000 48%);
        }

        .home-moonbeam {
          background:
            radial-gradient(ellipse at 52% 0%, rgba(202, 240, 248, 0.2) 0%, rgba(144, 224, 239, 0.1) 24%, transparent 62%),
            radial-gradient(ellipse at 72% 8%, rgba(255, 255, 255, 0.1) 0%, transparent 44%),
            linear-gradient(116deg, transparent 14%, rgba(202, 240, 248, 0.08) 34%, transparent 68%);
          filter: blur(3px);
          mix-blend-mode: screen;
          animation: home-moonbeam-drift 28s ease-in-out infinite alternate;
        }

        .home-underwater-caustics {
          background:
            radial-gradient(ellipse at 24% 8%, rgba(202, 240, 248, 0.08), transparent 34%),
            radial-gradient(ellipse at 76% 4%, rgba(144, 224, 239, 0.05), transparent 36%);
          background-size:
            42rem 24rem,
            34rem 20rem;
          filter: blur(5px);
          mix-blend-mode: screen;
          animation: home-caustics-drift 36s ease-in-out infinite alternate;
        }

        .home-underwater-current {
          background:
            radial-gradient(ellipse at 50% 4%, rgba(202, 240, 248, 0.08), transparent 48%),
            radial-gradient(ellipse at 20% 32%, rgba(0, 180, 216, 0.05), transparent 40%),
            radial-gradient(ellipse at 82% 28%, rgba(0, 119, 182, 0.06), transparent 44%);
          filter: blur(6px);
          mix-blend-mode: screen;
          animation: home-current-drift 40s ease-in-out infinite alternate;
        }

        .home-bubble {
          position: absolute;
          bottom: -4rem;
          border: 1px solid rgba(202, 240, 248, 0.32);
          border-radius: 9999px;
          background:
            radial-gradient(circle at 32% 28%, rgba(255, 255, 255, 0.54), transparent 18%),
            rgba(202, 240, 248, 0.09);
          box-shadow: 0 0 18px rgba(202, 240, 248, 0.14);
          animation: home-bubble-rise var(--bubble-duration) ease-in infinite;
          animation-delay: var(--bubble-delay);
        }

        .home-bubble-one {
          --bubble-drift: -1.2rem;
          --bubble-duration: 13s;
          --bubble-delay: -2s;
          --bubble-opacity: 0.32;
          left: 9%;
          width: 0.7rem;
          height: 0.7rem;
        }

        .home-bubble-two {
          --bubble-drift: 1.6rem;
          --bubble-duration: 17s;
          --bubble-delay: -8s;
          --bubble-opacity: 0.4;
          left: 24%;
          width: 1.05rem;
          height: 1.05rem;
        }

        .home-bubble-three {
          --bubble-drift: -1.8rem;
          --bubble-duration: 19s;
          --bubble-delay: -5s;
          --bubble-opacity: 0.34;
          left: 48%;
          width: 0.85rem;
          height: 0.85rem;
        }

        .home-bubble-four {
          --bubble-drift: 1.25rem;
          --bubble-duration: 15s;
          --bubble-delay: -11s;
          --bubble-opacity: 0.3;
          left: 68%;
          width: 0.55rem;
          height: 0.55rem;
        }

        .home-bubble-five {
          --bubble-drift: -1rem;
          --bubble-duration: 21s;
          --bubble-delay: -14s;
          --bubble-opacity: 0.42;
          left: 86%;
          width: 1.2rem;
          height: 1.2rem;
        }

        .home-bubble-six {
          --bubble-drift: 1.8rem;
          --bubble-duration: 18s;
          --bubble-delay: -4s;
          --bubble-opacity: 0.28;
          left: 36%;
          width: 0.5rem;
          height: 0.5rem;
        }

        .home-bubble-seven {
          --bubble-drift: -1.5rem;
          --bubble-duration: 22s;
          --bubble-delay: -17s;
          --bubble-opacity: 0.36;
          left: 58%;
          width: 0.95rem;
          height: 0.95rem;
        }

        .home-bubble-eight {
          --bubble-drift: 1.1rem;
          --bubble-duration: 16s;
          --bubble-delay: -7s;
          --bubble-opacity: 0.31;
          left: 78%;
          width: 0.72rem;
          height: 0.72rem;
        }

        .home-bubble-nine {
          --bubble-drift: -2rem;
          --bubble-duration: 14s;
          --bubble-delay: -9s;
          --bubble-opacity: 0.26;
          left: 16%;
          width: 0.38rem;
          height: 0.38rem;
        }

        .home-bubble-ten {
          --bubble-drift: 2.1rem;
          --bubble-duration: 20s;
          --bubble-delay: -15s;
          --bubble-opacity: 0.33;
          left: 92%;
          width: 0.82rem;
          height: 0.82rem;
        }

        .home-intro-card {
          animation: home-card-rise 900ms ease-out both;
          transform: translateZ(0);
        }

        .home-intro-card-inner {
          animation: home-card-float 5.6s ease-in-out infinite alternate;
        }

        @media (prefers-reduced-motion: reduce) {
          .home-underwater-backdrop,
          .home-moonbeam,
          .home-underwater-caustics,
          .home-underwater-current,
          .home-bubble,
          .home-intro-card,
          .home-intro-card-inner {
            animation: none;
          }

          .home-bubble {
            opacity: 0.1;
            transform: none;
          }
        }
      `}</style>

      <section
        className="relative min-h-[100svh] overflow-hidden bg-[#0077b6] bg-[url('/images/home-ocean-sky.png')] bg-cover"
        style={{ backgroundPosition: "center 44%" }}
      >
        <div className="absolute inset-0 bg-black/20" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#023e8a]/10 via-transparent to-[#003b73]/50" />
        <div className="absolute inset-x-0 bottom-0 h-[34vh] min-h-64 bg-gradient-to-b from-transparent via-[#003b73]/58 to-[#003b73]" />

        <div className="relative mx-auto flex min-h-[100svh] max-w-5xl flex-col items-center justify-center px-6 py-28 text-center sm:px-8 lg:px-10">
          <div className="max-w-4xl">
            <p className="mb-6 text-sm font-medium uppercase tracking-[0.32em] text-[#caf0f8] drop-shadow-[0_2px_8px_rgba(2,62,138,0.6)]">
              {t.home.eyebrow}
            </p>

            <p className="home-poem-serif text-3xl font-semibold leading-relaxed tracking-[0.035em] text-[#f8fcff] drop-shadow-[0_5px_22px_rgba(3,4,94,0.72)] sm:text-4xl md:text-5xl">
              {t.home.poemLine}
            </p>

            <p className="home-poem-serif mt-5 text-base font-normal tracking-[0.02em] text-[#eaf8ff] drop-shadow-[0_3px_14px_rgba(3,4,94,0.68)] sm:text-lg">
              {t.home.poemSource}
            </p>

            {t.home.poemTranslation && (
              <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-[#caf0f8] drop-shadow-[0_3px_12px_rgba(3,4,94,0.68)] sm:text-base">
                {t.home.poemTranslation}
              </p>
            )}
          </div>
        </div>

        <a
          href="#home-intro"
          aria-label={t.home.scrollLabel}
          title={t.home.scrollLabel}
          className="absolute bottom-8 left-1/2 inline-flex h-11 w-11 -translate-x-1/2 items-center justify-center rounded-full border border-white/45 bg-[#023e8a]/25 text-xl text-white shadow-lg shadow-[#03045e]/25 backdrop-blur-md transition hover:border-[#caf0f8] hover:bg-[#caf0f8]/20"
        >
          <span aria-hidden="true">↓</span>
        </a>
      </section>

      <section
        id="home-intro"
        className="relative flex min-h-screen scroll-mt-0 items-center justify-center overflow-hidden bg-[#003b73] px-6 py-28 sm:px-8 lg:px-10"
      >
        <div className="home-underwater-backdrop home-underwater-fade absolute inset-[-5rem] bg-[url('/images/home-ocean-sky.png')] bg-cover bg-center opacity-[0.22] blur-3xl" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,119,182,0.36)_0%,rgba(0,95,143,0.58)_22%,rgba(0,59,115,0.84)_54%,rgba(0,31,63,0.96)_82%,rgba(0,13,30,0.99)_100%)]" />
        <div className="absolute inset-x-0 -top-10 h-64 bg-[radial-gradient(ellipse_at_52%_0%,rgba(202,240,248,0.14),rgba(0,119,182,0.1)_38%,transparent_74%)] opacity-70" />
        <div className="home-moonbeam absolute -inset-x-28 -top-12 h-[78%] opacity-45" />
        <div className="home-underwater-caustics home-underwater-fade absolute -inset-x-24 -top-24 h-3/4 opacity-[0.04]" />
        <div className="home-underwater-current home-underwater-fade absolute inset-x-[-12%] top-8 h-1/2 opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#001f3f]/8 to-[#00101f]/66" />
        <span aria-hidden="true" className="home-bubble home-bubble-one" />
        <span aria-hidden="true" className="home-bubble home-bubble-two" />
        <span aria-hidden="true" className="home-bubble home-bubble-three" />
        <span aria-hidden="true" className="home-bubble home-bubble-four" />
        <span aria-hidden="true" className="home-bubble home-bubble-five" />
        <span aria-hidden="true" className="home-bubble home-bubble-six" />
        <span aria-hidden="true" className="home-bubble home-bubble-seven" />
        <span aria-hidden="true" className="home-bubble home-bubble-eight" />
        <span aria-hidden="true" className="home-bubble home-bubble-nine" />
        <span aria-hidden="true" className="home-bubble home-bubble-ten" />

        <div className="relative mx-auto flex w-full max-w-5xl items-center justify-center">
          <div className="home-intro-card mx-auto max-w-[760px] rounded-3xl border border-[#caf0f8]/10 bg-[#023e8a]/15 p-7 text-center shadow-[0_24px_80px_rgba(0,20,45,0.22)] ring-1 ring-white/[0.07] backdrop-blur-xl sm:p-10 lg:p-12">
            <div className="home-intro-card-inner">
              <p className="mb-4 text-sm font-medium uppercase tracking-[0.28em] text-[#caf0f8]">
                {t.home.eyebrow}
              </p>

              <h1 className="max-w-4xl text-3xl font-bold tracking-tight text-white drop-shadow-[0_4px_18px_rgba(0,31,63,0.46)] sm:text-4xl lg:text-5xl">
                {t.home.title}
              </h1>

              <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-[#eaf8ff] sm:text-lg">
                {t.home.description}
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
