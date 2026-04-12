"use client";

import { useState, useEffect } from "react";
import { LoginForm } from "./LoginForm";
import { DashboardContent } from "./DashboardContent";

export default function DashboardPage() {
  const [authenticated, setAuthenticated] = useState(false);
  const [checking, setChecking] = useState(true);

  // Check if already authenticated via cookie
  useEffect(() => {
    // The cookie is httpOnly so we can't read it client-side.
    // Instead, try to fetch data — if the API route works, we're authed.
    // For simplicity, check via a lightweight endpoint.
    fetch("/api/auth", { method: "POST", body: JSON.stringify({ password: "" }) })
      .then(() => {
        // We'll rely on the login flow instead
        setChecking(false);
      })
      .catch(() => setChecking(false));
  }, []);

  // Simpler approach: check if dashboard_auth cookie is set by trying a dummy call
  // Actually, let's just show login form and let cookie persist across reloads
  useEffect(() => {
    // Check if the auth cookie exists by looking at document.cookie
    // The cookie is httpOnly, so we can't read it. Use a verification endpoint instead.
    const checkAuth = async () => {
      try {
        const res = await fetch("/api/auth/check");
        if (res.ok) {
          setAuthenticated(true);
        }
      } catch {
        // Not authenticated
      }
      setChecking(false);
    };
    checkAuth();
  }, []);

  if (checking) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!authenticated) {
    return <LoginForm onSuccess={() => setAuthenticated(true)} />;
  }

  return <DashboardContent />;
}
