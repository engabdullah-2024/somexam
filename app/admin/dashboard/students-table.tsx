"use client";

import useSWR from "swr";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectValue,
  SelectItem,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import {
  Trash2,
  Edit3,
  ExternalLink,
  Printer,
  ArrowUpDown,
  Search,
  Loader2,
  FileX2,
} from "lucide-react";

const fetcher = (url: string) => fetch(url).then((r) => r.json());
const MAX_TOTAL = 12 * 100; // 12 subjects * 100

type SortBy = "total" | "average";
type SortDir = "desc" | "asc";

type Props = {
  initialStatus: "ALL" | "PASSED" | "FAILED";
  initialQuery: string;
};

type Student = {
  id: string;
  rollNumber: string;
  name: string;
  school?: string;
  total?: number;
  average?: number;
  grade?: string;
  status: "PASSED" | "FAILED";
};

type StudentsResponse = {
  total: number;
  items: Student[];
};

export default function StudentsTable({ initialStatus, initialQuery }: Props) {
  const sp = useSearchParams();
  const router = useRouter();

  const [status, setStatus] = useState<"ALL" | "PASSED" | "FAILED">(initialStatus);
  const [q, setQ] = useState(initialQuery);
  const [sortBy, setSortBy] = useState<SortBy>((sp?.get("sortBy") as SortBy) || "total");
  const [sortDir, setSortDir] = useState<SortDir>((sp?.get("sortDir") as SortDir) || "desc");

  // --- debounced query for better UX on mobile ---
  const [debouncedQ, setDebouncedQ] = useState(q);
  useEffect(() => {
    const id = setTimeout(() => setDebouncedQ(q.trim()), 300);
    return () => clearTimeout(id);
  }, [q]);

  const qs = useMemo(() => {
    const u = new URLSearchParams(sp?.toString());
    u.set("status", status);
    if (debouncedQ) u.set("q", debouncedQ);
    else u.delete("q");
    u.set("sortBy", sortBy);
    u.set("sortDir", sortDir);
    return u.toString();
  }, [status, debouncedQ, sortBy, sortDir, sp]);

  const { data, isLoading, mutate } = useSWR<StudentsResponse>(
    `/api/admin/students?${qs}`,
    fetcher
  );

  useEffect(() => {
    router.replace(`/admin/dashboard?${qs}`);
  }, [qs, router]);

  const totalCount = data?.total ?? 0;

  // compute items INSIDE useMemo and depend on the true source
  const items = useMemo(() => {
    const src = Array.isArray(data?.items) ? data!.items : [];

    const arr = [...src];
    const dir = sortDir === "desc" ? -1 : 1;
    arr.sort((a, b) => {
      const aval =
        sortBy === "total"
          ? Number(a.total) || 0
          : typeof a.average === "number"
          ? a.average
          : (Number(a.total) || 0) / 12;
      const bval =
        sortBy === "total"
          ? Number(b.total) || 0
          : typeof b.average === "number"
          ? b.average
          : (Number(b.total) || 0) / 12;
      return aval === bval ? 0 : aval < bval ? 1 * dir : -1 * dir;
    });
    return arr;
  }, [data?.items, sortBy, sortDir]);

  const countShown = items.length;
  const sumTotals = items.reduce((acc, s) => acc + (s.total ?? 0), 0);
  const avgShown =
    countShown > 0
      ? (
          items.reduce(
            (acc, s) => acc + (typeof s.average === "number" ? s.average : (s.total ?? 0) / 12),
            0
          ) / countShown
        ).toFixed(2)
      : "0.00";

  function toggleHeaderSort(column: SortBy) {
    if (sortBy === column) setSortDir((d) => (d === "desc" ? "asc" : "desc"));
    else {
      setSortBy(column);
      setSortDir("desc");
    }
  }

  return (
    <div className="p-4 sm:p-5 space-y-4">
      {/* Controls */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {/* Search + Status */}
        <div className="flex flex-col xs:flex-row gap-3 xs:items-center">
          <div className="relative w-full xs:w-72">
            <Search className="pointer-events-none absolute left-2 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              aria-label="Search by name, roll, or school"
              placeholder="Search name / roll / school"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              className="pl-8"
              autoComplete="off"
            />
          </div>

          <Select
            value={status}
            onValueChange={(v) => setStatus(v as "ALL" | "PASSED" | "FAILED")}
          >
            <SelectTrigger className="w-full xs:w-40">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent align="start">
              <SelectItem value="ALL">All</SelectItem>
              <SelectItem value="PASSED">Passed</SelectItem>
              <SelectItem value="FAILED">Failed</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Sort + CTA */}
        <div className="flex flex-wrap gap-2 items-center">
          <Select value={sortBy} onValueChange={(v) => setSortBy(v as SortBy)}>
            <SelectTrigger className="w-[9.5rem]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent align="end">
              <SelectItem value="total">By Total</SelectItem>
              <SelectItem value="average">By Average</SelectItem>
            </SelectContent>
          </Select>

          <Button
            variant="outline"
            onClick={() => setSortDir((d) => (d === "desc" ? "asc" : "desc"))}
            title={sortDir === "desc" ? "High → Low" : "Low → High"}
            className="min-w-[8.5rem] justify-start"
          >
            <ArrowUpDown className="mr-2 size-4" />
            {sortDir === "desc" ? "High → Low" : "Low → High"}
          </Button>

          <a href="/admin/students/new">
            <Button className="w-full xs:w-auto">+ New Student</Button>
          </a>
        </div>
      </div>

      {/* Summary */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between text-sm">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="outline" className="font-normal">
            Showing <b className="mx-1 tabular-nums">{countShown}</b> of
            <b className="mx-1 tabular-nums">{totalCount}</b> students
          </Badge>
          {countShown > 0 && (
            <>
              <Badge variant="outline" className="font-normal">
                Points:
                <b className="mx-1 tabular-nums">{sumTotals}</b> /
                <b className="mx-1 tabular-nums">{countShown * MAX_TOTAL}</b>
              </Badge>
              <Badge variant="outline" className="font-normal">
                Avg (shown): <b className="mx-1 tabular-nums">{avgShown}</b>
              </Badge>
            </>
          )}
          <span className="text-muted-foreground">
            • sorted by <b className="uppercase">{sortBy}</b> (
            {sortDir === "desc" ? "high → low" : "low → high"})
          </span>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => window.print()}>
            <Printer className="mr-2 size-4" /> Print
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-md border overflow-x-auto">
        <Table>
          <TableHeader className="sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <TableRow>
              <TableHead className="whitespace-nowrap">Roll</TableHead>
              <TableHead className="whitespace-nowrap">Name</TableHead>
              <TableHead className="hidden md:table-cell whitespace-nowrap">School</TableHead>
              <TableHead className="text-right whitespace-nowrap">
                <button
                  type="button"
                  onClick={() => toggleHeaderSort("total")}
                  className={`inline-flex items-center gap-1 ${sortBy === "total" ? "font-semibold" : ""}`}
                  title="Sort by Total"
                >
                  Total <ArrowUpDown className="size-3.5" />
                </button>
              </TableHead>
              <TableHead className="text-right whitespace-nowrap">
                <button
                  type="button"
                  onClick={() => toggleHeaderSort("average")}
                  className={`inline-flex items-center gap-1 ${sortBy === "average" ? "font-semibold" : ""}`}
                  title="Sort by Average"
                >
                  Average <ArrowUpDown className="size-3.5" />
                </button>
              </TableHead>
              <TableHead className="hidden sm:table-cell text-right whitespace-nowrap">Grade</TableHead>
              <TableHead className="text-right whitespace-nowrap">Status</TableHead>
              <TableHead className="text-right whitespace-nowrap">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={8} className="py-8 text-center text-muted-foreground">
                  <Loader2 className="mx-auto mb-2 size-5 animate-spin" /> Loading…
                </TableCell>
              </TableRow>
            ) : items.length ? (
              items.map((s: Student) => {
                const avg =
                  typeof s.average === "number" ? s.average : (Number(s.total) || 0) / 12;
                return (
                  <TableRow key={s.id} className="hover:bg-muted/40">
                    <TableCell className="font-mono tabular-nums">{s.rollNumber}</TableCell>
                    <TableCell className="font-medium max-w-[220px] truncate">{s.name}</TableCell>
                    <TableCell className="hidden md:table-cell max-w-[240px] truncate">{s.school}</TableCell>
                    <TableCell className="text-right tabular-nums">
                      {s.total}
                      <span className="text-muted-foreground"> / {MAX_TOTAL}</span>
                    </TableCell>
                    <TableCell className="text-right tabular-nums">{avg.toFixed(2)}</TableCell>
                    <TableCell className="hidden sm:table-cell text-right">{s.grade}</TableCell>
                    <TableCell className="text-right">
                      <Badge
                        className={
                          s.status === "PASSED"
                            ? "bg-emerald-600 text-white"
                            : "bg-rose-600 text-white"
                        }
                      >
                        {s.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <a
                          href={`/results/${encodeURIComponent(s.rollNumber)}`}
                          target="_blank"
                          rel="noreferrer"
                          aria-label={`Open public result for ${s.name}`}
                        >
                          <Button variant="outline" size="icon" title="View public result">
                            <ExternalLink className="size-4" />
                          </Button>
                        </a>
                        <a href={`/admin/students/${encodeURIComponent(s.rollNumber)}/edit`}>
                          <Button variant="outline" size="icon" title="Edit">
                            <Edit3 className="size-4" />
                          </Button>
                        </a>
                        <Button
                          variant="destructive"
                          size="icon"
                          title="Delete"
                          aria-label={`Delete ${s.name}`}
                          onClick={async () => {
                            if (!confirm(`Delete ${s.name} (${s.rollNumber})?`)) return;
                            const res = await fetch(`/api/admin/students/${s.id}`, { method: "DELETE" });
                            if (res.ok) mutate();
                            else
                              alert((await res.json().catch(() => ({})))?.error || "Delete failed");
                          }}
                        >
                          <Trash2 className="size-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={8} className="py-10 text-center">
                  <div className="mx-auto max-w-md px-6 text-muted-foreground">
                    <FileX2 className="mx-auto mb-3 size-8" />
                    <p className="text-sm">
                      No students found for the current filters. Try adjusting your search or status.
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
