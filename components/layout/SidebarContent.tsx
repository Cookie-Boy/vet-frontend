// components/layout/SidebarContent.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, PawPrint, Calendar, Stethoscope,
  Pill, Activity, User, Building2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useSession } from "next-auth/react";

interface SidebarContentProps {
  onNavigate?: () => void;
}

export function SidebarContent({ onNavigate }: SidebarContentProps) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const isAdmin = session?.user?.isAdmin || false;

  const navigation = [
    { name: "Главная", href: "/", icon: LayoutDashboard, alwaysShow: true },
    { name: "Питомцы", href: "/pets", icon: PawPrint, alwaysShow: true },
    { name: "Записи", href: "/appointments", icon: Calendar, alwaysShow: true },
    { name: "Врачи", href: "/doctors", icon: Stethoscope, alwaysShow: true },
    { name: "Клиники", href: "/clinics", icon: Building2, requireAdmin: true },
    { name: "Лекарства", href: "/medications", icon: Pill, requireAdmin: true },
    { name: "Здоровье", href: "/health", icon: Activity, alwaysShow: true },
    { name: "Профиль", href: "/profile", icon: User, alwaysShow: true },
  ];

  const filtered = navigation.filter(item => item.alwaysShow || (item.requireAdmin && isAdmin));

  return (
    <nav className="flex h-full flex-col p-4">
      <div className="flex-1 space-y-1">
        {filtered.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link key={item.name} href={item.href} onClick={onNavigate}>
              <Button
                variant={isActive ? "secondary" : "ghost"}
                className={cn("w-full justify-start !cursor-pointer", isActive && "bg-secondary")}
              >
                <item.icon className="mr-2 h-4 w-4" />
                {item.name}
              </Button>
            </Link>
          );
        })}
      </div>
      <Separator className="my-4" />
      <div className="text-xs text-muted-foreground px-2">Версия 1.0.0</div>
    </nav>
  );
}