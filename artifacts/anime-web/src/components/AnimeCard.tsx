import { Link } from "wouter";
import { Play } from "lucide-react";

interface AnimeCardProps {
  id: string;
  title: string;
  image: string;
  type?: string;
  rating?: string;
  episode?: string;
  status?: string;
  detailType?: "anime" | "film" | "series" | "donghua";
}

export default function AnimeCard({ id, title, image, type, rating, episode, status, detailType }: AnimeCardProps) {
  const resolvedType = detailType || (type?.toLowerCase() === "film" ? "film" : type?.toLowerCase() === "series" ? "series" : "anime");
  const href = `/detail/${resolvedType}/${id}`;

  return (
    <Link href={href}>
      <div className="group relative bg-[#1a1a1a] rounded-lg overflow-hidden cursor-pointer transition-transform hover:scale-105 hover:shadow-xl hover:shadow-purple-900/30">
        {/* Poster */}
        <div className="relative aspect-[2/3] overflow-hidden">
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
            loading="lazy"
            onError={(e) => {
              (e.target as HTMLImageElement).src = "https://placehold.co/150x223/1a1a1a/444?text=No+Image";
            }}
          />
          {/* Overlay on hover */}
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <div className="bg-purple-600 rounded-full p-3">
              <Play size={20} fill="white" className="text-white" />
            </div>
          </div>
          {/* Type badge */}
          {type && (
            <div className="absolute top-2 left-2 bg-purple-600/90 text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase">
              {type}
            </div>
          )}
          {/* Rating */}
          {rating && (
            <div className="absolute top-2 right-2 bg-black/70 text-yellow-400 text-[10px] font-bold px-2 py-0.5 rounded flex items-center gap-0.5">
              ★ {rating}
            </div>
          )}
          {/* Episode */}
          {episode && (
            <div className="absolute bottom-2 right-2 bg-black/70 text-white text-[10px] px-2 py-0.5 rounded">
              {episode}
            </div>
          )}
        </div>
        {/* Title */}
        <div className="p-2">
          <p className="text-xs text-white font-medium line-clamp-2 leading-tight">{title}</p>
          {status && <p className="text-[10px] text-gray-400 mt-0.5">{status}</p>}
        </div>
      </div>
    </Link>
  );
}
