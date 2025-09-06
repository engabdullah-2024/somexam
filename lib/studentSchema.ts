import { z } from "zod";

export const SubjectKeys = [
  "SOMALI","ISLAMIC","ARABIC","ENGLISH","HISTORY","GEOGRAPHY",
  "MATH","PHYSICS","BIOLOGY","CHEMISTRY","TECHNOLOGY","BUSINESS", 
] as const;

export type Subject = typeof SubjectKeys[number];

const score = z.number().int().min(0).max(100);

// strongly type the scores object using z.record + z.enum
export const UpsertStudentSchema = z.object({
  name: z.string().min(1),
  mothersName: z.string().min(1),
  rollNumber: z.string().min(1),
  school: z.string().min(1),
  placeOfExam: z.string().min(1),
  scores: z.record(z.enum(SubjectKeys), score),
});

export type UpsertStudentInput = z.infer<typeof UpsertStudentSchema>;
