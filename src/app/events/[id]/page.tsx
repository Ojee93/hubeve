"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowUp,
  Building2,
  CalendarDays,
  Check,
  CheckCircle2,
  Clock3,
  Info,
  MapPin,
  Menu,
  Sparkles,
  UserRound,
  X,
  XCircle,
} from "lucide-react";

/* =========================================================
   TYPES
========================================================= */

type EventStatus = "PENDING" | "APPROVED" | "REJECTED";

type CommunityEvent = {
  id: number;
  title: string;
  description: string;
  venue: {
    id: number;
    name: string;
    location: string;
  };
  date: string;
  time: string;
  status: EventStatus;
  votes: number;
  hasVoted: boolean;
  suggestedBy: string;
  createdAt: string;
};

/* =========================================================
   TEMPORARY MOCK DATA

   Replace this with GET /api/events/:id later.
========================================================= */

const mockEvents: CommunityEvent[] = [
  {
    id: 1,
    title: "Summer Music Night",
    description:
      "An evening of live music, local performers, food and community fun. The idea is to bring together musicians from around the community for a relaxed evening where people can discover new artists, meet their neighbours and enjoy good food.",
    venue: {
      id: 1,
      name: "Riverside Hall",
      location: "Riverside District",
    },
    date: "Oct 18, 2026",
    time: "7:00 PM",
    status: "PENDING",
    votes: 24,
    hasVoted: false,
    suggestedBy: "Alex Morgan",
    createdAt: "Oct 5, 2026",
  },
  {
    id: 2,
    title: "Community Tech Meetup",
    description:
      "A relaxed meetup for developers, designers and technology enthusiasts. Attendees can share ideas, discuss projects, meet other people working in technology and hear short talks from members of the community.",
    venue: {
      id: 2,
      name: "Central Events Hub",
      location: "City Centre",
    },
    date: "Oct 24, 2026",
    time: "6:00 PM",
    status: "APPROVED",
    votes: 17,
    hasVoted: true,
    suggestedBy: "Jamie Lee",
    createdAt: "Oct 3, 2026",
  },
  {
    id: 3,
    title: "Weekend Art Workshop",
    description:
      "A hands-on creative workshop featuring painting, crafts and local artists. The workshop would welcome beginners as well as experienced artists and provide materials for attendees to experiment with different techniques.",
    venue: {
      id: 3,
      name: "The Creative Space",
      location: "Arts District",
    },
    date: "Nov 2, 2026",
    time: "11:00 AM",
    status: "PENDING",
    votes: 31,
    hasVoted: true,
    suggestedBy: "Taylor Smith",
    createdAt: "Oct 6, 2026",
  },
  {
    id: 4,
    title: "Open Mic Evening",
    description:
      "An open stage for singers, poets, comedians and other local performers to share their work with the community in a welcoming environment.",
    venue: {
      id: 1,
      name: "Riverside Hall",
      location: "Riverside District",
    },
    date: "Nov 8, 2026",
    time: "7:30 PM",
    status: "REJECTED",
    votes: 9,
    hasVoted: false,
    suggestedBy: "Chris Johnson",
    createdAt: "Oct 1, 2026",
  },
  {
    id: 5,
    title: "Open Mic Evening",
    description:
      "An open stage for singers, poets, comedians and other local performers to share their work with the community in a welcoming environment.",
    venue: {
      id: 3,
      name: "The Creative Space",
      location: "Arts District",
    },
    date: "Nov 8, 2026",
    time: "7:30 PM",
    status: "REJECTED",
    votes: 9,
    hasVoted: false,
    suggestedBy: "Chris Johnson",
    createdAt: "Oct 1, 2026",
  },
  {
    id: 6,
    title: "Open Mic Evening",
    description:
      "An open stage for singers, poets, comedians and other local performers to share their work with the community in a welcoming environment.",
    venue: {
      id: 2,
      name: "Central Events Hub",
      location: "Riverside District",
    },
    date: "Nov 8, 2026",
    time: "7:30 PM",
    status: "REJECTED",
    votes: 9,
    hasVoted: false,
    suggestedBy: "Chris Johnson",
    createdAt: "Oct 1, 2026",
  },
];

/* =========================================================
   STATUS CONFIGURATION
========================================================= */

const statusConfig = {
  PENDING: {
    label: "Pending review",
    badge: "border-amber-200 bg-amber-50 text-amber-700",
    panel: "border-amber-100 bg-amber-50/70",
    iconBackground: "bg-amber-100",
    iconColor: "text-amber-600",
    title: "Waiting for venue review",
    description:
      "This suggestion is currently waiting for the venue manager to approve or reject it.",
  },

  APPROVED: {
    label: "Approved",
    badge: "border-emerald-200 bg-emerald-50 text-emerald-700",
    panel: "border-emerald-100 bg-emerald-50/70",
    iconBackground: "bg-emerald-100",
    iconColor: "text-emerald-600",
    title: "This event has been approved",
    description:
      "The venue manager has approved this community event suggestion.",
  },

  REJECTED: {
    label: "Rejected",
    badge: "border-red-200 bg-red-50 text-red-600",
    panel: "border-red-100 bg-red-50/70",
    iconBackground: "bg-red-100",
    iconColor: "text-red-600",
    title: "This suggestion was not approved",
    description:
      "The venue manager has reviewed this suggestion and decided not to approve it.",
  },
} satisfies Record<
  EventStatus,
  {
    label: string;
    badge: string;
    panel: string;
    iconBackground: string;
    iconColor: string;
    title: string;
    description: string;
  }
>;

/* =========================================================
   STATUS ICON
========================================================= */

function StatusIcon({ status }: { status: EventStatus }) {
  if (status === "APPROVED") {
    return <CheckCircle2 className="h-5 w-5" />;
  }

  if (status === "REJECTED") {
    return <XCircle className="h-5 w-5" />;
  }

  return <Clock3 className="h-5 w-5" />;
}

/* =========================================================
   PAGE
========================================================= */

export default function EventDetailsPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();

  const eventId = Number(params.id);

  const foundEvent = mockEvents.find((event) => event.id === eventId);

  const [event, setEvent] = useState<CommunityEvent | null>(
    foundEvent ?? null
  );

  const [voting, setVoting] = useState(false);
  const [voteError, setVoteError] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  /* =======================================================
     EVENT NOT FOUND
  ======================================================= */

  if (!event) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#eef5ff] px-5">
        <div
          className="
            w-full max-w-md
            rounded-[28px]
            border border-white/80
            bg-white/55
            p-8
            text-center
            shadow-[0_20px_60px_rgba(31,80,160,0.10)]
            backdrop-blur-xl
          "
        >
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
            <CalendarDays className="h-6 w-6" />
          </div>

          <h1 className="mt-5 text-xl font-bold text-slate-900">
            Event not found
          </h1>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            The event you're looking for doesn't exist or may no longer be
            available.
          </p>

          <button
            type="button"
            onClick={() => router.push("/events")}
            className="
              mt-6
              inline-flex h-11
              items-center justify-center
              gap-2
              rounded-xl
              bg-blue-600
              px-5
              text-sm font-semibold
              text-white
              transition
              hover:bg-blue-700
            "
          >
            <ArrowLeft className="h-4 w-4" />
            Back to events
          </button>
        </div>
      </main>
    );
  }

  const currentStatus = statusConfig[event.status];

  /* =======================================================
     VOTE / REMOVE VOTE

     Temporary local implementation.

     Later:
     POST   /api/events/:id/vote
     DELETE /api/events/:id/vote
  ======================================================= */

  const handleVote = async () => {
    if (voting) return;

    setVoteError("");
    setVoting(true);

    try {
      /*
       * TEMPORARY UI-ONLY VERSION
       *
       * Replace this block with an API request later.
       */

      setEvent((currentEvent) => {
        if (!currentEvent) {
          return currentEvent;
        }

        const removingVote = currentEvent.hasVoted;

        return {
          ...currentEvent,
          hasVoted: !currentEvent.hasVoted,
          votes: removingVote
            ? Math.max(0, currentEvent.votes - 1)
            : currentEvent.votes + 1,
        };
      });

      /*
       * REAL VERSION LATER:
       *
       * const response = await fetch(
       *   `/api/events/${event.id}/vote`,
       *   {
       *     method: event.hasVoted ? "DELETE" : "POST",
       *   }
       * );
       *
       * const data = await response.json();
       *
       * if (!response.ok) {
       *   throw new Error(data.message ?? "Unable to update vote.");
       * }
       *
       * setEvent((current) =>
       *   current
       *     ? {
       *         ...current,
       *         votes: data.votes,
       *         hasVoted: data.hasVoted,
       *       }
       *     : current
       * );
       */
    } catch {
      setVoteError("Unable to update your vote. Please try again.");
    } finally {
      setVoting(false);
    }
  };

  return (
    <main className="relative min-h-screen overflow-x-hidden bg-[#eef5ff]">
      {/* =================================================
          BACKGROUND
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

          {/* Desktop navigation */}

          <nav className="hidden items-center gap-2 md:flex">
            <button
              type="button"
              onClick={() => router.push("/events")}
              className="rounded-xl bg-white/70 px-4 py-2 text-sm font-semibold text-blue-600 shadow-sm"
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

          {/* Desktop actions */}

          <div className="hidden items-center gap-3 md:flex">
            <button
              type="button"
              onClick={() => router.push("/events/new")}
              className="
                flex h-10
                items-center gap-2
                rounded-xl
                bg-blue-600
                px-4
                text-sm font-semibold
                text-white
                shadow-md shadow-blue-500/20
                transition
                hover:bg-blue-700
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

          {/* Mobile menu */}

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

        {/* Mobile navigation */}

        {mobileMenuOpen && (
          <div className="border-t border-white/70 px-5 pb-5 pt-3 md:hidden">
            <div className="rounded-2xl border border-white/80 bg-white/60 p-2 shadow-lg backdrop-blur-xl">
              <button
                type="button"
                onClick={() => {
                  router.push("/events");
                  setMobileMenuOpen(false);
                }}
                className="flex w-full items-center rounded-xl bg-blue-50 px-4 py-3 text-sm font-semibold text-blue-700"
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
                onClick={() => {
                  router.push("/events/new");
                  setMobileMenuOpen(false);
                }}
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
          px-5 pb-14 pt-7
          sm:px-8
          lg:px-12 lg:pt-8
        "
      >
        {/* Back */}

        <button
          type="button"
          onClick={() => router.push("/events")}
          className="
            mb-6
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
            MAIN GRID
        ================================================== */}

        <div className="grid gap-6 lg:grid-cols-[1fr_330px] lg:gap-8">
          {/* =================================================
              LEFT — EVENT
          ================================================== */}

          <div className="space-y-5">
            {/* Main Event Card */}

            <section
              className="
                rounded-[28px]
                border border-white/80
                bg-white/55
                p-5
                shadow-[0_20px_60px_rgba(31,80,160,0.09)]
                backdrop-blur-xl

                sm:p-7
                lg:p-8
              "
            >
              {/* Status */}

              <div className="flex flex-wrap items-center justify-between gap-3">
                <span
                  className={`
                    inline-flex
                    items-center gap-1.5
                    rounded-full
                    border
                    px-3 py-1.5
                    text-xs font-semibold
                    ${currentStatus.badge}
                  `}
                >
                  <StatusIcon status={event.status} />
                  {currentStatus.label}
                </span>

                <span className="text-xs text-slate-400">
                  Suggested {event.createdAt}
                </span>
              </div>

              {/* Heading */}

              <div className="mt-6">
                <h1
                  className="
                    max-w-3xl
                    text-3xl font-bold
                    tracking-tight
                    text-slate-950

                    sm:text-4xl
                    sm:leading-tight
                  "
                >
                  {event.title}
                </h1>

                <p className="mt-2 text-sm text-slate-500">
                  Suggested by{" "}
                  <span className="font-semibold text-slate-700">
                    {event.suggestedBy}
                  </span>
                </p>
              </div>

              {/* Event metadata */}

              <div
                className="
                  mt-7
                  grid gap-3
                  border-y border-slate-100
                  py-5

                  sm:grid-cols-3
                "
              >
                {/* Venue */}

                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                    <Building2 className="h-4 w-4" />
                  </span>

                  <div className="min-w-0">
                    <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
                      Venue
                    </p>

                    <p className="mt-0.5 truncate text-sm font-semibold text-slate-800">
                      {event.venue.name}
                    </p>
                  </div>
                </div>

                {/* Date */}

                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                    <CalendarDays className="h-4 w-4" />
                  </span>

                  <div>
                    <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
                      Proposed date
                    </p>

                    <p className="mt-0.5 text-sm font-semibold text-slate-800">
                      {event.date}
                    </p>
                  </div>
                </div>

                {/* Time */}

                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                    <Clock3 className="h-4 w-4" />
                  </span>

                  <div>
                    <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
                      Proposed time
                    </p>

                    <p className="mt-0.5 text-sm font-semibold text-slate-800">
                      {event.time}
                    </p>
                  </div>
                </div>
              </div>

              {/* Description */}

              <div className="mt-7">
                <h2 className="text-base font-bold text-slate-900">
                  About this event
                </h2>

                <p className="mt-3 whitespace-pre-line text-sm leading-7 text-slate-600">
                  {event.description}
                </p>
              </div>

              {/* Venue location */}

              <div className="mt-7">
                <h2 className="text-base font-bold text-slate-900">
                  Proposed venue
                </h2>

                <div className="mt-3 flex items-center gap-3 rounded-2xl border border-white bg-white/60 p-4">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                    <MapPin className="h-4 w-4" />
                  </span>

                  <div>
                    <p className="text-sm font-semibold text-slate-800">
                      {event.venue.name}
                    </p>

                    <p className="mt-0.5 text-xs text-slate-500">
                      {event.venue.location}
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Status Information */}

            <section
              className={`
                flex gap-4
                rounded-[22px]
                border
                p-5
                ${currentStatus.panel}
              `}
            >
              <span
                className={`
                  flex h-10 w-10
                  shrink-0
                  items-center justify-center
                  rounded-xl
                  ${currentStatus.iconBackground}
                  ${currentStatus.iconColor}
                `}
              >
                <StatusIcon status={event.status} />
              </span>

              <div>
                <h2 className="text-sm font-bold text-slate-900">
                  {currentStatus.title}
                </h2>

                <p className="mt-1 text-xs leading-5 text-slate-600">
                  {currentStatus.description}
                </p>
              </div>
            </section>
          </div>

          {/* =================================================
              RIGHT — VOTING SIDEBAR
          ================================================== */}

          <aside className="space-y-5 lg:sticky lg:top-24 lg:self-start">
            {/* Voting Card */}

            <section
              className="
                rounded-[26px]
                border border-white/80
                bg-white/55
                p-5
                shadow-[0_18px_50px_rgba(31,80,160,0.08)]
                backdrop-blur-xl
              "
            >
              <div className="text-center">
                <span
                  className="
                    mx-auto
                    flex h-12 w-12
                    items-center justify-center
                    rounded-2xl
                    bg-blue-50
                    text-blue-600
                  "
                >
                  <ArrowUp className="h-5 w-5" />
                </span>

                <p className="mt-4 text-3xl font-bold tracking-tight text-slate-950">
                  {event.votes}
                </p>

                <p className="mt-1 text-xs font-medium text-slate-500">
                  {event.votes === 1 ? "community vote" : "community votes"}
                </p>
              </div>

              <div className="my-5 h-px bg-slate-100" />

              <p className="text-center text-xs leading-5 text-slate-500">
                Support this suggestion to show the venue that you'd like to
                see this event happen.
              </p>

              <button
                type="button"
                onClick={handleVote}
                disabled={voting}
                className={`
                  mt-5
                  flex h-12
                  w-full
                  items-center justify-center
                  gap-2
                  rounded-xl
                  text-sm font-semibold
                  transition

                  disabled:cursor-not-allowed
                  disabled:opacity-60

                  ${
                    event.hasVoted
                      ? `
                        border border-blue-200
                        bg-blue-50
                        text-blue-700
                        hover:bg-blue-100
                      `
                      : `
                        bg-gradient-to-r
                        from-blue-500
                        via-blue-600
                        to-indigo-600
                        text-white
                        shadow-lg
                        shadow-blue-500/20
                        hover:-translate-y-0.5
                        hover:shadow-xl
                      `
                  }
                `}
              >
                {voting ? (
                  "Updating..."
                ) : event.hasVoted ? (
                  <>
                    <Check className="h-4 w-4" />
                    Voted — remove vote
                  </>
                ) : (
                  <>
                    <ArrowUp className="h-4 w-4" />
                    Upvote this event
                  </>
                )}
              </button>

              {event.hasVoted && !voteError && (
                <div className="mt-3 flex items-center justify-center gap-1.5 text-xs font-medium text-blue-600">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  You've supported this event
                </div>
              )}

              {voteError && (
                <p
                  role="alert"
                  className="mt-3 text-center text-xs text-red-600"
                >
                  {voteError}
                </p>
              )}
            </section>

            {/* Review explanation */}

            <section
              className="
                rounded-[22px]
                border border-white/80
                bg-white/40
                p-4
                backdrop-blur-xl
              "
            >
              <div className="flex gap-3">
                <Info className="mt-0.5 h-4 w-4 shrink-0 text-blue-600" />

                <div>
                  <p className="text-xs font-semibold text-slate-800">
                    How suggestions work
                  </p>

                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    Community votes show support for an idea. The final approval
                    decision is made by the manager of the selected venue.
                  </p>
                </div>
              </div>
            </section>
          </aside>
        </div>
      </div>
    </main>
  );
}