"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn, signUp } from "@/lib/auth-client";

export default function SignUpPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (password.length < 8) {
      setError("Le mot de passe doit contenir au moins 8 caractères");
      setLoading(false);
      return;
    }

    try {
      const result = await signUp.email({ name, email, password });
      if (result.error) {
        setError("Erreur lors de la création du compte");
      } else {
        router.push("/");
      }
    } catch {
      setError("Une erreur est survenue");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError("");
    setGoogleLoading(true);
    try {
      await signIn.social({
        provider: "google",
        callbackURL: "/",
      });
    } catch {
      setError("Une erreur est survenue avec Google");
      setGoogleLoading(false);
    }
  };

  return (
    <div className="w-full max-w-[420px]">
      <div className="text-center mb-10">
        <Link href="/" className="font-display text-[32px] tracking-[8px] text-allurae-ink font-light">
          ALLURAE
        </Link>
        <h1 className="font-display text-[28px] text-allurae-ink mt-6 mb-2">Créer un compte</h1>
        <p className="text-allurae-muted text-[15px] font-light">
          Rejoignez la communauté Allurae
        </p>
      </div>

      {/* Google Sign Up */}
      <button
        type="button"
        onClick={handleGoogleSignIn}
        disabled={googleLoading}
        className="w-full flex items-center justify-center gap-3 bg-white border border-allurae-sandDark hover:border-allurae-muted px-4 py-3.5 text-[13px] text-allurae-ink font-medium transition-all duration-300 disabled:opacity-50 mb-6"
      >
        <svg width="18" height="18" viewBox="0 0 24 24">
          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
        </svg>
        {googleLoading ? "Connexion..." : "Continuer avec Google"}
      </button>

      {/* Separator */}
      <div className="flex items-center gap-4 mb-6">
        <div className="flex-1 h-px bg-allurae-sandDark"></div>
        <span className="text-[11px] uppercase tracking-[2px] text-allurae-muted">ou</span>
        <div className="flex-1 h-px bg-allurae-sandDark"></div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-[11px] uppercase tracking-[2px] text-allurae-muted block mb-2">
            Nom complet
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-allurae-warmWhite border border-allurae-sandDark px-4 py-3 text-[14px] outline-none focus:border-allurae-terracotta transition-colors"
            required
          />
        </div>
        <div>
          <label className="text-[11px] uppercase tracking-[2px] text-allurae-muted block mb-2">
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-allurae-warmWhite border border-allurae-sandDark px-4 py-3 text-[14px] outline-none focus:border-allurae-terracotta transition-colors"
            required
          />
        </div>
        <div>
          <label className="text-[11px] uppercase tracking-[2px] text-allurae-muted block mb-2">
            Mot de passe
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-allurae-warmWhite border border-allurae-sandDark px-4 py-3 text-[14px] outline-none focus:border-allurae-terracotta transition-colors"
            required
            minLength={8}
          />
          <p className="text-allurae-muted/60 text-[12px] mt-1">Minimum 8 caractères</p>
        </div>

        {error && <p className="text-red-500 text-[13px]">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-allurae-terracotta hover:bg-allurae-terracottaDark text-white py-3.5 text-[12px] uppercase tracking-[2px] font-medium transition-all duration-300 disabled:opacity-50"
        >
          {loading ? "Création..." : "Créer mon compte"}
        </button>
      </form>

      <p className="text-center text-allurae-muted text-[14px] mt-6 font-light">
        Déjà un compte ?{" "}
        <Link href="/auth/signin" className="text-allurae-terracotta hover:text-allurae-terracottaDark transition-colors">
          Se connecter
        </Link>
      </p>
    </div>
  );
}
