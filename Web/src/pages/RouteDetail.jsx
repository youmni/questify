import React, { useEffect, useState, useMemo } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
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

  useEffect(() => {
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
      } catch (e) {
        setError("Kon route details niet laden");
      } finally {
        setLoading(false);
      }
    };

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
        new Set(
          route.stops
            .map((s) => s.paintingId)
            .filter((id) => id != null)
        )
      );

      if (uniquePaintingIds.length === 0) return;

      try {
        const entries = await Promise.all(
          uniquePaintingIds.map(async (id) => {
            try {
              const res = await paintingService.getDetails(id);
              return [id, res.data];
            } catch (e) {
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
        // Hints are optional; ignore global errors here
      }
    };

    loadHints();
  }, [route]);

  return (
    <div className="min-h-screen bg-[#f8f4ec] text-[#2c3e54]">
      <main className="max-w-3xl mx-auto px-4 pb-12">
        <div className="pt-6 pb-4 flex items-center text-xs text-[#8a8579]">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-1 hover:underline"
          >
            <span>←</span>
            <span>Terug</span>
          </button>
        </div>

        <header className="text-center mb-6">
          <h1 className="text-2xl sm:text-3xl font-serif font-semibold mb-1">
            Voortgang
          </h1>
          <p className="text-xs sm:text-sm text-[#6d6a64]">
            {progress
              ? `${progress.completedStops} van ${progress.totalStops} schilderijen gevonden`
              : "Schilderijen gevonden"}
          </p>
        </header>

        {/* Progress bar */}
        {progress && (
          <div className="mb-6">
            <div className="h-1 rounded-full bg-[#e5ddcf] overflow-hidden">
              <div
                className="h-full bg-[#c4952c] transition-all"
                style={{
                  width: `${
                    progress.totalStops
                      ? Math.min(
                          100,
                          (progress.completedStops / progress.totalStops) * 100
                        )
                      : 0
                  }%`,
                }}
              />
            </div>
          </div>
        )}

        {/* Congrats banner when complete */}
        {progress && progress.isCompleted && (
          <section className="mb-4 rounded-xl border border-[#e8d8b0] bg-[#fbf3de] px-5 py-4 flex items-center gap-3 text-xs sm:text-sm text-[#6d5a32]">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#f1dfb3] text-[#6d5a32]">
              🏆
            </div>
            <div>
              <p className="font-semibold mb-0.5">Gefeliciteerd!</p>
              <p>Je hebt alle schilderijen gevonden!</p>
            </div>
          </section>
        )}

        {loading && <p className="text-sm text-[#6d6a64]">Laden...</p>}
        {error && <p className="text-sm text-red-600">{error}</p>}

        {/* Stops list */}
        {sortedStops.length > 0 && (
          <section className="space-y-3 mt-4">
            {sortedStops.map((stop) => {
              const detail = hintsByPainting[stop.paintingId];
              const isCompleted =
                progress?.completedPaintingIds?.includes(stop.paintingId);

              const title = detail?.title || `Stop ${stop.sequenceNumber}`;
              const subtitle = detail?.artist || "";

              return (
                <article
                  key={stop.routeStopId}
                  className="bg-[#fdfaf4] rounded-xl border border-[#e5ddcf] px-4 sm:px-6 py-4 flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f3e7cf]">
                      <span className={isCompleted ? "text-green-600" : "text-[#c4952c]"}>
                        {isCompleted ? "✔" : stop.sequenceNumber}
                      </span>
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm sm:text-base font-medium text-[#2c3e54] truncate">
                        {title}
                      </p>
                      <p className="text-xs text-[#8a8579] truncate">
                        {subtitle ||
                          (isCompleted
                            ? "Gevonden"
                            : "Nog niet gevonden")}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      navigate(
                        `/quest/museums/${museumId}/routes/${routeId}/stops/${stop.sequenceNumber}`
                      )
                    }
                    className="shrink-0 inline-flex h-8 w-8 items-center justify-center rounded-full border border-[#e5ddcf] text-[#c4952c] text-lg leading-none hover:bg-[#f8f0dd]"
                    aria-label="Ga naar stop"
                  >
                    +
                  </button>
                </article>
              );
            })}
          </section>
        )}

        {!loading && !error && route && sortedStops.length === 0 && (
          <p className="mt-4 text-sm text-[#6d6a64]">
            Deze route heeft nog geen stops met schilderijen.
          </p>
        )}
      </main>
    </div>
  );
};

export default RouteDetail;
