"use client";
import { Input } from "@base-ui/react/input";
import { Bell } from "lucide-react";
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useAuth } from "@/features/auth/hooks/use-auth";

const AppNavbar = () => {
  const { useProfile } = useAuth();
  const { data: userProfile } = useProfile();

  const [searchTerm, setSearchTerm] = useState<string>("");
  return (
    <nav className="sticky top-0 z-50 flex h-15 border-b bg-background px-5 items-center justify-between">
      <header>
        <div className="flex h-full">
          <h1 className="font-black">My Daily Focus</h1>
          <div className="h-6 w-px bg-border mx-5" />
          <h1 className="opacity-50">
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
          <Input
            type="search"
            placeholder="Search tasks..."
            value={searchTerm}
            className="min-w-24 p-2 rounded-full bg-[#f1f5f9] outline-none px-5"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Bell></Bell>
          <div className="flex gap-5 px-3 py-1 border rounded-md items-center shadow-md">
            <Avatar>
              <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <h1 className="capitalize font-bold">{userProfile?.username ?? "User"}</h1>
              <p className="capitalize text-xs font-light opacity-50">{userProfile?.role ?? "member"}</p>
            </div>
          </div>
        </div>
      </footer>
    </nav>
  );
};

export default AppNavbar;
