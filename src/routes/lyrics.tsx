import { createFileRoute } from "@tanstack/react-router";
import { AppShell, PageHeader, Waveform } from "@/components/app-shell";
import { Play, Highlighter, Pencil, Scissors, Sparkles } from "lucide-react";

export const Route = createFileRoute("/lyrics")({
  head: () => ({
    meta: [
      { title: "Lyrics Editor · Sanctum" },
      { name: "description", content: "Refine the words your song will project." },
    ],
  }),
  component: LyricsPage,
});

const lines = [
  { t: "0:00", text: "The static hums like a cathedral choir", highlight: false, section: "Intro" },
  { t: "0:07", text: "I kneel in the light of a broken sign", highlight: false },
  { t: "0:14", text: "You said forever like it was a threat", highlight: true, section: "Verse 1" },
  { t: "0:21", text: "I wear your name like a rusted crown", highlight: false },
  { t: "0:29", text: "Hallelujah, hallelujah — quietly", highlight: true, section: "Chorus" },
  { t: "0:37", text: "The neon bleeds into my cigarette", highlight: false },
  { t: "0:44", text: "I am the ghost of the boy you loved", highlight: true },
  { t: "0:52", text: "And I forgive you every single night", highlight: false },
  { t: "1:00", text: "Cathedral of static, hold me down", highlight: true, section: "Hook" },
  { t: "1:08", text: "Turn the volume up until I drown", highlight: false },
];

function LyricsPage() {
  return (
    <AppShell>
      <PageHeader
        eyebrow="Step 04 · Word"
        title="Refine what the song will say."
        subtitle="Sanctum transcribed your track. Correct anything wrong, mark the lines that matter, and we'll build lyric edits around them."
      >
        <button className="rounded-full border border-ember/40 bg-ember/10 px-6 py-3 text-xs font-medium uppercase tracking-[0.25em] text-ember transition-all hover:bg-ember/20">
          Save & regenerate →
        </button>
      </PageHeader>

      <div className="glass-panel mb-6 rounded-2xl p-6">
        <div className="mb-4 flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-3">
            <button className="flex h-9 w-9 items-center justify-center rounded-full bg-ember text-ember-foreground">
              <Play className="h-3.5 w-3.5" />
            </button>
            <span className="font-mono">01:04</span>
            <span className="opacity-40">/</span>
            <span className="font-mono">03:41</span>
          </div>
          <div className="flex gap-1.5">
            <ToolBtn icon={Highlighter} label="Highlight" active />
            <ToolBtn icon={Pencil} label="Edit" />
            <ToolBtn icon={Scissors} label="Split" />
            <ToolBtn icon={Sparkles} label="Auto-align" />
          </div>
        </div>
        <div className="relative">
          <Waveform bars={120} active={0.29} />
          <div className="pointer-events-none absolute inset-y-0 left-[15%] right-[62%] rounded-md border border-ember/40 bg-ember/5" />
          <div className="pointer-events-none absolute inset-y-0 left-[29%] w-px bg-ember" />
        </div>
        <div className="mt-3 flex justify-between font-mono text-[10px] text-muted-foreground">
          <span>0:00</span>
          <span>0:45</span>
          <span>1:30</span>
          <span>2:15</span>
          <span>3:00</span>
          <span>3:41</span>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 lg:col-span-8">
          <div className="space-y-2">
            {lines.map((l, i) => (
              <LyricRow key={i} line={l} active={i === 4} />
            ))}
          </div>
        </div>

        <aside className="col-span-12 space-y-4 lg:col-span-4">
          <div className="glass-panel rounded-2xl p-6">
            <div className="mb-4 text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
              Structure
            </div>
            <div className="space-y-2">
              {["Intro", "Verse 1", "Chorus", "Verse 2", "Hook", "Bridge", "Outro"].map(
                (s, i) => (
                  <div
                    key={s}
                    className={`flex items-center justify-between rounded-md px-3 py-2 text-sm ${
                      i === 2 ? "bg-ember/10 text-ember" : "text-muted-foreground"
                    }`}
                  >
                    <span>{s}</span>
                    <span className="font-mono text-[10px]">
                      {["0:00", "0:14", "0:29", "1:15", "1:45", "2:20", "3:15"][i]}
                    </span>
                  </div>
                ),
              )}
            </div>
          </div>

          <div className="glass-panel rounded-2xl p-6">
            <div className="mb-3 flex items-center justify-between text-[10px] uppercase tracking-[0.25em]">
              <span className="text-muted-foreground">Marked lines</span>
              <span className="text-ember">4 selected</span>
            </div>
            <p className="text-sm font-light leading-relaxed text-muted-foreground">
              Highlighted lyrics become the anchor moments of your lyric edits — the frames
              held longest, the type sized largest, the beat where the cut lands.
            </p>
          </div>
        </aside>
      </div>
    </AppShell>
  );
}

function LyricRow({ line, active }: { line: (typeof lines)[number]; active: boolean }) {
  return (
    <div>
      {line.section && (
        <div className="mb-2 mt-6 text-[10px] uppercase tracking-[0.3em] text-ember">
          {line.section}
        </div>
      )}
      <div
        className={`group flex items-center gap-5 rounded-lg border px-5 py-3.5 transition-all ${
          active
            ? "border-ember/40 bg-ember/5"
            : line.highlight
              ? "border-ember/20 bg-ember/[0.02] hover:border-ember/40"
              : "border-transparent hover:border-border/60 hover:bg-card/30"
        }`}
      >
        <div className="w-12 font-mono text-xs text-muted-foreground">{line.t}</div>
        <div
          className={`flex-1 font-serif text-lg font-light leading-snug ${
            line.highlight ? "text-foreground" : "text-foreground/70"
          }`}
        >
          {line.text}
        </div>
        <div className="flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
          <button className="rounded-md p-1.5 hover:bg-muted/50">
            <Highlighter className="h-3.5 w-3.5 text-ember" />
          </button>
          <button className="rounded-md p-1.5 hover:bg-muted/50">
            <Pencil className="h-3.5 w-3.5 text-muted-foreground" />
          </button>
        </div>
      </div>
    </div>
  );
}

function ToolBtn({
  icon: Icon,
  label,
  active,
}: {
  icon: typeof Play;
  label: string;
  active?: boolean;
}) {
  return (
    <button
      className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-[10px] uppercase tracking-[0.2em] transition-colors ${
        active
          ? "border-ember/40 bg-ember/10 text-ember"
          : "border-border/60 text-muted-foreground hover:text-foreground"
      }`}
    >
      <Icon className="h-3 w-3" strokeWidth={1.5} />
      {label}
    </button>
  );
}