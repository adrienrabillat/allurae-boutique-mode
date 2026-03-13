import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { PrintButton } from "@/components/admin/print-button";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function OrderLabelPage({ params }: PageProps) {
  const { id } = await params;

  const order = await db.order.findUnique({
    where: { id },
  });

  if (!order) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-200 flex items-center justify-center p-8 print:bg-white print:p-0">
      <div className="bg-white w-[800px] h-[1131px] shadow-2xl print:shadow-none flex flex-col items-center justify-center border border-gray-300 print:border-none relative">
        <div className="absolute top-4 right-4 print:hidden">
          <PrintButton />
        </div>
        <div className="text-center opacity-50">
          <div className="border-[4px] border-black p-8 inline-block mb-4">
            <h1 className="text-4xl font-bold uppercase tracking-widest text-black">BOXTAL</h1>
          </div>
          <p className="text-xl font-mono block">Format PDF d'étiquette Boxtal factice</p>
          <p className="text-sm text-gray-500 mt-2">Remplacez ceci par le vrai rendu de l'API Boxtal de prod.</p>
        </div>
      </div>
    </div>
  );
}
