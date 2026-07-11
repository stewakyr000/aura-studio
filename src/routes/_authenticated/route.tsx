import { createFileRoute, Outlet, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";

export const Route = createFileRoute("/_authenticated")({
  ssr: false,
  component: AuthenticatedLayout,
});

function AuthenticatedLayout() {
  const { session, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !session) {
      navigate({ to: "/auth", replace: true });
    }
  }, [session, loading, navigate]);

  if (loading || !session) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-sanctum">
        <div className="h-10 w-10 animate-pulse rounded-full border border-ember/40 bg-ember/10" />
      </div>
    );
  }

  return <Outlet />;
}