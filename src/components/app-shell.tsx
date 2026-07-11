import { Link, useRouterState } from "@tanstack/react-router";
import type { ReactNode } from "react";
import {
  Sparkles,
  Upload,
  Wand2,
  FileAudio,
  Calendar,
  LayoutDashboard,
  Search,
  Bell,
} from "lucide-react";

const nav = [
  { to: "/", label: "Studio", icon: LayoutDashboard },
  { to: "/upload", label: "Upload", icon: Upload },
  { to: "/vibes", label: "Direction", icon: Sparkles },
  { to: "/generate", label: "Generate", icon: Wand2 },
  { to: "/lyrics", label: "Lyrics", icon: FileAudio },
  { to: "/calendar", label: "Calendar", icon: Calendar },
] as const;

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <div className="min-h-screen bg-sanctum text-foreground">
      {/* Ambient background orbs */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 left-1/2 h-[600px] w-[900px] -translate-x-1/2 rounded-full bg-ember/[0.06] blur-[120px] animate-pulse-glow" />
        <div className="absolute bottom-0 right-0 h-[500px] w-[500px] rounded-full bg-ember/[0.04] blur-[100px]" />
      </div>

      <div className="relative flex">
        {/* Sidebar */}
        <aside className="sticky top-0 flex h-screen w-64 shrink-0 flex-col border-r border-border/60 bg-sidebar/60 backdrop-blur-xl">
          <div className="flex h-20 items-center gap-3 px-7">
            <div className="relative flex h-9 w-9 items-center justify-center rounded-full border border-ember/40">
              <div className="absolute inset-1 rounded-full bg-ember/20 blur-sm" />
              <span className="relative font-serif text-lg text-ember">✦</span>
            </div>
            <div>
              <div className="font-serif text-xl tracking-tight">Sanctum</div>
              <div className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
                Studio
              </div>
            </div>
          </div>

          <nav className="flex-1 space-y-1 px-4 pt-4">
            <div className="px-3 pb-3 text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
              Workflow
            </div>
            {nav.map(({ to, label, icon: Icon }) => {
              const active =
                to === "/" ? pathname === "/" : pathname.startsWith(to);
              return (
                <Link
                  key={to}
                  to={to}
                  className={`group relative flex items-center gap-3 rounded-md px-3 py-2.5 text-sm transition-colors ${
                    active
                      ? "bg-sidebar-accent text-foreground"
                      : "text-muted-foreground hover:bg-sidebar-accent/50 hover:text-foreground"
                  }`}
                >
                  {active && (
                    <span className="absolute left-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-r bg-ember" />
                  )}
                  <Icon className="h-4 w-4" strokeWidth={1.5} />
                  <span className="font-medium">{label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="m-4 rounded-lg border border-border/60 bg-card/40 p-4">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-full bg-gradient-to-br from-ember to-ember/40" />
              <div className="min-w-0">
                <div className="truncate text-sm font-medium">Nova Vale</div>
                <div className="text-xs text-muted-foreground">Artist · Pro</div>
              </div>
            </div>
          </div>
        </aside>

        {/* Main */}
        <main className="min-w-0 flex-1">
          <header className="sticky top-0 z-20 flex h-20 items-center justify-between border-b border-border/60 bg-background/60 px-10 backdrop-blur-xl">
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <Search className="h-4 w-4" strokeWidth={1.5} />
              <span className="font-mono text-xs tracking-wide">
                Search songs, styles, drops…
              </span>
              <kbd className="ml-2 rounded border border-border/60 bg-muted/40 px-1.5 py-0.5 font-mono text-[10px]">
                ⌘K
              </kbd>
            </div>
            <div className="flex items-center gap-4">
              <button className="rounded-full border border-border/60 p-2 text-muted-foreground transition-colors hover:text-foreground">
                <Bell className="h-4 w-4" strokeWidth={1.5} />
              </button>
              <Link
                to="/generate"
                className="group relative overflow-hidden rounded-full border border-ember/40 bg-ember/10 px-5 py-2 text-xs font-medium uppercase tracking-[0.2em] text-ember transition-all hover:bg-ember/20 hover:ember-glow"
              >
                Summon Content
              </Link>
            </div>
          </header>

          <div className="relative animate-rise px-10 py-10">{children}</div>
        </main>
      </div>
    </div>
  );
}

export function PageHeader({
  eyebrow,
  title,
  subtitle,
  children,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
  children?: ReactNode;
}) {
  return (
    <div className="mb-10 flex items-end justify-between gap-8">
      <div className="max-w-3xl">
        <div className="mb-4 flex items-center gap-3 text-[10px] uppercase tracking-[0.35em] text-ember">
          <span className="h-px w-8 bg-ember/60" />
          {eyebrow}
        </div>
        <h1 className="font-serif text-5xl font-light leading-[1.05] tracking-tight">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-4 max-w-xl text-base font-light leading-relaxed text-muted-foreground">
            {subtitle}
          </p>
        )}
      </div>
      {children && <div className="shrink-0">{children}</div>}
    </div>
  );
}

export function Waveform({
  bars = 64,
  active = 0.6,
  className = "",
}: {
  bars?: number;
  active?: number;
  className?: string;
}) {
  // Deterministic pseudo-random pattern for SSR stability
  const heights = Array.from({ length: bars }, (_, i) => {
    const v = Math.sin(i * 0.7) * Math.cos(i * 0.31) * 0.5 + 0.55;
    const noise = ((i * 9301 + 49297) % 233280) / 233280;
    return Math.max(0.15, Math.min(1, v * 0.7 + noise * 0.3));
  });
  const cutoff = Math.floor(bars * active);
  return (
    <div className={`flex h-20 items-center gap-[3px] ${className}`}>
      {heights.map((h, i) => (
        <div
          key={i}
          className={`w-[3px] rounded-full transition-colors ${
            i < cutoff ? "bg-ember" : "bg-foreground/25"
          }`}
          style={{ height: `${h * 100}%` }}
        />
      ))}
    </div>
  );
}