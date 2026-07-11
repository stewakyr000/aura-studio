import { createFileRoute } from "@tanstack/react-router";
import { AppShell, PageHeader } from "@/components/app-shell";
import { Download, MoreHorizontal, Instagram, Youtube, Music2 } from "lucide-react";

export const Route = createFileRoute("/calendar")({
  head: () => ({
    meta: [
      { title: "Content Calendar · Sanctum" },
      { name: "description", content: "Your song's rollout across the week." },
    ],
  }),
  component: CalendarPage,
});

type Item = {
  title: string;
  vibe: string;
  time: string;
  platform: "tt" | "ig" | "yt";
  status: "scheduled" | "ready" | "draft" | "posted";
  tone: string;
};

const week: { day: string; date: string; items: Item[] }[] = [
  {
    day: "Monday",
    date: "Nov 04",
    items: [
      { title: "VHS lyric edit · chorus", vibe: "VHS Underground", time: "18:30", platform: "tt", status: "scheduled", tone: "from-rose-900/50 to-zinc-950" },
      { title: "Emotional slideshow", vibe: "Late Night Cinema", time: "21:00", platform: "ig", status: "ready", tone: "from-slate-800/50 to-neutral-950" },
    ],
  },
  {
    day: "Tuesday",
    date: "Nov 05",
    items: [
      { title: "Fan-style discovery post", vibe: "Internet Discovery", time: "12:15", platform: "tt", status: "ready", tone: "from-cyan-950/50 to-fuchsia-950/30" },
    ],
  },
  {
    day: "Wednesday",
    date: "Nov 06",
    items: [
      { title: "Cinematic long edit", vibe: "Late Night Cinema", time: "19:00", platform: "yt", status: "draft", tone: "from-neutral-800/60 to-zinc-950" },
      { title: "Bedroom performance loop", vibe: "Bedroom Artist", time: "22:30", platform: "ig", status: "scheduled", tone: "from-amber-900/40 to-stone-950" },
    ],
  },
  {
    day: "Thursday",
    date: "Nov 07",
    items: [
      { title: "Dark Ritual · smoke frames", vibe: "Dark Ritual", time: "20:00", platform: "tt", status: "ready", tone: "from-red-950/60 to-black" },
    ],
  },
  {
    day: "Friday",
    date: "Nov 08",
    items: [
      { title: "Editorial cover reveal", vibe: "High Editorial", time: "09:00", platform: "ig", status: "scheduled", tone: "from-zinc-800/60 to-neutral-950" },
      { title: "Quote card · chorus line", vibe: "High Editorial", time: "17:00", platform: "ig", status: "posted", tone: "from-neutral-900/70 to-zinc-950" },
      { title: "Snippet · hook 15s", vibe: "VHS Underground", time: "20:45", platform: "tt", status: "ready", tone: "from-orange-900/50 to-zinc-950" },
    ],
  },
  {
    day: "Saturday",
    date: "Nov 09",
    items: [
      { title: "Behind the record · vlog", vibe: "Bedroom Artist", time: "11:00", platform: "yt", status: "draft", tone: "from-amber-900/40 to-stone-950" },
    ],
  },
  {
    day: "Sunday",
    date: "Nov 10",
    items: [
      { title: "Sacred silence · mood board", vibe: "Dark Ritual", time: "21:11", platform: "ig", status: "scheduled", tone: "from-red-950/50 to-black" },
    ],
  },
];

function CalendarPage() {
  return (
    <AppShell>
      <PageHeader
        eyebrow="Step 05 · Ritual schedule"
        title="Your song's rollout, week by week."
        subtitle="Sanctum staggers your drops across platforms so the algorithm meets a steady rhythm — not a spike."
      >
        <div className="flex items-center gap-2">
          <button className="rounded-full border border-border/60 px-4 py-2.5 text-xs uppercase tracking-[0.2em] text-muted-foreground hover:text-foreground">
            ← Prev
          </button>
          <div className="rounded-full border border-ember/30 bg-ember/5 px-5 py-2.5 font-mono text-xs text-ember">
            Nov 04 — Nov 10
          </div>
          <button className="rounded-full border border-border/60 px-4 py-2.5 text-xs uppercase tracking-[0.2em] text-muted-foreground hover:text-foreground">
            Next →
          </button>
        </div>
      </PageHeader>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-7">
        {week.map((d, i) => (
          <div key={d.day} className="space-y-3">
            <div className="flex items-baseline justify-between border-b border-border/60 pb-3">
              <div>
                <div className="font-serif text-lg">{d.day}</div>
                <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                  {d.date}
                </div>
              </div>
              {i === 4 && (
                <div className="rounded-full border border-ember/40 bg-ember/10 px-2 py-0.5 text-[9px] uppercase tracking-[0.2em] text-ember">
                  Today
                </div>
              )}
            </div>
            <div className="space-y-3">
              {d.items.map((item, j) => (
                <CalItem key={j} item={item} />
              ))}
              <button className="w-full rounded-lg border border-dashed border-border/60 py-3 text-[10px] uppercase tracking-[0.25em] text-muted-foreground transition-colors hover:border-ember/40 hover:text-ember">
                + Add drop
              </button>
            </div>
          </div>
        ))}
      </div>
    </AppShell>
  );
}

function CalItem({ item }: { item: Item }) {
  const statusColor = {
    ready: "text-ember border-ember/40 bg-ember/10",
    scheduled: "text-foreground/80 border-border/60 bg-muted/30",
    draft: "text-muted-foreground border-border/40 bg-transparent",
    posted: "text-emerald-300/70 border-emerald-500/20 bg-emerald-500/5",
  }[item.status];

  const PlatformIcon =
    item.platform === "ig" ? Instagram : item.platform === "yt" ? Youtube : Music2;

  return (
    <div className="glass-panel group overflow-hidden rounded-xl transition-all hover:border-ember/40">
      <div className={`relative aspect-[3/4] overflow-hidden bg-gradient-to-br ${item.tone}`}>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,transparent_30%,rgba(0,0,0,0.7))]" />
        <div className="absolute left-2.5 top-2.5 flex items-center gap-1.5">
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-background/60 backdrop-blur">
            <PlatformIcon className="h-3 w-3 text-foreground/90" strokeWidth={1.5} />
          </div>
          <span className="rounded-full bg-background/60 px-2 py-0.5 font-mono text-[9px] backdrop-blur">
            {item.time}
          </span>
        </div>
        <div className="absolute inset-x-3 bottom-3">
          <div className="text-[9px] uppercase tracking-[0.25em] text-foreground/60">
            {item.vibe}
          </div>
          <div className="mt-1 font-serif text-sm leading-tight text-foreground/95">
            {item.title}
          </div>
        </div>
      </div>
      <div className="flex items-center justify-between px-3 py-2.5">
        <span className={`rounded-full border px-2 py-0.5 text-[9px] uppercase tracking-[0.2em] ${statusColor}`}>
          {item.status}
        </span>
        <div className="flex gap-1">
          <button className="rounded-md p-1.5 text-muted-foreground hover:bg-muted/50 hover:text-foreground">
            <Download className="h-3.5 w-3.5" />
          </button>
          <button className="rounded-md p-1.5 text-muted-foreground hover:bg-muted/50 hover:text-foreground">
            <MoreHorizontal className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}