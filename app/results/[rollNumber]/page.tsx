// app/results/[rollNumber]/page.tsx
import { prisma } from "@/lib/db";
import { ResultCard } from "../../components/ResultCard";

export const runtime = "nodejs";

export default async function ResultPage({
  params,
}: {
  params: Promise<{ rollNumber: string }>;
}) {
  const { rollNumber } = await params;
  const roll = decodeURIComponent(rollNumber);

  try {
    const student = await prisma.student.findUnique({
      where: { rollNumber: roll },
      include: { scores: true },
    });

    if (!student) {
      return (
        <main className="p-6">
          <p>Result not found.</p>
        </main>
      );
    }

    return (
      <main className="mx-auto max-w-3xl p-6">
        <ResultCard s={student} />
      </main>
    );
  } catch (e) {
    console.error("RESULTS_QUERY_ERROR:", e);
    return (
      <main className="p-6">
        <p className="text-red-600">
          We’re having trouble connecting to the results service. Please try again
          in a minute.
        </p>
      </main>
    );
  }
}
