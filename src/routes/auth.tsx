import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "sonner";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Enter Sanctum" },
      { name: "description", content: "Sign in to your creative sanctuary." },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const { session } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (session) navigate({ to: "/", replace: true });
  }, [session, navigate]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: window.location.origin },
        });
        if (error) throw error;
        toast.success("Account created. Welcome to Sanctum.");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setBusy(false);
    }
  };

  const google = async () => {
    setBusy(true);
    try {
      const res = await lovable.auth.signInWithOAuth("google", {
        redirect_uri: window.location.origin,
      });
      if (res.error) throw res.error;
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Google sign-in failed");
      setBusy(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-sanctum text-foreground">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 left-1/2 h-[600px] w-[900px] -translate-x-1/2 rounded-full bg-ember/[0.06] blur-[120px] animate-pulse-glow" />
        <div className="absolute bottom-0 right-0 h-[500px] w-[500px] rounded-full bg-ember/[0.04] blur-[100px]" />
      </div>
      <div className="relative flex min-h-screen items-center justify-center px-6">
        <div className="w-full max-w-md">
          <div className="mb-10 flex items-center gap-3">
            <div className="relative flex h-10 w-10 items-center justify-center rounded-full border border-ember/40">
              <div className="absolute inset-1 rounded-full bg-ember/20 blur-sm" />
              <span className="relative font-serif text-lg text-ember">✦</span>
            </div>
            <div>
              <div className="font-serif text-2xl tracking-tight">Sanctum</div>
              <div className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
                Studio
              </div>
            </div>
          </div>

          <div className="glass-panel rounded-2xl p-8">
            <div className="mb-2 flex items-center gap-3 text-[10px] uppercase tracking-[0.35em] text-ember">
              <span className="h-px w-8 bg-ember/60" />
              {mode === "signin" ? "Return" : "Enter"}
            </div>
            <h1 className="font-serif text-3xl font-light leading-tight">
              {mode === "signin" ? "Welcome back to the studio." : "Begin your first session."}
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              {mode === "signin"
                ? "Sign in to continue your rituals."
                : "Create an account to summon content from your songs."}
            </p>

            <button
              onClick={google}
              disabled={busy}
              className="mt-6 flex w-full items-center justify-center gap-3 rounded-full border border-border/60 bg-background/40 py-3 text-sm font-medium transition-colors hover:bg-background/60 disabled:opacity-50"
            >
              <GoogleG /> Continue with Google
            </button>

            <div className="my-6 flex items-center gap-3 text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
              <span className="h-px flex-1 bg-border" /> or <span className="h-px flex-1 bg-border" />
            </div>

            <form onSubmit={submit} className="space-y-4">
              <Field
                label="Email"
                type="email"
                value={email}
                onChange={setEmail}
                placeholder="artist@yourdomain.com"
                required
              />
              <Field
                label="Password"
                type="password"
                value={password}
                onChange={setPassword}
                placeholder="At least 6 characters"
                required
                minLength={6}
              />
              <button
                type="submit"
                disabled={busy}
                className="w-full rounded-full bg-ember py-3 text-sm font-medium uppercase tracking-[0.25em] text-ember-foreground ember-glow transition-transform hover:scale-[1.01] disabled:opacity-50"
              >
                {busy ? "…" : mode === "signin" ? "Sign in" : "Create account"}
              </button>
            </form>

            <div className="mt-6 text-center text-xs text-muted-foreground">
              {mode === "signin" ? "New to Sanctum?" : "Already have an account?"}{" "}
              <button
                type="button"
                onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
                className="text-ember hover:underline"
              >
                {mode === "signin" ? "Create an account" : "Sign in"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  type,
  value,
  onChange,
  placeholder,
  required,
  minLength,
}: {
  label: string;
  type: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  required?: boolean;
  minLength?: number;
}) {
  return (
    <label className="block">
      <div className="mb-1.5 text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
        {label}
      </div>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        minLength={minLength}
        className="w-full rounded-md border border-border/60 bg-background/40 px-3 py-2.5 text-sm focus:border-ember/50 focus:outline-none"
      />
    </label>
  );
}

function GoogleG() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden>
      <path fill="#EA4335" d="M12 10.2v3.9h5.5c-.24 1.4-1.68 4.1-5.5 4.1-3.32 0-6-2.72-6-6.1s2.68-6.1 6-6.1c1.88 0 3.14.8 3.86 1.48l2.62-2.52C16.9 3.4 14.7 2.4 12 2.4 6.98 2.4 3 6.38 3 11.4s3.98 9 9 9c5.18 0 8.62-3.62 8.62-8.72 0-.58-.06-1.02-.14-1.48H12z" />
    </svg>
  );
}