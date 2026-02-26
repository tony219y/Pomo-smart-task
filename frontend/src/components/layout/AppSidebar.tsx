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
import { ChartColumnIncreasing, CircleCheck, ClipboardList, Folder, LayoutDashboard, Menu, X } from "lucide-react";

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
    ]
    const { toggleSidebar, open } = useSidebar();
    return (
        <Sidebar collapsible="icon" className="border-none">
            <SidebarHeader className="min-h-15 flex justify-center">
                <div className={`flex w-full  ${open ? "justify-end" : "justify-center"}`}>
                    <div className={`${open ? "flex" : "hidden"} items-center mr-auto gap-3 px-2`}>
                        <strong className="border h-full p-2 bg-[#28AF60] rounded-md"><CircleCheck color="white" /></strong>
                        <div className="flex flex-col text-md text-nowrap">
                            <b>Smart Task Pomo</b>
                            <small>Workspace</small>
                        </div>
                    </div>
                    {open ? (<X onClick={toggleSidebar} />) : (<Menu onClick={toggleSidebar} />)}
                </div>
            </SidebarHeader>

            <SidebarContent className="flex flex-col gap-2 items-center p-3">
                <SidebarMenu className="flex items-center">
                    {projects.map((project, idx) => {
                        const Icon = project.icon;
                        return (
                            <SidebarMenuButton
                                key={idx}
                                asChild
                                isActive={pathname === project.url}
                                className="data-[active=true]:bg-[#28AF60]/10 data-[active=true]:text-[#28AF60]"
                            >
                                <a href={project.url} className="p-5" >
                                    <Icon />
                                    <span>{project.name}</span>
                                </a>
                            </SidebarMenuButton>
                        )
                    })}
                </SidebarMenu>
            </SidebarContent>

            <SidebarFooter className="p-4 border-t border-white/10 text-xs text-muted-foreground italic bg-[#2c2c2c]">
            </SidebarFooter>
        </Sidebar>
    );
};

export default AppSidebar;