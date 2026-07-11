import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell, Waveform } from "@/components/app-shell";
import {
  Play,
  Pause,
  Upload,
  Sparkles,
  Wand2,
  ArrowUpRight,
  Music2,
  Film,
  Image as ImageIcon,
  TrendingUp,
} from "lucide-react";

export const Route = createFileRoute("/")({
  component: StudioHome,
});

function StudioHome() {
  return (
    <AppShell>
      {/* Hero */}
      <section className="relative mb-16">
        <div className="mb-6 flex items-center gap-3 text-[10px] uppercase tracking-[0.35em] text-ember">
          <span className="h-px w-8 bg-ember/60" />
          The Studio · Session 04
        </div>
        <h1 className="max-w-4xl font-serif text-6xl font-light leading-[1.02] tracking-tight md:text-7xl">
          Turn one song into an{" "}
          <span className="italic text-ember">entire content universe.</span>
        </h1>
        <p className="mt-6 max-w-xl text-lg font-light leading-relaxed text-muted-foreground">
          Upload a track. Choose a vibe. Sanctum renders fifty pieces of
          cinematic short-form content — while you make the next one.
        </p>

        <div className="mt-10 flex items-center gap-4">
          <Link
            to="/upload"
            className="group inline-flex items-center gap-3 rounded-full bg-foreground px-7 py-3.5 text-sm font-medium text-background transition-all hover:ember-glow"
          >
            Begin a session
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </Link>
          <Link
            to="/vibes"
            className="text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground transition-colors hover:text-foreground"
          >
            Browse directions →
          </Link>
        </div>
      </section>

      {/* Now playing / flow */}
      <section className="mb-16 grid grid-cols-12 gap-6">
        {/* Song card */}
        <div className="glass-panel col-span-12 rounded-2xl p-8 lg:col-span-7">
          <div className="mb-8 flex items-center justify-between">
            <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-ember" />
              Currently loaded
            </div>
            <div className="font-mono text-xs text-muted-foreground">
              02:47 / 03:41
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-lg border border-ember/30">
              <div className="absolute inset-0 bg-gradient-to-br from-ember/60 via-ember/10 to-transparent" />
              <div className="absolute inset-0 flex items-center justify-center">
                <Music2 className="h-8 w-8 text-background/70" strokeWidth={1.2} />
              </div>
            </div>
            <div className="min-w-0 flex-1">
              <div className="font-serif text-2xl leading-tight">
                Cathedral of Static
              </div>
              <div className="mt-1 text-sm text-muted-foreground">
                Nova Vale · Unreleased · A minor · 84 BPM
              </div>
            </div>
            <button className="flex h-14 w-14 items-center justify-center rounded-full bg-ember text-ember-foreground ember-glow transition-transform hover:scale-105">
              <Pause className="h-5 w-5" strokeWidth={2} />
            </button>
          </div>

          <Waveform className="mt-8" bars={72} active={0.72} />

          <div className="mt-6 grid grid-cols-3 gap-4 border-t border-border/60 pt-6 text-sm">
            <Stat label="Lyrics" value="Detected" ok />
            <Stat label="Stems" value="Split · 4 tracks" ok />
            <Stat label="Mood" value="Nocturnal · Longing" ok />
          </div>
        </div>

        {/* Flow steps */}
        <div className="col-span-12 space-y-3 lg:col-span-5">
          <FlowStep
            num="01"
            icon={Upload}
            title="Upload"
            body="Drop a track or paste a link."
            state="done"
          />
          <FlowStep
            num="02"
            icon={Sparkles}
            title="Choose a vibe"
            body="Late Night Cinema selected."
            state="active"
          />
          <FlowStep
            num="03"
            icon={Wand2}
            title="Generate"
            body="Ready to render 50 pieces."
            state="pending"
          />
        </div>
      </section>

      {/* Content previews */}
      <section className="mb-4">
        <div className="mb-6 flex items-end justify-between">
          <div>
            <div className="mb-2 text-[10px] uppercase tracking-[0.3em] text-ember">
              Recent output
            </div>
            <h2 className="font-serif text-3xl font-light">Fresh from the altar</h2>
          </div>
          <div className="flex gap-2 text-xs">
            <Chip active>All</Chip>
            <Chip>Video</Chip>
            <Chip>Photo</Chip>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-5 md:grid-cols-4">
          {previews.map((p, i) => (
            <PreviewCard key={i} {...p} />
          ))}
        </div>
      </section>

      <section className="mt-16 grid grid-cols-3 gap-6">
        <MetricCard icon={Film} label="Video edits" value="128" trend="+24" />
        <MetricCard icon={ImageIcon} label="Photo pieces" value="41" trend="+9" />
        <MetricCard icon={TrendingUp} label="Avg. reach" value="12.4k" trend="+38%" />
      </section>
    </AppShell>
  );
}

function Stat({ label, value, ok }: { label: string; value: string; ok?: boolean }) {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
        {label}
      </div>
      <div className="mt-1 flex items-center gap-2 text-sm">
        {ok && <span className="h-1.5 w-1.5 rounded-full bg-ember" />}
        {value}
      </div>
    </div>
  );
}

function FlowStep({
  num,
  icon: Icon,
  title,
  body,
  state,
}: {
  num: string;
  icon: typeof Upload;
  title: string;
  body: string;
  state: "done" | "active" | "pending";
}) {
  return (
    <div
      className={`glass-panel flex items-center gap-5 rounded-xl p-5 transition-all ${
        state === "active" ? "border-ember/40 ember-glow" : ""
      }`}
    >
      <div className="font-mono text-xs text-muted-foreground">{num}</div>
      <div
        className={`flex h-11 w-11 items-center justify-center rounded-full border ${
          state === "done"
            ? "border-ember/40 bg-ember/15 text-ember"
            : state === "active"
              ? "border-ember bg-ember text-ember-foreground"
              : "border-border text-muted-foreground"
        }`}
      >
        <Icon className="h-4 w-4" strokeWidth={1.5} />
      </div>
      <div className="min-w-0 flex-1">
        <div className="font-serif text-lg">{title}</div>
        <div className="text-xs text-muted-foreground">{body}</div>
      </div>
      <div className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
        {state}
      </div>
    </div>
  );
}

function Chip({ children, active }: { children: React.ReactNode; active?: boolean }) {
  return (
    <button
      className={`rounded-full border px-3.5 py-1.5 text-[10px] uppercase tracking-[0.25em] transition-colors ${
        active
          ? "border-ember/50 bg-ember/10 text-ember"
          : "border-border/60 text-muted-foreground hover:text-foreground"
      }`}
    >
      {children}
    </button>
  );
}

const previews = [
  { kind: "VHS", title: "Chorus loop · 07", tone: "from-rose-900/40 to-amber-800/20" },
  { kind: "Cinema", title: "Bridge · slow-mo", tone: "from-slate-800/50 to-neutral-900/30" },
  { kind: "Ritual", title: "Verse 2 · smoke", tone: "from-orange-900/40 to-zinc-900/30" },
  { kind: "Bedroom", title: "Intro · handheld", tone: "from-amber-900/30 to-stone-900/40" },
];

function PreviewCard({ kind, title, tone }: (typeof previews)[number]) {
  return (
    <div className="group cursor-pointer">
      <div
        className={`relative aspect-[3/4] overflow-hidden rounded-xl border border-border/60 bg-gradient-to-br ${tone} transition-all group-hover:border-ember/40 group-hover:ember-glow`}
      >
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,rgba(0,0,0,0.6))]" />
        <div className="absolute left-3 top-3 rounded-full border border-ember/40 bg-background/40 px-2.5 py-1 text-[9px] uppercase tracking-[0.25em] text-ember backdrop-blur">
          {kind}
        </div>
        <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity group-hover:opacity-100">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-background/60 backdrop-blur">
            <Play className="h-4 w-4 text-ember" />
          </div>
        </div>
        <div className="absolute bottom-3 left-3 right-3 font-serif text-sm text-foreground/90">
          {title}
        </div>
      </div>
    </div>
  );
}

function MetricCard({
  icon: Icon,
  label,
  value,
  trend,
}: {
  icon: typeof Film;
  label: string;
  value: string;
  trend: string;
}) {
  return (
    <div className="glass-panel rounded-xl p-6">
      <div className="mb-4 flex items-center justify-between">
        <Icon className="h-4 w-4 text-ember" strokeWidth={1.5} />
        <div className="rounded-full bg-ember/10 px-2 py-0.5 font-mono text-[10px] text-ember">
          {trend}
        </div>
      </div>
      <div className="font-serif text-4xl font-light">{value}</div>
      <div className="mt-1 text-xs uppercase tracking-[0.2em] text-muted-foreground">
        {label}
      </div>
    </div>
  );
}
