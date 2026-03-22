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
  Bolt,
  ChartColumnIncreasing,
  ClipboardList,
  Folder,
  LayoutDashboard,
  Menu,
  Settings,
  X,
} from "lucide-react";
import Link from "next/link";

const AppSidebar = () => {
  const pathname = usePathname();

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
      name: "Projects",
      url: "/projects",
      icon: Folder,
    },
    {
      name: "Analytics",
      url: "/analytics",
      icon: ChartColumnIncreasing,
    },
    {
      name: "Settings",
      url: "/settings",
      icon: Settings,
    },
  ];
  const { toggleSidebar, open } = useSidebar();
  return (
    <Sidebar collapsible="icon" className="border-r border-sidebar-border bg-sidebar">
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
            <X onClick={toggleSidebar} className="mt-1 cursor-pointer text-muted-foreground" />
          ) : (
            <Menu onClick={toggleSidebar} className="mt-1 cursor-pointer text-muted-foreground" />
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
      <SidebarFooter className="px-4 pb-4 text-xs text-muted-foreground">Smart Task Manager Website</SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;
