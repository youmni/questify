import React, { useEffect, useState, useMemo } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import museumService from "../services/museumService";
import paintingService from "../services/paintingService";
import progressService from "../services/progressService";

const RouteDetail = () => {
  const { museumId, routeId } = useParams();
  const navigate = useNavigate();
  const [route, setRoute] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [hintsByPainting, setHintsByPainting] = useState({});
  const [progress, setProgress] = useState(null);
  const [restarting, setRestarting] = useState(false);

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const [routeRes, progressRes] = await Promise.all([
        museumService.getRouteDetails(museumId, routeId),
        progressService.getForRoute(routeId),
      ]);

      setRoute(routeRes.data || null);
      setProgress(progressRes.data || null);
    } catch {
      setError("Kon route details niet laden");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (museumId && routeId) {
      load();
    }
  }, [museumId, routeId]);

  const sortedStops = useMemo(() => {
    if (!route?.stops) return [];
    return [...route.stops].sort((a, b) => (a.sequenceNumber || 0) - (b.sequenceNumber || 0));
  }, [route]);

  useEffect(() => {
    const loadHints = async () => {
      if (!route?.stops) return;

      const uniquePaintingIds = Array.from(
        new Set(route.stops.map((s) => s.paintingId).filter((id) => id != null))
      );

      if (uniquePaintingIds.length === 0) return;

      try {
        const entries = await Promise.all(
          uniquePaintingIds.map(async (id) => {
            try {
              const res = await paintingService.getDetails(id);
              return [id, res.data];
            } catch {
              return [id, null];
            }
          })
        );

        const map = entries
          .filter(([_, detail]) => detail)
          .reduce((acc, [id, detail]) => {
            acc[id] = detail;
            return acc;
          }, {});

        setHintsByPainting(map);
      } catch {
        // Hints zijn optioneel
      }
    };

    loadHints();
  }, [route]);

  const handleRestart = async () => {
    if (!window.confirm("Weet je zeker dat je de route opnieuw wilt starten? Je voortgang wordt gewist.")) return;
    setRestarting(true);
    try {
      await progressService.restartRoute(routeId);
      await load();
      navigate(`/quest/museums/${museumId}/routes/${routeId}/stops/1`);
    } catch {
      setError("Route herstarten mislukt. Probeer het opnieuw.");
    } finally {
      setRestarting(false);
    }
  };

  const progressPct =
    progress && progress.totalStops
      ? Math.min(100, (progress.completedStops / progress.totalStops) * 100)
      : 0;

  // === COMPLETION SCREEN ===
  if (progress?.isCompleted) {
    return (
      <div className="min-h-screen bg-[#1c2e45] text-[#f4f0e8] flex flex-col">
        <div className="h-1 bg-gradient-to-r from-[#c4952c] via-[#e8b84b] to-[#c4952c]" />

        <main className="flex-1 flex flex-col items-center justify-center px-4 py-12">
          <div className="w-full max-w-2xl">
            {/* Trophy */}
            <div className="flex flex-col items-center mb-8 text-center">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#c4952c] to-[#e8b84b] flex items-center justify-center mb-4 shadow-2xl shadow-[#c4952c]/30 text-5xl">
                🏆
              </div>
              <p className="text-[#c4952c] text-xs font-bold uppercase tracking-widest mb-2">
                Route voltooid!
              </p>
              <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#f4f0e8] mb-2">
                Gefeliciteerd!
              </h1>
              <p className="text-[#8a9ab0] text-sm max-w-sm">
                Je hebt alle {progress.totalStops} schilderijen gevonden op de route{" "}
                <span className="text-[#e8b84b] font-semibold">{route?.name}</span>.
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3 mb-6">
              <div className="bg-[#243a54] rounded-2xl border border-[#2c4a6a] p-4 text-center">
                <p className="font-serif text-2xl font-bold text-[#e8b84b]">{progress.totalStops}</p>
                <p className="text-xs text-[#6a7a90] mt-0.5">Schilderijen</p>
              </div>
              <div className="bg-[#243a54] rounded-2xl border border-[#2c4a6a] p-4 text-center">
                <p className="font-serif text-2xl font-bold text-[#e8b84b]">100%</p>
                <p className="text-xs text-[#6a7a90] mt-0.5">Voltooid</p>
              </div>
              <div className="bg-[#243a54] rounded-2xl border border-[#2c4a6a] p-4 text-center">
                <p className="font-serif text-2xl font-bold text-[#e8b84b]">✓</p>
                <p className="text-xs text-[#6a7a90] mt-0.5">Klaar</p>
              </div>
            </div>

            {/* Completed stops overview */}
            <div className="bg-[#243a54] rounded-2xl border border-[#2c4a6a] p-5 mb-6">
              <p className="text-xs font-bold uppercase tracking-widest text-[#8a9ab0] mb-4">
                Gevonden schilderijen
              </p>
              <div className="space-y-2">
                {sortedStops.map((stop) => {
                  const detail = hintsByPainting[stop.paintingId];
                  const title = detail?.title || `Stop ${stop.sequenceNumber}`;
                  const artist = detail?.artist || "";
                  return (
                    <div key={stop.routeStopId} className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-full bg-[#c4952c] flex items-center justify-center shrink-0">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#1c2e45" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M20 6 9 17l-5-5"/>
                        </svg>
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-[#e8b84b] truncate">{title}</p>
                        {artist && <p className="text-xs text-[#6a7a90] truncate">{artist}</p>}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex flex-col gap-3">
              <Link
                to="/"
                className="w-full flex items-center justify-center gap-2 bg-[#c4952c] hover:bg-[#d4a53c] text-[#1c2e45] font-bold py-4 rounded-xl transition-all shadow-lg text-center"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                  <polyline points="9 22 9 12 15 12 15 22"/>
                </svg>
                Terug naar home
              </Link>
              <button
                type="button"
                onClick={handleRestart}
                disabled={restarting}
                className="w-full flex items-center justify-center gap-2 bg-transparent border border-[#2c4a6a] hover:border-[#c4952c]/50 text-[#8a9ab0] hover:text-[#f4f0e8] font-semibold py-3.5 rounded-xl transition-all text-sm disabled:opacity-50"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
                  <path d="M3 3v5h5"/>
                </svg>
                {restarting ? "Route wordt herstart..." : "Route opnieuw starten"}
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // === NORMAL PROGRESS VIEW ===
  return (
    <div className="min-h-screen bg-[#1c2e45] text-[#f4f0e8]">
      <div className="h-1 bg-gradient-to-r from-[#c4952c] via-[#e8b84b] to-[#c4952c]" />

      {/* Header */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-5 pb-6">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="flex items-center gap-1.5 text-[#8a9ab0] hover:text-[#f4f0e8] text-sm transition-colors mb-6"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 5l-7 7 7 7"/>
          </svg>
          Terug
        </button>

        <div className="text-center mb-6">
          <p className="text-[#c4952c] text-xs font-bold uppercase tracking-widest mb-1">
            {route?.name || "Route"}
          </p>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#f4f0e8]">
            Voortgang
          </h1>
          {progress && (
            <p className="text-[#8a9ab0] text-sm mt-1">
              {progress.completedStops} van {progress.totalStops} schilderijen gevonden
            </p>
          )}
        </div>

        {/* Progress bar */}
        {progress && (
          <div className="mb-2">
            <div className="h-2 rounded-full bg-[#243a54] overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#c4952c] to-[#e8b84b] rounded-full transition-all duration-700"
                style={{ width: `${progressPct}%` }}
              />
            </div>
            <div className="flex justify-between mt-1 text-[11px] text-[#6a7a90]">
              <span>Start</span>
              <span>{Math.round(progressPct)}%</span>
              <span>Einde</span>
            </div>
          </div>
        )}
      </div>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 pb-12">
        {loading && (
          <div className="flex items-center justify-center py-16 text-[#8a9ab0] text-sm">
            Laden...
          </div>
        )}
        {error && (
          <div className="bg-red-900/30 border border-red-500/30 text-red-300 rounded-2xl px-5 py-4 text-sm">
            {error}
          </div>
        )}

        {/* Stops */}
        {sortedStops.length > 0 && (
          <div className="space-y-3">
            {sortedStops.map((stop) => {
              const detail = hintsByPainting[stop.paintingId];
              const isCompleted = progress?.completedPaintingIds?.includes(stop.paintingId);
              const title = detail?.title || `Stop ${stop.sequenceNumber}`;
              const subtitle = detail?.artist || "";

              return (
                <article
                  key={stop.routeStopId}
                  className={`rounded-2xl border px-4 sm:px-5 py-4 flex items-center justify-between gap-4 transition-all ${
                    isCompleted
                      ? "bg-[#c4952c]/10 border-[#c4952c]/30"
                      : "bg-[#243a54] border-[#2c4a6a]"
                  }`}
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-full font-bold text-sm shrink-0 ${
                        isCompleted
                          ? "bg-[#c4952c] text-[#1c2e45]"
                          : "bg-[#1c2e45] border border-[#2c4a6a] text-[#8a9ab0]"
                      }`}
                    >
                      {isCompleted ? (
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M20 6 9 17l-5-5"/>
                        </svg>
                      ) : (
                        stop.sequenceNumber
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className={`text-sm sm:text-base font-semibold truncate ${isCompleted ? "text-[#e8b84b]" : "text-[#f4f0e8]"}`}>
                        {title}
                      </p>
                      <p className="text-xs truncate text-[#6a7a90]">
                        {subtitle || (isCompleted ? "Gevonden" : "Nog te vinden")}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      navigate(`/quest/museums/${museumId}/routes/${routeId}/stops/${stop.sequenceNumber}`)
                    }
                    className={`shrink-0 flex items-center justify-center w-9 h-9 rounded-full border font-bold transition-colors ${
                      isCompleted
                        ? "border-[#c4952c]/40 text-[#c4952c] hover:bg-[#c4952c]/10"
                        : "border-[#2c4a6a] text-[#c4952c] hover:bg-[#1c2e45]"
                    }`}
                    aria-label="Ga naar stop"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12h14M12 5l7 7-7 7"/>
                    </svg>
                  </button>
                </article>
              );
            })}
          </div>
        )}

        {!loading && !error && route && sortedStops.length === 0 && (
          <p className="text-center py-12 text-[#6a7a90] text-sm">
            Deze route heeft nog geen stops.
          </p>
        )}

        {/* Restart button (only shown when progress exists and not completed) */}
        {progress && !progress.isCompleted && progress.completedStops > 0 && (
          <div className="mt-8 pt-6 border-t border-[#243a54]">
            <button
              type="button"
              onClick={handleRestart}
              disabled={restarting}
              className="w-full flex items-center justify-center gap-2 bg-transparent border border-[#2c4a6a] hover:border-[#c4952c]/50 text-[#6a7a90] hover:text-[#f4f0e8] text-sm font-semibold py-3 rounded-xl transition-all disabled:opacity-50"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
                <path d="M3 3v5h5"/>
              </svg>
              {restarting ? "Route wordt herstart..." : "Route opnieuw starten"}
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

export default RouteDetail;
