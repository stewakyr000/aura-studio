import { createFileRoute } from "@tanstack/react-router";
import { AppShell, PageHeader } from "@/components/app-shell";
import { Instagram, Music2, Trash2, Youtube } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { useCurrentProjectId } from "@/hooks/use-current-project";
import {
  createCalendarPost,
  deleteCalendarPost,
  listCalendarPosts,
  listContentItems,
  updateCalendarPost,
} from "@/lib/api";
import { NoProjectMessage } from "./upload";

export const Route = createFileRoute("/_authenticated/calendar")({
  head: () => ({
    meta: [
      { title: "Content Calendar · Sanctum" },
      { name: "description", content: "Your song's rollout across the week." },
    ],
  }),
  component: CalendarPage,
});

const STATUSES = ["idea", "generated", "ready", "posted"] as const;

function startOfWeek(d: Date) {
  const day = d.getDay(); // Sun=0
  const diff = day === 0 ? -6 : 1 - day;
  const m = new Date(d);
  m.setDate(d.getDate() + diff);
  m.setHours(0, 0, 0, 0);
  return m;
}

function CalendarPage() {
  const { user } = useAuth();
  const [projectId] = useCurrentProjectId();
  const qc = useQueryClient();

  const postsQ = useQuery({
    queryKey: ["calendar", projectId],
    queryFn: () => listCalendarPosts(projectId!),
    enabled: !!projectId,
  });
  const itemsQ = useQuery({
    queryKey: ["content", projectId],
    queryFn: () => listContentItems(projectId!),
    enabled: !!projectId,
  });

  const addM = useMutation({
    mutationFn: (dateIso: string) => {
      if (!user || !projectId) throw new Error("No project");
      return createCalendarPost({
        project_id: projectId,
        user_id: user.id,
        scheduled_for: dateIso,
        status: "idea",
        platform: "tiktok",
      });
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["calendar", projectId] }),
  });

  const updateM = useMutation({
    mutationFn: ({ id, patch }: { id: string; patch: Parameters<typeof updateCalendarPost>[1] }) =>
      updateCalendarPost(id, patch),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["calendar", projectId] }),
  });

  const deleteM = useMutation({
    mutationFn: deleteCalendarPost,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["calendar", projectId] }),
  });

  if (!projectId) return <NoProjectMessage />;

  const start = startOfWeek(new Date());
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    return d;
  });
  const posts = postsQ.data ?? [];
  const items = itemsQ.data ?? [];
  const todayKey = new Date().toDateString();

  return (
    <AppShell>
      <PageHeader
        eyebrow="Step 05 · Ritual schedule"
        title="Your song's rollout, week by week."
        subtitle="Assign content items to dates and track them across idea, ready, and posted."
      >
        <div className="rounded-full border border-ember/30 bg-ember/5 px-5 py-2.5 font-mono text-xs text-ember">
          {formatRange(days[0], days[6])}
        </div>
      </PageHeader>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-7">
        {days.map((d) => {
          const dayPosts = posts.filter(
            (p) => p.scheduled_for && new Date(p.scheduled_for).toDateString() === d.toDateString(),
          );
          const isToday = d.toDateString() === todayKey;
          return (
            <div key={d.toISOString()} className="space-y-3">
              <div className="flex items-baseline justify-between border-b border-border/60 pb-3">
                <div>
                  <div className="font-serif text-lg">
                    {d.toLocaleDateString(undefined, { weekday: "long" })}
                  </div>
                  <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                    {d.toLocaleDateString(undefined, { month: "short", day: "2-digit" })}
                  </div>
                </div>
                {isToday && (
                  <div className="rounded-full border border-ember/40 bg-ember/10 px-2 py-0.5 text-[9px] uppercase tracking-[0.2em] text-ember">
                    Today
                  </div>
                )}
              </div>
              <div className="space-y-3">
                {dayPosts.map((p) => {
                  const linked = items.find((i) => i.id === p.content_item_id);
                  const PlatformIcon =
                    p.platform === "instagram" ? Instagram : p.platform === "youtube" ? Youtube : Music2;
                  return (
                    <div key={p.id} className="glass-panel overflow-hidden rounded-xl">
                      <div className="relative aspect-[3/4] overflow-hidden bg-gradient-to-br from-rose-900/40 to-zinc-950">
                        {linked?.preview_url && (
                          <img src={linked.preview_url} alt="" className="absolute inset-0 h-full w-full object-cover" />
                        )}
                        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,transparent_30%,rgba(0,0,0,0.7))]" />
                        <div className="absolute left-2.5 top-2.5 flex h-6 w-6 items-center justify-center rounded-full bg-background/60 backdrop-blur">
                          <PlatformIcon className="h-3 w-3 text-foreground/90" strokeWidth={1.5} />
                        </div>
                        <div className="absolute inset-x-3 bottom-3">
                          <div className="font-serif text-sm text-foreground/95">
                            {linked?.title ?? p.caption ?? "Untitled"}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between gap-2 px-3 py-2.5">
                        <select
                          value={p.status}
                          onChange={(e) => updateM.mutate({ id: p.id, patch: { status: e.target.value } })}
                          className="rounded-md border border-border/60 bg-background/40 px-2 py-1 text-[10px] uppercase tracking-widest text-muted-foreground"
                        >
                          {STATUSES.map((s) => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                        <select
                          value={p.content_item_id ?? ""}
                          onChange={(e) =>
                            updateM.mutate({ id: p.id, patch: { content_item_id: e.target.value || null } })
                          }
                          className="min-w-0 flex-1 truncate rounded-md border border-border/60 bg-background/40 px-2 py-1 text-[10px] text-muted-foreground"
                        >
                          <option value="">— no content —</option>
                          {items.map((i) => (
                            <option key={i.id} value={i.id}>{i.title ?? i.type}</option>
                          ))}
                        </select>
                        <button
                          onClick={() => deleteM.mutate(p.id)}
                          className="rounded-md p-1 text-muted-foreground hover:text-foreground"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
                <button
                  onClick={() => {
                    const iso = new Date(d);
                    iso.setHours(18, 0, 0, 0);
                    addM.mutate(iso.toISOString());
                  }}
                  className="w-full rounded-lg border border-dashed border-border/60 py-3 text-[10px] uppercase tracking-[0.25em] text-muted-foreground transition-colors hover:border-ember/40 hover:text-ember"
                >
                  + Add drop
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </AppShell>
  );
}

function formatRange(a: Date, b: Date) {
  const fmt = (d: Date) => d.toLocaleDateString(undefined, { month: "short", day: "2-digit" });
  return `${fmt(a)} — ${fmt(b)}`;
}