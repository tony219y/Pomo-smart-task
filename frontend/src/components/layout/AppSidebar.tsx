"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  useSidebar,
} from "@/components/ui/sidebar";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  Bolt,
  ClipboardList,
  Clock,
  LayoutDashboard,
  LogOut,
  Menu,
  Shield,
  X,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { logOut } from "@/features/auth/services/auth.service";
import { useAuthStore } from "@/store/auth-store";
import { toast } from "sonner";
import { useAuth } from "@/features/auth/hooks/use-auth";

const AppSidebar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const clearAuth = useAuthStore((state) => state.logout);
  const { useProfile } = useAuth();
  const { data: profile } = useProfile();

  const projects = [
    {
      name: "Dashboard",
      url: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "Tasks",
      url: "/tasks",
      icon: ClipboardList,
    },
    {
      name: "Pomodoro",
      url: "/pomodoro",
      icon: Clock,
    },
    {
      name: "Reports",
      url: "/reports",
      icon: BarChart3,
    },
    ...(profile?.role === "admin"
      ? [
          {
            name: "Admin Users",
            url: "/admin/users",
            icon: Shield,
          },
        ]
      : []),
  ];
  const { toggleSidebar, open } = useSidebar();

  const handleLogout = async () => {
    if (isLoggingOut) return;

    setIsLoggingOut(true);
    try {
      await logOut();
      clearAuth();
      router.replace("/login");
    } catch {
      toast.error("Logout failed. Please try again.");
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <Sidebar
      collapsible="icon"
      className="border-r border-sidebar-border bg-sidebar"
    >
      <SidebarHeader className="min-h-18 flex justify-center border-b border-sidebar-border">
        <div
          className={`flex w-full ${open ? "justify-end" : "justify-center"}`}
        >
          <div
            className={`${open ? "flex" : "hidden"} items-center mr-auto gap-3 px-3`}
          >
            <strong className="flex size-9 items-center justify-center rounded-xl bg-sidebar-primary shadow-sm">
              <Bolt color="white" size={16} />
            </strong>
            <div className="flex flex-col text-nowrap leading-tight">
              <b className="text-sidebar-foreground">TaskMaster</b>
              <small className="text-muted-foreground">Pro Workspace</small>
            </div>
          </div>
          {open ? (
            <X
              onClick={toggleSidebar}
              className="mt-1 cursor-pointer text-muted-foreground"
            />
          ) : (
            <Menu
              onClick={toggleSidebar}
              className="mt-1 cursor-pointer text-muted-foreground"
            />
          )}
        </div>
      </SidebarHeader>

      <SidebarContent className="flex flex-col gap-2 p-3">
        <SidebarMenu className="flex items-center">
          {projects.map((project, idx) => {
            const Icon = project.icon;
            return (
              <SidebarMenuButton
                key={idx}
                asChild
                isActive={pathname === project.url}
                className="h-11 rounded-xl text-[15px] text-sidebar-foreground/80 data-[active=true]:bg-sidebar-accent data-[active=true]:text-sidebar-primary"
              >
                <Link href={project.url} className="px-3">
                  <Icon size={18} />
                  <span>{project.name}</span>
                </Link>
              </SidebarMenuButton>
            );
          })}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="flex flex-col gap-2 p-3">
        <SidebarMenu className="flex items-center">
          <SidebarMenuButton
            type="button"
            variant="outline"
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="h-11 rounded-xl text-[15px] text-sidebar-foreground/80 data-[active=true]:bg-sidebar-accent data-[active=true]:text-sidebar-primary"
          >
            <LogOut size={18} />
            <span className="overflow-hidden">
              {isLoggingOut ? "Signing out..." : "Log out"}
            </span>
          </SidebarMenuButton>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;
