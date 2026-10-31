"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Shield,
  ChevronDown,
  LogOut,
  Settings,
  ShieldCheck,
  Check,
  Sparkles,
  Building2,
} from "lucide-react";
import { useAdminAuth } from "@/components/auth/AuthContext";
import { AdminRole, ADMIN_PRESET_USERS } from "@/lib/mock/admin-auth";
import { cn } from "@/lib/utils";

export function ProfileMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, role, switchRole, logout } = useAdminAuth();
  const menuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleRoleSelect = (targetRole: AdminRole) => {
    switchRole(targetRole);
    setIsOpen(false);
  };

  const handleLogout = () => {
    logout();
    setIsOpen(false);
    router.push("/login");
  };

  return (
    <div className="relative" ref={menuRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2.5 p-1.5 rounded-xl hover:bg-dairy-surface-low transition-colors border border-transparent hover:border-dairy-subtle focus:outline-none"
      >
        <div className="h-8 w-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold text-xs shrink-0 shadow-sm">
          {user.avatarText}
        </div>
        <div className="hidden lg:block text-left">
          <p className="text-xs font-bold text-dairy-dark leading-tight">
            {user.name}
          </p>
          <div className="flex items-center gap-1 mt-0.5">
            <Shield className="h-2.5 w-2.5 text-secondary" />
            <p className="text-[10px] text-muted-foreground font-medium">
              {user.roleLabel}
            </p>
          </div>
        </div>
        <ChevronDown
          className={cn(
            "h-4 w-4 text-muted-foreground transition-transform duration-200",
            isOpen && "rotate-180"
          )}
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-dairy-subtle p-3 z-50 animate-in fade-in-50 zoom-in-95">
          {/* Header Card */}
          <div className="p-3 bg-dairy-surface-low rounded-xl border border-dairy-subtle mb-3">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-primary text-white flex items-center justify-center font-bold text-sm shadow-sm">
                {user.avatarText}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-bold text-dairy-dark truncate">
                  {user.name}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {user.email}
                </p>
              </div>
            </div>
            <div className="mt-2.5 pt-2 border-t border-dairy-subtle/80 flex items-center justify-between text-[11px] text-muted-foreground">
              <span className="flex items-center gap-1">
                <Building2 className="h-3 w-3 text-secondary" />
                {user.hubName}
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-primary bg-primary/10 px-1.5 py-0.5 rounded">
                Active Staff
              </span>
            </div>
          </div>

          {/* Role Switcher Section */}
          <div className="mb-3">
            <div className="px-2 py-1 flex items-center justify-between">
              <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground flex items-center gap-1">
                <Sparkles className="h-3 w-3 text-secondary" />
                Simulate Role
              </span>
              <span className="text-[10px] text-primary font-semibold">
                Instant Switch
              </span>
            </div>
            <div className="space-y-1 mt-1">
              {(Object.keys(ADMIN_PRESET_USERS) as AdminRole[]).map((r) => {
                const preset = ADMIN_PRESET_USERS[r];
                const isCurrent = role === r;
                return (
                  <button
                    key={r}
                    type="button"
                    onClick={() => handleRoleSelect(r)}
                    className={cn(
                      "w-full text-left px-3 py-2 rounded-lg text-xs font-medium flex items-center justify-between transition-colors",
                      isCurrent
                        ? "bg-primary text-white font-semibold"
                        : "text-dairy-dark hover:bg-dairy-surface-low"
                    )}
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className={cn(
                          "w-2 h-2 rounded-full",
                          isCurrent ? "bg-secondary-container" : "bg-muted-foreground/40"
                        )}
                      />
                      <span>{preset.roleLabel}</span>
                    </div>
                    {isCurrent && <Check className="h-3.5 w-3.5 text-secondary-container" />}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="border-t border-dairy-subtle my-2" />

          {/* Quick Menu Actions */}
          <div className="space-y-0.5 text-xs font-medium">
            <Link
              href="/settings"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-dairy-dark hover:bg-dairy-surface-low transition-colors"
            >
              <Settings className="h-4 w-4 text-muted-foreground" />
              <span>Admin Settings &amp; Staff</span>
            </Link>
            <Link
              href="/audit"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-dairy-dark hover:bg-dairy-surface-low transition-colors"
            >
              <ShieldCheck className="h-4 w-4 text-muted-foreground" />
              <span>Append-Only Audit Trail</span>
            </Link>
            <button
              type="button"
              onClick={handleLogout}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-rose-600 hover:bg-rose-50 transition-colors"
            >
              <LogOut className="h-4 w-4 text-rose-500" />
              <span>Sign Out to Auth Matrix</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

