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
    <div className="min-h-screen bg-[#f4f1e9] text-[#2c3e54]">
      {/* Header */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-8 pb-4">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#2c3e54] flex items-center justify-center shadow-md">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#f4f1e9" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/>
                <circle cx="12" cy="12" r="3"/>
              </svg>
            </div>
            <span className="text-xl font-bold tracking-wider text-[#2c3e54]">QUESTIFY</span>
          </div>
          <Link
            to="/dashboard"
            className="text-sm font-semibold text-[#2c3e54]/70 hover:text-[#2c3e54] transition-colors"
          >
            Mijn profiel
          </Link>
        </div>

        <div className="mb-6">
          <p className="text-xs font-bold uppercase tracking-widest text-[#2c3e54]/60 mb-1">Welkom</p>
          <h1 className="text-3xl font-bold text-[#2c3e54]">Kies een museum</h1>
          <p className="text-sm text-[#2c3e54]/60 mt-1">Selecteer een museum en start je speurtocht</p>
        </div>

        {/* Search */}
        <div className="relative">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#2c3e54]/40">
            <SearchIcon />
          </div>
          <input
            type="text"
            placeholder="Zoek een museum..."
            className="w-full pl-11 pr-4 py-3 rounded-xl bg-white border border-[#2c3e54]/15 text-[#2c3e54] placeholder-[#2c3e54]/35 focus:outline-none focus:border-[#2c3e54]/40 focus:ring-1 focus:ring-[#2c3e54]/10 transition-all text-sm shadow-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 pb-10">
        {loading && (
          <div className="flex items-center justify-center py-16">
            <div className="text-[#2c3e54]/40 text-sm">Musea worden geladen...</div>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-100 text-red-600 rounded-xl px-4 py-3 text-sm mb-6">{error}</div>
        )}

        {!loading && filteredMuseums.length === 0 && !error && (
          <div className="text-center py-16 text-[#2c3e54]/40">
            <p className="text-base">Geen musea gevonden.</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
          {filteredMuseums.map((museum) => {
            const activeRoutes = museum.routes?.filter((r) => r.active) || [];
            return (
              <div
                key={museum.museumId}
                className="bg-white border border-[#2c3e54]/10 rounded-2xl shadow-[0_4px_20px_rgba(44,62,84,0.06)] overflow-hidden"
              >
                {/* Card header */}
                <div className="px-5 pt-5 pb-3 flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h2 className="text-base font-bold text-[#2c3e54] leading-tight truncate">
                      {museum.name}
                    </h2>
                    {museum.address && (
                      <div className="flex items-center gap-1.5 mt-1 text-[#2c3e54]/50 text-xs">
                        <MapPinIcon />
                        <span className="truncate">{museum.address}</span>
                      </div>
                    )}
                  </div>
                  <div className="shrink-0 flex items-center gap-1.5 bg-[#2c3e54]/8 text-[#2c3e54]/70 rounded-full px-2.5 py-1 text-xs font-semibold border border-[#2c3e54]/10">
                    <RouteIcon />
                    <span>{activeRoutes.length} {activeRoutes.length === 1 ? "route" : "routes"}</span>
                  </div>
                </div>

                {/* Divider */}
                <div className="h-px bg-[#2c3e54]/8 mx-5" />

                {/* Card body */}
                <div className="px-5 py-4">
                  {museum.description && (
                    <p className="text-sm text-[#2c3e54]/65 leading-relaxed mb-4">{museum.description}</p>
                  )}

                  {activeRoutes.length > 0 ? (
                    <div className="space-y-2">
                      {activeRoutes.map((route) => (
                        <Link
                          key={route.routeId}
                          to={`/quest/museums/${museum.museumId}/routes/${route.routeId}/start`}
                          className="flex items-center justify-between w-full px-4 py-2.5 rounded-xl bg-[#2c3e54] text-[#f4f1e9] text-sm font-semibold hover:bg-[#233247] transition-colors group"
                        >
                          <span>{route.name}</span>
                          <svg className="w-4 h-4 text-[#f4f1e9]/60 group-hover:translate-x-0.5 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M5 12h14M12 5l7 7-7 7"/>
                          </svg>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-[#2c3e54]/40 italic">Geen actieve routes beschikbaar.</p>
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
