"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function AdminLoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");

    if (!email.trim() || !password) {
      setError("Completa el correo y la contraseña.");
      return;
    }

    setLoading(true);

    try {
      const supabase = createClient();

      const { error: loginError } =
        await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });

      if (loginError) {
        setError("Correo o contraseña incorrectos.");
        return;
      }

      router.replace("/admin");
      router.refresh();
    } catch (loginError) {
      console.error("Admin login error:", loginError);
      setError("No fue posible iniciar sesión.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="admin-login-page">
      <section className="admin-login-card">
        <div className="admin-login-brand">
          <span />
          <p>ANDARIEGOS</p>
          <span />
        </div>

        <p className="eyebrow">ESCRITORIO PRIVADO</p>

        <h1>Bienvenido.</h1>

        <p className="admin-login-intro">
          Accede al espacio de administración de Andariegos.
        </p>

        <form onSubmit={handleLogin} className="admin-login-form">
          <label>
            Correo electrónico
            <input
              type="email"
              value={email}
              onChange={(event) =>
                setEmail(event.target.value)
              }
              placeholder="admin@andariegos.com"
              autoComplete="email"
              autoFocus
            />
          </label>

          <label>
            Contraseña
            <input
              type="password"
              value={password}
              onChange={(event) =>
                setPassword(event.target.value)
              }
              placeholder="••••••••"
              autoComplete="current-password"
            />
          </label>

          {error && (
            <p className="admin-login-error" role="alert">
              {error}
            </p>
          )}

          <button
            type="submit"
            className="button button-primary admin-login-button"
            disabled={loading}
          >
            {loading ? "ENTRANDO..." : "ENTRAR"}
          </button>
        </form>

        <p className="admin-login-footer">
          ANDARIEGOS · COCINA DE MUNDO
        </p>
      </section>
    </main>
  );
}