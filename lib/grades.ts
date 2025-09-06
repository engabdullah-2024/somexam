// src/lib/grades.ts
export type LetterGrade =
  | "A+" | "A" | "A-"
  | "B+" | "B" | "B-"
  | "C+" | "C" | "C-"
  | "D+" | "D" | "D-"
  | "E";

export function gradeFromPct(p: number): LetterGrade {
  const x = Math.max(0, Math.min(100, p)); // clamp 0–100

  if (x >= 95) return "A+";
  if (x >= 90) return "A";
  if (x >= 80) return "A-";

  if (x >= 75) return "B+";
  if (x >= 70) return "B";
  if (x >= 65) return "B-";

  if (x >= 60) return "C+";
  if (x >= 55) return "C";
  if (x >= 50) return "C-";

  if (x >= 45) return "D+";
  if (x >= 40) return "D";
  if (x >= 35) return "D-";

  return "E";
}

/**
 * Pass rule:
 * - "Write anything below D+ as failed."
 *   ⇒ D+ (≥ 45%) and up = PASSED; below 45% = FAILED.
 */
export function passedFromPct(p: number) {
  return p >= 45 ? "PASSED" : "FAILED";
}
