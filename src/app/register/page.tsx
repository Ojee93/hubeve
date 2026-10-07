"use client";

import { useState } from "react";
import {
  ArrowRight,
  Building2,
  CalendarDays,
  Eye,
  EyeOff,
  Sparkles,
  UserRound,
} from "lucide-react";
import { useRouter } from "next/navigation";

type Role = "CUSTOMER" | "MANAGER";

export default function RegisterPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState<Role>("CUSTOMER");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (
    event
  ) => {
    event.preventDefault();

    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (password.length < 8) {
      setError("Password must contain at least 8 characters.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
          role,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message ?? "Unable to create your account.");
        return;
      }

      // Option 1:
      // If registration automatically signs the user in,
      // redirect based on their role.

      if (data.user?.role === "MANAGER") {
        router.push("/manager/queue");
      } else {
        router.push("/events");
      }

      router.refresh();

      // Option 2:
      // If registration DOES NOT automatically log the user in,
      // replace the code above with:
      //
      // router.push("/login");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
<main className="relative min-h-screen overflow-hidden bg-[#eef5ff] lg:h-dvh lg:min-h-0">
      {/* =========================================
          BACKGROUND DECORATIONS
      ========================================== */}

      <div className="pointer-events-none absolute -left-32 -top-32 h-80 w-80 rounded-full border-[32px] border-white/60 bg-blue-100/50 shadow-[0_0_80px_rgba(37,99,235,0.18)]" />

      <div className="pointer-events-none absolute -bottom-40 -right-36 h-96 w-96 rounded-full border-[32px] border-white/70 bg-blue-100/40 shadow-[0_0_90px_rgba(37,99,235,0.18)]" />

      <div className="pointer-events-none absolute right-[12%] top-[8%] h-24 w-24 rounded-full bg-white/50 blur-xl" />

      <div className="pointer-events-none absolute left-[45%] top-[35%] hidden h-72 w-72 rounded-full bg-blue-300/10 blur-3xl lg:block" />

      {/* =========================================
          MAIN CONTENT
      ========================================== */}

      <div
        className="
          relative z-10
          mx-auto
          flex min-h-screen
          w-full max-w-7xl
          flex-col
          items-center
          justify-center
          px-5 py-8

          sm:px-8

          lg:h-full
          lg:min-h-0
          lg:flex-row
          lg:gap-14
          lg:px-12
          lg:py-6

          xl:gap-20
          xl:px-16
          xl:py-8
        "
      >
        {/* =========================================
            LEFT SIDE — BRANDING
        ========================================== */}

        <section
          className="
            flex w-full max-w-md
            flex-col
            items-center
            text-center

            lg:max-w-none
            lg:flex-1
            lg:items-start
            lg:text-left
          "
        >
          {/* Logo */}

          <div
            className="
              mb-5
              flex h-20 w-20
              items-center justify-center
              rounded-[26px]
              border border-white/80
              bg-white/55
              shadow-[0_18px_50px_rgba(37,99,235,0.18)]
              backdrop-blur-xl

              lg:mb-6
              lg:h-20
              lg:w-20
              lg:rounded-[24px]

              xl:h-24
              xl:w-24
              xl:rounded-[30px]
            "
          >
            <div
              className="
                flex h-12 w-12
                items-center justify-center
                rounded-2xl
                bg-gradient-to-br
                from-blue-400
                via-blue-600
                to-indigo-700
                shadow-lg
                shadow-blue-500/30

                lg:h-12
                lg:w-12

                xl:h-14
                xl:w-14
              "
            >
              <CalendarDays className="h-6 w-6 text-white xl:h-7 xl:w-7" />
            </div>
          </div>

          {/* Brand */}

          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.35em] text-blue-600 sm:text-sm lg:text-xs xl:text-sm">
            EventHub
          </p>

          {/* Heading */}

          <h1
            className="
              text-3xl
              font-bold
              tracking-tight
              text-slate-950

              sm:text-4xl

              lg:max-w-xl
              lg:text-4xl
              lg:leading-[1.08]

              xl:text-5xl
              2xl:text-6xl
            "
          >
            Join your community
          </h1>

          {/* Description */}

          <p
            className="
              mt-3
              max-w-sm
              text-sm
              leading-6
              text-slate-500

              lg:mt-4
              lg:max-w-lg
              lg:text-sm
              lg:leading-6

              xl:mt-5
              xl:text-base
              xl:leading-7
            "
          >
            Create an account to suggest events, support community ideas, or
            manage event requests for your venue.
          </p>

          {/* Desktop supporting content */}

          <div className="mt-7 hidden lg:block">
            <div className="flex items-center gap-3 text-sm font-medium text-slate-600">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/60 shadow-sm">
                <Sparkles className="h-4 w-4 text-blue-600" />
              </span>

              <span>Suggest • Support • Bring events to life</span>
            </div>
          </div>
        </section>

        {/* =========================================
            RIGHT SIDE — REGISTRATION FORM
        ========================================== */}

        <section
          className="
            mt-7
            w-full
            max-w-lg

            lg:mt-0
            lg:flex
            lg:flex-1
            lg:items-center
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

              lg:max-w-[500px]
              lg:rounded-[24px]
              lg:p-5

              xl:p-6
            "
          >
            {/* =====================================
                FORM HEADER
            ====================================== */}

            <div className="mb-5 lg:mb-4">
              <h2 className="text-xl font-bold text-slate-900 lg:text-lg xl:text-xl">
                Create your account
              </h2>

              <p className="mt-1 text-sm text-slate-500 lg:text-xs xl:text-sm">
                Choose how you'd like to use EventHub.
              </p>
            </div>

            {/* =====================================
                FORM
            ====================================== */}

            <form
              onSubmit={handleSubmit}
              className="space-y-4 lg:space-y-3"
            >
              {/* =====================================
                  ACCOUNT TYPE
              ====================================== */}

              <fieldset>
                <legend className="mb-2 block text-sm font-medium text-slate-700 lg:mb-1.5 lg:text-xs">
                  Account type
                </legend>

                <div className="grid grid-cols-2 gap-3 lg:gap-2">
                  {/* Customer */}

                  <button
                    type="button"
                    onClick={() => setRole("CUSTOMER")}
                    aria-pressed={role === "CUSTOMER"}
                    className={`
                      flex items-center gap-3
                      rounded-2xl
                      border
                      p-3
                      text-left
                      transition

                      lg:gap-2
                      lg:rounded-xl
                      lg:p-2.5

                      ${
                        role === "CUSTOMER"
                          ? "border-blue-500 bg-blue-50/80 shadow-sm ring-2 ring-blue-100"
                          : "border-white bg-white/60 hover:border-blue-200 hover:bg-white/80"
                      }
                    `}
                  >
                    <span
                      className={`
                        flex h-10 w-10
                        shrink-0
                        items-center justify-center
                        rounded-xl

                        lg:h-8
                        lg:w-8
                        lg:rounded-lg

                        ${
                          role === "CUSTOMER"
                            ? "bg-blue-600 text-white"
                            : "bg-blue-50 text-blue-600"
                        }
                      `}
                    >
                      <UserRound className="h-5 w-5 lg:h-4 lg:w-4" />
                    </span>

                    <span className="min-w-0">
                      <span className="block text-sm font-semibold text-slate-900 lg:text-xs">
                        Customer
                      </span>

                      <span className="mt-0.5 hidden text-xs text-slate-500 sm:block lg:text-[11px]">
                        Suggest & vote
                      </span>
                    </span>
                  </button>

                  {/* Manager */}

                  <button
                    type="button"
                    onClick={() => setRole("MANAGER")}
                    aria-pressed={role === "MANAGER"}
                    className={`
                      flex items-center gap-3
                      rounded-2xl
                      border
                      p-3
                      text-left
                      transition

                      lg:gap-2
                      lg:rounded-xl
                      lg:p-2.5

                      ${
                        role === "MANAGER"
                          ? "border-blue-500 bg-blue-50/80 shadow-sm ring-2 ring-blue-100"
                          : "border-white bg-white/60 hover:border-blue-200 hover:bg-white/80"
                      }
                    `}
                  >
                    <span
                      className={`
                        flex h-10 w-10
                        shrink-0
                        items-center justify-center
                        rounded-xl

                        lg:h-8
                        lg:w-8
                        lg:rounded-lg

                        ${
                          role === "MANAGER"
                            ? "bg-blue-600 text-white"
                            : "bg-blue-50 text-blue-600"
                        }
                      `}
                    >
                      <Building2 className="h-5 w-5 lg:h-4 lg:w-4" />
                    </span>

                    <span className="min-w-0">
                      <span className="block text-sm font-semibold text-slate-900 lg:text-xs">
                        Manager
                      </span>

                      <span className="mt-0.5 hidden text-xs text-slate-500 sm:block lg:text-[11px]">
                        Review events
                      </span>
                    </span>
                  </button>
                </div>
              </fieldset>

              {/* =====================================
                  FULL NAME
              ====================================== */}

              <div>
                <label
                  htmlFor="name"
                  className="mb-1.5 block text-sm font-medium text-slate-700 lg:mb-1 lg:text-xs"
                >
                  Full name
                </label>

                <input
                  id="name"
                  type="text"
                  autoComplete="name"
                  required
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="Enter your full name"
                  className="
                    h-[48px]
                    w-full
                    rounded-2xl
                    border border-white
                    bg-white/70
                    px-5
                    text-sm
                    text-slate-900
                    shadow-sm
                    outline-none
                    transition
                    placeholder:text-slate-400
                    focus:border-blue-400
                    focus:ring-4
                    focus:ring-blue-100

                    lg:h-[42px]
                    lg:rounded-xl
                    lg:px-4
                    lg:text-xs

                    xl:h-[44px]
                    xl:text-sm
                  "
                />
              </div>

              {/* =====================================
                  EMAIL
              ====================================== */}

              <div>
                <label
                  htmlFor="email"
                  className="mb-1.5 block text-sm font-medium text-slate-700 lg:mb-1 lg:text-xs"
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
                    h-[48px]
                    w-full
                    rounded-2xl
                    border border-white
                    bg-white/70
                    px-5
                    text-sm
                    text-slate-900
                    shadow-sm
                    outline-none
                    transition
                    placeholder:text-slate-400
                    focus:border-blue-400
                    focus:ring-4
                    focus:ring-blue-100

                    lg:h-[42px]
                    lg:rounded-xl
                    lg:px-4
                    lg:text-xs

                    xl:h-[44px]
                    xl:text-sm
                  "
                />
              </div>

              {/* =====================================
                  PASSWORD FIELDS
              ====================================== */}

              <div className="grid gap-4 sm:grid-cols-2 lg:gap-3">
                {/* Password */}

                <div>
                  <label
                    htmlFor="password"
                    className="mb-1.5 block text-sm font-medium text-slate-700 lg:mb-1 lg:text-xs"
                  >
                    Password
                  </label>

                  <div className="relative">
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="new-password"
                      required
                      minLength={8}
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      placeholder="Min. 8 characters"
                      className="
                        h-[48px]
                        w-full
                        rounded-2xl
                        border border-white
                        bg-white/70
                        px-4
                        pr-11
                        text-sm
                        text-slate-900
                        shadow-sm
                        outline-none
                        transition
                        placeholder:text-slate-400
                        focus:border-blue-400
                        focus:ring-4
                        focus:ring-blue-100

                        lg:h-[42px]
                        lg:rounded-xl
                        lg:px-3
                        lg:pr-10
                        lg:text-xs

                        xl:h-[44px]
                        xl:text-sm
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
                        absolute
                        right-3
                        top-1/2
                        -translate-y-1/2
                        text-slate-400
                        transition
                        hover:text-blue-600
                      "
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 lg:h-3.5 lg:w-3.5" />
                      ) : (
                        <Eye className="h-4 w-4 lg:h-3.5 lg:w-3.5" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}

                <div>
                  <label
                    htmlFor="confirmPassword"
                    className="mb-1.5 block text-sm font-medium text-slate-700 lg:mb-1 lg:text-xs"
                  >
                    Confirm password
                  </label>

                  <div className="relative">
                    <input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      autoComplete="new-password"
                      required
                      minLength={8}
                      value={confirmPassword}
                      onChange={(event) =>
                        setConfirmPassword(event.target.value)
                      }
                      placeholder="Repeat password"
                      className="
                        h-[48px]
                        w-full
                        rounded-2xl
                        border border-white
                        bg-white/70
                        px-4
                        pr-11
                        text-sm
                        text-slate-900
                        shadow-sm
                        outline-none
                        transition
                        placeholder:text-slate-400
                        focus:border-blue-400
                        focus:ring-4
                        focus:ring-blue-100

                        lg:h-[42px]
                        lg:rounded-xl
                        lg:px-3
                        lg:pr-10
                        lg:text-xs

                        xl:h-[44px]
                        xl:text-sm
                      "
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword((current) => !current)
                      }
                      aria-label={
                        showConfirmPassword
                          ? "Hide password"
                          : "Show password"
                      }
                      className="
                        absolute
                        right-3
                        top-1/2
                        -translate-y-1/2
                        text-slate-400
                        transition
                        hover:text-blue-600
                      "
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4 lg:h-3.5 lg:w-3.5" />
                      ) : (
                        <Eye className="h-4 w-4 lg:h-3.5 lg:w-3.5" />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* =====================================
                  ERROR MESSAGE
              ====================================== */}

              {error && (
                <div
                  role="alert"
                  className="
                    rounded-xl
                    border border-red-200
                    bg-red-50
                    px-4 py-2.5
                    text-sm
                    text-red-700

                    lg:px-3
                    lg:py-2
                    lg:text-xs
                  "
                >
                  {error}
                </div>
              )}

              {/* =====================================
                  SUBMIT BUTTON
              ====================================== */}

              <button
                type="submit"
                disabled={loading}
                className="
                  group
                  flex h-[52px]
                  w-full
                  items-center
                  justify-center
                  gap-3
                  rounded-2xl
                  bg-gradient-to-r
                  from-blue-500
                  via-blue-600
                  to-indigo-600
                  px-6
                  text-sm
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

                  lg:h-[44px]
                  lg:rounded-xl
                  lg:text-xs

                  xl:h-[46px]
                  xl:text-sm
                "
              >
                <span>
                  {loading ? "Creating account..." : "Create account"}
                </span>

                {!loading && (
                  <span
                    className="
                      flex h-7 w-7
                      items-center
                      justify-center
                      rounded-full
                      bg-white/15
                      transition
                      group-hover:translate-x-1
                    "
                  >
                    <ArrowRight className="h-3.5 w-3.5" />
                  </span>
                )}
              </button>
            </form>

            {/* =====================================
                LOGIN LINK
            ====================================== */}

            <div className="mt-5 border-t border-white/80 pt-4 text-center lg:mt-4 lg:pt-3">
              <p className="text-sm text-slate-500 lg:text-xs xl:text-sm">
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={() => router.push("/login")}
                  className="font-semibold text-blue-600 transition hover:text-blue-700"
                >
                  Sign in
                </button>
              </p>
            </div>
          </div>
        </section>

        {/* =========================================
            MOBILE FOOTER
        ========================================== */}

        <p className="mt-6 text-center text-[10px] font-medium uppercase tracking-[0.22em] text-slate-400 lg:hidden">
          Suggest • Support • Bring events to life
        </p>
      </div>
    </main>
  );
}