/* =========================================================
   TYPES
========================================================= */

export type EventStatus = "PENDING" | "APPROVED" | "REJECTED";

export type CommunityEvent = {
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