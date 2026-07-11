import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell, PageHeader, Waveform } from "@/components/app-shell";
import { UploadCloud, Link2, Music2, Check, Loader2, FileAudio } from "lucide-react";

export const Route = createFileRoute("/upload")({
  head: () => ({
    meta: [
      { title: "Upload · Sanctum" },
      { name: "description", content: "Bring your song into the studio." },
    ],
  }),
  component: UploadPage,
});

function UploadPage() {
  return (
    <AppShell>
      <PageHeader
        eyebrow="Step 01 · Offering"
        title="Bring your song into the studio."
        subtitle="Drop an audio or video file, or paste a link. Sanctum will listen, transcribe, and prepare it for the ritual."
      />

      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 lg:col-span-8">
          <div className="glass-panel relative flex min-h-[380px] flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border/70 p-12 text-center transition-colors hover:border-ember/50">
            <div className="absolute inset-x-16 top-8 h-40 rounded-full bg-ember/[0.06] blur-3xl" />
            <div className="relative flex h-16 w-16 items-center justify-center rounded-full border border-ember/40 bg-ember/10 animate-float">
              <UploadCloud className="h-6 w-6 text-ember" strokeWidth={1.5} />
            </div>
            <h3 className="relative mt-6 font-serif text-3xl font-light">
              Drop your track here
            </h3>
            <p className="relative mt-2 max-w-sm text-sm text-muted-foreground">
              MP3, WAV, MP4, MOV up to 500 MB. Higher fidelity produces better edits.
            </p>
            <button className="relative mt-6 rounded-full border border-ember/40 bg-ember/10 px-6 py-2.5 text-xs font-medium uppercase tracking-[0.25em] text-ember transition-all hover:bg-ember/20">
              Choose file
            </button>

            <div className="relative mt-10 flex items-center gap-3 text-xs uppercase tracking-[0.25em] text-muted-foreground">
              <span className="h-px w-8 bg-border" /> or <span className="h-px w-8 bg-border" />
            </div>

            <div className="relative mt-6 flex w-full max-w-md items-center gap-2 rounded-full border border-border/60 bg-background/50 px-2 py-2">
              <Link2 className="ml-3 h-4 w-4 shrink-0 text-muted-foreground" strokeWidth={1.5} />
              <input
                className="min-w-0 flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
                placeholder="Paste a YouTube, SoundCloud or Dropbox link…"
              />
              <button className="rounded-full bg-foreground px-4 py-1.5 text-xs font-medium text-background">
                Fetch
              </button>
            </div>
          </div>

          <div className="glass-panel mt-6 rounded-2xl p-6">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-gradient-to-br from-ember/40 to-transparent">
                <FileAudio className="h-5 w-5 text-ember" strokeWidth={1.5} />
              </div>
              <div className="min-w-0 flex-1">
                <div className="font-serif text-lg">cathedral_of_static_v3.wav</div>
                <div className="text-xs text-muted-foreground">
                  48.2 MB · 03:41 · Uploaded 2 minutes ago
                </div>
              </div>
              <div className="rounded-full border border-ember/40 bg-ember/10 px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-ember">
                Ready
              </div>
            </div>
            <Waveform className="mt-6" bars={80} active={1} />
          </div>
        </div>

        <div className="col-span-12 space-y-4 lg:col-span-4">
          <div className="glass-panel rounded-2xl p-6">
            <div className="mb-5 flex items-center gap-2 text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
              <Music2 className="h-3.5 w-3.5" /> Metadata
            </div>
            <div className="space-y-4">
              <Field label="Title" value="Cathedral of Static" />
              <Field label="Artist" value="Nova Vale" />
              <Field label="Release" value="Unreleased single" />
              <div className="grid grid-cols-2 gap-4">
                <Field label="Key" value="A minor" />
                <Field label="BPM" value="84" />
              </div>
            </div>
          </div>

          <div className="glass-panel rounded-2xl p-6">
            <div className="mb-4 text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
              Analysis
            </div>
            <Task label="Waveform rendered" done />
            <Task label="Stems separated · 4 tracks" done />
            <Task label="Lyrics detected · 84%" done />
            <Task label="Structure mapped · verse/chorus" pending />
          </div>

          <Link
            to="/vibes"
            className="group flex items-center justify-between rounded-2xl bg-foreground px-6 py-4 text-background transition-all hover:ember-glow"
          >
            <div>
              <div className="text-[10px] uppercase tracking-[0.25em] opacity-70">
                Next
              </div>
              <div className="font-serif text-lg">Choose your direction</div>
            </div>
            <span className="text-2xl transition-transform group-hover:translate-x-1">
              →
            </span>
          </Link>
        </div>
      </div>
    </AppShell>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="mb-1.5 text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
        {label}
      </div>
      <input
        defaultValue={value}
        className="w-full rounded-md border border-border/60 bg-background/40 px-3 py-2 text-sm focus:border-ember/50 focus:outline-none"
      />
    </div>
  );
}

function Task({ label, done, pending }: { label: string; done?: boolean; pending?: boolean }) {
  return (
    <div className="flex items-center gap-3 py-2 text-sm">
      <div
        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${
          done ? "bg-ember/20 text-ember" : "bg-muted/40 text-muted-foreground"
        }`}
      >
        {done ? (
          <Check className="h-3 w-3" strokeWidth={2.5} />
        ) : (
          <Loader2 className="h-3 w-3 animate-spin" />
        )}
      </div>
      <span className={done ? "text-foreground" : "text-muted-foreground"}>{label}</span>
      {pending && (
        <span className="ml-auto font-mono text-[10px] text-muted-foreground">
          working…
        </span>
      )}
    </div>
  );
}