import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getAnimeList, getOngoing, getCompleted } from "@/lib/api";
import AnimeCard from "@/components/AnimeCard";
import LoadingGrid from "@/components/LoadingGrid";

type Tab = "all" | "ongoing" | "completed";

export default function AnimePage() {
  const [tab, setTab] = useState<Tab>("all");
  const [page, setPage] = useState(1);

  const allQuery = useQuery({ queryKey: ["anime-all", page], queryFn: () => getAnimeList(page), enabled: tab === "all" });
  const ongoingQuery = useQuery({ queryKey: ["anime-ongoing", page], queryFn: () => getOngoing(page), enabled: tab === "ongoing" });
  const completedQuery = useQuery({ queryKey: ["anime-completed", page], queryFn: () => getCompleted(page), enabled: tab === "completed" });

  const activeQuery = tab === "all" ? allQuery : tab === "ongoing" ? ongoingQuery : completedQuery;
  const animeData = activeQuery.data?.data ?? activeQuery.data?.results ?? [];

  function handleTab(t: Tab) { setTab(t); setPage(1); }

  return (
    <main className="max-w-7xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-black text-white">🎌 Anime</h1>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b border-white/10 pb-3">
        {(["all", "ongoing", "completed"] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => handleTab(t)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
              tab === t ? "bg-purple-600 text-white" : "text-gray-400 hover:text-white bg-white/5"
            }`}
          >
            {t === "all" ? "Semua" : t === "ongoing" ? "Ongoing" : "Completed"}
          </button>
        ))}
      </div>

      {activeQuery.isLoading ? <LoadingGrid count={18} /> : (
        <>
          {animeData.length === 0 ? (
            <p className="text-gray-400 text-center py-20">Tidak ada data.</p>
          ) : (
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3 mb-6">
              {animeData.map((a: any) => (
                <AnimeCard key={a.id} id={a.id} title={a.title} image={a.image} type={a.type} episode={a.episode} status={a.status} />
              ))}
            </div>
          )}

          {/* Pagination */}
          <div className="flex items-center justify-center gap-3 mt-6">
            <button
              disabled={page <= 1}
              onClick={() => setPage(p => p - 1)}
              className="px-4 py-2 rounded-lg bg-white/10 text-white disabled:opacity-30 hover:bg-purple-600 transition-colors text-sm"
            >
              ← Prev
            </button>
            <span className="text-gray-400 text-sm">Hal {page}</span>
            <button
              disabled={animeData.length < 10}
              onClick={() => setPage(p => p + 1)}
              className="px-4 py-2 rounded-lg bg-white/10 text-white disabled:opacity-30 hover:bg-purple-600 transition-colors text-sm"
            >
              Next →
            </button>
          </div>
        </>
      )}
    </main>
  );
}
