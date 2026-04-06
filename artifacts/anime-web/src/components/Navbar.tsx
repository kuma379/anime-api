import { useState } from "react";
import { useLocation, Link } from "wouter";
import { Search, Menu, X, Film, Tv, Play } from "lucide-react";

export default function Navbar() {
  const [location, navigate] = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [query, setQuery] = useState("");

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
      setMenuOpen(false);
    }
  }

  const navLinks = [
    { href: "/", label: "Beranda" },
    { href: "/anime", label: "Anime", icon: <Tv size={15} /> },
    { href: "/film", label: "Film", icon: <Film size={15} /> },
    { href: "/donghua", label: "Donghua", icon: <Play size={15} /> },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-[#111111]/95 backdrop-blur border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-14 gap-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <span className="text-xl font-black tracking-tight text-purple-400">NONTON</span>
          <span className="text-xl font-black tracking-tight text-white">ANIME</span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                location === l.href
                  ? "bg-purple-600 text-white"
                  : "text-gray-300 hover:text-white hover:bg-white/10"
              }`}
            >
              {l.icon}
              {l.label}
            </Link>
          ))}
        </div>

        {/* Search */}
        <form onSubmit={handleSearch} className="hidden md:flex items-center bg-white/10 rounded-lg overflow-hidden flex-1 max-w-xs">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cari anime..."
            className="flex-1 bg-transparent px-3 py-1.5 text-sm text-white placeholder-gray-400 outline-none"
          />
          <button type="submit" className="px-3 py-1.5 text-gray-400 hover:text-white">
            <Search size={16} />
          </button>
        </form>

        {/* Mobile menu button */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden text-gray-300 hover:text-white"
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-[#111111] border-t border-white/10 px-4 py-3 flex flex-col gap-2">
          <form onSubmit={handleSearch} className="flex items-center bg-white/10 rounded-lg overflow-hidden mb-2">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Cari anime..."
              className="flex-1 bg-transparent px-3 py-2 text-sm text-white placeholder-gray-400 outline-none"
            />
            <button type="submit" className="px-3 py-2 text-gray-400">
              <Search size={16} />
            </button>
          </form>
          {navLinks.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setMenuOpen(false)}
              className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium ${
                location === l.href ? "bg-purple-600 text-white" : "text-gray-300"
              }`}
            >
              {l.icon}{l.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}
