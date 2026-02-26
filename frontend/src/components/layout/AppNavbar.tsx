"use client"
import { Button } from "@base-ui/react/button"
import { Input } from "@base-ui/react/input"
import { Bell } from "lucide-react"
import { useState } from "react"
import { Avatar, AvatarBadge, AvatarFallback, AvatarImage } from "../ui/avatar"

const AppNavbar = () => {
  const [searchTerm, setSearchTerm] = useState("")
  return (
    <nav className="sticky top-0 z-50 flex h-15 border-b bg-background px-5 items-center justify-between">
      <header>
        <div className="flex h-full">
          <h1 className="font-black">My Daily Focus</h1>
          <div className="h-6 w-px bg-border mx-5" />
          <h1 className="opacity-50">
            {new Date().toLocaleDateString('en-US', {
              weekday: 'long',
              month: 'short',
              day: 'numeric'
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
          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </div>
      </footer>
    </nav >
  )
}

export default AppNavbar