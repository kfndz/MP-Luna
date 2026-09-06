import React, { useEffect, useState } from "react";
import {
  LayoutDashboard,
  LogOut,
  Menu,
  Package,
  X,
} from "lucide-react";
import {
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom";

import { AuthService } from "@/services/AuthService";

type Props = {
  children: React.ReactNode;
  title?: string;
};

export default function AdminLayout({
  children,
  title,
}: Props) {
  const navigate = useNavigate();
  const location = useLocation();

  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!sidebarOpen) return;

    const previousOverflow =
      document.body.style.overflow;

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow =
        previousOverflow;
    };
  }, [sidebarOpen]);

  function handleLogout() {
    AuthService.logout();

    navigate("/admin/login", {
      replace: true,
    });
  }

  function isActive(path: string) {
    if (path === "/admin") {
      return location.pathname === "/admin";
    }

    return location.pathname.startsWith(path);
  }

  const navigation = [
    {
      label: "Dashboard",
      path: "/admin",
      icon: LayoutDashboard,
    },
    {
      label: "Produtos",
      path: "/admin/produtos",
      icon: Package,
    },
  ];

  const sidebarContent = (
    <div className="flex h-full flex-col">
      <div className="mb-8 flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            Gerenciamento
          </p>

          <h2 className="mt-3 text-2xl font-semibold text-foreground">
            MP LUNA
          </h2>
        </div>

        <button
          type="button"
          onClick={() => setSidebarOpen(false)}
          aria-label="Fechar menu"
          className="rounded-xl p-2 transition hover:bg-muted lg:hidden"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <nav className="flex flex-col gap-2 text-sm">
        {navigation.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 rounded-2xl px-4 py-3 font-medium transition-colors ${
                active
                  ? "bg-accent text-accent-foreground"
                  : "text-foreground hover:bg-muted hover:text-accent"
              }`}
            >
              <Icon className="h-5 w-5 flex-shrink-0" />

              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto pt-8">
        <button
          type="button"
          onClick={handleLogout}
          className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm font-medium text-destructive transition hover:bg-destructive/20"
        >
          <LogOut className="h-5 w-5" />
          Sair
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-muted text-foreground">
      <div className="flex min-h-screen">
        {/* Sidebar desktop */}
        <aside className="fixed inset-y-0 left-0 z-30 hidden w-72 border-r border-border bg-card px-6 py-8 shadow-sm lg:block">
          {sidebarContent}
        </aside>

        {/* Overlay mobile/tablet */}
        {sidebarOpen && (
          <button
            type="button"
            aria-label="Fechar menu"
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-[1px] lg:hidden"
          />
        )}

        {/* Sidebar mobile/tablet */}
        <aside
          className={`fixed inset-y-0 left-0 z-50 w-[min(82vw,320px)] border-r border-border bg-card px-5 py-6 shadow-2xl transition-transform duration-300 lg:hidden ${
            sidebarOpen
              ? "translate-x-0"
              : "-translate-x-full"
          }`}
        >
          {sidebarContent}
        </aside>

        {/* Conteúdo */}
        <div className="min-w-0 flex-1 lg:pl-72">
          {/* Header do painel */}
          <header className="sticky top-0 z-20 border-b border-border bg-card/95 backdrop-blur">
            <div className="flex min-h-16 items-center gap-3 px-4 sm:px-6 lg:px-8">
              <button
                type="button"
                onClick={() => setSidebarOpen(true)}
                aria-label="Abrir menu administrativo"
                className="rounded-xl border border-border bg-background p-2.5 transition hover:bg-muted lg:hidden"
              >
                <Menu className="h-5 w-5" />
              </button>

              <div className="min-w-0">
                <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground lg:hidden">
                  Painel administrativo
                </p>

                {title && (
                  <h1 className="truncate text-xl font-bold text-foreground sm:text-2xl lg:text-3xl">
                    {title}
                  </h1>
                )}
              </div>
            </div>
          </header>

          <main className="p-4 sm:p-6 lg:p-8">
            <div className="mx-auto max-w-7xl space-y-6">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}