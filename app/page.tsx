"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  ArrowRight,
  ShieldCheck,
  School,
  Search,
  Globe,
  Clock,
  CheckCircle2,
} from "lucide-react";

export default function HomePage() {
  const [roll, setRoll] = useState("");
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  const go = useCallback(() => {
    const v = roll.trim();
    if (v) router.push(`/results/${encodeURIComponent(v)}`);
  }, [roll, router]);

  // UX nicety: focus the field when user presses "/" key (like global search)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "/" && !e.metaKey && !e.ctrlKey && !e.altKey) {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const samples = ["254123301", "254433", "9988"];

  return (
    <main className="relative min-h-[100dvh] overflow-hidden">
      {/* Background */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-black" />
        <div className="absolute -top-24 -left-24 h-96 w-96 rounded-full blur-3xl opacity-30 bg-emerald-300 dark:opacity-20" />
        <div className="absolute -bottom-24 -right-24 h-96 w-96 rounded-full blur-3xl opacity-30 bg-cyan-300 dark:opacity-20" />
      </div>

      {/* Hero */}
      <section className="mx-auto max-w-6xl px-6 pt-16 sm:pt-24">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
          {/* Left: copy */}
          <div className="space-y-5">
            <div className="flex items-center gap-2">
              <Badge className="bg-emerald-600 hover:bg-emerald-600 text-white">
                Official Results Portal
              </Badge>
              <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                <Globe className="h-3.5 w-3.5" />
                Global-grade UX
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl font-semibold leading-tight tracking-tight">
              Find Your Exam Result <span className="text-emerald-600">Instantly</span>
            </h1>

            <p className="text-muted-foreground max-w-xl">
              Enter your roll number to view your personal details, subject grades,
              total points, average, overall percentage, and pass/fail status.
            </p>

            <ul className="text-sm text-muted-foreground grid gap-2">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                12 subjects with per-subject scores and grading letters
              </li>
              <li className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-emerald-600" />
                Secure, admin-only data entry with protected APIs
              </li>
              <li className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-emerald-600" />
                Real-time lookup — no login required for students
              </li>
            </ul>
          </div>

          {/* Right: search card */}
          <div className="mx-auto w-full max-w-xl">
            <Card className="shadow-xl border border-emerald-200/40 dark:border-emerald-900/30">
              <CardContent className="p-6 sm:p-8">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    go();
                  }}
                  className="space-y-5"
                  aria-label="Exam Result Lookup"
                >
                  <div className="grid gap-2">
                    <Label htmlFor="roll" className="text-sm">Roll Number</Label>
                    <div className="flex flex-col sm:flex-row gap-3">
                      <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="roll"
                          ref={inputRef}
                          placeholder="e.g. 254123301"
                          value={roll}
                          onChange={(e) => setRoll(e.target.value)}
                          onKeyDown={(e) => e.key === "Enter" && go()}
                          className="pl-9"
                          autoFocus
                          inputMode="numeric"
                        />
                        <span className="absolute right-2 top-1/2 -translate-y-1/2 hidden sm:inline text-xs text-muted-foreground">
                          Press <kbd className="rounded border bg-muted px-1">/</kbd> to focus
                        </span>
                      </div>
                      <Button
                        type="submit"
                        className="w-full sm:w-auto"
                        disabled={!roll.trim()}
                      >
                        View Result
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>

                    {/* sample chips */}
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs text-muted-foreground">Try:</span>
                      {samples.map((s) => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => setRoll(s)}
                          className="text-xs rounded-md border px-2 py-1 hover:bg-muted transition"
                          aria-label={`Use sample roll ${s}`}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Passing rule (updated to D+ ≥ 45%) */}
                  <div className="text-xs rounded-md border px-3 py-2 border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/40 dark:bg-emerald-950/40 dark:text-emerald-300">
                    Passing threshold: <b>D+ (≥ 45%)</b>. Anything below D+ is considered <b className="text-rose-600">FAILED</b>.
                    <p>Pass eligibility: 7+ subjects attempted.</p>
                  </div>

                  {/* Feature tiles */}
                  <div className="grid sm:grid-cols-3 gap-3 text-sm">
                    <Feature
                      icon={<School className="h-4 w-4" />}
                      title="12 Subjects"
                      desc="Somali, Islamic, Arabic, English, and more."
                    />
                    <Feature
                      icon={<ShieldCheck className="h-4 w-4" />}
                      title="Secure"
                      desc="Admin-only data entry & protected APIs."
                    />
                    <Feature
                      icon={<ArrowRight className="h-4 w-4" />}
                      title="Instant Lookup"
                      desc="Search by roll number—no login needed."
                    />
                  </div>
                </form>
              </CardContent>
            </Card>

            {/* footer actions */}
            <div className="flex items-center justify-center gap-4 mt-6 text-sm">
              <a
                href="/admin/login"
                className="text-muted-foreground hover:text-foreground underline underline-offset-4"
              >
                Admin Login
              </a>
              <span className="text-muted-foreground">•</span>
              <a
                href="/complaint"
                className="text-muted-foreground hover:text-foreground underline underline-offset-4"
              >
                Report an issue
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

function Feature({
  icon,
  title,
  desc,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
}) {
  return (
    <div className="rounded-md border p-3 flex items-start gap-3">
      <div className="shrink-0 mt-0.5">{icon}</div>
      <div>
        <div className="font-medium">{title}</div>
        <div className="text-muted-foreground">{desc}</div>
      </div>
    </div>
  );
}
