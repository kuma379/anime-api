import { useState, useEffect } from "react";
import { useRoute, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { getEpisode, getServer } from "@/lib/api";
import { ChevronLeft, ChevronRight, Loader2, Play, Download } from "lucide-react";

interface Stream {
  resolution: string;
  server: string;
  data: { post: string; nume: string; type: string };
}

export default function WatchPage() {
  const [, params] = useRoute("/watch/:slug");
  const slug = params?.slug ?? "";

  const [selectedStream, setSelectedStream] = useState<Stream | null>(null);
  const [embedUrl, setEmbedUrl] = useState<string | null>(null);
  const [loadingEmbed, setLoadingEmbed] = useState(false);
  const [embedError, setEmbedError] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ["episode", slug],
    queryFn: () => getEpisode(slug),
    enabled: !!slug,
  });

  const episode = data?.data ?? null;
  const streams: Stream[] = episode?.streams ?? [];
  const downloads = episode?.downloads ?? [];
  const title = episode?.title ?? slug.replace(/-/g, " ");
  const prevEp = episode?.prev_episode ?? episode?.prev ?? null;
  const nextEp = episode?.next_episode ?? episode?.next ?? null;
  const animeSlug = episode?.anime_slug ?? null;
  const animeTitle = episode?.anime_title ?? "";

  // Auto-select first stream
  useEffect(() => {
    if (streams.length > 0 && !selectedStream) {
      setSelectedStream(streams[0]);
    }
  }, [streams]);

  // Load embed URL when stream changes
  useEffect(() => {
    if (!selectedStream) return;
    const { post, nume, type } = selectedStream.data;
    if (!post) return;

    setLoadingEmbed(true);
    setEmbedUrl(null);
    setEmbedError(false);

    getServer(post, nume, type)
      .then((res) => {
        const url = res?.embed_url ?? res?.data?.embed_url ?? null;
        if (url) {
          setEmbedUrl(url);
        } else {
          // Try to extract from html
          const html = res?.html ?? res?.data?.html ?? "";
          const match = html.match(/src="([^"]+)"/);
          if (match?.[1]) setEmbedUrl(match[1]);
          else setEmbedError(true);
        }
      })
      .catch(() => setEmbedError(true))
      .finally(() => setLoadingEmbed(false));
  }, [selectedStream]);

  if (isLoading) {
    return (
      <main className="max-w-5xl mx-auto px-4 py-10 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="animate-spin text-purple-400 mx-auto mb-3" size={40} />
          <p className="text-gray-400">Memuat episode...</p>
        </div>
      </main>
    );
  }

  if (!episode) {
    return (
      <main className="max-w-5xl mx-auto px-4 py-10 text-center">
        <p className="text-red-400 text-lg">Episode tidak ditemukan.</p>
        <Link href="/" className="text-purple-400 hover:underline text-sm mt-3 inline-block">← Kembali ke Beranda</Link>
      </main>
    );
  }

  return (
    <main className="max-w-5xl mx-auto px-4 py-4">
      {/* Breadcrumb */}
      {(animeSlug || animeTitle) && (
        <div className="flex items-center gap-2 text-sm text-gray-400 mb-3">
          <Link href="/" className="hover:text-white">Beranda</Link>
          <span>/</span>
          {animeSlug ? (
            <Link href={`/detail/anime/${animeSlug}`} className="hover:text-white truncate max-w-xs">
              {animeTitle || animeSlug}
            </Link>
          ) : (
            <span>{animeTitle}</span>
          )}
          <span>/</span>
          <span className="text-white truncate max-w-xs">{title}</span>
        </div>
      )}

      {/* Video Player */}
      <div className="relative bg-black rounded-xl overflow-hidden mb-4" style={{ aspectRatio: "16/9" }}>
        {loadingEmbed && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-black/90">
            <Loader2 className="animate-spin text-purple-400 mb-3" size={44} />
            <p className="text-gray-300 text-sm">Memuat stream dari {selectedStream?.server}...</p>
          </div>
        )}

        {!loadingEmbed && embedUrl && (
          <iframe
            key={embedUrl}
            src={embedUrl}
            className="w-full h-full"
            allowFullScreen
            allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
            frameBorder="0"
            title={title}
            sandbox="allow-scripts allow-same-origin allow-presentation allow-forms allow-popups"
          />
        )}

        {!loadingEmbed && !embedUrl && !embedError && streams.length === 0 && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
            <Play size={50} className="text-purple-500 opacity-60" />
            <p className="text-gray-400 text-sm">Pilih server streaming di bawah</p>
          </div>
        )}

        {!loadingEmbed && embedError && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-black/80">
            <p className="text-red-400 font-medium">Gagal memuat video</p>
            <p className="text-gray-400 text-sm">Coba server lain di bawah</p>
          </div>
        )}
      </div>

      <h1 className="text-base md:text-xl font-bold text-white mb-4 capitalize">
        {title}
      </h1>

      {/* Server Pilihan */}
      {streams.length > 0 && (
        <div className="mb-6 bg-[#1a1a1a] rounded-xl p-4">
          <p className="text-sm font-semibold text-gray-300 mb-3 flex items-center gap-2">
            <Play size={14} className="text-purple-400" /> Pilih Server Streaming
          </p>

          {/* Group by resolution */}
          {(() => {
            const grouped: Record<string, Stream[]> = {};
            for (const s of streams) {
              const key = s.resolution || "Default";
              if (!grouped[key]) grouped[key] = [];
              grouped[key].push(s);
            }
            return Object.entries(grouped).map(([res, grpStreams]) => (
              <div key={res} className="mb-3">
                <p className="text-xs text-gray-500 mb-1.5 uppercase tracking-wide">{res}</p>
                <div className="flex flex-wrap gap-2">
                  {grpStreams.map((s, i) => {
                    const isActive = selectedStream?.data.post === s.data.post && selectedStream?.data.nume === s.data.nume;
                    return (
                      <button
                        key={i}
                        onClick={() => setSelectedStream(s)}
                        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                          isActive
                            ? "bg-purple-600 text-white shadow shadow-purple-900/50"
                            : "bg-white/5 text-gray-300 hover:bg-white/15 hover:text-white border border-white/10"
                        }`}
                      >
                        {s.server}
                      </button>
                    );
                  })}
                </div>
              </div>
            ));
          })()}
        </div>
      )}

      {/* Download Links */}
      {downloads.length > 0 && (
        <div className="mb-6 bg-[#1a1a1a] rounded-xl p-4">
          <p className="text-sm font-semibold text-gray-300 mb-3 flex items-center gap-2">
            <Download size={14} className="text-blue-400" /> Link Download
          </p>
          <div className="space-y-3">
            {downloads.map((dl: any, i: number) => (
              <div key={i}>
                <p className="text-xs text-gray-500 mb-1.5 uppercase tracking-wide">{dl.resolution}</p>
                <div className="flex flex-wrap gap-2">
                  {dl.links?.map((lk: any, j: number) => (
                    <a
                      key={j}
                      href={lk.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 rounded-lg text-sm bg-blue-600/20 text-blue-300 hover:bg-blue-600/40 border border-blue-500/20 transition-colors"
                    >
                      {lk.server}
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Prev / Next Navigation */}
      <div className="flex items-center justify-between gap-3 mt-2">
        {prevEp ? (
          <Link href={`/watch/${typeof prevEp === "string" ? prevEp : prevEp.id ?? prevEp.slug}`}>
            <button className="flex items-center gap-2 bg-[#1a1a1a] hover:bg-purple-600/20 border border-white/10 hover:border-purple-500/40 text-white px-4 py-2.5 rounded-lg text-sm transition-all">
              <ChevronLeft size={16} /> Sebelumnya
            </button>
          </Link>
        ) : <div />}

        {nextEp ? (
          <Link href={`/watch/${typeof nextEp === "string" ? nextEp : nextEp.id ?? nextEp.slug}`}>
            <button className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2.5 rounded-lg text-sm transition-all">
              Selanjutnya <ChevronRight size={16} />
            </button>
          </Link>
        ) : <div />}
      </div>
    </main>
  );
}
