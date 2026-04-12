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
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";

const navigation = [
  { name: "Дашборд", href: "/dashboard", icon: LayoutDashboard },
  { name: "Питомцы", href: "/pets", icon: PawPrint },
  { name: "Записи", href: "/appointments", icon: Calendar },
  { name: "Врачи", href: "/doctors", icon: Stethoscope },
  { name: "Лекарства", href: "/medications", icon: Pill },
  { name: "Здоровье", href: "/health", icon: Activity },
  { name: "Профиль", href: "/profile", icon: User },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="fixed left-0 top-16 z-20 hidden h-[calc(100vh-4rem)] w-64 shrink-0 border-r bg-white lg:block">
        <nav className="flex h-full flex-col p-4">
          <div className="flex-1 space-y-1">
            {navigation.map((item) => {
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
            Версия 1.0.1
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
              {navigation.map((item) => {
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
              Версия 1.0.1
            </div>
          </nav>
        </SheetContent>
      </Sheet>
    </>
  );
}