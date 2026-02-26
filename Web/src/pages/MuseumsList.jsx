import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import museumService from "../services/museumService";

const SearchIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
  </svg>
);

const MapPinIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>
  </svg>
);

const RouteIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="6" cy="19" r="3"/><path d="M9 19h8.5a3.5 3.5 0 0 0 0-7h-11a3.5 3.5 0 0 1 0-7H15"/><circle cx="18" cy="5" r="3"/>
  </svg>
);

const MuseumsList = () => {
  const [museums, setMuseums] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await museumService.getAll();
        setMuseums(res.data || []);
      } catch {
        setError("Kon musea niet laden");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const filteredMuseums = museums.filter((museum) =>
    museum.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#f4f0e8] text-[#1c2e45]">
      {/* Header */}
      <div className="bg-[#1c2e45] text-[#f4f0e8]">
        <div className="h-1 bg-gradient-to-r from-[#c4952c] via-[#e8b84b] to-[#c4952c]" />
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#c4952c] flex items-center justify-center">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1c2e45" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/>
                  <circle cx="12" cy="12" r="3"/>
                </svg>
              </div>
              <span className="font-serif text-xl font-bold text-[#f4f0e8]">Questify</span>
            </div>
            <Link to="/dashboard" className="text-sm text-[#c4952c] hover:text-[#e8b84b] transition-colors font-medium">
              Mijn profiel
            </Link>
          </div>

          <h1 className="font-serif text-3xl font-bold mb-1 text-[#f4f0e8]">Kies een museum</h1>
          <p className="text-[#8a9ab0] text-sm">Selecteer een museum en start je speurtocht</p>

          {/* Search */}
          <div className="mt-5 relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6a7a90]">
              <SearchIcon />
            </div>
            <input
              type="text"
              placeholder="Zoek een museum..."
              className="w-full pl-11 pr-4 py-3 rounded-xl bg-[#243a54] border border-[#2c4a6a] text-[#f4f0e8] placeholder-[#6a7a90] focus:outline-none focus:border-[#c4952c] transition-colors text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading && (
          <div className="flex items-center justify-center py-16">
            <div className="text-[#1c2e45]/40 text-sm">Musea worden geladen...</div>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-100 text-red-700 rounded-xl px-4 py-3 text-sm mb-6">{error}</div>
        )}

        {!loading && filteredMuseums.length === 0 && !error && (
          <div className="text-center py-16 text-[#1c2e45]/40">
            <p className="text-base">Geen musea gevonden.</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredMuseums.map((museum) => {
            const activeRoutes = museum.routes?.filter((r) => r.active) || [];
            return (
              <div
                key={museum.museumId}
                className="bg-[#fdf9f2] rounded-2xl border border-[#e5ddcf] shadow-sm overflow-hidden hover:shadow-md transition-shadow"
              >
                {/* Card header */}
                <div className="bg-[#1c2e45] px-5 py-4 flex items-start justify-between gap-3">
                  <div>
                    <h2 className="text-base font-serif font-semibold text-[#f4f0e8] leading-tight">
                      {museum.name}
                    </h2>
                    {museum.address && (
                      <div className="flex items-center gap-1.5 mt-1 text-[#8a9ab0] text-xs">
                        <MapPinIcon />
                        <span>{museum.address}</span>
                      </div>
                    )}
                  </div>
                  <div className="shrink-0 flex items-center gap-1.5 bg-[#c4952c]/20 text-[#c4952c] rounded-full px-2.5 py-1 text-xs font-semibold">
                    <RouteIcon />
                    <span>{activeRoutes.length} {activeRoutes.length === 1 ? "route" : "routes"}</span>
                  </div>
                </div>

                {/* Card body */}
                <div className="px-5 py-4">
                  {museum.description && (
                    <p className="text-sm text-[#4a5060] leading-relaxed mb-4">{museum.description}</p>
                  )}

                  {activeRoutes.length > 0 ? (
                    <div className="space-y-2">
                      {activeRoutes.map((route) => (
                        <Link
                          key={route.routeId}
                          to={`/quest/museums/${museum.museumId}/routes/${route.routeId}/start`}
                          className="flex items-center justify-between w-full px-4 py-2.5 rounded-xl bg-[#1c2e45] text-[#f4f0e8] text-sm font-medium hover:bg-[#243a54] transition-colors group"
                        >
                          <span>{route.name}</span>
                          <svg className="w-4 h-4 text-[#c4952c] group-hover:translate-x-0.5 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M5 12h14M12 5l7 7-7 7"/>
                          </svg>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-[#1c2e45]/40 italic">Geen actieve routes beschikbaar.</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
};

export default MuseumsList;
