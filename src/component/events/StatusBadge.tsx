/* =========================================================
   STATUS BADGE
========================================================= */

import { EventStatus } from "@/types";

type StatusBadgeProps = {
  status: EventStatus;
};

export const StatusBadge = ({ status }: StatusBadgeProps) => {
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