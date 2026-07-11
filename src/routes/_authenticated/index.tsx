import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createProject, deleteProject, listProjects } from "@/lib/api";
import { useAuth } from "@/hooks/use-auth";
import { useCurrentProjectId } from "@/hooks/use-current-project";
import { useState } from "react";
import { toast } from "sonner";
import { ArrowUpRight, Music2, Plus, Trash2 } from "lucide-react";

export const Route = createFileRoute("/_authenticated/")({
  head: () => ({
    meta: [
      { title: "Studio · Sanctum" },
      { name: "description", content: "Your music projects." },
    ],
  }),
  component: StudioHome,
});

function StudioHome() {
  const { user } = useAuth();
  const qc = useQueryClient();
  const navigate = useNavigate();
  const [, setCurrent] = useCurrentProjectId();
  const [title, setTitle] = useState("");
  const [artist, setArtist] = useState("");
  const [releaseInfo, setReleaseInfo] = useState("");
  const [creating, setCreating] = useState(false);

  const projectsQ = useQuery({ queryKey: ["projects"], queryFn: listProjects });

  const createM = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error("Not signed in");
      return createProject({
        title: title.trim() || "Untitled song",
        artist: artist.trim() || undefined,
        release_info: releaseInfo.trim() || undefined,
        user_id: user.id,
      });
    },
    onSuccess: (p) => {
      qc.invalidateQueries({ queryKey: ["projects"] });
      setCurrent(p.id);
      setTitle("");
      setArtist("");
      setReleaseInfo("");
      setCreating(false);
      toast.success("Project created");
      navigate({ to: "/upload" });
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Failed to create"),
  });

  const deleteM = useMutation({
    mutationFn: deleteProject,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["projects"] });
      toast.success("Project deleted");
    },
  });

  const projects = projectsQ.data ?? [];

  return (
    <AppShell>
      <section className="relative mb-16">
        <div className="mb-6 flex items-center gap-3 text-[10px] uppercase tracking-[0.35em] text-ember">
          <span className="h-px w-8 bg-ember/60" />
          The Studio
        </div>
        <h1 className="max-w-4xl font-serif text-6xl font-light leading-[1.02] tracking-tight md:text-7xl">
          Turn one song into an{" "}
          <span className="italic text-ember">entire content universe.</span>
        </h1>
        <p className="mt-6 max-w-xl text-lg font-light leading-relaxed text-muted-foreground">
          Every song is a project. Upload a track, choose a direction, generate a rollout.
        </p>

        <div className="mt-10 flex items-center gap-4">
          <button
            onClick={() => setCreating(true)}
            className="group inline-flex items-center gap-3 rounded-full bg-foreground px-7 py-3.5 text-sm font-medium text-background transition-all hover:ember-glow"
          >
            Begin a new session
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </button>
        </div>
      </section>

      {creating && (
        <div className="glass-panel mb-10 rounded-2xl p-8">
          <div className="mb-4 text-[10px] uppercase tracking-[0.3em] text-ember">
            New project
          </div>
          <h3 className="mb-6 font-serif text-3xl font-light">Name the song.</h3>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <Input label="Title" value={title} onChange={setTitle} placeholder="Cathedral of Static" />
            <Input label="Artist" value={artist} onChange={setArtist} placeholder="Nova Vale" />
            <Input label="Release" value={releaseInfo} onChange={setReleaseInfo} placeholder="Unreleased single" />
          </div>
          <div className="mt-6 flex items-center gap-3">
            <button
              disabled={createM.isPending || !title.trim()}
              onClick={() => createM.mutate()}
              className="rounded-full bg-ember px-6 py-2.5 text-xs font-medium uppercase tracking-[0.25em] text-ember-foreground ember-glow disabled:opacity-50"
            >
              {createM.isPending ? "Creating…" : "Create project"}
            </button>
            <button
              onClick={() => setCreating(false)}
              className="rounded-full border border-border/60 px-6 py-2.5 text-xs uppercase tracking-[0.25em] text-muted-foreground hover:text-foreground"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <section>
        <div className="mb-6 flex items-end justify-between">
          <div>
            <div className="mb-2 text-[10px] uppercase tracking-[0.3em] text-ember">Sessions</div>
            <h2 className="font-serif text-3xl font-light">Your projects</h2>
          </div>
          {!creating && (
            <button
              onClick={() => setCreating(true)}
              className="flex items-center gap-2 rounded-full border border-ember/40 bg-ember/10 px-5 py-2.5 text-xs font-medium uppercase tracking-[0.2em] text-ember hover:bg-ember/20"
            >
              <Plus className="h-3.5 w-3.5" /> New
            </button>
          )}
        </div>

        {projectsQ.isLoading ? (
          <div className="text-sm text-muted-foreground">Loading your sessions…</div>
        ) : projects.length === 0 ? (
          <div className="glass-panel rounded-2xl p-12 text-center">
            <Music2 className="mx-auto h-8 w-8 text-ember" strokeWidth={1.2} />
            <div className="mt-4 font-serif text-2xl font-light">No projects yet</div>
            <div className="mt-1 text-sm text-muted-foreground">
              Create your first project to begin the ritual.
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {projects.map((p) => (
              <div
                key={p.id}
                className="glass-panel group cursor-pointer overflow-hidden rounded-2xl transition-all hover:border-ember/40 hover:ember-glow"
                onClick={() => {
                  setCurrent(p.id);
                  navigate({ to: "/upload" });
                }}
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-ember/30 via-ember/5 to-background">
                  {p.cover_url ? (
                    <img src={p.cover_url} alt="" className="h-full w-full object-cover opacity-80" />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Music2 className="h-10 w-10 text-background/60" strokeWidth={1.2} />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,rgba(0,0,0,0.7))]" />
                  <div className="absolute left-3 top-3 rounded-full border border-ember/40 bg-background/60 px-2.5 py-1 text-[9px] uppercase tracking-[0.25em] text-ember backdrop-blur">
                    {p.status}
                  </div>
                </div>
                <div className="flex items-center justify-between p-5">
                  <div className="min-w-0">
                    <div className="truncate font-serif text-xl">{p.title}</div>
                    <div className="mt-0.5 text-xs text-muted-foreground">
                      {p.artist ?? "—"} · {p.release_info ?? "unreleased"}
                    </div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (confirm(`Delete "${p.title}"? This removes all its assets.`)) {
                        deleteM.mutate(p.id);
                      }
                    }}
                    className="rounded-md p-2 text-muted-foreground opacity-0 transition-opacity hover:text-foreground group-hover:opacity-100"
                  >
                    <Trash2 className="h-4 w-4" strokeWidth={1.5} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </AppShell>
  );
}

function Input({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <div className="mb-1.5 text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
        {label}
      </div>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-md border border-border/60 bg-background/40 px-3 py-2.5 text-sm focus:border-ember/50 focus:outline-none"
      />
    </label>
  );
}