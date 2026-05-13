// components/layout/Header.tsx
"use client";

import { useState } from "react";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { LogOut, PawPrint, User, ChevronDown, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export default function Header() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  const isLoading = status === "loading";
  const userName = session?.user?.name || "Пользователь";
  const userEmail = session?.user?.email || "";

  const getUserInitials = (name?: string | null) => {
    if (!name) return "U";
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-white px-6 shadow-sm">
      <div className="flex items-center gap-3">
        <PawPrint className="h-6 w-6 text-primary" />
        <h1 className="text-xl font-semibold">ВетПлатформа</h1>
      </div>

      <div className="relative">
        {isLoading ? (
          <div className="flex items-center justify-center h-10 w-10 rounded-full bg-muted animate-pulse">
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <>
            <Button
              variant="ghost"
              className="flex items-center gap-2 h-10 px-2"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-primary/10 text-primary font-medium">
                  {getUserInitials(session?.user?.name)}
                </AvatarFallback>
              </Avatar>
              <ChevronDown className="h-4 w-4" />
            </Button>

            {menuOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
                <div className="absolute right-0 mt-2 w-56 bg-white border rounded-lg shadow-lg z-20">
                  <div className="px-4 py-3 border-b">
                    <p className="text-sm font-medium">{userName}</p>
                    <p className="text-xs text-muted-foreground">{userEmail}</p>
                  </div>
                  <button
                    className="w-full flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-100"
                    onClick={() => {
                      setMenuOpen(false);
                      router.push("/profile");
                    }}
                  >
                    <User className="h-4 w-4" />
                    Профиль
                  </button>
                  <button
                    className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                    onClick={() => {
                      setMenuOpen(false);
                      signOut({ callbackUrl: "/login" });
                    }}
                  >
                    <LogOut className="h-4 w-4" />
                    Выйти
                  </button>
                </div>
              </>
            )}
          </>
        )}
      </div>
    </header>
  );
}