"use client";

import { useState } from "react";
import { Eye, EyeOff, CalendarDays, ArrowRight, Sparkles, CalendarCheck, Users } from "lucide-react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit: React.SubmitEventHandler<HTMLFormElement> = async (
    event,
  ) => {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
          rememberMe,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message ?? "Unable to sign in.");
        return;
      }

      // Send each user type to the correct part of the application.
      if (data.user.role === "MANAGER") {
        router.push("/manager/queue");
      } else {
        router.push("/events");
      }

      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#eef5ff] lg:h-screen">
      {/* --------------------------------
          Background decorations
      --------------------------------- */}

      <div className="pointer-events-none absolute -left-32 -top-32 h-80 w-80 rounded-full border-[32px] border-white/60 bg-blue-100/50 shadow-[0_0_80px_rgba(37,99,235,0.18)]" />

      <div className="pointer-events-none absolute -bottom-40 -right-36 h-96 w-96 rounded-full border-[32px] border-white/70 bg-blue-100/40 shadow-[0_0_90px_rgba(37,99,235,0.18)]" />

      <div className="pointer-events-none absolute right-[12%] top-[8%] h-24 w-24 rounded-full bg-white/50 blur-xl" />

      <div className="pointer-events-none absolute left-[45%] top-[35%] hidden h-72 w-72 rounded-full bg-blue-300/10 blur-3xl lg:block" />

      {/* --------------------------------
          Main content
      --------------------------------- */}

      <div
        className="
          relative z-10 mx-auto flex min-h-screen w-full max-w-7xl
          flex-col items-center justify-center
          px-5 py-8

          sm:px-8

          lg:h-screen lg:min-h-0
          lg:flex-row
          lg:gap-16
          lg:px-12
          lg:py-8

          xl:gap-24
          xl:px-16
        "
      >
        {/* =================================
            LEFT / HEADER SECTION

            Mobile: sits above form
            Desktop: left column
        ================================== */}

        <section
          className="
            flex w-full max-w-md flex-col items-center text-center

            lg:max-w-none
            lg:flex-1
            lg:items-start
            lg:text-left
          "
        >
          {/* Logo */}
          <div
            className="
              mb-5 flex h-20 w-20 items-center justify-center
              rounded-[26px]
              border border-white/80
              bg-white/55
              shadow-[0_18px_50px_rgba(37,99,235,0.18)]
              backdrop-blur-xl

              lg:mb-7
              lg:h-24
              lg:w-24
              lg:rounded-[30px]
            "
          >
            <div
              className="
                flex h-12 w-12 items-center justify-center
                rounded-2xl
                bg-gradient-to-br
                from-blue-400
                via-blue-600
                to-indigo-700
                shadow-lg shadow-blue-500/30

                lg:h-14 lg:w-14
              "
            >
              <CalendarDays className="h-6 w-6 text-white lg:h-7 lg:w-7" />
            </div>
          </div>

          {/* Brand */}
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.35em] text-blue-600 sm:text-sm">
            EventHub
          </p>

          {/* Heading */}
          <h1
            className="
              text-3xl font-bold tracking-tight text-slate-950

              sm:text-4xl

              lg:max-w-xl
              lg:text-5xl
              lg:leading-[1.08]

              xl:text-6xl
            "
          >
            Welcome back
          </h1>

          {/* Description */}
          <p
            className="
              mt-3 max-w-sm text-sm leading-6 text-slate-500

              lg:mt-5
              lg:max-w-lg
              lg:text-base
              lg:leading-7
            "
          >
            Sign in to discover events your community wants and help bring
            great ideas to life.
          </p>

          {/* Desktop-only supporting content */}
          <div className="mt-8 hidden lg:block">
            <div className="flex items-center gap-3 text-sm font-medium text-slate-600">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/60 shadow-sm">
                <Sparkles className="h-4 w-4 text-blue-600" />
              </span>

              <span>Suggest • Support • Bring events to life</span>
            </div>
          </div>
        </section>

        {/* =================================
            RIGHT / LOGIN SECTION
        ================================== */}

        <section
          className="
            mt-7 w-full max-w-md

            lg:mt-0
            lg:flex
            lg:flex-1
            lg:justify-end
          "
        >
          <div
            className="
              w-full
              rounded-[28px]
              border border-white/80
              bg-white/45
              p-5
              shadow-[0_25px_70px_rgba(31,80,160,0.15)]
              backdrop-blur-2xl

              sm:p-7

              lg:max-w-md
              lg:p-8
            "
          >
            {/* Form header */}
            <div className="mb-6">
              <h2 className="text-xl font-bold text-slate-900">
                Sign in
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Enter your account details to continue.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Email
                </label>

                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="you@example.com"
                  className="
                    h-13 w-full rounded-2xl
                    border border-white
                    bg-white/70
                    px-5
                    text-slate-900
                    shadow-sm
                    outline-none
                    transition
                    placeholder:text-slate-400
                    focus:border-blue-400
                    focus:ring-4
                    focus:ring-blue-100
                  "
                />
              </div>

              {/* Password */}
              <div>
                <label
                  htmlFor="password"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Password
                </label>

                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="Enter your password"
                    className="
                      h-13 w-full rounded-2xl
                      border border-white
                      bg-white/70
                      px-5
                      pr-14
                      text-slate-900
                      shadow-sm
                      outline-none
                      transition
                      placeholder:text-slate-400
                      focus:border-blue-400
                      focus:ring-4
                      focus:ring-blue-100
                    "
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword((current) => !current)
                    }
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                    className="
                      absolute right-4 top-1/2
                      -translate-y-1/2
                      text-slate-400
                      transition
                      hover:text-blue-600
                    "
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Remember me */}
              <label className="flex cursor-pointer items-center gap-3 py-1 text-sm text-slate-600">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(event) =>
                    setRememberMe(event.target.checked)
                  }
                  className="h-4 w-4 rounded border-slate-300 accent-blue-600"
                />

                Remember me
              </label>

              {/* Error */}
              {error && (
                <div
                  role="alert"
                  className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
                >
                  {error}
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="
                  group flex h-14 w-full
                  items-center justify-center gap-3
                  rounded-2xl
                  bg-gradient-to-r
                  from-blue-500
                  via-blue-600
                  to-indigo-600
                  px-6
                  font-semibold
                  text-white
                  shadow-lg
                  shadow-blue-500/25
                  transition
                  hover:-translate-y-0.5
                  hover:shadow-xl
                  hover:shadow-blue-500/30
                  disabled:cursor-not-allowed
                  disabled:opacity-60
                "
              >
                <span>{loading ? "Signing in..." : "Sign in"}</span>

                {!loading && (
                  <span
                    className="
                      flex h-8 w-8 items-center justify-center
                      rounded-full
                      bg-white/15
                      transition
                      group-hover:translate-x-1
                    "
                  >
                    <ArrowRight className="h-4 w-4" />
                  </span>
                )}
              </button>
            </form>

            {/* Registration */}
            <div className="mt-6 border-t border-white/80 pt-5 text-center">
              <p className="text-sm text-slate-500">
                New to EventHub?{" "}
                <button
                  type="button"
                  onClick={() => router.push("/register")}
                  className="font-semibold text-blue-600 transition hover:text-blue-700"
                >
                  Create an account
                </button>
              </p>
            </div>
          </div>
        </section>

        {/* Mobile footer */}
        <p className="mt-6 text-center text-[10px] font-medium uppercase tracking-[0.22em] text-slate-400 lg:hidden">
          Suggest • Support • Bring events to life
        </p>
      </div>
    </main>
  );
}
