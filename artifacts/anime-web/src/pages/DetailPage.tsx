import { useRoute, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { getAnimeDetail, getFilmDetail, getSeriesDetail } from "@/lib/api";
import { Play, Star, Calendar, Tag, Film, Loader2 } from "lucide-react";
import AnimeCard from "@/components/AnimeCard";

export default function DetailPage() {
  const [, params] = useRoute("/detail/:type/:slug");
  const type = params?.type ?? "anime";
  const slug = params?.slug ?? "";

  const fetchFn =
    type === "film"
      ? () => getFilmDetail(slug)
      : type === "series"
      ? () => getSeriesDetail(slug)
      : () => getAnimeDetail(slug);

  const { data, isLoading } = useQuery({
    queryKey: ["detail", type, slug],
    queryFn: fetchFn,
    enabled: !!slug,
  });

  if (isLoading) {
    return (
      <main className="max-w-7xl mx-auto px-4 py-16 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="animate-spin text-purple-400 mx-auto mb-3" size={40} />
          <p className="text-gray-400">Memuat detail...</p>
        </div>
      </main>
    );
  }

  if (!data) {
    return (
      <main className="max-w-7xl mx-auto px-4 py-16 text-center">
        <p className="text-red-400">Gagal memuat. Coba lagi nanti.</p>
      </main>
    );
  }

  const detail = data?.data ?? data;

  // Anime detail: episodes have { title, id, link }
  // id is the episode slug (e.g. "my-gift-episode-8")
  const episodes: Array<{ title: string; id: string; link?: string }> =
    detail?.episodes ?? [];

  const title = detail?.title ?? slug.replace(/-/g, " ");
  const image = detail?.image ?? detail?.poster ?? "";
  const synopsis = detail?.synopsis ?? detail?.description ?? "";
  const info = detail?.info ?? {};
  const rating = info?.rating ?? detail?.rating ?? "";
  const status = info?.status ?? detail?.status ?? "";
  const genres: Array<{ name: string; url?: string }> =
    info?.genres ?? detail?.genres ?? [];
  const aired = info?.release_date ?? detail?.aired ?? "";
  const duration = info?.duration ?? detail?.duration ?? "";
  const season = info?.season ?? "";
  const epCount = info?.episodes_count ?? "";
  const recommendations: any[] = detail?.recommendations ?? [];

  const isFilm = type === "film";

  return (
    <main className="max-w-7xl mx-auto px-4 py-6">
      {/* Hero card */}
      <div className="relative rounded-2xl overflow-hidden mb-8 bg-[#1a1a1a]">
        {image && (
          <img
            src={image}
            alt={title}
            className="absolute inset-0 w-full h-full object-cover opacity-15 blur-md scale-105"
            onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
          />
        )}
        <div className="relative flex flex-col md:flex-row gap-6 p-5 md:p-8">
          {/* Poster */}
          {image && (
            <div className="shrink-0 w-32 md:w-44 self-start rounded-xl overflow-hidden shadow-2xl ring-1 ring-white/10">
              <img
                src={image}
                alt={title}
                className="w-full aspect-[2/3] object-cover"
                onError={(e) => { (e.target as HTMLImageElement).src = "https://placehold.co/176x264/1a1a1a/444?text=No+Image"; }}
              />
            </div>
          )}

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start gap-2 mb-1 flex-wrap">
              {isFilm && (
                <span className="text-xs bg-blue-600/80 text-white px-2 py-0.5 rounded font-bold uppercase">Film</span>
              )}
              {type === "series" && (
                <span className="text-xs bg-green-600/80 text-white px-2 py-0.5 rounded font-bold uppercase">Series</span>
              )}
            </div>

            <h1 className="text-2xl md:text-3xl font-black text-white mb-3 leading-tight">{title}</h1>

            {/* Meta row */}
            <div className="flex flex-wrap items-center gap-3 mb-4 text-sm">
              {rating && rating !== "0" && (
                <span className="flex items-center gap-1 text-yellow-400 font-bold">
                  <Star size={14} fill="currentColor" /> {rating}
                </span>
              )}
              {status && status !== "-" && (
                <span className={`text-xs px-2 py-0.5 rounded font-semibold ${
                  status.toLowerCase().includes("air") || status.toLowerCase().includes("ongoing")
                    ? "bg-green-500/20 text-green-400"
                    : "bg-gray-500/20 text-gray-400"
                }`}>
                  {status}
                </span>
              )}
              {season && season !== "-" && (
                <span className="flex items-center gap-1 text-gray-400 text-xs">
                  <Calendar size={12} /> {season}
                </span>
              )}
              {aired && aired !== "-" && (
                <span className="text-gray-400 text-xs">{aired}</span>
              )}
              {duration && duration !== "-" && (
                <span className="text-gray-400 text-xs">{duration}</span>
              )}
              {epCount && epCount !== "-" && (
                <span className="text-gray-400 text-xs">{epCount} episode</span>
              )}
            </div>

            {/* Genres */}
            {genres.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {genres.map((g, i) => {
                  const name = typeof g === "string" ? g : g.name;
                  const genreSlug = name.toLowerCase().replace(/\s+/g, "-");
                  return (
                    <Link key={i} href={`/genre/${genreSlug}`}>
                      <span className="flex items-center gap-1 text-xs px-2.5 py-1 bg-purple-600/20 text-purple-300 rounded-full hover:bg-purple-600/40 transition-colors cursor-pointer border border-purple-500/20">
                        <Tag size={10} /> {name}
                      </span>
                    </Link>
                  );
                })}
              </div>
            )}

            {/* Synopsis */}
            {synopsis && (
              <p className="text-gray-300 text-sm leading-relaxed line-clamp-5 mb-4">{synopsis}</p>
            )}

            {/* Film: single watch button */}
            {isFilm && (
              <Link href={`/watch/${slug}`}>
                <button className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-6 py-2.5 rounded-xl font-semibold text-sm transition-colors shadow-lg shadow-purple-900/40">
                  <Play size={16} fill="white" /> Tonton Film
                </button>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Episodes list (anime / series) */}
      {!isFilm && (
        <div className="mb-10">
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <Film size={18} className="text-purple-400" />
            {episodes.length > 0 ? `Daftar Episode (${episodes.length})` : "Episode"}
          </h2>

          {episodes.length === 0 ? (
            <div className="bg-[#1a1a1a] rounded-xl p-8 text-center">
              <p className="text-gray-400">Belum ada episode tersedia.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2.5">
              {episodes.map((ep) => {
                // ep.id is the watch slug (e.g. "anime-title-episode-8")
                const watchSlug = ep.id;
                const label = ep.title ?? ep.id ?? "";
                return (
                  <Link key={watchSlug} href={`/watch/${watchSlug}`}>
                    <div className="group bg-[#1a1a1a] hover:bg-purple-600/20 border border-white/5 hover:border-purple-500/40 rounded-lg p-3 cursor-pointer transition-all">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-purple-600/20 group-hover:bg-purple-600 flex items-center justify-center transition-colors shrink-0">
                          <Play size={11} className="text-purple-300 group-hover:text-white" fill="currentColor" />
                        </div>
                        <span className="text-xs text-white leading-tight">{label}</span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Recommendations */}
      {recommendations.length > 0 && (
        <div>
          <h2 className="text-lg font-bold text-white mb-4">Rekomendasi</h2>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3">
            {recommendations
              .filter((r, i, arr) => arr.findIndex((x) => x.id === r.id) === i) // deduplicate
              .slice(0, 12)
              .map((r: any) => (
                <AnimeCard
                  key={r.id}
                  id={r.id}
                  title={r.title}
                  image={r.image}
                  type={r.type}
                  detailType={r.type?.toLowerCase() === "film" ? "film" : "anime"}
                />
              ))}
          </div>
        </div>
      )}
    </main>
  );
}
