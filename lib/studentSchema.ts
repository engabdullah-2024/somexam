import { z } from "zod";

export const SubjectKeys = [
  "SOMALI","ISLAMIC","ARABIC","ENGLISH","HISTORY","GEOGRAPHY",
  "MATH","PHYSICS","BIOLOGY","CHEMISTRY","TECHNOLOGY","BUSINESS",
] as const;

const score = z.number().int().min(0).max(100);

export const CreateStudentSchema = z.object({
  name: z.string().min(1),
  mothersName: z.string().min(1),
  rollNumber: z.string().min(1),
  school: z.string().min(1),
  placeOfExam: z.string().min(1),
  scores: z.object(Object.fromEntries(SubjectKeys.map(k => [k, score])) as Record<string, any>)
});

export type CreateStudentInput = z.infer<typeof CreateStudentSchema>;
