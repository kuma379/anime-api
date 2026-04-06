export default function LoadingGrid({ count = 12 }: { count?: number }) {
  return (
    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="bg-[#1a1a1a] rounded-lg overflow-hidden animate-pulse">
          <div className="aspect-[2/3] bg-[#2a2a2a]" />
          <div className="p-2 space-y-1">
            <div className="h-2 bg-[#2a2a2a] rounded w-full" />
            <div className="h-2 bg-[#2a2a2a] rounded w-2/3" />
          </div>
        </div>
      ))}
    </div>
  );
}
