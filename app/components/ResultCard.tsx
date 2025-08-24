import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function ResultCard({ s }: { s: any }) {
  const passed = String(s.status).toUpperCase() === "PASSED";
  const pct = typeof s.percentage === "number" ? s.percentage.toFixed(2) : s.percentage;

  return (
    <Card className={`shadow-lg border-l-4 ${passed ? "border-green-500" : "border-red-500"}`}>
      <CardContent className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">{s.name}</h2>
          <Badge
            className={`${passed ? "bg-green-600 hover:bg-green-600" : "bg-red-600 hover:bg-red-600"} text-white`}
          >
            {s.status}
          </Badge>
        </div>

        <div className="grid grid-cols-2 gap-2 text-sm">
          <div><b>Roll:</b> {s.rollNumber}</div>
          <div><b>Mother:</b> {s.mothersName}</div>
          <div><b>School:</b> {s.school}</div>
          <div><b>Place:</b> {s.placeOfExam}</div>
        </div>

        <div className="grid grid-cols-3 gap-2 text-sm">
          <div><b>Total</b>: {s.total}</div>
          <div><b>%</b>: {pct}%</div>
          <div><b>Grade</b>: {s.grade}</div>
        </div>

        <div className="mt-2">
          <div className="text-sm font-medium mb-1">Subject Scores</div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-sm">
            {s.scores.map((r: any) => {
              const fail = typeof r.score === "number" ? r.score < 50 : false;
              return (
                <div key={r.id ?? `${r.subject}`} className="flex justify-between border rounded px-2 py-1">
                  <span>{r.subject}</span>
                  <span className={fail ? "text-red-600 font-medium" : ""}>{r.score}</span>
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
