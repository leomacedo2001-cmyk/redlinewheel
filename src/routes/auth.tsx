import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";

export const Route = createFileRoute("/auth")({
  ssr: false,
  validateSearch: (s: Record<string, unknown>) => ({
    next: typeof s.next === "string" ? s.next : "",
  }),
  component: AuthPage,
});

function isSafeNext(next: string): boolean {
  return next.startsWith("/") && !next.startsWith("//");
}

function AuthPage() {
  const { next } = Route.useSearch();
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const safeNext = next && isSafeNext(next) ? next : "/";

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) window.location.href = safeNext;
    });
  }, [safeNext]);

  async function handleEmail(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const res =
      mode === "signin"
        ? await supabase.auth.signInWithPassword({ email, password })
        : await supabase.auth.signUp({
            email,
            password,
            options: { emailRedirectTo: `${window.location.origin}${safeNext}` },
          });
    setBusy(false);
    if (res.error) {
      setError(res.error.message);
      return;
    }
    window.location.href = safeNext;
  }

  async function handleGoogle() {
    setBusy(true);
    setError(null);
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: `${window.location.origin}${safeNext}`,
    });
    if (result.error) {
      setBusy(false);
      setError(result.error.message ?? "Falha ao iniciar sessão com Google");
      return;
    }
    if (result.redirected) return;
    window.location.href = safeNext;
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center p-8 text-foreground">
      <h1 className="text-2xl font-semibold">
        {mode === "signin" ? "Iniciar sessão" : "Criar conta"}
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Autentica-te para continuar.
      </p>

      <button
        type="button"
        onClick={handleGoogle}
        disabled={busy}
        className="mt-6 rounded-sm border border-input bg-background px-4 py-2 text-sm font-medium hover:bg-accent disabled:opacity-50"
      >
        Continuar com Google
      </button>

      <div className="my-4 flex items-center gap-3 text-xs text-muted-foreground">
        <div className="h-px flex-1 bg-border" />
        <span>ou</span>
        <div className="h-px flex-1 bg-border" />
      </div>

      <form onSubmit={handleEmail} className="flex flex-col gap-3">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="rounded-sm border border-input bg-background px-3 py-2 text-sm"
        />
        <input
          type="password"
          required
          minLength={6}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Palavra-passe"
          className="rounded-sm border border-input bg-background px-3 py-2 text-sm"
        />
        {error && (
          <p role="alert" className="text-sm text-destructive">
            {error}
          </p>
        )}
        <button
          type="submit"
          disabled={busy}
          className="rounded-sm bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
        >
          {busy ? "A processar…" : mode === "signin" ? "Iniciar sessão" : "Criar conta"}
        </button>
      </form>

      <button
        type="button"
        onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
        className="mt-4 text-sm text-muted-foreground underline-offset-2 hover:underline"
      >
        {mode === "signin" ? "Não tens conta? Criar conta" : "Já tens conta? Iniciar sessão"}
      </button>
    </main>
  );
}
