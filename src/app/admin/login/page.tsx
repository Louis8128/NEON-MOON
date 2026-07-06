import Link from "next/link";
import { getSafeAdminRedirectPath } from "@/lib/adminAuth";

type AdminLoginPageProps = {
  searchParams: Promise<{
    error?: string;
    next?: string;
  }>;
};

function getErrorMessage(error: string | undefined) {
  if (error === "invalid") {
    return "Invalid admin password.";
  }

  if (error === "missing-secret") {
    return "Admin session secret is not configured.";
  }

  if (error === "missing-password") {
    return "Admin password is not configured.";
  }

  if (error === "invalid-request") {
    return "Unable to read the login request. Please try again.";
  }

  return null;
}

export default async function AdminLoginPage({
  searchParams,
}: AdminLoginPageProps) {
  const params = await searchParams;
  const nextPath = getSafeAdminRedirectPath(params.next);
  const errorMessage = getErrorMessage(params.error);

  return (
    <main className="min-h-screen bg-[#0077b6] px-6 py-20 text-white">
      <section className="mx-auto max-w-xl">
        <Link
          href="/"
          className="text-sm font-semibold text-[#caf0f8] transition hover:text-white"
        >
          ← Back to Home
        </Link>

        <div className="mt-10">
          <p className="text-xs font-semibold uppercase tracking-[0.4em] text-[#caf0f8]">
            Admin Login
          </p>

          <h1 className="mt-4 text-4xl font-bold tracking-tight text-white md:text-5xl">
            Sign in to NEON MOON
          </h1>

          <p className="mt-5 text-sm leading-7 text-[#eaf8ff]">
            Use the private admin password to open the dashboard.
          </p>
        </div>

        <form
          action="/api/admin/login"
          method="post"
          className="mt-10 rounded-3xl border border-[#caf0f8]/25 bg-[#023e8a]/75 p-6 shadow-lg shadow-[#03045e]/20"
        >
          <input type="hidden" name="next" value={nextPath} />

          <label
            htmlFor="password"
            className="text-sm font-semibold text-[#caf0f8]"
          >
            Admin password
          </label>

          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            className="mt-3 w-full rounded-2xl border border-[#caf0f8]/25 bg-[#03045e]/45 px-4 py-3 text-sm text-white placeholder:text-[#caf0f8]/55 outline-none transition focus:border-[#caf0f8]"
            placeholder="Enter password"
          />

          {errorMessage && (
            <p className="mt-4 rounded-2xl border border-rose-300/30 bg-rose-400/10 px-4 py-3 text-sm text-rose-100">
              {errorMessage}
            </p>
          )}

          <button
            type="submit"
            className="mt-6 w-full rounded-full bg-[#caf0f8] px-5 py-3 text-sm font-semibold text-[#023e8a] transition hover:bg-white"
          >
            Sign in
          </button>
        </form>
      </section>
    </main>
  );
}
