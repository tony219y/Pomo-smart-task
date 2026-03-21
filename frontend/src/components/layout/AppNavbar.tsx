"use client";
import { Input } from "@base-ui/react/input";
import { Bell, Search } from "lucide-react";
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

const AppNavbar = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  return (
    <nav className="sticky top-0 z-50 flex h-16 border-b border-[#e6edf3] bg-white px-6 items-center justify-between">
      <header>
        <div className="flex h-full items-center">
          <h1 className="text-xl font-black tracking-tight text-[#1d2939]">My Daily Focus</h1>
          <div className="mx-5 h-6 w-px bg-[#d9e2ea]" />
          <h1 className="text-sm text-[#8b99a8]">
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              month: "short",
              day: "numeric",
            })}
          </h1>
        </div>
      </header>
      <footer>
        <div className="flex items-center gap-5">
          <div className="relative hidden md:block">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#98a4b3]" />
            <Input
              type="search"
              placeholder="Search tasks..."
              value={searchTerm}
              className="w-72 rounded-full border border-[#e4eaf1] bg-[#f8fafc] py-2 pl-10 pr-4 text-sm outline-none"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Bell className="size-5 text-[#6b7a8b]" />
          <div className="flex items-center gap-3 rounded-full border border-[#dce5ee] px-2 py-1">
            <Avatar>
              <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </footer>
    </nav>
  );
};

export default AppNavbar;
