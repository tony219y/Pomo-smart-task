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
    <Sidebar collapsible="icon" className="border-r border-[#dce2e8] bg-[#f7f9fb]">
      <SidebarHeader className="min-h-18 flex justify-center border-b border-[#e7edf3]">
        <div
          className={`flex w-full ${open ? "justify-end" : "justify-center"}`}
        >
          <div
            className={`${open ? "flex" : "hidden"} items-center mr-auto gap-3 px-3`}
          >
            <strong className="flex size-9 items-center justify-center rounded-xl bg-[#2fad66] shadow-sm">
              <Bolt color="white" size={16} />
            </strong>
            <div className="flex flex-col text-nowrap leading-tight">
              <b className="text-[#1f2a37]">TaskMaster</b>
              <small className="text-[#7e8b98]">Pro Workspace</small>
            </div>
          </div>
          {open ? (
            <X onClick={toggleSidebar} className="mt-1 cursor-pointer text-[#8a97a6]" />
          ) : (
            <Menu onClick={toggleSidebar} className="mt-1 cursor-pointer text-[#8a97a6]" />
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
                className="h-11 rounded-xl text-[15px] text-[#526374] data-[active=true]:bg-[#e0efe6] data-[active=true]:text-[#2fad66]"
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
      <SidebarFooter className="px-4 pb-4 text-xs text-[#9aa7b4]">Smart Task Manager Website</SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;
