"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowUp,
  CalendarDays,
  Check,
  ChevronRight,
  Clock3,
  MapPin,
  Menu,
  Plus,
  Search,
  Sparkles,
  UserRound,
  X,
} from "lucide-react";

/* =========================================================
   TYPES
========================================================= */

type EventStatus = "PENDING" | "APPROVED" | "REJECTED";

type CommunityEvent = {
  id: number;
  title: string;
  description: string;
  venue: string;
  date: string;
  time: string;
  status: EventStatus;
  votes: number;
  hasVoted: boolean;
};

/* =========================================================
   TEMPORARY MOCK DATA

   Replace this with GET /api/events later.
========================================================= */

const initialEvents: CommunityEvent[] = [
  {
    id: 1,
    title: "Summer Music Night",
    description:
      "An evening of live music, local performers, food and community fun.",
    venue: "Riverside Hall",
    date: "Oct 18, 2026",
    time: "7:00 PM",
    status: "PENDING",
    votes: 24,
    hasVoted: false,
  },
  {
    id: 2,
    title: "Community Tech Meetup",
    description:
      "A relaxed meetup for developers, designers and technology enthusiasts.",
    venue: "Central Events Hub",
    date: "Oct 24, 2026",
    time: "6:00 PM",
    status: "APPROVED",
    votes: 17,
    hasVoted: true,
  },
  {
    id: 3,
    title: "Weekend Art Workshop",
    description:
      "A hands-on creative workshop featuring painting, crafts and local artists.",
    venue: "The Creative Space",
    date: "Nov 2, 2026",
    time: "11:00 AM",
    status: "PENDING",
    votes: 31,
    hasVoted: true,
  },
  {
    id: 4,
    title: "Open Mic Evening",
    description:
      "An open stage for singers, poets, comedians and other local performers.",
    venue: "Riverside Hall",
    date: "Nov 8, 2026",
    time: "7:30 PM",
    status: "REJECTED",
    votes: 9,
    hasVoted: false,
  },
  {
    id: 5,
    title: "Local Food Festival",
    description:
      "A community food experience bringing together local cooks and vendors.",
    venue: "Central Events Hub",
    date: "Nov 15, 2026",
    time: "12:00 PM",
    status: "APPROVED",
    votes: 42,
    hasVoted: false,
  },
  {
    id: 6,
    title: "Board Game Social",
    description:
      "Meet new people and enjoy an afternoon of board games and friendly competition.",
    venue: "The Creative Space",
    date: "Nov 21, 2026",
    time: "2:00 PM",
    status: "PENDING",
    votes: 14,
    hasVoted: false,
  },
];

/* =========================================================
   STATUS BADGE
========================================================= */

function StatusBadge({ status }: { status: EventStatus }) {
  const styles: Record<EventStatus, string> = {
    PENDING: "border-amber-200 bg-amber-50 text-amber-700",
    APPROVED: "border-emerald-200 bg-emerald-50 text-emerald-700",
    REJECTED: "border-red-200 bg-red-50 text-red-600",
  };

  const labels: Record<EventStatus, string> = {
    PENDING: "Pending",
    APPROVED: "Approved",
    REJECTED: "Rejected",
  };

  return (
    <span
      className={`
        inline-flex items-center
        rounded-full border
        px-2.5 py-1
        text-[11px] font-semibold
        ${styles[status]}
      `}
    >
      {labels[status]}
    </span>
  );
}

/* =========================================================
   EVENT CARD
========================================================= */

type EventCardProps = {
  event: CommunityEvent;
  onVote: (eventId: number) => void;
  onOpen: (eventId: number) => void;
};

function EventCard({ event, onVote, onOpen }: EventCardProps) {
  return (
    <article
      className="
        group
        relative
        flex h-full
        flex-col
        rounded-[24px]
        border border-white/80
        bg-white/60
        p-5
        shadow-[0_15px_45px_rgba(31,80,160,0.08)]
        backdrop-blur-xl
        transition-all
        duration-300

        hover:-translate-y-1
        hover:bg-white/80
        hover:shadow-[0_22px_55px_rgba(31,80,160,0.13)]
      "
    >
      {/* Top */}

      <div className="flex items-start justify-between gap-4">
        <StatusBadge status={event.status} />

        <button
          type="button"
          onClick={() => onOpen(event.id)}
          aria-label={`Open ${event.title}`}
          className="
            flex h-8 w-8
            shrink-0
            items-center justify-center
            rounded-full
            bg-white/70
            text-slate-400
            transition

            hover:bg-blue-50
            hover:text-blue-600
          "
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      {/* Event information */}

      <div className="mt-4 flex-1">
        <button
          type="button"
          onClick={() => onOpen(event.id)}
          className="text-left"
        >
          <h2
            className="
              text-lg font-bold
              tracking-tight
              text-slate-900
              transition
              group-hover:text-blue-700
            "
          >
            {event.title}
          </h2>
        </button>

        <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-500">
          {event.description}
        </p>

        {/* Meta information */}

        <div className="mt-5 space-y-2.5">
          <div className="flex items-center gap-2.5 text-sm text-slate-600">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
              <MapPin className="h-3.5 w-3.5" />
            </span>

            <span className="truncate">{event.venue}</span>
          </div>

          <div className="flex items-center gap-2.5 text-sm text-slate-600">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
              <CalendarDays className="h-3.5 w-3.5" />
            </span>

            <span>{event.date}</span>
          </div>

          <div className="flex items-center gap-2.5 text-sm text-slate-600">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
              <Clock3 className="h-3.5 w-3.5" />
            </span>

            <span>{event.time}</span>
          </div>
        </div>
      </div>

      {/* Bottom */}

      <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
        <button
          type="button"
          onClick={() => onVote(event.id)}
          className={`
            flex items-center gap-2
            rounded-xl
            px-3 py-2
            text-sm font-semibold
            transition

            ${
              event.hasVoted
                ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                : "bg-blue-50 text-blue-700 hover:bg-blue-100"
            }
          `}
        >
          {event.hasVoted ? (
            <Check className="h-4 w-4" />
          ) : (
            <ArrowUp className="h-4 w-4" />
          )}

          <span>{event.votes}</span>

          <span className="hidden sm:inline">
            {event.hasVoted ? "Voted" : "Vote"}
          </span>
        </button>

        <button
          type="button"
          onClick={() => onOpen(event.id)}
          className="
            flex items-center gap-1
            text-sm font-semibold
            text-slate-500
            transition

            hover:text-blue-600
          "
        >
          Details

          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </article>
  );
}

/* =========================================================
   PAGE
========================================================= */

export default function EventsPage() {
  const router = useRouter();

  const [events, setEvents] = useState(initialEvents);
  const [search, setSearch] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<
    "ALL" | EventStatus
  >("ALL");

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  /* =======================================================
     FILTERING
  ======================================================= */

  const filteredEvents = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return events.filter((event) => {
      const matchesStatus =
        selectedStatus === "ALL" || event.status === selectedStatus;

      const matchesSearch =
        !normalizedSearch ||
        event.title.toLowerCase().includes(normalizedSearch) ||
        event.description.toLowerCase().includes(normalizedSearch) ||
        event.venue.toLowerCase().includes(normalizedSearch);

      return matchesStatus && matchesSearch;
    });
  }, [events, search, selectedStatus]);

  /* =======================================================
     VOTING

     Temporary local implementation.
     Replace with POST / DELETE API calls later.
  ======================================================= */

  const handleVote = (eventId: number) => {
    setEvents((currentEvents) =>
      currentEvents.map((event) => {
        if (event.id !== eventId) {
          return event;
        }

        return {
          ...event,
          hasVoted: !event.hasVoted,
          votes: event.hasVoted
            ? Math.max(0, event.votes - 1)
            : event.votes + 1,
        };
      })
    );
  };

  const handleOpenEvent = (eventId: number) => {
    router.push(`/events/${eventId}`);
  };

  const statuses: Array<{
    value: "ALL" | EventStatus;
    label: string;
  }> = [
    {
      value: "ALL",
      label: "All",
    },
    {
      value: "PENDING",
      label: "Pending",
    },
    {
      value: "APPROVED",
      label: "Approved",
    },
    {
      value: "REJECTED",
      label: "Rejected",
    },
  ];

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

          {/* Desktop navigation */}

          <nav className="hidden items-center gap-2 md:flex">
            <button
              type="button"
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
                hover:shadow-lg
              "
            >
              <Plus className="h-4 w-4" />
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

        {/* Mobile navigation panel */}

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
                <Plus className="h-4 w-4" />
                Suggest event
              </button>
            </div>
          </div>
        )}
      </header>

      {/* =================================================
          PAGE CONTENT
      ================================================== */}

      <div className="relative z-10 mx-auto w-full max-w-7xl px-5 pb-12 pt-8 sm:px-8 lg:px-12 lg:pt-10">
        {/* =================================================
            HERO
        ================================================== */}

        <section className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-blue-600">
              <Sparkles className="h-3.5 w-3.5" />
              Community ideas
            </div>

            <h1 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
              Discover events
            </h1>

            <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500 sm:text-base">
              Explore event ideas from your community, support your favorites
              and help decide what happens next.
            </p>
          </div>

          {/* Mobile suggest button */}

          <button
            type="button"
            onClick={() => router.push("/events/new")}
            className="
              flex h-12
              w-full
              items-center justify-center
              gap-2
              rounded-2xl
              bg-gradient-to-r
              from-blue-500
              via-blue-600
              to-indigo-600
              px-5
              text-sm font-semibold
              text-white
              shadow-lg shadow-blue-500/20
              transition

              hover:-translate-y-0.5

              md:hidden
            "
          >
            <Plus className="h-4 w-4" />
            Suggest an event
          </button>
        </section>

        {/* =================================================
            SEARCH + FILTERS
        ================================================== */}

        <section
          className="
            mt-7
            rounded-[24px]
            border border-white/80
            bg-white/45
            p-3
            shadow-[0_12px_40px_rgba(31,80,160,0.06)]
            backdrop-blur-xl

            sm:p-4
          "
        >
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            {/* Search */}

            <div className="relative w-full lg:max-w-md">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search events or venues..."
                className="
                  h-11
                  w-full
                  rounded-xl
                  border border-white
                  bg-white/70
                  pl-11 pr-4
                  text-sm
                  text-slate-900
                  outline-none
                  transition
                  placeholder:text-slate-400

                  focus:border-blue-400
                  focus:ring-4
                  focus:ring-blue-100
                "
              />
            </div>

            {/* Status filters */}

            <div className="flex gap-2 overflow-x-auto pb-1 lg:pb-0">
              {statuses.map((status) => {
                const active = selectedStatus === status.value;

                return (
                  <button
                    key={status.value}
                    type="button"
                    onClick={() => setSelectedStatus(status.value)}
                    className={`
                      shrink-0
                      rounded-xl
                      px-4 py-2.5
                      text-xs font-semibold
                      transition

                      ${
                        active
                          ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                          : "bg-white/60 text-slate-600 hover:bg-white hover:text-blue-600"
                      }
                    `}
                  >
                    {status.label}
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        {/* =================================================
            RESULTS HEADER
        ================================================== */}

        <div className="mb-4 mt-7 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold text-slate-900">
              Community suggestions
            </h2>

            <p className="mt-0.5 text-xs text-slate-500">
              {filteredEvents.length}{" "}
              {filteredEvents.length === 1 ? "event" : "events"} found
            </p>
          </div>
        </div>

        {/* =================================================
            EVENTS GRID
        ================================================== */}

        {filteredEvents.length > 0 ? (
          <section
            className="
              grid
              grid-cols-1
              gap-4

              md:grid-cols-2

              xl:grid-cols-3
            "
          >
            {filteredEvents.map((event) => (
              <EventCard
                key={event.id}
                event={event}
                onVote={handleVote}
                onOpen={handleOpenEvent}
              />
            ))}
          </section>
        ) : (
          /* =================================================
             EMPTY STATE
          ================================================== */

          <section
            className="
              mt-4
              flex min-h-[320px]
              flex-col
              items-center
              justify-center
              rounded-[28px]
              border border-white/80
              bg-white/45
              px-6
              text-center
              shadow-[0_15px_45px_rgba(31,80,160,0.06)]
              backdrop-blur-xl
            "
          >
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
              <Search className="h-6 w-6" />
            </div>

            <h2 className="mt-4 text-lg font-bold text-slate-900">
              No events found
            </h2>

            <p className="mt-2 max-w-sm text-sm leading-6 text-slate-500">
              Try changing your search or selecting a different event status.
            </p>

            <button
              type="button"
              onClick={() => {
                setSearch("");
                setSelectedStatus("ALL");
              }}
              className="mt-5 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-blue-600 shadow-sm transition hover:bg-blue-50"
            >
              Clear filters
            </button>
          </section>
        )}
      </div>
    </main>
  );
}