import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell, PageHeader, Waveform } from "@/components/app-shell";
import { UploadCloud, Music2, Check, FileAudio, Trash2, Image as ImageIcon, Film } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { useCurrentProjectId } from "@/hooks/use-current-project";
import {
  deleteAsset,
  getProject,
  listAssets,
  updateProject,
  uploadAsset,
  type Asset,
} from "@/lib/api";
import { useRef, useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/upload")({
  head: () => ({
    meta: [
      { title: "Upload · Sanctum" },
      { name: "description", content: "Bring your song into the studio." },
    ],
  }),
  component: UploadPage,
});

function UploadPage() {
  const { user } = useAuth();
  const [projectId] = useCurrentProjectId();
  const qc = useQueryClient();
  const fileInput = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);

  const projectQ = useQuery({
    queryKey: ["project", projectId],
    queryFn: () => getProject(projectId!),
    enabled: !!projectId,
  });

  const assetsQ = useQuery({
    queryKey: ["assets", projectId],
    queryFn: () => listAssets(projectId!),
    enabled: !!projectId,
  });

  const uploadM = useMutation({
    mutationFn: async (files: FileList) => {
      if (!user || !projectId) throw new Error("Select a project first");
      for (const file of Array.from(files)) {
        await uploadAsset({ file, projectId, userId: user.id });
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["assets", projectId] });
      toast.success("Upload complete");
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Upload failed"),
  });

  const deleteM = useMutation({
    mutationFn: deleteAsset,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["assets", projectId] }),
  });

  const saveMetaM = useMutation({
    mutationFn: (patch: { title?: string; artist?: string; release_info?: string; song_key?: string; bpm?: number }) => {
      if (!projectId) throw new Error("No project");
      return updateProject(projectId, patch);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["project", projectId] });
      qc.invalidateQueries({ queryKey: ["projects"] });
      toast.success("Saved");
    },
  });

  if (!projectId) return <NoProjectMessage />;
  const project = projectQ.data;
  const assets = assetsQ.data ?? [];
  const audioAsset = assets.find((a) => a.type === "audio");

  return (
    <AppShell>
      <PageHeader
        eyebrow="Step 01 · Offering"
        title="Bring your song into the studio."
        subtitle="Drop audio, video, or images. Every file is stored with this project."
      />

      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 lg:col-span-8">
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragOver(false);
              if (e.dataTransfer.files.length) uploadM.mutate(e.dataTransfer.files);
            }}
            className={`glass-panel relative flex min-h-[380px] flex-col items-center justify-center rounded-2xl border-2 border-dashed p-12 text-center transition-colors ${
              dragOver ? "border-ember/70 bg-ember/[0.03]" : "border-border/70 hover:border-ember/50"
            }`}
          >
            <div className="absolute inset-x-16 top-8 h-40 rounded-full bg-ember/[0.06] blur-3xl" />
            <div className="relative flex h-16 w-16 items-center justify-center rounded-full border border-ember/40 bg-ember/10 animate-float">
              <UploadCloud className="h-6 w-6 text-ember" strokeWidth={1.5} />
            </div>
            <h3 className="relative mt-6 font-serif text-3xl font-light">
              {uploadM.isPending ? "Uploading…" : "Drop files here"}
            </h3>
            <p className="relative mt-2 max-w-sm text-sm text-muted-foreground">
              Audio, video, or image files. Higher fidelity produces better edits.
            </p>
            <input
              ref={fileInput}
              type="file"
              multiple
              accept="audio/*,video/*,image/*"
              className="hidden"
              onChange={(e) => {
                if (e.target.files?.length) uploadM.mutate(e.target.files);
                e.target.value = "";
              }}
            />
            <button
              onClick={() => fileInput.current?.click()}
              disabled={uploadM.isPending}
              className="relative mt-6 rounded-full border border-ember/40 bg-ember/10 px-6 py-2.5 text-xs font-medium uppercase tracking-[0.25em] text-ember transition-all hover:bg-ember/20 disabled:opacity-50"
            >
              Choose files
            </button>
          </div>

          {audioAsset && (
            <div className="glass-panel mt-6 rounded-2xl p-6">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-gradient-to-br from-ember/40 to-transparent">
                  <FileAudio className="h-5 w-5 text-ember" strokeWidth={1.5} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="truncate font-serif text-lg">{audioAsset.file_name}</div>
                  <div className="text-xs text-muted-foreground">
                    {formatBytes(audioAsset.file_size)} · uploaded {formatDate(audioAsset.created_at)}
                  </div>
                </div>
                <div className="rounded-full border border-ember/40 bg-ember/10 px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-ember">
                  Ready
                </div>
              </div>
              <Waveform className="mt-6" bars={80} active={1} />
            </div>
          )}

          {assets.length > 0 && (
            <div className="mt-6">
              <div className="mb-3 text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
                All files ({assets.length})
              </div>
              <div className="glass-panel divide-y divide-border/40 rounded-2xl">
                {assets.map((a) => (
                  <AssetRow key={a.id} asset={a} onDelete={() => deleteM.mutate(a)} />
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="col-span-12 space-y-4 lg:col-span-4">
          <div className="glass-panel rounded-2xl p-6">
            <div className="mb-5 flex items-center gap-2 text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
              <Music2 className="h-3.5 w-3.5" /> Metadata
            </div>
            {project && (
              <MetadataForm
                initial={project}
                onSave={(patch) => saveMetaM.mutate(patch)}
                busy={saveMetaM.isPending}
              />
            )}
          </div>

          <div className="glass-panel rounded-2xl p-6">
            <div className="mb-4 text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
              Assets summary
            </div>
            <SummaryRow label="Audio" count={assets.filter((a) => a.type === "audio").length} />
            <SummaryRow label="Video" count={assets.filter((a) => a.type === "video").length} />
            <SummaryRow label="Images" count={assets.filter((a) => a.type === "image").length} />
          </div>

          <Link
            to="/vibes"
            className="group flex items-center justify-between rounded-2xl bg-foreground px-6 py-4 text-background transition-all hover:ember-glow"
          >
            <div>
              <div className="text-[10px] uppercase tracking-[0.25em] opacity-70">Next</div>
              <div className="font-serif text-lg">Choose your direction</div>
            </div>
            <span className="text-2xl transition-transform group-hover:translate-x-1">→</span>
          </Link>
        </div>
      </div>
    </AppShell>
  );
}

function MetadataForm({
  initial,
  onSave,
  busy,
}: {
  initial: { title: string; artist: string | null; release_info: string | null; song_key: string | null; bpm: number | null };
  onSave: (patch: { title?: string; artist?: string; release_info?: string; song_key?: string; bpm?: number }) => void;
  busy: boolean;
}) {
  const [title, setTitle] = useState(initial.title);
  const [artist, setArtist] = useState(initial.artist ?? "");
  const [rel, setRel] = useState(initial.release_info ?? "");
  const [key, setKey] = useState(initial.song_key ?? "");
  const [bpm, setBpm] = useState(initial.bpm ? String(initial.bpm) : "");

  return (
    <div className="space-y-4">
      <Field label="Title" value={title} onChange={setTitle} />
      <Field label="Artist" value={artist} onChange={setArtist} />
      <Field label="Release" value={rel} onChange={setRel} />
      <div className="grid grid-cols-2 gap-4">
        <Field label="Key" value={key} onChange={setKey} />
        <Field label="BPM" value={bpm} onChange={setBpm} />
      </div>
      <button
        onClick={() =>
          onSave({
            title: title.trim() || "Untitled",
            artist: artist.trim(),
            release_info: rel.trim(),
            song_key: key.trim(),
            bpm: bpm.trim() ? Number(bpm) : undefined,
          })
        }
        disabled={busy}
        className="w-full rounded-full border border-ember/40 bg-ember/10 py-2.5 text-xs font-medium uppercase tracking-[0.25em] text-ember hover:bg-ember/20 disabled:opacity-50"
      >
        {busy ? "Saving…" : "Save metadata"}
      </button>
    </div>
  );
}

function Field({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <div className="mb-1.5 text-[10px] uppercase tracking-[0.25em] text-muted-foreground">{label}</div>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-md border border-border/60 bg-background/40 px-3 py-2 text-sm focus:border-ember/50 focus:outline-none"
      />
    </div>
  );
}

function SummaryRow({ label, count }: { label: string; count: number }) {
  return (
    <div className="flex items-center justify-between border-b border-border/40 py-2 text-sm last:border-b-0">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-mono text-ember">{count}</span>
    </div>
  );
}

function AssetRow({ asset, onDelete }: { asset: Asset; onDelete: () => void }) {
  const Icon = asset.type === "audio" ? FileAudio : asset.type === "video" ? Film : ImageIcon;
  return (
    <div className="flex items-center gap-3 p-4">
      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-ember/10">
        <Icon className="h-4 w-4 text-ember" strokeWidth={1.5} />
      </div>
      <div className="min-w-0 flex-1">
        <div className="truncate text-sm">{asset.file_name}</div>
        <div className="text-xs text-muted-foreground">
          {asset.type} · {formatBytes(asset.file_size)}
        </div>
      </div>
      <span className="rounded-full border border-ember/30 bg-ember/5 px-2 py-0.5 text-[9px] uppercase tracking-[0.2em] text-ember">
        <Check className="inline h-3 w-3" strokeWidth={2.5} />
      </span>
      <button
        onClick={onDelete}
        className="rounded-md p-1.5 text-muted-foreground transition-colors hover:text-foreground"
      >
        <Trash2 className="h-4 w-4" strokeWidth={1.5} />
      </button>
    </div>
  );
}

function formatBytes(bytes: number | null | undefined): string {
  if (!bytes) return "—";
  const units = ["B", "KB", "MB", "GB"];
  let n = bytes;
  let i = 0;
  while (n >= 1024 && i < units.length - 1) {
    n /= 1024;
    i++;
  }
  return `${n.toFixed(1)} ${units[i]}`;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

export function NoProjectMessage() {
  return (
    <AppShell>
      <div className="glass-panel rounded-2xl p-12 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-ember/40 bg-ember/10">
          <Music2 className="h-6 w-6 text-ember" strokeWidth={1.5} />
        </div>
        <h2 className="mt-6 font-serif text-3xl font-light">Select or create a project first</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Every action here belongs to a song. Head back to the studio to begin.
        </p>
        <Link
          to="/"
          className="mt-6 inline-flex rounded-full bg-ember px-6 py-2.5 text-xs font-medium uppercase tracking-[0.25em] text-ember-foreground ember-glow"
        >
          Go to studio
        </Link>
      </div>
    </AppShell>
  );
}