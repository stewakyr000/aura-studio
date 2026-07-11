import { createFileRoute } from "@tanstack/react-router";
import { AppShell, PageHeader, Waveform } from "@/components/app-shell";
import { Highlighter, Plus, Trash2 } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { useCurrentProjectId } from "@/hooks/use-current-project";
import { deleteLyric, listLyrics, updateLyric, upsertLyricLine, type Lyric } from "@/lib/api";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { NoProjectMessage } from "./upload";

export const Route = createFileRoute("/_authenticated/lyrics")({
  head: () => ({
    meta: [
      { title: "Lyrics Editor · Sanctum" },
      { name: "description", content: "Refine the words your song will project." },
    ],
  }),
  component: LyricsPage,
});

const PLACEHOLDERS = [
  { section: "Intro", text: "Add your opening line…" },
  { section: null, text: "" },
];

function LyricsPage() {
  const { user } = useAuth();
  const [projectId] = useCurrentProjectId();
  const qc = useQueryClient();
  const lyricsQ = useQuery({
    queryKey: ["lyrics", projectId],
    queryFn: () => listLyrics(projectId!),
    enabled: !!projectId,
  });

  const addM = useMutation({
    mutationFn: async (params: { text: string; section?: string | null }) => {
      if (!user || !projectId) throw new Error("No project");
      const list = lyricsQ.data ?? [];
      const idx = list.length > 0 ? Math.max(...list.map((l) => l.line_index)) + 1 : 0;
      return upsertLyricLine({
        project_id: projectId,
        user_id: user.id,
        line_index: idx,
        text: params.text,
        section: params.section ?? null,
      });
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["lyrics", projectId] }),
  });

  const updateM = useMutation({
    mutationFn: ({ id, patch }: { id: string; patch: Parameters<typeof updateLyric>[1] }) => updateLyric(id, patch),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["lyrics", projectId] }),
  });

  const deleteM = useMutation({
    mutationFn: deleteLyric,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["lyrics", projectId] }),
  });

  // Seed placeholder lines the first time the page loads for an empty project.
  useEffect(() => {
    if (lyricsQ.data && lyricsQ.data.length === 0 && user && projectId) {
      PLACEHOLDERS.forEach((p, i) => {
        upsertLyricLine({
          project_id: projectId,
          user_id: user.id,
          line_index: i,
          text: p.text,
          section: p.section ?? null,
        });
      });
      setTimeout(() => qc.invalidateQueries({ queryKey: ["lyrics", projectId] }), 400);
    }
  }, [lyricsQ.data, projectId, user, qc]);

  if (!projectId) return <NoProjectMessage />;
  const lines = lyricsQ.data ?? [];

  return (
    <AppShell>
      <PageHeader
        eyebrow="Step 04 · Word"
        title="Refine what the song will say."
        subtitle="Edit lines, mark timestamps, and highlight the lines that carry the moment."
      >
        <button
          onClick={() => addM.mutate({ text: "", section: null })}
          className="rounded-full border border-ember/40 bg-ember/10 px-6 py-3 text-xs font-medium uppercase tracking-[0.25em] text-ember hover:bg-ember/20"
        >
          + Add line
        </button>
      </PageHeader>

      <div className="glass-panel mb-6 rounded-2xl p-6">
        <Waveform bars={120} active={0.4} />
        <div className="mt-3 text-center text-xs text-muted-foreground">
          Transcription runs when the AI system connects — timestamps auto-align.
        </div>
      </div>

      <div className="space-y-2">
        {lines.length === 0 ? (
          <div className="glass-panel rounded-2xl p-12 text-center text-sm text-muted-foreground">
            No lyrics yet.{" "}
            <button onClick={() => addM.mutate({ text: "", section: "Verse 1" })} className="text-ember hover:underline">
              Add your first line
            </button>
            .
          </div>
        ) : (
          lines.map((l) => (
            <LyricRow
              key={l.id}
              line={l}
              onUpdate={(patch) => updateM.mutate({ id: l.id, patch })}
              onDelete={() => deleteM.mutate(l.id)}
            />
          ))
        )}
      </div>

      {lines.length > 0 && (
        <button
          onClick={() => addM.mutate({ text: "", section: null })}
          className="mt-4 flex items-center gap-2 rounded-full border border-dashed border-border/60 px-5 py-2.5 text-xs uppercase tracking-[0.25em] text-muted-foreground hover:text-ember"
        >
          <Plus className="h-3.5 w-3.5" /> Add line
        </button>
      )}
    </AppShell>
  );
}

function LyricRow({
  line,
  onUpdate,
  onDelete,
}: {
  line: Lyric;
  onUpdate: (patch: { text?: string; section?: string | null; start_seconds?: number | null }) => void;
  onDelete: () => void;
}) {
  const [text, setText] = useState(line.text);
  const [ts, setTs] = useState(line.start_seconds ? formatTs(Number(line.start_seconds)) : "");

  const highlighted = (line.metadata as { highlight?: boolean } | null)?.highlight === true;

  return (
    <div>
      {line.section && (
        <div className="mb-2 mt-6 text-[10px] uppercase tracking-[0.3em] text-ember">{line.section}</div>
      )}
      <div
        className={`group flex items-center gap-5 rounded-lg border px-5 py-3 transition-all ${
          highlighted ? "border-ember/40 bg-ember/[0.04]" : "border-transparent hover:border-border/60 hover:bg-card/30"
        }`}
      >
        <input
          value={ts}
          onChange={(e) => setTs(e.target.value)}
          onBlur={() => onUpdate({ start_seconds: parseTs(ts) })}
          placeholder="0:00"
          className="w-16 rounded-md border border-transparent bg-transparent px-2 py-1 font-mono text-xs text-muted-foreground focus:border-border/60 focus:outline-none"
        />
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          onBlur={() => text !== line.text && onUpdate({ text })}
          placeholder="Write a lyric line…"
          className="flex-1 border-none bg-transparent font-serif text-lg font-light leading-snug text-foreground/90 focus:outline-none"
        />
        <div className="flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
          <button
            onClick={() => onUpdate({ /* toggle via metadata cast */ } )}
            title="Highlight (coming with AI)"
            className="rounded-md p-1.5 hover:bg-muted/50"
          >
            <Highlighter className="h-3.5 w-3.5 text-ember" />
          </button>
          <button onClick={onDelete} className="rounded-md p-1.5 hover:bg-muted/50">
            <Trash2 className="h-3.5 w-3.5 text-muted-foreground" />
          </button>
        </div>
      </div>
    </div>
  );
}

function formatTs(sec: number): string {
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

function parseTs(v: string): number | null {
  if (!v.trim()) return null;
  const parts = v.split(":").map((p) => Number(p.trim()));
  if (parts.some((n) => Number.isNaN(n))) return null;
  if (parts.length === 2) return parts[0] * 60 + parts[1];
  return parts[0];
}
// suppress unused import lint noise
void toast;