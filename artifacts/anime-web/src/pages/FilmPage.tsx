import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getFilmList } from "@/lib/api";
import AnimeCard from "@/components/AnimeCard";
import LoadingGrid from "@/components/LoadingGrid";

export default function FilmPage() {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useQuery({ queryKey: ["film", page], queryFn: () => getFilmList(page) });
  const films = data?.data ?? data?.results ?? [];

  return (
    <main className="max-w-7xl mx-auto px-4 py-6">
      <div className="flex items-center gap-3 mb-6">
        <span className="text-3xl">🎬</span>
        <h1 className="text-2xl font-black text-white">Film</h1>
      </div>
      <p className="text-gray-400 text-sm mb-6">Koleksi film anime & live action terlengkap</p>

      {isLoading ? <LoadingGrid count={18} /> : (
        <>
          {films.length === 0 ? (
            <p className="text-gray-400 text-center py-20">Tidak ada data.</p>
          ) : (
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3 mb-6">
              {films.map((f: any) => (
                <AnimeCard key={f.id} id={f.id} title={f.title} image={f.image} type={f.type || "Film"} detailType="film" />
              ))}
            </div>
          )}
          <div className="flex items-center justify-center gap-3 mt-6">
            <button disabled={page <= 1} onClick={() => setPage(p => p - 1)} className="px-4 py-2 rounded-lg bg-white/10 text-white disabled:opacity-30 hover:bg-purple-600 transition-colors text-sm">← Prev</button>
            <span className="text-gray-400 text-sm">Hal {page}</span>
            <button disabled={films.length < 10} onClick={() => setPage(p => p + 1)} className="px-4 py-2 rounded-lg bg-white/10 text-white disabled:opacity-30 hover:bg-purple-600 transition-colors text-sm">Next →</button>
          </div>
        </>
      )}
    </main>
  );
}
