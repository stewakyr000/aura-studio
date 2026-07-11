import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell, PageHeader } from "@/components/app-shell";
import { Check } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getProject, listStyles, updateProject, type Style } from "@/lib/api";
import { useCurrentProjectId } from "@/hooks/use-current-project";
import { toast } from "sonner";
import { NoProjectMessage } from "./upload";

export const Route = createFileRoute("/_authenticated/vibes")({
  head: () => ({
    meta: [
      { title: "Creative Direction · Sanctum" },
      { name: "description", content: "Choose the artistic universe for your song." },
    ],
  }),
  component: VibesPage,
});

function VibesPage() {
  const [projectId] = useCurrentProjectId();
  const qc = useQueryClient();
  const stylesQ = useQuery({ queryKey: ["styles"], queryFn: listStyles });
  const projectQ = useQuery({
    queryKey: ["project", projectId],
    queryFn: () => getProject(projectId!),
    enabled: !!projectId,
  });

  const selectM = useMutation({
    mutationFn: (styleId: string) => updateProject(projectId!, { style_id: styleId }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["project", projectId] });
      toast.success("Direction locked in");
    },
  });

  if (!projectId) return <NoProjectMessage />;
  const styles = stylesQ.data ?? [];
  const selectedId = projectQ.data?.style_id ?? null;
  const selected = styles.find((s) => s.id === selectedId);

  return (
    <AppShell>
      <PageHeader
        eyebrow="Step 02 · Direction"
        title="Choose the universe your song lives in."
        subtitle="Each direction is a complete visual grammar — color, motion, typography, edit rhythm."
      >
        {selected && (
          <Link
            to="/generate"
            className="rounded-full border border-ember/40 bg-ember/10 px-6 py-3 text-xs font-medium uppercase tracking-[0.25em] text-ember transition-all hover:bg-ember/20 hover:ember-glow"
          >
            Continue with {selected.name} →
          </Link>
        )}
      </PageHeader>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
        {styles.map((v) => (
          <VibeCard
            key={v.id}
            vibe={v}
            selected={v.id === selectedId}
            onSelect={() => selectM.mutate(v.id)}
          />
        ))}
      </div>
    </AppShell>
  );
}

function VibeCard({ vibe, selected, onSelect }: { vibe: Style; selected: boolean; onSelect: () => void }) {
  return (
    <button
      onClick={onSelect}
      className={`group relative overflow-hidden rounded-2xl border p-1 text-left transition-all hover:-translate-y-1 ${
        selected ? "border-ember/50 ember-glow" : "border-border/60"
      }`}
    >
      <div className={`relative aspect-[4/5] overflow-hidden rounded-xl bg-gradient-to-br ${vibe.gradient ?? ""}`}>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,transparent,rgba(0,0,0,0.7))]" />
        <div className="absolute inset-0 opacity-30 mix-blend-overlay bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,rgba(255,255,255,0.03)_3px)]" />

        {selected && (
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
            {vibe.description}
          </p>
          <div className="mt-4 flex flex-wrap gap-1.5">
            {(vibe.tokens ?? []).map((t) => (
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
    </button>
  );
}