"use client";

import { useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Separator } from "@/components/ui/separator";
import { CheckCircle2, XCircle, Award, Hash, School, MapPin } from "lucide-react";

/** Tiny helper to join class names safely */
function cn(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

type ScoreRow = {
  id?: string | number;
  subject: string;
  score: number | string;
};

type Result = {
  name: string;
  status: string; // "PASSED" | "FAILED"
  percentage: number | string;
  rollNumber: string | number;
  mothersName?: string;
  school?: string;
  placeOfExam?: string;
  total?: number | string;
  grade?: string;
  scores: ScoreRow[];
};

export function ResultCard({ s }: { s: Result }) {
  const passed = String(s.status).toUpperCase() === "PASSED";

  // Normalize % to a number for visuals, but keep your original display precision
  const pctNumber = useMemo(() => {
    const n = typeof s.percentage === "number" ? s.percentage : parseFloat(String(s.percentage));
    return Number.isFinite(n) ? Math.min(Math.max(n, 0), 100) : 0;
  }, [s.percentage]);

  const pctLabel = useMemo(() => {
    return typeof s.percentage === "number" ? s.percentage.toFixed(2) : String(s.percentage);
  }, [s.percentage]);

  return (
    <Card
      className={cn(
        "overflow-hidden shadow-md transition-all hover:shadow-xl border",
        passed ? "border-emerald-200" : "border-rose-200"
      )}
      aria-live="polite"
    >
      {/* Decorative header */}
      <div
        className={cn(
          "h-2 w-full",
          passed
            ? "bg-gradient-to-r from-emerald-400 via-emerald-500 to-emerald-600"
            : "bg-gradient-to-r from-rose-400 via-rose-500 to-rose-600"
        )}
      />

      <CardContent className="p-6 sm:p-7">
        {/* Top row: name + status */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            {/* Initials pill */}
            <div
              className={cn(
                "flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-semibold text-white",
                passed ? "bg-emerald-500" : "bg-rose-500"
              )}
              aria-hidden="true"
            >
              {s.name?.slice(0, 2)?.toUpperCase() ?? "ST"}
            </div>
            <div className="min-w-0">
              <h2 className="truncate text-xl sm:text-2xl font-semibold tracking-tight">{s.name}</h2>
              <p className="text-xs text-muted-foreground">
                Student Performance Summary
              </p>
            </div>
          </div>

          <Badge
            className={cn(
              "px-3 py-1.5 text-white gap-1.5 text-xs sm:text-sm",
              passed ? "bg-emerald-600 hover:bg-emerald-600" : "bg-rose-600 hover:bg-rose-600"
            )}
          >
            {passed ? <CheckCircle2 className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
            {String(s.status).toUpperCase()}
          </Badge>
        </div>

        {/* Passing rule notice */}
        <div
          className={cn(
            "mt-4 text-xs rounded-md border px-3 py-2",
            passed
              ? "border-emerald-200 bg-emerald-50 text-emerald-700"
              : "border-rose-200 bg-rose-50 text-rose-700"
          )}
        >
          The passing score for the exam must not be less than <b>45%</b>.
        </div>

        {/* Meta grid */}
        <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
          <div className="flex items-center gap-2">
            <Hash className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium">Roll-Number:</span>
            <span className="truncate">{s.rollNumber}</span>
          </div>
          <div className="flex items-center gap-2">
            <Award className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium">Mother:</span>
            <span className="truncate">{s.mothersName ?? "-"}</span>
          </div>
          <div className="flex items-center gap-2">
            <School className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium">School:</span>
            <span className="truncate">{s.school ?? "-"}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium">Place:</span>
            <span className="truncate">{s.placeOfExam ?? "-"}</span>
          </div>
        </div>

        <Separator className="my-5" />

        {/* Totals + visual % */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
          <div className="rounded-md border bg-card p-3">
            <div className="text-xs text-muted-foreground">Total</div>
            <div className="text-lg font-semibold">{s.total ?? "-"}</div>
          </div>
          <div className="rounded-md border bg-card p-3">
            <div className="text-xs text-muted-foreground">% Percentage</div>
            <div className="text-lg font-semibold">{pctLabel}%</div>
          </div>
          <div className="rounded-md border bg-card p-3">
            <div className="text-xs text-muted-foreground">Grade</div>
            <div
              className={cn(
                "text-lg font-semibold",
                passed ? "text-emerald-700" : "text-rose-700"
              )}
            >
              {s.grade ?? "-"}
            </div>
          </div>
        </div>

        <div className="mt-4">
          <TooltipProvider delayDuration={200}>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="cursor-help">
                  <Progress
                    value={pctNumber}
                    className={cn(
                      "h-2",
                      passed ? "[&>div]:bg-emerald-600" : "[&>div]:bg-rose-600"
                    )}
                    aria-label={`Overall percentage ${pctLabel}%`}
                  />
                </div>
              </TooltipTrigger>
              <TooltipContent side="top">
                Overall percentage: {pctLabel}%
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        {/* Subjects */}
        <div className="mt-6">
          <div className="text-sm font-medium mb-2">Subject Scores</div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {s.scores.map((r) => {
              const val =
                typeof r.score === "number" ? r.score : parseFloat(String(r.score));
              const failed = Number.isFinite(val) ? val < 50 : false;

              return (
                <div
                  key={r.id ?? r.subject}
                  className={cn(
                    "flex items-center justify-between rounded-md border px-2 py-1.5 text-sm transition-colors",
                    failed
                      ? "border-rose-200 bg-rose-50"
                      : "border-muted bg-card"
                  )}
                  aria-label={`${r.subject}: ${r.score}`}
                >
                  <span className="truncate">{r.subject}</span>
                  <span className={cn("ml-2 font-medium", failed && "text-rose-700")}>
                    {r.score}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer hint */}
        <p className="mt-4 text-xs text-muted-foreground">
          Tip: You can print this result or save as PDF from your browser’s menu.
        </p>
      </CardContent>
    </Card>
  );
}
