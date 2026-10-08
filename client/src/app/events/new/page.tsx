"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Info,
  Menu,
  Sparkles,
  UserRound,
  X,
} from "lucide-react";

/* =========================================================
   TYPES
========================================================= */

type Venue = {
  id: number;
  name: string;
  location: string;
};

/* =========================================================
   TEMPORARY VENUE DATA

   Replace this with GET /api/venues later.
========================================================= */

const venues: Venue[] = [
  {
    id: 1,
    name: "Riverside Hall",
    location: "Riverside District",
  },
  {
    id: 2,
    name: "Central Events Hub",
    location: "City Centre",
  },
  {
    id: 3,
    name: "The Creative Space",
    location: "Arts District",
  },
];

/* =========================================================
   PAGE
========================================================= */

export default function NewEventPage() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [venueId, setVenueId] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  /* =======================================================
     SUBMIT EVENT
  ======================================================= */

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (
    event
  ) => {
    event.preventDefault();

    setError("");

    const trimmedTitle = title.trim();
    const trimmedDescription = description.trim();

    if (!trimmedTitle) {
      setError("Please enter an event title.");
      return;
    }

    if (!trimmedDescription) {
      setError("Please enter an event description.");
      return;
    }

    if (!venueId) {
      setError("Please select a venue.");
      return;
    }

    if (!date || !time) {
      setError("Please select a proposed date and time.");
      return;
    }

    /*
     * Prevent submission of a date/time that has
     * already passed.
     */
    const proposedDateTime = new Date(`${date}T${time}`);

    if (proposedDateTime <= new Date()) {
      setError("The proposed date and time must be in the future.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/events", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: trimmedTitle,
          description: trimmedDescription,
          venueId: Number(venueId),
          proposedDateTime: proposedDateTime.toISOString(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message ?? "Unable to submit your event.");
        return;
      }

      /*
       * Event is created as PENDING by the backend.
       *
       * If your API returns the created event:
       */
      if (data.event?.id) {
        router.push(`/events/${data.event.id}`);
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
    <main className="relative min-h-screen overflow-x-hidden bg-[#eef5ff]">
      {/* =================================================
          BACKGROUND DECORATIONS
      ================================================== */}

      <div className="pointer-events-none fixed -left-40 -top-40 h-96 w-96 rounded-full border-[40px] border-white/50 bg-blue-100/40" />

      <div className="pointer-events-none fixed -bottom-52 -right-40 h-[450px] w-[450px] rounded-full border-[40px] border-white/60 bg-blue-100/40" />

      <div className="pointer-events-none fixed left-[45%] top-[25%] h-80 w-80 rounded-full bg-blue-300/10 blur-3xl" />

      {/* =================================================
          NAVIGATION
      ================================================== */}

      <header className="relative z-30 border-b border-white/70 bg-[#eef5ff]/80 backdrop-blur-xl">
        <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-5 sm:px-8 lg:px-12">
          {/* Brand */}

          <button
            type="button"
            onClick={() => router.push("/events")}
            className="flex items-center gap-3"
          >
            <span
              className="
                flex h-10 w-10
                items-center justify-center
                rounded-xl
                bg-gradient-to-br
                from-blue-400
                via-blue-600
                to-indigo-700
                shadow-md shadow-blue-500/20
              "
            >
              <CalendarDays className="h-5 w-5 text-white" />
            </span>

            <span className="text-lg font-bold tracking-tight text-slate-900">
              EventHub
            </span>
          </button>

          {/* Desktop Navigation */}

          <nav className="hidden items-center gap-2 md:flex">
            <button
              type="button"
              onClick={() => router.push("/events")}
              className="rounded-xl px-4 py-2 text-sm font-medium text-slate-500 transition hover:bg-white/60 hover:text-slate-900"
            >
              Discover
            </button>

            <button
              type="button"
              className="rounded-xl px-4 py-2 text-sm font-medium text-slate-500 transition hover:bg-white/60 hover:text-slate-900"
            >
              My Events
            </button>
          </nav>

          {/* Desktop Actions */}

          <div className="hidden items-center gap-3 md:flex">
            <button
              type="button"
              className="
                flex h-10
                items-center gap-2
                rounded-xl
                bg-blue-600
                px-4
                text-sm font-semibold
                text-white
                shadow-md shadow-blue-500/20
              "
            >
              <Sparkles className="h-4 w-4" />
              Suggest event
            </button>

            <button
              type="button"
              aria-label="Account"
              className="
                flex h-10 w-10
                items-center justify-center
                rounded-xl
                border border-white
                bg-white/60
                text-slate-600
                shadow-sm
                transition
                hover:bg-white
                hover:text-blue-600
              "
            >
              <UserRound className="h-4 w-4" />
            </button>
          </div>

          {/* Mobile Menu */}

          <button
            type="button"
            onClick={() => setMobileMenuOpen((current) => !current)}
            aria-label="Toggle navigation"
            aria-expanded={mobileMenuOpen}
            className="
              flex h-10 w-10
              items-center justify-center
              rounded-xl
              bg-white/60
              text-slate-700
              md:hidden
            "
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}

        {mobileMenuOpen && (
          <div className="border-t border-white/70 px-5 pb-5 pt-3 md:hidden">
            <div className="rounded-2xl border border-white/80 bg-white/60 p-2 shadow-lg backdrop-blur-xl">
              <button
                type="button"
                onClick={() => {
                  router.push("/events");
                  setMobileMenuOpen(false);
                }}
                className="flex w-full items-center rounded-xl px-4 py-3 text-sm font-medium text-slate-600"
              >
                Discover
              </button>

              <button
                type="button"
                className="flex w-full items-center rounded-xl px-4 py-3 text-sm font-medium text-slate-600"
              >
                My Events
              </button>

              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white"
              >
                <Sparkles className="h-4 w-4" />
                Suggest event
              </button>
            </div>
          </div>
        )}
      </header>

      {/* =================================================
          PAGE CONTENT
      ================================================== */}

      <div
        className="
          relative z-10
          mx-auto
          w-full max-w-6xl
          px-5
          pb-12
          pt-7

          sm:px-8

          lg:px-12
          lg:pb-10
          lg:pt-8
        "
      >
        {/* Back Button */}

        <button
          type="button"
          onClick={() => router.push("/events")}
          className="
            mb-5
            inline-flex
            items-center gap-2
            text-sm font-medium
            text-slate-500
            transition
            hover:text-blue-600
          "
        >
          <ArrowLeft className="h-4 w-4" />
          Back to events
        </button>

        {/* =================================================
            TWO COLUMN LAYOUT
        ================================================== */}

        <div className="grid gap-7 lg:grid-cols-[0.8fr_1.2fr] lg:items-start lg:gap-12">
          {/* ===============================================
              LEFT SIDE
          ================================================ */}

          <section className="lg:sticky lg:top-28">
            <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-blue-600">
              <Sparkles className="h-3.5 w-3.5" />
              Community suggestion
            </div>

            <h1
              className="
                max-w-md
                text-3xl font-bold
                tracking-tight
                text-slate-950

                sm:text-4xl
              "
            >
              Suggest an event
            </h1>

            <p className="mt-3 max-w-md text-sm leading-6 text-slate-500">
              Have an event idea your community would enjoy? Share it with a
              venue and let the community show their support.
            </p>

            {/* How it works */}

            <div
              className="
                mt-7
                hidden
                rounded-[24px]
                border border-white/80
                bg-white/45
                p-5
                shadow-[0_15px_45px_rgba(31,80,160,0.06)]
                backdrop-blur-xl

                lg:block
              "
            >
              <p className="text-sm font-semibold text-slate-900">
                What happens next?
              </p>

              <div className="mt-5 space-y-5">
                {/* Step 1 */}

                <div className="flex gap-3">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-xs font-bold text-white">
                    1
                  </span>

                  <div>
                    <p className="text-sm font-semibold text-slate-800">
                      Submit your idea
                    </p>

                    <p className="mt-1 text-xs leading-5 text-slate-500">
                      Tell the community what you'd like to see happen.
                    </p>
                  </div>
                </div>

                {/* Step 2 */}

                <div className="flex gap-3">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-xs font-bold text-blue-600">
                    2
                  </span>

                  <div>
                    <p className="text-sm font-semibold text-slate-800">
                      Gather support
                    </p>

                    <p className="mt-1 text-xs leading-5 text-slate-500">
                      Other customers can discover and upvote your suggestion.
                    </p>
                  </div>
                </div>

                {/* Step 3 */}

                <div className="flex gap-3">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-xs font-bold text-blue-600">
                    3
                  </span>

                  <div>
                    <p className="text-sm font-semibold text-slate-800">
                      Venue review
                    </p>

                    <p className="mt-1 text-xs leading-5 text-slate-500">
                      The selected venue manager can approve or reject the
                      suggestion.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ===============================================
              RIGHT SIDE — FORM
          ================================================ */}

          <section
            className="
              rounded-[28px]
              border border-white/80
              bg-white/50
              p-5
              shadow-[0_20px_60px_rgba(31,80,160,0.10)]
              backdrop-blur-2xl

              sm:p-7

              lg:p-7
            "
          >
            {/* Form Header */}

            <div className="mb-6">
              <h2 className="text-lg font-bold text-slate-900">
                Event details
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Give the venue enough information to understand your idea.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* ===========================================
                  TITLE
              ============================================ */}

              <div>
                <div className="mb-1.5 flex items-center justify-between">
                  <label
                    htmlFor="title"
                    className="text-sm font-medium text-slate-700"
                  >
                    Event title
                  </label>

                  <span className="text-[11px] text-slate-400">
                    {title.length}/100
                  </span>
                </div>

                <input
                  id="title"
                  type="text"
                  required
                  maxLength={100}
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                  placeholder="e.g. Community Jazz Night"
                  className="
                    h-[48px]
                    w-full
                    rounded-2xl
                    border border-white
                    bg-white/70
                    px-4
                    text-sm
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

              {/* ===========================================
                  DESCRIPTION
              ============================================ */}

              <div>
                <div className="mb-1.5 flex items-center justify-between">
                  <label
                    htmlFor="description"
                    className="text-sm font-medium text-slate-700"
                  >
                    Description
                  </label>

                  <span className="text-[11px] text-slate-400">
                    {description.length}/500
                  </span>
                </div>

                <textarea
                  id="description"
                  required
                  maxLength={500}
                  rows={5}
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                  placeholder="Describe your event idea, what attendees can expect, and why the community might enjoy it..."
                  className="
                    w-full
                    resize-none
                    rounded-2xl
                    border border-white
                    bg-white/70
                    px-4 py-3
                    text-sm
                    leading-6
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

              {/* ===========================================
                  VENUE
              ============================================ */}

              <div>
                <label
                  htmlFor="venue"
                  className="mb-1.5 block text-sm font-medium text-slate-700"
                >
                  Target venue
                </label>

                <div className="relative">
                  <Building2 className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                  <select
                    id="venue"
                    required
                    value={venueId}
                    onChange={(event) => setVenueId(event.target.value)}
                    className="
                      h-[48px]
                      w-full
                      appearance-none
                      rounded-2xl
                      border border-white
                      bg-white/70
                      pl-11 pr-10
                      text-sm
                      text-slate-900
                      shadow-sm
                      outline-none
                      transition

                      focus:border-blue-400
                      focus:ring-4
                      focus:ring-blue-100
                    "
                  >
                    <option value="">Select a venue</option>

                    {venues.map((venue) => (
                      <option key={venue.id} value={venue.id}>
                        {venue.name} — {venue.location}
                      </option>
                    ))}
                  </select>

                  <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-xs text-slate-400">
                    ▼
                  </span>
                </div>
              </div>

              {/* ===========================================
                  DATE + TIME
              ============================================ */}

              <div className="grid gap-4 sm:grid-cols-2">
                {/* Date */}

                <div>
                  <label
                    htmlFor="date"
                    className="mb-1.5 block text-sm font-medium text-slate-700"
                  >
                    Proposed date
                  </label>

                  <div className="relative">
                    <CalendarDays className="pointer-events-none absolute left-4 top-1/2 hidden h-4 w-4 -translate-y-1/2 text-slate-400 lg:block" />

                    <input
                      id="date"
                      type="date"
                      required
                      value={date}
                      onChange={(event) => setDate(event.target.value)}
                      className="
                        h-[48px]
                        w-full
                        rounded-2xl
                        border border-white
                        bg-white/70
                        px-4
                        text-sm
                        text-slate-900
                        shadow-sm
                        outline-none
                        transition

                        focus:border-blue-400
                        focus:ring-4
                        focus:ring-blue-100

                        lg:pl-11
                      "
                    />
                  </div>
                </div>

                {/* Time */}

                <div>
                  <label
                    htmlFor="time"
                    className="mb-1.5 block text-sm font-medium text-slate-700"
                  >
                    Proposed time
                  </label>

                  <div className="relative">
                    <Clock3 className="pointer-events-none absolute left-4 top-1/2 hidden h-4 w-4 -translate-y-1/2 text-slate-400 lg:block" />

                    <input
                      id="time"
                      type="time"
                      required
                      value={time}
                      onChange={(event) => setTime(event.target.value)}
                      className="
                        h-[48px]
                        w-full
                        rounded-2xl
                        border border-white
                        bg-white/70
                        px-4
                        text-sm
                        text-slate-900
                        shadow-sm
                        outline-none
                        transition

                        focus:border-blue-400
                        focus:ring-4
                        focus:ring-blue-100

                        lg:pl-11
                      "
                    />
                  </div>
                </div>
              </div>

              {/* ===========================================
                  PENDING STATUS INFORMATION
              ============================================ */}

              <div className="flex gap-3 rounded-2xl border border-blue-100 bg-blue-50/70 p-4">
                <Info className="mt-0.5 h-4 w-4 shrink-0 text-blue-600" />

                <div>
                  <p className="text-xs font-semibold text-blue-900">
                    Your suggestion will be submitted for review
                  </p>

                  <p className="mt-1 text-xs leading-5 text-blue-700/80">
                    Once submitted, its status will be Pending until the venue
                    manager approves or rejects it.
                  </p>
                </div>
              </div>

              {/* ===========================================
                  ERROR
              ============================================ */}

              {error && (
                <div
                  role="alert"
                  className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
                >
                  {error}
                </div>
              )}

              {/* ===========================================
                  ACTIONS
              ============================================ */}

              <div className="flex flex-col-reverse gap-3 border-t border-white/80 pt-5 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  disabled={loading}
                  onClick={() => router.push("/events")}
                  className="
                    h-[48px]
                    rounded-xl
                    border border-white
                    bg-white/70
                    px-6
                    text-sm font-semibold
                    text-slate-600
                    shadow-sm
                    transition

                    hover:bg-white
                    hover:text-slate-900

                    disabled:cursor-not-allowed
                    disabled:opacity-60
                  "
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={loading}
                  className="
                    group
                    flex h-[48px]
                    items-center justify-center
                    gap-3
                    rounded-xl
                    bg-gradient-to-r
                    from-blue-500
                    via-blue-600
                    to-indigo-600
                    px-6
                    text-sm font-semibold
                    text-white
                    shadow-lg shadow-blue-500/20
                    transition

                    hover:-translate-y-0.5
                    hover:shadow-xl
                    hover:shadow-blue-500/25

                    disabled:cursor-not-allowed
                    disabled:opacity-60
                    disabled:hover:translate-y-0
                  "
                >
                  {loading ? (
                    "Submitting..."
                  ) : (
                    <>
                      Submit suggestion

                      <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </section>
        </div>

        {/* Mobile explanation */}

        <div className="mt-6 flex items-start gap-3 rounded-2xl border border-white/80 bg-white/40 p-4 lg:hidden">
          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-blue-600" />

          <p className="text-xs leading-5 text-slate-500">
            Community members can support your suggestion with votes while the
            selected venue manager reviews it.
          </p>
        </div>
      </div>
    </main>
  );
}