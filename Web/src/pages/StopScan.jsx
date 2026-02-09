import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import museumService from "../services/museumService";
import paintingService from "../services/paintingService";
import verificationService from "../services/verificationService";
import progressService from "../services/progressService";

const StopScan = () => {
  const { museumId, routeId, stopNumber } = useParams();
  const navigate = useNavigate();

  const [route, setRoute] = useState(null);
  const [stop, setStop] = useState(null);
  const [paintingDetail, setPaintingDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);
  const [resultMessage, setResultMessage] = useState("");
  const [isMatch, setIsMatch] = useState(null);
  const [verifiedPainting, setVerifiedPainting] = useState(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError("");
      setResultMessage("");
      setIsMatch(null);
      setVerifiedPainting(null);

      try {
        // Ensure route progress exists for this route (best effort)
        try {
          await progressService.startOrResumeRoute(routeId);
        } catch {
          // Progress is helpful but not required for scanning
        }

        const res = await museumService.getRouteDetails(museumId, routeId);
        const routeData = res.data;
        const number = parseInt(stopNumber, 10);

        const foundStop = (routeData.stops || []).find(
          (s) => s.sequenceNumber === number
        );

        if (!foundStop) {
          setError("Deze stop kon niet worden gevonden in deze route.");
          setRoute(routeData);
          return;
        }

        setRoute(routeData);
        setStop(foundStop);

        if (foundStop.paintingId) {
          try {
            const detailRes = await paintingService.getDetails(foundStop.paintingId);
            setPaintingDetail(detailRes.data);
          } catch {
            // Hints and extra info are optional
          }
        }
      } catch {
        setError("Kon deze stop niet laden.");
      } finally {
        setLoading(false);
      }
    };

    if (museumId && routeId && stopNumber) {
      load();
    }
  }, [museumId, routeId, stopNumber]);

  const allHints = useMemo(() => {
    if (!paintingDetail) return [];

    const standard = (paintingDetail.standardHints || []).map((h) => h.text);
    const extra = (paintingDetail.extraHints || []).map((h) => h.text);

    return [...standard, ...extra].filter(Boolean);
  }, [paintingDetail]);

  const [visibleHintCount, setVisibleHintCount] = useState(1);

  useEffect(() => {
    // Reset shown hints when painting changes
    if (allHints.length === 0) {
      setVisibleHintCount(0);
    } else {
      setVisibleHintCount(1);
    }
  }, [allHints]);

  const totalStops = useMemo(() => {
    if (!route) return 0;
    if (typeof route.totalStops === "number") return route.totalStops;
    return route.stops ? route.stops.length : 0;
  }, [route]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stop?.paintingId) return;

    const fileInput = e.target.elements.image;
    const file = fileInput?.files?.[0];

    setResultMessage("");
    setIsMatch(null);

    if (!file) {
      setResultMessage("Kies eerst een foto om te scannen.");
      setIsMatch(false);
      return;
    }

    setUploading(true);
    try {
      const res = await verificationService.verifyPainting(
        routeId,
        stop.paintingId,
        file
      );
      const data = res.data || {};

      setIsMatch(Boolean(data.isMatch));
      setResultMessage(
        data.message ||
          (data.isMatch
            ? "Scan geslaagd! Goed gedaan."
            : "Scan mislukt. Probeer het nog eens.")
      );

      if (data.paintingDetails) {
        setVerifiedPainting(data.paintingDetails);
      }
    } catch {
      setIsMatch(false);
      setResultMessage("Er ging iets mis bij het scannen. Probeer het later opnieuw.");
    } finally {
      setUploading(false);
    }
  };

  const goToNextStop = () => {
    if (!stop || !totalStops) return;
    const nextNumber = (stop.sequenceNumber || 0) + 1;
    if (nextNumber > totalStops) return;

    navigate(
      `/quest/museums/${museumId}/routes/${routeId}/stops/${nextNumber}`
    );
  };

  const isLastStop = stop && totalStops && stop.sequenceNumber >= totalStops;

  return (
    <div className="min-h-screen bg-[#f8f4ec] text-[#2c3e54] flex flex-col">
      <header className="py-8 text-center">
        {!loading && !error && isMatch && (
          <>
            <h1 className="text-3xl font-serif font-semibold mb-1">Gevonden!</h1>
            <p className="text-sm text-[#6d6a64]">
              Je hebt het schilderij correct geïdentificeerd
            </p>
          </>
        )}

        {(!isMatch || loading || error) && (
          <>
            <h1 className="text-3xl font-serif font-semibold mb-1">
              Stop {stop?.sequenceNumber || stopNumber}
            </h1>
            {totalStops > 0 && (
              <p className="text-xs text-[#6d6a64]">
                Stop {stop?.sequenceNumber || stopNumber} van {totalStops} in {route?.name}
              </p>
            )}
          </>
        )}
      </header>

      <main className="flex-1 flex items-start justify-center px-4 pb-10">
        <div className="w-full max-w-2xl bg-[#fdfaf4] rounded-2xl border border-[#e5ddcf] shadow-[0_18px_45px_rgba(0,0,0,0.06)] px-6 sm:px-10 py-8">
          {loading && (
            <p className="text-sm text-[#6d6a64]">Stop wordt geladen...</p>
          )}

          {!loading && error && (
            <p className="text-sm text-red-600 mb-2">{error}</p>
          )}

          {!loading && !error && stop && (
            <>
              {/* Image placeholder */}
              <div className="mb-8">
                <div className="w-full h-64 sm:h-72 bg-[#ebe5d9] rounded-xl flex items-center justify-center text-xs text-[#a89e8b]">
                  Afbeelding placeholder
                </div>
              </div>

              {/* Painting info after a successful match */}
              {isMatch && verifiedPainting && (
                <div className="space-y-4">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-serif font-semibold text-[#1f3554]">
                      {verifiedPainting.title}
                    </h2>
                    <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-[#6d6a64]">
                      {verifiedPainting.artist && (
                        <span className="flex items-center gap-1">
                          <span>👤</span>
                          <span>{verifiedPainting.artist}</span>
                        </span>
                      )}
                      {verifiedPainting.year && (
                        <span className="flex items-center gap-1">
                          <span>📅</span>
                          <span>{verifiedPainting.year}</span>
                        </span>
                      )}
                    </div>
                  </div>

                  {verifiedPainting.infoText && (
                    <p className="text-sm leading-relaxed text-[#4b4944]">
                      {verifiedPainting.infoText}
                    </p>
                  )}

                  {verifiedPainting.infoTitle && (
                    <div className="mt-4 rounded-lg border border-[#f0e0b5] bg-[#fdf3d8] px-4 py-3 text-xs text-[#6d5a32]">
                      <p className="font-semibold mb-1">{verifiedPainting.infoTitle}</p>
                      {verifiedPainting.extraHints?.[0]?.text && (
                        <p>{verifiedPainting.extraHints[0].text}</p>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Hint and scan form when not matched yet */}
              {!isMatch && (
                <div className="space-y-6">
                  <div className="bg-[#f5efe0] border border-[#e3d6bf] rounded-xl p-4">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-[#9b8a63] mb-2">
                      Hint
                    </p>
                    {allHints.length > 0 ? (
                      <div className="space-y-1">
                        {allHints.slice(0, visibleHintCount).map((text, index) => (
                          <p
                            key={index}
                            className="text-sm leading-relaxed text-[#4b4944]"
                          >
                            {text}
                          </p>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm leading-relaxed text-[#4b4944]">
                        De hint voor deze stop is nog niet beschikbaar. Kijk goed rond in de zaal!
                      </p>
                    )}

                    {visibleHintCount < allHints.length && (
                      <button
                        type="button"
                        onClick={() =>
                          setVisibleHintCount((count) =>
                            Math.min(count + 1, allHints.length)
                          )
                        }
                        className="mt-3 inline-flex items-center rounded-full border border-[#d4c6a7] px-3 py-1 text-[11px] font-medium text-[#6d5a32] hover:bg-[#f0e4cd]"
                      >
                        Extra hint
                      </button>
                    )}
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label
                        htmlFor="image"
                        className="block text-xs font-medium text-[#4b4944] mb-1"
                      >
                        Maak of kies een foto
                      </label>
                      <input
                        id="image"
                        name="image"
                        type="file"
                        accept="image/*"
                        capture="environment"
                        className="block w-full text-xs text-[#4b4944] file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-[#1f3554] file:text-[#fdfaf4] hover:file:bg-[#172740] cursor-pointer"
                      />
                      <p className="mt-1 text-[11px] text-[#8a8579]">
                        Zorg dat het schilderij goed in beeld is en dat het niet
                        te donker is.
                      </p>
                    </div>

                    {resultMessage && !isMatch && (
                      <div className="text-xs rounded-xl px-3 py-2 bg-[#fceaea] border border-[#f1c7c7] text-[#8a3a3a]">
                        {resultMessage}
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={uploading}
                      className="w-full inline-flex justify-center items-center rounded-full bg-[#1f3554] px-5 py-2.5 text-sm font-semibold text-[#fdfaf4] shadow-sm hover:bg-[#172740] disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
                    >
                      {uploading ? "Foto wordt gecontroleerd..." : "Scan schilderij"}
                    </button>
                  </form>
                </div>
              )}

              {/* Bottom primary action like the screenshot */}
              {isMatch && (
                <div className="mt-8">
                  <button
                    type="button"
                    onClick={isLastStop ? () => navigate(`/quest/museums/${museumId}/routes/${routeId}`) : goToNextStop}
                    className="w-full inline-flex justify-center items-center rounded-md bg-[#1f3554] px-6 py-3 text-sm font-semibold text-[#fdfaf4] hover:bg-[#172740] transition-colors"
                  >
                    {isLastStop ? "Terug naar routeoverzicht" : "Ga verder"}
                  </button>
                </div>
              )}

              {/* Navigation links under the card */}
              <div className="mt-6 flex justify-between text-xs text-[#8a8579]">
                <Link
                  to={`/quest/museums/${museumId}/routes/${routeId}`}
                  className="hover:underline"
                >
                  ← Terug naar route
                </Link>
                <Link to="/quest/museums" className="hover:underline">
                  Alle musea
                </Link>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default StopScan;
