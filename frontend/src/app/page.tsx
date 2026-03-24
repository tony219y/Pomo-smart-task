"use client";

import Link from "next/link";
import { ArrowRight, BarChart3, Clock3, ClipboardList } from "lucide-react";
import { Button } from "@/components/ui/button";

const features = [
  {
    title: "Tasks",
    description: "Plan your day, organize priorities, and keep work moving.",
    icon: ClipboardList,
  },
  {
    title: "Pomodoro",
    description: "Stay focused with simple work sessions tied to real tasks.",
    icon: Clock3,
  },
  {
    title: "Reports",
    description: "Review progress, workload, and activity in one clean view.",
    icon: BarChart3,
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto flex min-h-screen max-w-6xl flex-col px-6 py-8">
        <header className="flex items-center justify-between py-2">
          <Link href="/" className="text-sm font-semibold tracking-wide text-foreground">
            Pomo Smart Task
          </Link>

          <div className="flex items-center gap-3">
            <Button asChild variant="ghost" size="sm">
              <Link href="/login">Sign in</Link>
            </Button>
            <Button asChild size="sm">
              <Link href="/register">Get started</Link>
            </Button>
          </div>
        </header>

        <section className="flex flex-1 items-center py-16">
          <div className="grid w-full gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div className="space-y-6">
              <div className="inline-flex w-fit rounded-full border border-border bg-card px-4 py-2 text-xs font-medium text-muted-foreground">
                Minimal productivity workspace
              </div>

              <div className="space-y-4">
                <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
                  Focus on your work without fighting your tools.
                </h1>
                <p className="max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
                  Pomo Smart Task brings tasks, Pomodoro sessions, reports, and admin tools
                  together in one clean dark workspace.
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <Button asChild size="lg" className="rounded-xl px-6">
                  <Link href="/register">
                    Start free
                    <ArrowRight className="size-4" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="rounded-xl px-6">
                  <Link href="/dashboard">Open app</Link>
                </Button>
              </div>
            </div>

            <div className="rounded-3xl border border-border bg-card p-5 shadow-sm">
              <div className="rounded-2xl border border-border bg-background p-5">
                <div className="flex items-center justify-between border-b border-border pb-4">
                  <div>
                    <p className="text-sm font-semibold text-foreground">Today</p>
                    <p className="text-sm text-muted-foreground">
                      Tasks, focus sessions, and progress at a glance.
                    </p>
                  </div>
                  <span className="rounded-full bg-primary/15 px-3 py-1 text-xs font-semibold text-primary">
                    Live workspace
                  </span>
                </div>

                <div className="mt-5 grid gap-3 sm:grid-cols-3">
                  <div className="rounded-2xl border border-border bg-card p-4">
                    <p className="text-sm text-muted-foreground">Completed</p>
                    <p className="mt-2 text-2xl font-semibold text-foreground">12</p>
                  </div>
                  <div className="rounded-2xl border border-border bg-card p-4">
                    <p className="text-sm text-muted-foreground">Focus Time</p>
                    <p className="mt-2 text-2xl font-semibold text-foreground">4h 32m</p>
                  </div>
                  <div className="rounded-2xl border border-border bg-card p-4">
                    <p className="text-sm text-muted-foreground">Score</p>
                    <p className="mt-2 text-2xl font-semibold text-foreground">94%</p>
                  </div>
                </div>

                <div className="mt-5 space-y-3">
                  <div className="rounded-2xl border border-border bg-card px-4 py-3">
                    <p className="font-medium text-foreground">
                      Refactor the dashboard layout components
                    </p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Work · In progress · 25 min focus planned
                    </p>
                  </div>
                  <div className="rounded-2xl border border-border bg-card px-4 py-3">
                    <p className="font-medium text-foreground">
                      Weekly team sync meeting preparation
                    </p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Personal · Todo · Due today
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-4 pb-8 md:grid-cols-3">
          {features.map((feature) => {
            const Icon = feature.icon;

            return (
              <div
                key={feature.title}
                className="rounded-2xl border border-border bg-card p-5"
              >
                <div className="flex size-10 items-center justify-center rounded-xl bg-primary/15 text-primary">
                  <Icon className="size-5" />
                </div>
                <h2 className="mt-4 text-lg font-semibold text-foreground">{feature.title}</h2>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </section>
      </div>
    </main>
  );
}
