"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Lock,
  Warehouse,
  BadgeAlert,
  ShieldCheck,
  KeyRound,
  AlertOctagon,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Building2,
  Truck,
  RotateCw,
} from "lucide-react";
import { AuthProvider, useAdminAuth } from "@/components/auth/AuthContext";
import { AdminRole, ADMIN_PRESET_USERS } from "@/lib/mock/admin-auth";
import { cn } from "@/lib/utils";

function LoginContent() {
  const router = useRouter();
  const { role, switchRole, login } = useAdminAuth();
  const [activeTab, setActiveTab] = useState<"signin" | "mfa" | "denied">("signin");
  const [email, setEmail] = useState<string>("ops.fleet@yogmilk.com");
  const [password, setPassword] = useState<string>("••••••••••••");
  const [selectedRole, setSelectedRole] = useState<AdminRole>("OPERATIONS_MANAGER");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [mfaCode, setMfaCode] = useState<string>("894 102");

  const handleRoleQuickPick = (targetRole: AdminRole) => {
    setSelectedRole(targetRole);
    setEmail(ADMIN_PRESET_USERS[targetRole].email);
  };

  const handleSignIn = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      login(email, selectedRole);
      router.push("/");
    }, 600);
  };

  return (
    <div className="min-h-screen bg-dairy-surface flex flex-col justify-between selection:bg-secondary-container selection:text-white">
      {/* Top Telemetry & Security Header */}
      <header className="w-full px-4 lg:px-12 py-3.5 flex items-center justify-between border-b border-dairy-subtle bg-white/90 backdrop-blur-md sticky top-0 z-20">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-primary text-white flex items-center justify-center shadow-xs">
            <Truck className="h-5 w-5 text-secondary-container" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-serif text-lg font-bold text-primary tracking-tight">
                YOG MILK
              </span>
              <span className="text-[10px] tracking-wider uppercase px-2 py-0.5 rounded-full bg-secondary/10 text-secondary font-bold">
                Admin Console
              </span>
            </div>
            <p className="text-[11px] text-muted-foreground font-medium">
              Dairy Operations &amp; Logistics Management Portal
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-dairy-subtle text-dairy-dark shadow-xs text-xs font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Cold-Chain Telemetry: 3.8°C Nominal</span>
          </div>
          <div className="flex items-center gap-1.5 text-muted-foreground text-xs font-semibold px-2.5 py-1 rounded-lg bg-dairy-surface-low border border-dairy-subtle">
            <Lock className="h-3.5 w-3.5 text-primary" />
            <span>256-Bit TLS Terminal</span>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-8 md:py-12 flex flex-col justify-center">
        {/* Portal Header Narrative */}
        <div className="text-center max-w-2xl mx-auto mb-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white border border-dairy-subtle shadow-xs mb-3">
            <Warehouse className="h-3.5 w-3.5 text-secondary" />
            <span className="text-xs font-bold text-primary tracking-wider uppercase">
              Operational Authentication Matrix
            </span>
          </div>
          <h1 className="font-serif text-3xl md:text-4xl text-primary font-bold tracking-tight mb-2">
            Internal Fleet &amp; Facility Access
          </h1>
          <p className="text-xs md:text-sm text-muted-foreground">
            B2B bulk dairy dispatch management, cash on delivery reconciliation, and cold-chain compliance.
          </p>

          {/* Interactive State Tab Switcher for Stitch Reference Fidelity */}
          <div className="mt-5 inline-flex p-1 bg-dairy-surface-low border border-dairy-subtle rounded-xl text-xs font-semibold">
            <button
              type="button"
              onClick={() => setActiveTab("signin")}
              className={cn(
                "px-3.5 py-1.5 rounded-lg transition-all",
                activeTab === "signin"
                  ? "bg-white text-primary shadow-xs font-bold"
                  : "text-muted-foreground hover:text-dairy-dark"
              )}
            >
              State 1: Primary Sign-In
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("mfa")}
              className={cn(
                "px-3.5 py-1.5 rounded-lg transition-all",
                activeTab === "mfa"
                  ? "bg-white text-primary shadow-xs font-bold"
                  : "text-muted-foreground hover:text-dairy-dark"
              )}
            >
              State 2: 2FA Challenge
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("denied")}
              className={cn(
                "px-3.5 py-1.5 rounded-lg transition-all",
                activeTab === "denied"
                  ? "bg-white text-primary shadow-xs font-bold"
                  : "text-muted-foreground hover:text-dairy-dark"
              )}
            >
              State 3: 403 Forbidden
            </button>
          </div>
        </div>

        {/* Auth States Display */}
        <div className="max-w-xl mx-auto w-full">
          {activeTab === "signin" && (
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-dairy-subtle shadow-xl relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-secondary to-primary" />

              {/* Status Header */}
              <div className="flex items-center justify-between mb-6">
                <span className="text-[11px] uppercase tracking-wider px-2.5 py-1 rounded bg-emerald-50 text-emerald-700 font-bold flex items-center gap-1.5 border border-emerald-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  State 1 • Operator Credentials
                </span>
                <span className="text-[11px] text-muted-foreground font-mono">
                  NODE: NSK-HQ-01
                </span>
              </div>

              {/* Title */}
              <div className="text-center mb-6">
                <div className="w-12 h-12 rounded-2xl bg-secondary/10 border border-secondary/20 text-secondary flex items-center justify-center mx-auto mb-3 shadow-xs">
                  <Warehouse className="h-6 w-6" />
                </div>
                <h2 className="font-serif text-2xl font-bold text-primary">
                  Operations Console Login
                </h2>
                <p className="text-xs text-muted-foreground mt-1">
                  Single sign-on for authorized dairy facility staff
                </p>
              </div>

              {/* Google Workspace SSO Simulation */}
              <div className="space-y-4 mb-5">
                <button
                  type="button"
                  onClick={() => handleSignIn()}
                  className="w-full h-11 px-4 rounded-xl bg-white border border-dairy-subtle hover:border-primary hover:bg-dairy-surface-low transition-all flex items-center justify-center gap-3 shadow-xs text-xs font-semibold text-dairy-dark group active:scale-[0.99]"
                >
                  <svg aria-hidden="true" className="w-4 h-4" viewBox="0 0 24 24">
                    <path
                      d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.66v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.15z"
                      fill="#4285F4"
                    />
                    <path
                      d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.26v3.15C3.25 21.36 7.33 24 12 24z"
                      fill="#34A853"
                    />
                    <path
                      d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.26C.46 8.16 0 9.94 0 12s.46 3.84 1.26 5.42l4.02-3.15z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.25 2.64 1.26 6.58l4.02 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                      fill="#EA4335"
                    />
                  </svg>
                  <span>Continue with Google Workspace (Yog Milk Enterprise)</span>
                </button>

                <div className="relative flex py-1 items-center">
                  <div className="flex-grow border-t border-dairy-subtle" />
                  <span className="flex-shrink mx-3 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                    or quick role credentials
                  </span>
                  <div className="flex-grow border-t border-dairy-subtle" />
                </div>

                {/* 1-Click Role Switcher for Seamless Prototype Verification */}
                <div className="grid grid-cols-2 gap-2">
                  {(Object.keys(ADMIN_PRESET_USERS) as AdminRole[]).map((r) => {
                    const preset = ADMIN_PRESET_USERS[r];
                    const isSelected = selectedRole === r;
                    return (
                      <button
                        key={r}
                        type="button"
                        onClick={() => handleRoleQuickPick(r)}
                        className={cn(
                          "p-2.5 rounded-xl border text-left transition-all text-xs flex flex-col justify-between",
                          isSelected
                            ? "border-primary bg-primary/5 text-primary font-bold shadow-xs"
                            : "border-dairy-subtle hover:border-dairy-outline bg-white text-dairy-dark"
                        )}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-xs leading-tight">
                            {preset.roleLabel}
                          </span>
                          {isSelected && (
                            <CheckCircle2 className="h-3.5 w-3.5 text-primary shrink-0" />
                          )}
                        </div>
                        <span className="text-[10px] text-muted-foreground font-normal mt-0.5 truncate">
                          {preset.name}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Email Form */}
                <form onSubmit={handleSignIn} className="space-y-3 mt-4">
                  <div>
                    <label className="block text-xs font-semibold text-dairy-dark mb-1">
                      Facility Email
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full text-xs rounded-xl px-3 py-2.5 bg-dairy-surface-low border border-dairy-subtle focus:bg-white focus:border-primary focus:ring-1 focus:ring-primary transition outline-none text-dairy-dark"
                      placeholder="name@yogmilk.com"
                      required
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-xs font-semibold text-dairy-dark">
                        Terminal Passkey
                      </label>
                      <span className="text-[10px] text-secondary font-medium">
                        Hardware MFA Enforced
                      </span>
                    </div>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full text-xs rounded-xl px-3 py-2.5 bg-dairy-surface-low border border-dairy-subtle focus:bg-white focus:border-primary focus:ring-1 focus:ring-primary transition outline-none text-dairy-dark"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full mt-2 h-11 bg-primary hover:bg-primary-container text-white rounded-xl text-xs font-bold tracking-wide transition-all shadow-md flex items-center justify-center gap-2 active:scale-[0.99]"
                  >
                    {isLoading ? (
                      <>
                        <RotateCw className="h-4 w-4 animate-spin" />
                        <span>Verifying Security Matrix...</span>
                      </>
                    ) : (
                      <>
                        <span>Enter Operations Console</span>
                        <ArrowRight className="h-4 w-4" />
                      </>
                    )}
                  </button>
                </form>
              </div>

              {/* Bottom Notice */}
              <div className="pt-3 border-t border-dairy-subtle text-center text-[11px] text-muted-foreground">
                Authorized YOG MILK personnel only. Session activity recorded to append-only audit trail.
              </div>
            </div>
          )}

          {activeTab === "mfa" && (
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-dairy-subtle shadow-xl relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-amber-500" />
              <div className="flex items-center justify-between mb-6">
                <span className="text-[11px] uppercase tracking-wider px-2.5 py-1 rounded bg-amber-50 text-amber-800 font-bold flex items-center gap-1.5 border border-amber-200">
                  <KeyRound className="h-3 w-3" />
                  State 2 • Two-Factor Challenge
                </span>
                <span className="text-[11px] text-muted-foreground font-mono">
                  TOTP / FIDO2
                </span>
              </div>

              <div className="text-center mb-6">
                <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-3 border border-amber-200">
                  <KeyRound className="h-6 w-6" />
                </div>
                <h2 className="font-serif text-2xl font-bold text-dairy-dark">
                  Hardware Token Challenge
                </h2>
                <p className="text-xs text-muted-foreground mt-1">
                  Enter the 6-digit verification code from your authenticator device
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <input
                    type="text"
                    value={mfaCode}
                    onChange={(e) => setMfaCode(e.target.value)}
                    className="w-full text-center font-mono text-2xl tracking-widest font-bold py-3 bg-dairy-surface-low border border-dairy-subtle rounded-xl focus:border-primary focus:bg-white outline-none"
                  />
                  <p className="text-[11px] text-center text-muted-foreground mt-2">
                    Code expires in <span className="font-mono font-bold text-amber-700">24 seconds</span>
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => handleSignIn()}
                  className="w-full h-11 bg-primary text-white rounded-xl text-xs font-bold tracking-wide transition-all hover:bg-primary-container shadow-md flex items-center justify-center gap-2"
                >
                  <span>Verify Hardware Token &amp; Enter</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          {activeTab === "denied" && (
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-rose-200 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-rose-500" />
              <div className="flex items-center justify-between mb-6">
                <span className="text-[11px] uppercase tracking-wider px-2.5 py-1 rounded bg-rose-50 text-rose-800 font-bold flex items-center gap-1.5 border border-rose-200">
                  <AlertOctagon className="h-3 w-3" />
                  State 3 • 403 Forbidden
                </span>
                <span className="text-[11px] text-muted-foreground font-mono">
                  SECURITY BREACH BLOCKED
                </span>
              </div>

              <div className="text-center mb-6">
                <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto mb-3 border border-rose-200">
                  <AlertOctagon className="h-6 w-6" />
                </div>
                <h2 className="font-serif text-2xl font-bold text-rose-800">
                  Access Unauthorized
                </h2>
                <p className="text-xs text-muted-foreground mt-1">
                  Your credentials do not possess dispatch authorization for Western India Hub
                </p>
              </div>

              <div className="p-3 bg-rose-50/60 rounded-xl border border-rose-200 text-xs text-rose-900 space-y-1">
                <p className="font-bold">Error Reference: ERR_RBAC_INSUFFICIENT_SCOPE</p>
                <p className="text-[11px] text-rose-700">
                  Contact Super Admin (priya.admin@yogmilk.com) to provision role-based access tokens.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setActiveTab("signin")}
                className="w-full mt-4 h-11 bg-white border border-dairy-subtle hover:bg-dairy-surface-low text-dairy-dark rounded-xl text-xs font-bold transition-all"
              >
                Return to Primary Operator Login
              </button>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full py-4 border-t border-dairy-subtle bg-white text-center text-xs text-muted-foreground">
        <p>
          YOG MILK B2B Platform • Western India Regional Operations (Pune, Mumbai, Satara, Kolhapur)
        </p>
      </footer>
    </div>
  );
}

export default function LoginPage() {
  return (
    <AuthProvider>
      <LoginContent />
    </AuthProvider>
  );
}

