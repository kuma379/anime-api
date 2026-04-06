import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { search } from "@/lib/api";
import AnimeCard from "@/components/AnimeCard";
import LoadingGrid from "@/components/LoadingGrid";
import { Search } from "lucide-react";

export default function SearchPage() {
  const [location, navigate] = useLocation();
  const params = new URLSearchParams(location.split("?")[1] ?? "");
  const q = params.get("q") ?? "";
  const [input, setInput] = useState(q);

  useEffect(() => { setInput(q); }, [q]);

  const { data, isLoading } = useQuery({
    queryKey: ["search", q],
    queryFn: () => search(q),
    enabled: q.length > 0,
  });

  const results = data?.results ?? [];

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (input.trim()) navigate(`/search?q=${encodeURIComponent(input.trim())}`);
  }

  return (
    <main className="max-w-7xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-black text-white mb-6">🔍 Pencarian</h1>

      <form onSubmit={handleSubmit} className="flex gap-2 mb-8">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Cari anime, film, donghua..."
          className="flex-1 bg-[#1a1a1a] border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder-gray-400 outline-none focus:border-purple-500"
        />
        <button type="submit" className="bg-purple-600 hover:bg-purple-700 text-white px-5 py-2.5 rounded-lg flex items-center gap-2 transition-colors">
          <Search size={16} /> Cari
        </button>
      </form>

      {!q && (
        <p className="text-gray-400 text-center py-20">Masukkan kata kunci untuk mencari anime.</p>
      )}

      {q && isLoading && <LoadingGrid count={12} />}

      {q && !isLoading && results.length === 0 && (
        <p className="text-gray-400 text-center py-20">Tidak ada hasil untuk "<span className="text-white">{q}</span>"</p>
      )}

      {results.length > 0 && (
        <>
          <p className="text-gray-400 text-sm mb-4">{results.length} hasil untuk "<span className="text-white font-medium">{q}</span>"</p>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3">
            {results.map((a: any) => (
              <AnimeCard key={a.id} id={a.id} title={a.title} image={a.image} type={a.type} />
            ))}
          </div>
        </>
      )}
    </main>
  );
}
