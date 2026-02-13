import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import museumService from "../services/museumService";

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
      } catch (e) {
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
      <nav className="bg-white shadow-sm border-b border-[#2c3e54]/10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between h-16 items-center">
          <h1 className="text-xl font-bold text-[#2c3e54]">Kies een museum</h1>
          <Link to="/" className="text-sm text-[#2c3e54] hover:underline">
            Terug naar dashboard
          </Link>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="mb-4">
          <input
            type="text"
            placeholder="Zoek een museum..."
            className="w-full p-2 rounded border border-[#2c3e54]/20"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {loading && <p className="text-[#2c3e54]/70">Laden...</p>}
        {error && <p className="text-red-600 text-sm mb-4">{error}</p>}
        {!loading && filteredMuseums.length === 0 && (
          <p className="text-[#2c3e54]/70">Geen musea gevonden.</p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredMuseums.map((museum) => (
            <div
              key={museum.museumId}
              className="bg-white rounded-lg shadow p-4 flex flex-col justify-between"
            >
              <div>
                <h2 className="text-lg font-semibold text-[#2c3e54]">{museum.name}</h2>
                <p className="text-sm text-[#2c3e54]/70 mb-1">{museum.address}</p>
                {museum.description && (
                  <p className="text-sm text-[#2c3e54]/80 mb-2">{museum.description}</p>
                )}
                <p className="text-xs uppercase tracking-wide text-[#2c3e54]/50">
                  Routes: {museum.routes?.length ?? 0}
                </p>
              </div>

              <div className="mt-4 space-y-2">
                {museum.routes && museum.routes.length > 0 ? (
                  museum.routes.map((route) => (
                    <Link
                      key={route.routeId}
                      to={`/quest/museums/${museum.museumId}/routes/${route.routeId}/start`}
                      className="block w-full text-left px-3 py-2 rounded-md border border-cyan-900 text-cyan-950 text-sm font-medium hover:bg-cyan-900 hover:text-white transition-colors"
                    >
                      {route.name}
                    </Link>
                  ))
                ) : (
                  <p className="text-sm text-gray-500">
                    Geen routes beschikbaar voor dit museum.
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default MuseumsList;