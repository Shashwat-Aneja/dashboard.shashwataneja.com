import { createContext, useContext, useEffect, useMemo, useState, type FormEvent, type ReactNode } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "../lib/supabase";

type AuthContextValue = { user: User; isAdmin: boolean; signOut: () => Promise<void> };
const AuthContext = createContext<AuthContextValue | null>(null);
type Mode = "login" | "reset" | "set-password";

export function useAuth() {
  const value = useContext(AuthContext);
  if (!value) throw new Error("useAuth must be used inside AuthGate.");
  return value;
}

export function AuthGate({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState<Mode>(() => {
    const type = new URLSearchParams(window.location.hash.slice(1)).get("type");
    return type === "invite" || type === "recovery" ? "set-password" : "login";
  });
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  useEffect(() => {
    if (!supabase) { setLoading(false); return; }
    let active = true;
    supabase.auth.getSession().then(({ data }) => {
      if (active) { setSession(data.session); setLoading(false); }
    }).catch(() => { if (active) setLoading(false); });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
    });
    return () => { active = false; listener.subscription.unsubscribe(); };
  }, []);

  const isAdmin = session?.user.app_metadata?.role === "admin";
  const contextValue = useMemo(() => session ? ({
    user: session.user,
    isAdmin,
    signOut: async () => { if (supabase) await supabase.auth.signOut(); }
  }) : null, [session, isAdmin]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!supabase) return;
    setBusy(true); setError(""); setNotice("");
    try {
      if (mode === "login") {
        const { error: authError } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
        if (authError) throw authError;
      } else if (mode === "reset") {
        const { error: authError } = await supabase.auth.resetPasswordForEmail(email.trim(), {
          redirectTo: window.location.origin + "/auth/set-password"
        });
        if (authError) throw authError;
        setNotice("If an account exists for this email, a password reset link has been sent.");
      } else {
        if (password.length < 10) throw new Error("Use a password with at least 10 characters.");
        if (password !== confirmPassword) throw new Error("The passwords do not match.");
        const { error: authError } = await supabase.auth.updateUser({ password });
        if (authError) throw authError;
        setNotice("Password set. Your Dashboard is ready.");
        setMode("login"); setPassword(""); setConfirmPassword("");
        window.history.replaceState({}, document.title, window.location.pathname);
      }
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Authentication failed. Please try again.");
    } finally { setBusy(false); }
  }

  if (loading) return <div className="auth-screen"><div className="auth-card">Loading your workspace…</div></div>;
  if (!supabase) return <div className="auth-screen"><div className="auth-card"><div className="auth-brand"><div className="auth-brand-mark">s.</div><div><div className="auth-brand-name">studio.</div><span className="auth-brand-caption">CLIENT DASHBOARD</span></div></div><span className="auth-kicker">SETUP REQUIRED</span><h1>Authentication is not configured.</h1><p className="auth-description">Add the Supabase project URL and publishable key to the Dashboard environment before enabling sign-in.</p></div></div>;
  if (session && mode !== "set-password" && contextValue) return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;

  const title = mode === "login" ? "Welcome back." : mode === "reset" ? "Reset your password." : "Set your password.";
  const description = mode === "login" ? "Sign in to continue to your Studio workspace." : mode === "reset" ? "Enter your account email and we’ll send a secure reset link." : "Choose a password to activate your Dashboard account.";
  return <div className="auth-screen"><section className="auth-card">
    <div className="auth-brand"><div className="auth-brand-mark">s.</div><div><div className="auth-brand-name">studio.</div><span className="auth-brand-caption">BY SHASHWAT ANEJA</span></div></div>
    <span className="auth-kicker">CLIENT DASHBOARD / ACCESS</span><h1>{title}</h1><p className="auth-description">{description}</p>
    <form className="auth-form" onSubmit={submit}>
      {mode !== "set-password" && <label>Email address<input type="email" autoComplete="email" required value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@example.com" /></label>}
      {mode !== "reset" && <label>{mode === "login" ? "Password" : "New password"}<input type="password" autoComplete={mode === "login" ? "current-password" : "new-password"} required minLength={mode === "login" ? 1 : 10} value={password} onChange={e=>setPassword(e.target.value)} placeholder={mode === "login" ? "Enter your password" : "At least 10 characters"} /></label>}
      {mode === "set-password" && <label>Confirm password<input type="password" autoComplete="new-password" required minLength={10} value={confirmPassword} onChange={e=>setConfirmPassword(e.target.value)} placeholder="Enter it again" /></label>}
      {error && <div className="auth-error" role="alert">{error}</div>}
      {notice && <div className="auth-success" role="status">{notice}</div>}
      <button className="auth-submit" disabled={busy}>{busy ? "Please wait…" : mode === "login" ? "Sign in" : mode === "reset" ? "Send reset link" : "Set password"}</button>
    </form>
    {mode === "login" && <p style={{marginTop:16}}><button className="auth-link" onClick={()=>{setMode("reset");setError("");setNotice("");}}>Forgot password?</button></p>}
    {mode !== "login" && <p style={{marginTop:16}}><button className="auth-link" onClick={()=>{setMode("login");setError("");setNotice("");}}>← Back to sign in</button></p>}
    <div className="auth-foot">Access is provided after your Studio booking is confirmed.</div>
  </section></div>;
}
