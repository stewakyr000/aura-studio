import { createFileRoute } from "@tanstack/react-router";
import { AppShell, PageHeader } from "@/components/app-shell";
import * as Tabs from "@radix-ui/react-tabs";
import { Film, Image as ImageIcon, Download, Sparkles, Loader2, Trash2, Plus } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { useCurrentProjectId } from "@/hooks/use-current-project";
import {
  createContentItem,
  deleteContentItem,
  getProject,
  listContentItems,
  updateContentItem,
  type ContentItem,
} from "@/lib/api";
import { toast } from "sonner";
import { NoProjectMessage } from "./upload";

export const Route = createFileRoute("/_authenticated/generate")({
  head: () => ({
    meta: [
      { title: "Generate · Sanctum" },
      { name: "description", content: "Summon a batch of content from your song." },
    ],
  }),
  component: GeneratePage,
});

function GeneratePage() {
  const { user } = useAuth();
  const [projectId] = useCurrentProjectId();
  const qc = useQueryClient();

  const projectQ = useQuery({
    queryKey: ["project", projectId],
    queryFn: () => getProject(projectId!),
    enabled: !!projectId,
  });
  const itemsQ = useQuery({
    queryKey: ["content", projectId],
    queryFn: () => listContentItems(projectId!),
    enabled: !!projectId,
  });

  const createM = useMutation({
    mutationFn: (type: "video" | "photo") => {
      if (!user || !projectId) throw new Error("Missing project");
      return createContentItem({
        project_id: projectId,
        user_id: user.id,
        type,
        title: `${type === "video" ? "Edit" : "Photo"} · ${new Date().toLocaleTimeString()}`,
        status: "idea",
        style_id: projectQ.data?.style_id ?? null,
      });
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["content", projectId] });
      toast.success("Content slot created — connect AI to render");
    },
  });

  const deleteM = useMutation({
    mutationFn: deleteContentItem,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["content", projectId] }),
  });

  const updateM = useMutation({
    mutationFn: ({ id, patch }: { id: string; patch: Parameters<typeof updateContentItem>[1] }) =>
      updateContentItem(id, patch),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["content", projectId] }),
  });

  if (!projectId) return <NoProjectMessage />;
  const items = itemsQ.data ?? [];
  const videos = items.filter((i) => i.type === "video");
  const photos = items.filter((i) => i.type === "photo");

  return (
    <AppShell>
      <PageHeader
        eyebrow="Step 03 · Summon"
        title="Render the batch."
        subtitle="Each slot is a content item waiting on the render pipeline. AI rendering connects here."
      />

      <Tabs.Root defaultValue="video">
        <div className="mb-8 flex items-center justify-between">
          <Tabs.List className="glass-panel inline-flex gap-1 rounded-full p-1">
            <Tab value="video" icon={Film} label="Video edits" count={videos.length} />
            <Tab value="photo" icon={ImageIcon} label="Photo pieces" count={photos.length} />
          </Tabs.List>

          <div className="flex gap-2">
            <button
              onClick={() => createM.mutate("video")}
              className="flex items-center gap-2 rounded-full border border-ember/40 bg-ember/10 px-5 py-2.5 text-xs font-medium uppercase tracking-[0.2em] text-ember hover:bg-ember/20"
            >
              <Plus className="h-3.5 w-3.5" /> New video slot
            </button>
            <button
              onClick={() => createM.mutate("photo")}
              className="flex items-center gap-2 rounded-full border border-border/60 px-5 py-2.5 text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground hover:text-foreground"
            >
              <Plus className="h-3.5 w-3.5" /> Photo slot
            </button>
          </div>
        </div>

        <Tabs.Content value="video">
          <Grid items={videos} onDelete={(id) => deleteM.mutate(id)} onStatus={(id, s) => updateM.mutate({ id, patch: { status: s } })} />
        </Tabs.Content>
        <Tabs.Content value="photo">
          <Grid items={photos} onDelete={(id) => deleteM.mutate(id)} onStatus={(id, s) => updateM.mutate({ id, patch: { status: s } })} />
        </Tabs.Content>
      </Tabs.Root>

      <div className="glass-panel mt-8 flex items-start gap-4 rounded-2xl p-6">
        <Sparkles className="h-5 w-5 shrink-0 text-ember" strokeWidth={1.5} />
        <div className="text-sm text-muted-foreground">
          <div className="mb-1 font-medium text-foreground">Waiting for the render pipeline</div>
          AI video and image generation connect here via API. Content items you create hold the
          preview and final URLs the pipeline will populate.
        </div>
      </div>
    </AppShell>
  );
}

function Tab({ value, icon: Icon, label, count }: { value: string; icon: typeof Film; label: string; count: number }) {
  return (
    <Tabs.Trigger
      value={value}
      className="group inline-flex items-center gap-3 rounded-full px-6 py-2.5 text-sm text-muted-foreground transition-colors data-[state=active]:bg-ember data-[state=active]:text-ember-foreground"
    >
      <Icon className="h-4 w-4" strokeWidth={1.5} />
      {label}
      <span className="rounded-full bg-background/30 px-2 py-0.5 font-mono text-[10px]">{count}</span>
    </Tabs.Trigger>
  );
}

function Grid({
  items,
  onDelete,
  onStatus,
}: {
  items: ContentItem[];
  onDelete: (id: string) => void;
  onStatus: (id: string, status: string) => void;
}) {
  if (items.length === 0) {
    return (
      <div className="glass-panel rounded-2xl p-16 text-center text-sm text-muted-foreground">
        No content slots yet. Create one to reserve a render.
      </div>
    );
  }
  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
      {items.map((item) => (
        <Tile key={item.id} item={item} onDelete={() => onDelete(item.id)} onStatus={(s) => onStatus(item.id, s)} />
      ))}
    </div>
  );
}

function Tile({ item, onDelete, onStatus }: { item: ContentItem; onDelete: () => void; onStatus: (s: string) => void }) {
  const rendered = item.status === "ready" || item.status === "generated" || item.status === "posted";
  return (
    <div className="group relative">
      <div className="relative aspect-[9/16] overflow-hidden rounded-xl border border-border/60 bg-gradient-to-br from-rose-900/40 to-zinc-950 transition-all group-hover:border-ember/40">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,rgba(0,0,0,0.7))]" />
        {item.preview_url && (
          <img src={item.preview_url} alt="" className="absolute inset-0 h-full w-full object-cover" />
        )}
        <div className="absolute left-2.5 top-2.5 rounded-full bg-background/60 px-2 py-0.5 font-mono text-[9px] uppercase backdrop-blur">
          {item.status}
        </div>
        {!rendered && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-muted-foreground">
            <Loader2 className="h-5 w-5 animate-spin text-ember/60" />
            <div className="font-mono text-[10px] uppercase tracking-widest">{item.status}</div>
          </div>
        )}
        <div className="absolute inset-x-2 bottom-2 flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
          {item.final_url && (
            <a
              href={item.final_url}
              download
              className="flex h-8 w-8 items-center justify-center rounded-full bg-background/70 backdrop-blur"
            >
              <Download className="h-3.5 w-3.5 text-ember" />
            </a>
          )}
          <button
            onClick={onDelete}
            className="ml-auto flex h-8 w-8 items-center justify-center rounded-full bg-background/70 backdrop-blur"
          >
            <Trash2 className="h-3.5 w-3.5 text-foreground/70" />
          </button>
        </div>
      </div>
      <div className="mt-2 flex items-center justify-between text-[11px]">
        <span className="truncate text-foreground/80">{item.title}</span>
        <select
          value={item.status}
          onChange={(e) => onStatus(e.target.value)}
          className="rounded-md border border-border/60 bg-background/40 px-1.5 py-0.5 text-[10px] uppercase tracking-widest text-muted-foreground"
        >
          {["idea", "queued", "processing", "generated", "ready", "posted", "failed"].map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}