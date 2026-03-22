"use client"
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const router = useRouter();
  useEffect(()=>{
    router.push('/dashboard')
  })
  return (
    <div className="flex w-full h-screen items-center justify-center">
      <h1>Hello, world</h1>
    </div>
  );
}
