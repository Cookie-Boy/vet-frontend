// components/layout/Sidebar.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  PawPrint,
  Calendar,
  Stethoscope,
  Pill,
  Activity,
  User,
  Menu,
  Building2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { useSession } from "next-auth/react";

export default function Sidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  
  const isAdmin = session?.user?.isAdmin || false;
  const isDoctor = session?.user?.isDoctor || false;

  <h1 className="text-3xl font-bold">
            {isDoctor ? "Мои приёмы" : isAdmin ? "Все приёмы" : "Мои записи"}
          </h1>

  const navigation = [
    { name: "Главная", href: "/", icon: LayoutDashboard, alwaysShow: true },
    { name: "Питомцы", href: "/pets", icon: PawPrint, alwaysShow: true },
    { name: "Записи", href: "/appointments", icon: Calendar, alwaysShow: false, requireDefaultUser: true},
    { name: "Приёмы", href: "/appointments", icon: Calendar, alwaysShow: false, requireAdminOrDoctor: true },
    { name: "Клиники", href: "/clinics", icon: Building2, alwaysShow: false, requireAdmin: true },
    { name: "Врачи", href: "/doctors", icon: Stethoscope, alwaysShow: true },
    { name: "Лекарства", href: "/medications", icon: Pill, alwaysShow: false, requireAdmin: true },
    { name: "Здоровье", href: "/health", icon: Activity, alwaysShow: true },
    { name: "Профиль", href: "/profile", icon: User, alwaysShow: true },
  ];

  const filteredNavigation = navigation.filter(item => 
    item.alwaysShow || 
    (item.requireAdmin && isAdmin) || 
    (item.requireAdminOrDoctor && (isAdmin || isDoctor)) || 
    (item.requireDefaultUser && (!isAdmin && !isDoctor))
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="fixed left-0 top-16 z-20 hidden h-[calc(100vh-4rem)] w-64 shrink-0 border-r bg-white lg:block">
        <nav className="flex h-full flex-col p-4">
          <div className="flex-1 space-y-1">
            {filteredNavigation.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
              return (
                <Link key={item.name} href={item.href}>
                  <Button
                    variant={isActive ? "secondary" : "ghost"}
                    className={cn(
                      "w-full justify-start",
                      isActive && "bg-secondary"
                    )}
                  >
                    <item.icon className="mr-2 h-4 w-4" />
                    {item.name}
                  </Button>
                </Link>
              );
            })}
          </div>
          <Separator className="my-4" />
          <div className="text-xs text-muted-foreground px-2">
            Версия 1.0.0
          </div>
        </nav>
      </aside>

      {/* Mobile Sidebar (Sheet) */}
      <Sheet>
        <SheetTrigger>
          <Button variant="ghost" size="icon" className="lg:hidden fixed left-4 top-4 z-40">
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-0 pt-10">
          <nav className="flex h-full flex-col p-4">
            <div className="flex-1 space-y-1">
              {filteredNavigation.map((item) => {
                const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
                return (
                  <Link key={item.name} href={item.href}>
                    <Button
                      variant={isActive ? "secondary" : "ghost"}
                      className={cn(
                        "w-full justify-start",
                        isActive && "bg-secondary"
                      )}
                    >
                      <item.icon className="mr-2 h-4 w-4" />
                      {item.name}
                    </Button>
                  </Link>
                );
              })}
            </div>
            <Separator className="my-4" />
            <div className="text-xs text-muted-foreground px-2">
              Версия 1.0.0
            </div>
          </nav>
        </SheetContent>
      </Sheet>
    </>
  );
}