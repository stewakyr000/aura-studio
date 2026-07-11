import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell, PageHeader } from "@/components/app-shell";
import { Check } from "lucide-react";

export const Route = createFileRoute("/vibes")({
  head: () => ({
    meta: [
      { title: "Creative Direction · Sanctum" },
      { name: "description", content: "Choose the artistic universe for your song." },
    ],
  }),
  component: VibesPage,
});

const vibes = [
  {
    id: "vhs",
    name: "VHS Underground",
    tag: "Analog · Raw",
    body: "Grain, scanlines, and shutter jitter. The tape you found in your father's attic. For songs that bruise.",
    tokens: ["grain", "distortion", "nostalgic", "raw"],
    gradient: "from-orange-900/50 via-rose-950/30 to-zinc-950",
  },
  {
    id: "cinema",
    name: "Late Night Cinema",
    tag: "Emotional · 35mm",
    body: "Slow pushes, letterbox bars, warm rolloff. Songs sung to the passenger window at 2 a.m.",
    tokens: ["emotional", "film", "slow", "letterbox"],
    gradient: "from-slate-800/50 via-neutral-900/40 to-background",
  },
  {
    id: "ritual",
    name: "Dark Ritual",
    tag: "Sacred · Mysterious",
    body: "Candlelight, smoke, and inverted crosses of light. For tracks that feel like a summoning.",
    tokens: ["mysterious", "spiritual", "atmospheric"],
    gradient: "from-red-950/50 via-amber-950/20 to-black",
    featured: true,
  },
  {
    id: "bedroom",
    name: "Bedroom Artist",
    tag: "Intimate · Handheld",
    body: "Fairy lights, unmade bed, phone-in-hand. Confessional and impossible to fake.",
    tokens: ["intimate", "authentic", "handheld"],
    gradient: "from-amber-900/40 via-stone-900/30 to-background",
  },
  {
    id: "internet",
    name: "Internet Discovery",
    tag: "Native · Fan-page",
    body: "Fast cuts, bold captions, algorithm-fluent. Designed to be discovered, not scrolled past.",
    tokens: ["tiktok", "fan-page", "fast", "bold"],
    gradient: "from-cyan-950/40 via-fuchsia-950/20 to-zinc-950",
  },
  {
    id: "editorial",
    name: "High Editorial",
    tag: "Magazine · Cold",
    body: "Serif type, cropped stills, gallery silence. When your record deserves a spread.",
    tokens: ["editorial", "typographic", "minimal"],
    gradient: "from-zinc-800/60 via-neutral-900/40 to-background",
  },
];

function VibesPage() {
  return (
    <AppShell>
      <PageHeader
        eyebrow="Step 02 · Direction"
        title="Choose the universe your song lives in."
        subtitle="Each direction is a complete visual grammar — color, motion, typography, edit rhythm. Pick one, or blend two."
      >
        <Link
          to="/generate"
          className="rounded-full border border-ember/40 bg-ember/10 px-6 py-3 text-xs font-medium uppercase tracking-[0.25em] text-ember transition-all hover:bg-ember/20 hover:ember-glow"
        >
          Continue with Dark Ritual →
        </Link>
      </PageHeader>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
        {vibes.map((v) => (
          <VibeCard key={v.id} vibe={v} />
        ))}
      </div>

      <div className="glass-panel mt-10 flex items-center justify-between rounded-2xl p-6">
        <div>
          <div className="text-[10px] uppercase tracking-[0.25em] text-ember">Custom</div>
          <div className="mt-1 font-serif text-2xl font-light">Blend your own direction</div>
          <div className="mt-1 text-sm text-muted-foreground">
            Combine two universes and describe the feeling you want in a sentence.
          </div>
        </div>
        <button className="rounded-full border border-border/60 px-5 py-2.5 text-xs font-medium uppercase tracking-[0.25em] text-muted-foreground transition-colors hover:text-foreground">
          Open blender
        </button>
      </div>
    </AppShell>
  );
}

function VibeCard({ vibe }: { vibe: (typeof vibes)[number] }) {
  return (
    <div
      className={`group relative overflow-hidden rounded-2xl border p-1 transition-all hover:-translate-y-1 ${
        vibe.featured ? "border-ember/50 ember-glow" : "border-border/60"
      }`}
    >
      <div
        className={`relative aspect-[4/5] overflow-hidden rounded-xl bg-gradient-to-br ${vibe.gradient}`}
      >
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,transparent,rgba(0,0,0,0.7))]" />
        <div className="absolute inset-0 opacity-30 mix-blend-overlay bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,rgba(255,255,255,0.03)_3px)]" />

        {vibe.featured && (
          <div className="absolute right-4 top-4 flex items-center gap-1.5 rounded-full border border-ember/50 bg-background/60 px-3 py-1 text-[9px] uppercase tracking-[0.25em] text-ember backdrop-blur">
            <Check className="h-3 w-3" strokeWidth={2.5} /> Selected
          </div>
        )}

        <div className="absolute left-5 top-5 text-[10px] uppercase tracking-[0.3em] text-foreground/70">
          {vibe.tag}
        </div>

        <div className="absolute inset-x-5 bottom-5">
          <h3 className="font-serif text-3xl font-light leading-tight">{vibe.name}</h3>
          <p className="mt-2 max-w-[90%] text-sm font-light leading-relaxed text-foreground/75">
            {vibe.body}
          </p>
          <div className="mt-4 flex flex-wrap gap-1.5">
            {vibe.tokens.map((t) => (
              <span
                key={t}
                className="rounded-full border border-foreground/15 bg-background/30 px-2.5 py-0.5 font-mono text-[10px] text-foreground/70 backdrop-blur"
              >
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}