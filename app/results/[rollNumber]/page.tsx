// app/results/[rollNumber]/page.tsx
import { prisma } from "@/lib/db";
import { ResultCard } from "../../components/ResultCard";

export const runtime = "nodejs"; // keep Prisma on Node runtime

export default async function ResultPage({
  params,
}: { params: { rollNumber: string } }) {
  const roll = decodeURIComponent(params.rollNumber);

  const student = await prisma.student.findUnique({
    where: { rollNumber: roll },
    include: { scores: true },
  });

  if (!student) {
    return <main className="p-6"><p>Result not found.</p></main>;
  }

  return (
    <main className="mx-auto max-w-3xl p-6">
      <ResultCard s={student} />
    </main>
  );
}
