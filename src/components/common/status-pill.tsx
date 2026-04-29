type StatusPillProps = {
  status: "planned" | "foundation" | "migration" | "ready";
};

const statusLabels: Record<StatusPillProps["status"], string> = {
  planned: "Planned",
  foundation: "Foundation",
  migration: "Migration",
  ready: "Ready",
};

const statusClassNames: Record<StatusPillProps["status"], string> = {
  planned: "border-slate-200 bg-slate-50 text-slate-600",
  foundation: "border-cyan-200 bg-cyan-50 text-cyan-700",
  migration: "border-amber-200 bg-amber-50 text-amber-700",
  ready: "border-emerald-200 bg-emerald-50 text-emerald-700",
};

export function StatusPill({ status }: StatusPillProps) {
  return (
    <span className={`rounded-md border px-2 py-1 text-xs font-medium ${statusClassNames[status]}`}>
      {statusLabels[status]}
    </span>
  );
}
