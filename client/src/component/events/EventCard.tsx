/* =========================================================
   EVENT CARD
========================================================= */

import { CommunityEvent } from "@/types";
import { StatusBadge } from "./StatusBadge";
import { ChevronRight, MapPin, CalendarDays, Clock3, Check, ArrowUp } from "lucide-react";

type EventCardProps = {
  event: CommunityEvent;
  onVote: (eventId: number) => void;
  onOpen: (eventId: number) => void;
};

export const EventCard = ({ event, onVote, onOpen }: EventCardProps) => {
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