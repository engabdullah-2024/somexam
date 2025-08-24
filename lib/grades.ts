// src/lib/grades.ts
export type LetterGrade =
  | "A+" | "A" | "A-"
  | "B+" | "B" | "B-"
  | "C+" | "C" | "C-"
  | "D"
  | "F";

export function gradeFromPct(p: number): LetterGrade {
  const x = Math.max(0, Math.min(100, p)); // clamp 0–100

  if (x >= 95) return "A+";
  if (x >= 90) return "A";
  if (x >= 85) return "A-";

  if (x >= 80) return "B+";
  if (x >= 75) return "B";
  if (x >= 70) return "B-";

  if (x >= 65) return "C+";
  if (x >= 60) return "C";
  if (x >= 55) return "C-";

  if (x >= 50) return "D";
  return "F";
}

export function passedFromPct(p: number) {
  // Per your scale, F is < 50, so passing is ≥ 50
  return p >= 50 ? "PASSED" : "FAILED";
}
