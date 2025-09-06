import { prisma } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import StudentsTable from "../dashboard/students-table";
import AdminUser from "./admin-user";
import Link from "next/link";
import {
  Users2,
  CheckCircle2,
  XCircle,
  Plus,
  LineChart,
  Building2,
  School,
} from "lucide-react";
import { ModeToggle } from "@/app/components/ModeToggle";

export const runtime = "nodejs";

// If you're on Next.js App Router, searchParams is a plain object on server components.
// Keep the signature flexible to avoid runtime type issues.
export default async function DashboardPage({
  searchParams,
}: {
  searchParams?: { q?: string; status?: "ALL" | "PASSED" | "FAILED" };
}) {
  const q = (searchParams?.q ?? "").toString();
  const status = (searchParams?.status ?? "ALL") as "ALL" | "PASSED" | "FAILED";

  const [all, passed, failed] = await Promise.all([
    prisma.student.count(),
    prisma.student.count({ where: { status: "PASSED" } }),
    prisma.student.count({ where: { status: "FAILED" } }),
  ]);

  return (
    <main className="mx-auto max-w-7xl px-6 py-8 space-y-8">
      {/* Topbar */}
      <header className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border bg-gradient-to-br from-background to-muted/40 p-5 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="grid size-10 place-items-center rounded-xl bg-primary/10 text-primary">
            <LineChart className="size-5" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Admin Dashboard</h1>
            <p className="text-sm text-muted-foreground flex items-center gap-2">
              <Building2 className="size-4" /> Manage students & results for your institution
            </p>
          </div>
        
        </div>
  <ModeToggle/>
        <div className="flex items-center gap-3">
          <AdminUser />
          <Button asChild className="gap-2">
            <Link href="/admin/students/new">
              <Plus className="size-4" /> New Student
            </Link>
          </Button>
        </div>
      </header>

      {/* Overview / Stats */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard
          label="All Students"
          value={all}
          icon={<Users2 className="size-5" />}
          badgeClass="bg-muted text-foreground"
        />
        <StatCard
          label="Passed"
          value={passed}
          icon={<CheckCircle2 className="size-5" />}
          badgeClass="bg-emerald-600 text-white"
          ringClass="ring-emerald-200"
        />
        <StatCard
          label="Failed"
          value={failed}
          icon={<XCircle className="size-5" />}
          badgeClass="bg-rose-600 text-white"
          ringClass="ring-rose-200"
        />
      </section>

      {/* Data table */}
      <section>
        <Card className="overflow-hidden">
          <CardHeader className="border-b bg-muted/40">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-medium flex items-center gap-2">
                <School className="size-4" /> Students
              </CardTitle>
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="rounded-full">Query: {q || "—"}</Badge>
                <Badge variant="outline" className="rounded-full">Status: {status}</Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <StudentsTable initialStatus={status} initialQuery={q} />
          </CardContent>
        </Card>
      </section>
    </main>
  );
}

function StatCard({
  label,
  value,
  icon,
  badgeClass,
  ringClass,
}: {
  label: string;
  value: number;
  icon: React.ReactNode;
  badgeClass?: string;
  ringClass?: string;
}) {
  return (
    <Card className={`border bg-gradient-to-b from-background to-muted/20 transition-all hover:shadow-md`}>
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div className={`grid size-10 place-items-center rounded-xl bg-background ring-1 ${ringClass ?? "ring-muted"}`}>
            {icon}
          </div>
          <Badge className={`px-3 py-1.5 text-xs ${badgeClass ?? "bg-muted text-foreground"}`}>{label}</Badge>
        </div>
        <div className="mt-4">
          <div className="text-[11px] uppercase tracking-wider text-muted-foreground">{label}</div>
          <div className="mt-1 text-3xl font-semibold tabular-nums">{value}</div>
        </div>
      </CardContent>
    </Card>
  );
}
