import React, { useEffect, useState, useMemo } from "react";
import { useNavigate, useParams, Link, Navigate } from "react-router-dom";
import museumService from "../services/museumService";
import paintingService from "../services/paintingService";
import progressService from "../services/progressService";
import QuestNav from "../components/QuestNav";

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
        // no-op
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

  if (progress?.isCompleted) {
    return <Navigate to={`/quest/museums/${museumId}/routes/${routeId}/complete`} replace />;
  }

  return (
    <div className="min-h-screen bg-[#f4f1e9] text-[#2c3e54] px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <QuestNav museumId={museumId} routeId={routeId} />

        <div className="mb-5">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex items-center gap-1.5 text-[#2c3e54]/70 hover:text-[#2c3e54] text-sm font-semibold"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 5l-7 7 7 7" />
            </svg>
            Terug
          </button>
        </div>

        <div className="bg-white border border-[#2c3e54]/10 rounded-3xl p-6 sm:p-8 shadow-[0_10px_40px_rgba(44,62,84,0.05)] mb-5">
          <div className="text-center mb-6">
            <p className="text-xs font-bold uppercase tracking-widest text-[#2c3e54]/60 mb-1">{route?.name || "Route"}</p>
            <h1 className="text-3xl font-bold text-[#2c3e54]">Voortgang</h1>
            {progress && (
              <p className="text-sm text-[#2c3e54]/70 mt-1">
                {progress.completedStops} van {progress.totalStops} schilderijen gevonden
              </p>
            )}
          </div>

          {progress && (
            <div>
              <div className="h-2 rounded-full bg-[#f4f1e9] overflow-hidden border border-[#2c3e54]/10">
                <div
                  className="h-full bg-[#2c3e54] rounded-full transition-all duration-700"
                  style={{ width: `${progressPct}%` }}
                />
              </div>
              <div className="flex justify-between mt-1 text-[11px] text-[#2c3e54]/60">
                <span>Start</span>
                <span>{Math.round(progressPct)}%</span>
                <span>Einde</span>
              </div>
            </div>
          )}
        </div>

        {loading && (
          <div className="bg-white border border-[#2c3e54]/10 rounded-2xl px-5 py-10 text-center text-sm text-[#2c3e54]/70">
            Laden...
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-100 text-red-600 rounded-2xl px-5 py-4 text-sm mb-4">
            {error}
          </div>
        )}

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
                      ? "bg-[#f4f1e9] border-[#2c3e54]/20"
                      : "bg-white border-[#2c3e54]/10"
                  }`}
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-full font-bold text-sm shrink-0 ${
                        isCompleted
                          ? "bg-[#2c3e54] text-[#f4f1e9]"
                          : "bg-[#f4f1e9] border border-[#2c3e54]/15 text-[#2c3e54]/70"
                      }`}
                    >
                      {isCompleted ? "✓" : stop.sequenceNumber}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm sm:text-base font-semibold truncate text-[#2c3e54]">{title}</p>
                      <p className="text-xs truncate text-[#2c3e54]/60">
                        {subtitle || (isCompleted ? "Gevonden" : "Nog te vinden")}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      navigate(`/quest/museums/${museumId}/routes/${routeId}/stops/${stop.sequenceNumber}`)
                    }
                    className="shrink-0 flex items-center justify-center w-9 h-9 rounded-full border border-[#2c3e54]/20 text-[#2c3e54] hover:border-[#2c3e54]/40 bg-white"
                    aria-label="Ga naar stop"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </button>
                </article>
              );
            })}
          </div>
        )}

        {!loading && !error && route && sortedStops.length === 0 && (
          <p className="text-center py-12 text-[#2c3e54]/60 text-sm">Deze route heeft nog geen stops.</p>
        )}

        {progress && !progress.isCompleted && progress.completedStops > 0 && (
          <div className="mt-8 pt-6">
            <button
              type="button"
              onClick={handleRestart}
              disabled={restarting}
              className="w-full border border-[#2c3e54]/20 hover:border-[#2c3e54]/40 text-[#2c3e54] text-sm font-semibold py-3 rounded-xl transition-all disabled:opacity-50 bg-white"
            >
              {restarting ? "Route wordt herstart..." : "Route opnieuw starten"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default RouteDetail;
