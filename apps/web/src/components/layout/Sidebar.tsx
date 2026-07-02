"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  LayoutDashboard,
  FileText,
  FolderOpen,
  Settings,
  ChevronRight,
  ChevronDown,
  HelpCircle,
  TrendingUp,
  Receipt,
  Building2,
  Calculator,
  FileSpreadsheet,
  FileCheck,
  Users,
  BarChart3,
  Landmark,
  RefreshCw,
  DollarSign,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface NavItem {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  children?: NavItem[];
}

const navGroups: { label: string; items: NavItem[] }[] = [
  {
    label: "Menu",
    items: [
      { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
      {
        href: "/income",
        label: "Income",
        icon: TrendingUp,
        children: [
          { href: "/income/categories", label: "Income categories", icon: DollarSign },
          { href: "/income/recurring", label: "Recurring income", icon: RefreshCw },
        ],
      },
      { href: "/expenses", label: "Expenses", icon: Receipt },
      { href: "/assets", label: "Assets", icon: Building2 },
      { href: "/taxes", label: "Taxes", icon: Calculator },
      { href: "/quotes", label: "Quotes", icon: FileSpreadsheet },
      { href: "/invoices", label: "Invoices", icon: FileCheck },
      { href: "/clients", label: "Clients", icon: Users },
      { href: "/reports", label: "Reports", icon: BarChart3 },
      { href: "/bank-feeds", label: "Bank feeds", icon: Landmark },
    ],
  },
  {
    label: "Settings",
    items: [
      { href: "/settings", label: "Settings", icon: Settings },
      { href: "/help", label: "Help & Support", icon: HelpCircle },
    ],
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const [expandedItems, setExpandedItems] = useState<Set<string>>(
    new Set(["/income"])
  );

  const toggleExpanded = (href: string) => {
    setExpandedItems((prev) => {
      const next = new Set(prev);
      if (next.has(href)) {
        next.delete(href);
      } else {
        next.add(href);
      }
      return next;
    });
  };

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`);

  return (
    <aside className="flex h-full w-60 flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground">
      {/* Logo */}
      <div className="flex h-14 items-center gap-2 border-b border-sidebar-border px-4">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
          <span className="text-sm font-bold text-primary-foreground">TC</span>
        </div>
        <span className="text-base font-semibold tracking-tight">TaxCode</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-4 overflow-y-auto p-3">
        {navGroups.map((group) => (
          <div key={group.label}>
            <p className="mb-1 px-3 text-xs font-semibold uppercase tracking-wider text-sidebar-foreground/40">
              {group.label}
            </p>
            <div className="space-y-0.5">
              {group.items.map((item) => {
                const active = isActive(item.href);
                const hasChildren = item.children && item.children.length > 0;
                const isExpanded = expandedItems.has(item.href);

                return (
                  <div key={item.href}>
                    {hasChildren ? (
                      <button
                        onClick={() => toggleExpanded(item.href)}
                        className={cn(
                          "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors duration-150",
                          active
                            ? "bg-sidebar-accent/10 text-sidebar-accent"
                            : "text-sidebar-foreground/70 hover:bg-sidebar-accent/5 hover:text-sidebar-foreground"
                        )}
                      >
                        <item.icon
                          className={cn(
                            "h-4 w-4 flex-shrink-0",
                            active && "text-sidebar-accent"
                          )}
                          strokeWidth={active ? 2.5 : 2}
                        />
                        <span className="flex-1 text-left">{item.label}</span>
                        <ChevronDown
                          className={cn(
                            "h-3 w-3 flex-shrink-0 transition-transform duration-150",
                            isExpanded ? "rotate-0" : "-rotate-90"
                          )}
                          strokeWidth={2}
                        />
                      </button>
                    ) : (
                      <Link
                        href={item.href}
                        className={cn(
                          "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors duration-150",
                          active
                            ? "bg-sidebar-accent/10 text-sidebar-accent"
                            : "text-sidebar-foreground/70 hover:bg-sidebar-accent/5 hover:text-sidebar-foreground"
                        )}
                      >
                        <item.icon
                          className={cn(
                            "h-4 w-4 flex-shrink-0",
                            active && "text-sidebar-accent"
                          )}
                          strokeWidth={active ? 2.5 : 2}
                        />
                        <span className="flex-1">{item.label}</span>
                        {active && (
                          <ChevronRight className="h-3 w-3 flex-shrink-0 text-sidebar-accent/60" />
                        )}
                      </Link>
                    )}

                    {/* Sub-items */}
                    {hasChildren && isExpanded && (
                      <div className="ml-6 mt-0.5 space-y-0.5 border-l border-sidebar-border/50 pl-3">
                        {item.children!.map((child) => {
                          const childActive = isActive(child.href);
                          return (
                            <Link
                              key={child.href}
                              href={child.href}
                              className={cn(
                                "flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors duration-150",
                                childActive
                                  ? "bg-sidebar-accent/10 text-sidebar-accent font-medium"
                                  : "text-sidebar-foreground/50 hover:bg-sidebar-accent/5 hover:text-sidebar-foreground/70"
                              )}
                            >
                              <child.icon
                                className="h-3.5 w-3.5 flex-shrink-0"
                                strokeWidth={childActive ? 2.5 : 2}
                              />
                              {child.label}
                            </Link>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Help */}
      <div className="border-t border-sidebar-border p-3" />
    </aside>
  );
}
