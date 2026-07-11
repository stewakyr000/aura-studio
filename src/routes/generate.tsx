import { createFileRoute } from "@tanstack/react-router";
import { AppShell, PageHeader } from "@/components/app-shell";
import * as Tabs from "@radix-ui/react-tabs";
import { Film, Image as ImageIcon, Play, Download, Sparkles, Loader2 } from "lucide-react";

export const Route = createFileRoute("/generate")({
  head: () => ({
    meta: [
      { title: "Generate · Sanctum" },
      { name: "description", content: "Summon a batch of content from your song." },
    ],
  }),
  component: GeneratePage,
});

function GeneratePage() {
  return (
    <AppShell>
      <PageHeader
        eyebrow="Step 03 · Summon"
        title="Render the batch."
        subtitle="Sanctum uses Cathedral of Static + Dark Ritual to compose your queue. Adjust the count, hit summon, walk away."
      />

      <Tabs.Root defaultValue="video">
        <Tabs.List className="glass-panel mb-8 inline-flex gap-1 rounded-full p-1">
          <Tab value="video" icon={Film} label="Video edits" count={50} />
          <Tab value="photo" icon={ImageIcon} label="Photo pieces" count={30} />
        </Tabs.List>

        <div className="grid grid-cols-12 gap-6">
          <aside className="glass-panel col-span-12 h-fit space-y-6 rounded-2xl p-6 lg:col-span-4">
            <Section title="Batch size">
              <div className="grid grid-cols-4 gap-2">
                {[10, 25, 50, 100].map((n) => (
                  <button
                    key={n}
                    className={`rounded-md border py-2 text-sm ${
                      n === 50
                        ? "border-ember/50 bg-ember/10 text-ember"
                        : "border-border/60 text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {n}
                  </button>
                ))}
              </div>
            </Section>

            <Section title="Include">
              <CheckRow label="Lyric videos" on />
              <CheckRow label="Aesthetic edits" on />
              <CheckRow label="Performance edits" on />
              <CheckRow label="Short clips (7–15s)" on />
            </Section>

            <Section title="Aspect ratio">
              <div className="flex gap-2">
                <Aspect label="9:16" active />
                <Aspect label="1:1" />
                <Aspect label="4:5" />
              </div>
            </Section>

            <button className="group flex w-full items-center justify-center gap-3 rounded-full bg-ember py-4 text-sm font-medium uppercase tracking-[0.25em] text-ember-foreground ember-glow transition-transform hover:scale-[1.02]">
              <Sparkles className="h-4 w-4" strokeWidth={2} />
              Generate 50 videos
            </button>
            <div className="text-center text-xs text-muted-foreground">
              ~ 6 minutes · 12 credits
            </div>
          </aside>

          <div className="col-span-12 space-y-6 lg:col-span-8">
            <div className="glass-panel rounded-2xl p-6">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <div className="text-[10px] uppercase tracking-[0.25em] text-ember">
                    Now rendering
                  </div>
                  <div className="mt-1 font-serif text-2xl font-light">
                    Batch · Dark Ritual · 32 of 50
                  </div>
                </div>
                <div className="font-mono text-xs text-muted-foreground">04:12 remaining</div>
              </div>
              <div className="relative h-1.5 overflow-hidden rounded-full bg-muted/40">
                <div
                  className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-ember/60 to-ember"
                  style={{ width: "64%" }}
                />
              </div>
              <div className="mt-4 flex gap-6 text-xs">
                <Stat label="Rendered" value="32" />
                <Stat label="Queued" value="18" />
                <Stat label="Style" value="Dark Ritual" />
                <Stat label="Runtime" value="7–15s" />
              </div>
            </div>

            <Tabs.Content value="video" className="grid grid-cols-2 gap-4 md:grid-cols-3">
              {Array.from({ length: 9 }).map((_, i) => (
                <ContentTile key={i} idx={i} kind="video" />
              ))}
            </Tabs.Content>
            <Tabs.Content value="photo" className="grid grid-cols-2 gap-4 md:grid-cols-3">
              {Array.from({ length: 9 }).map((_, i) => (
                <ContentTile key={i} idx={i} kind="photo" />
              ))}
            </Tabs.Content>
          </div>
        </div>
      </Tabs.Root>
    </AppShell>
  );
}

function Tab({
  value,
  icon: Icon,
  label,
  count,
}: {
  value: string;
  icon: typeof Film;
  label: string;
  count: number;
}) {
  return (
    <Tabs.Trigger
      value={value}
      className="group inline-flex items-center gap-3 rounded-full px-6 py-2.5 text-sm text-muted-foreground transition-colors data-[state=active]:bg-ember data-[state=active]:text-ember-foreground"
    >
      <Icon className="h-4 w-4" strokeWidth={1.5} />
      {label}
      <span className="rounded-full bg-background/30 px-2 py-0.5 font-mono text-[10px]">
        {count}
      </span>
    </Tabs.Trigger>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="mb-3 text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
        {title}
      </div>
      <div className="space-y-2">{children}</div>
    </div>
  );
}

function CheckRow({ label, on }: { label: string; on?: boolean }) {
  return (
    <label className="flex cursor-pointer items-center justify-between rounded-md border border-border/60 bg-background/30 px-3 py-2.5 text-sm">
      <span>{label}</span>
      <span
        className={`flex h-4 w-4 items-center justify-center rounded-sm border ${
          on ? "border-ember bg-ember text-ember-foreground" : "border-border"
        }`}
      >
        {on && <span className="text-[10px]">✓</span>}
      </span>
    </label>
  );
}

function Aspect({ label, active }: { label: string; active?: boolean }) {
  return (
    <button
      className={`flex-1 rounded-md border py-2 font-mono text-xs ${
        active
          ? "border-ember/50 bg-ember/10 text-ember"
          : "border-border/60 text-muted-foreground"
      }`}
    >
      {label}
    </button>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
        {label}
      </div>
      <div className="mt-0.5 font-mono text-sm">{value}</div>
    </div>
  );
}

function ContentTile({ idx, kind }: { idx: number; kind: "video" | "photo" }) {
  const rendered = idx < 6;
  const tones = [
    "from-rose-900/40 to-zinc-950",
    "from-amber-900/50 to-black",
    "from-slate-800/40 to-neutral-950",
    "from-orange-900/40 to-zinc-950",
    "from-red-950/60 to-black",
    "from-neutral-800/50 to-zinc-950",
  ];
  return (
    <div className="group relative">
      <div
        className={`relative aspect-[9/16] overflow-hidden rounded-xl border border-border/60 bg-gradient-to-br ${tones[idx % 6]} transition-all group-hover:border-ember/40`}
      >
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,rgba(0,0,0,0.7))]" />
        {rendered ? (
          <>
            <div className="absolute left-2.5 top-2.5 rounded-full bg-background/60 px-2 py-0.5 font-mono text-[9px] backdrop-blur">
              {kind === "video" ? "00:12" : "still"}
            </div>
            <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity group-hover:opacity-100">
              <div className="flex gap-2">
                <button className="flex h-9 w-9 items-center justify-center rounded-full bg-background/70 backdrop-blur">
                  <Play className="h-3.5 w-3.5 text-ember" />
                </button>
                <button className="flex h-9 w-9 items-center justify-center rounded-full bg-background/70 backdrop-blur">
                  <Download className="h-3.5 w-3.5 text-ember" />
                </button>
              </div>
            </div>
            <div className="absolute bottom-2.5 left-2.5 right-2.5 text-[11px] font-light text-foreground/80">
              {kind === "video" ? "Chorus loop · v" : "Lyric card · v"}
              {idx + 1}
            </div>
          </>
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-muted-foreground">
            <Loader2 className="h-5 w-5 animate-spin text-ember/60" />
            <div className="font-mono text-[10px] uppercase tracking-widest">
              Rendering
            </div>
          </div>
        )}
      </div>
    </div>
  );
}