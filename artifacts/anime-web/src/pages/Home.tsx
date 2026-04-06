import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { ChevronRight, TrendingUp, Clock, Star } from "lucide-react";
import { getHome } from "@/lib/api";
import AnimeCard from "@/components/AnimeCard";
import LoadingGrid from "@/components/LoadingGrid";

function Section({ title, icon, href, children }: { title: string; icon?: React.ReactNode; href?: string; children: React.ReactNode }) {
  return (
    <section className="mb-10">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          {icon && <span className="text-purple-400">{icon}</span>}
          <h2 className="text-lg font-bold text-white">{title}</h2>
        </div>
        {href && (
          <Link href={href} className="flex items-center gap-1 text-sm text-purple-400 hover:text-purple-300">
            Lihat semua <ChevronRight size={15} />
          </Link>
        )}
      </div>
      {children}
    </section>
  );
}

export default function Home() {
  const { data, isLoading, error } = useQuery({ queryKey: ["home"], queryFn: getHome });

  if (error) return (
    <div className="max-w-7xl mx-auto px-4 py-20 text-center">
      <p className="text-red-400 text-lg">Gagal memuat data. Coba refresh halaman.</p>
    </div>
  );

  const top10 = data?.data?.top10_anime ?? [];
  const ongoing = data?.data?.ongoing_anime ?? [];
  const latest = data?.data?.latest_anime ?? [];
  const recent = data?.data?.recent_release ?? [];

  const heroItems = (recent?.length ? recent : top10).slice(0, 5);

  return (
    <main className="max-w-7xl mx-auto px-4 py-6">
      {/* Hero banner */}
      {heroItems.length > 0 && (
        <section className="mb-10">
          <div className="relative rounded-2xl overflow-hidden h-64 md:h-80 bg-gradient-to-r from-purple-900 to-indigo-900">
            <img
              src={heroItems[0]?.image}
              alt={heroItems[0]?.title}
              className="absolute inset-0 w-full h-full object-cover opacity-40"
              onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-transparent" />
            <div className="absolute bottom-0 left-0 p-6 md:p-8">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs bg-purple-600 px-2 py-0.5 rounded text-white uppercase font-bold">
                  {heroItems[0]?.type || "Anime"}
                </span>
                {heroItems[0]?.rating && (
                  <span className="text-xs text-yellow-400">★ {heroItems[0].rating}</span>
                )}
              </div>
              <h1 className="text-2xl md:text-4xl font-black text-white leading-tight max-w-lg mb-3">
                {heroItems[0]?.title}
              </h1>
              <Link
                href={`/detail/${heroItems[0]?.type?.toLowerCase() === "film" ? "film" : "anime"}/${heroItems[0]?.id}`}
                className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-5 py-2.5 rounded-lg font-semibold text-sm transition-colors"
              >
                ▶ Tonton Sekarang
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Category cards */}
      <div className="grid grid-cols-3 gap-3 mb-10">
        {[
          { href: "/anime", label: "Anime", color: "from-purple-700 to-purple-900", emoji: "🎌" },
          { href: "/film", label: "Film", color: "from-blue-700 to-blue-900", emoji: "🎬" },
          { href: "/donghua", label: "Donghua", color: "from-red-700 to-red-900", emoji: "🐉" },
        ].map((c) => (
          <Link key={c.href} href={c.href}>
            <div className={`bg-gradient-to-br ${c.color} rounded-xl p-4 text-center cursor-pointer hover:scale-105 transition-transform`}>
              <div className="text-3xl mb-1">{c.emoji}</div>
              <div className="text-sm font-bold text-white">{c.label}</div>
            </div>
          </Link>
        ))}
      </div>

      {/* Top 10 */}
      {isLoading ? (
        <Section title="Top 10 Anime" icon={<TrendingUp size={18} />}>
          <LoadingGrid count={6} />
        </Section>
      ) : top10.length > 0 && (
        <Section title="Top 10 Anime" icon={<TrendingUp size={18} />} href="/anime">
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
            {top10.slice(0, 10).map((a: any, i: number) => (
              <div key={a.id} className="relative">
                <div className="absolute -top-2 -left-2 z-10 w-7 h-7 bg-purple-600 rounded-full flex items-center justify-center text-white text-xs font-black shadow">
                  {i + 1}
                </div>
                <AnimeCard id={a.id} title={a.title} image={a.image} type={a.type} rating={a.rating} />
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* Ongoing */}
      {isLoading ? (
        <Section title="Ongoing" icon={<Clock size={18} />}>
          <LoadingGrid count={6} />
        </Section>
      ) : ongoing.length > 0 && (
        <Section title="Sedang Tayang" icon={<Clock size={18} />} href="/anime">
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3">
            {ongoing.slice(0, 12).map((a: any) => (
              <AnimeCard key={a.id} id={a.id} title={a.title} image={a.image} type={a.type} episode={a.episode} />
            ))}
          </div>
        </Section>
      )}

      {/* Latest */}
      {isLoading ? (
        <Section title="Terbaru" icon={<Star size={18} />}>
          <LoadingGrid count={6} />
        </Section>
      ) : latest.length > 0 && (
        <Section title="Rilis Terbaru" icon={<Star size={18} />} href="/anime">
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3">
            {latest.slice(0, 12).map((a: any) => (
              <AnimeCard key={a.id} id={a.id} title={a.title} image={a.image} type={a.type} episode={a.episode} />
            ))}
          </div>
        </Section>
      )}
    </main>
  );
}
