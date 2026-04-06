import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getDonghuaList } from "@/lib/api";
import AnimeCard from "@/components/AnimeCard";
import LoadingGrid from "@/components/LoadingGrid";

export default function DonghuaPage() {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useQuery({ queryKey: ["donghua", page], queryFn: () => getDonghuaList(page) });
  const donghua = data?.data ?? data?.results ?? [];

  return (
    <main className="max-w-7xl mx-auto px-4 py-6">
      <div className="flex items-center gap-3 mb-6">
        <span className="text-3xl">🐉</span>
        <h1 className="text-2xl font-black text-white">Donghua</h1>
      </div>
      <p className="text-gray-400 text-sm mb-6">Anime China / Donghua terlengkap</p>

      {isLoading ? <LoadingGrid count={18} /> : (
        <>
          {donghua.length === 0 ? (
            <p className="text-gray-400 text-center py-20">Tidak ada data.</p>
          ) : (
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3 mb-6">
              {donghua.map((d: any) => (
                <AnimeCard key={d.id} id={d.id} title={d.title} image={d.image} type={d.type || "Donghua"} detailType="anime" />
              ))}
            </div>
          )}
          <div className="flex items-center justify-center gap-3 mt-6">
            <button disabled={page <= 1} onClick={() => setPage(p => p - 1)} className="px-4 py-2 rounded-lg bg-white/10 text-white disabled:opacity-30 hover:bg-purple-600 transition-colors text-sm">← Prev</button>
            <span className="text-gray-400 text-sm">Hal {page}</span>
            <button disabled={donghua.length < 10} onClick={() => setPage(p => p + 1)} className="px-4 py-2 rounded-lg bg-white/10 text-white disabled:opacity-30 hover:bg-purple-600 transition-colors text-sm">Next →</button>
          </div>
        </>
      )}
    </main>
  );
}
