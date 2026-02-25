import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import museumService from "../services/museumService";
import paintingService from "../services/paintingService";
import verificationService from "../services/verificationService";
import progressService from "../services/progressService";
import QuestNav from "../components/QuestNav";

const CameraIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/>
    <circle cx="12" cy="13" r="3"/>
  </svg>
);

const CheckIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 6 9 17l-5-5"/>
  </svg>
);

const LightbulbIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"/>
    <path d="M9 18h6"/><path d="M10 22h4"/>
  </svg>
);

const StopScan = () => {
  const { museumId, routeId, stopNumber } = useParams();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [route, setRoute] = useState(null);
  const [stop, setStop] = useState(null);
  const [paintingDetail, setPaintingDetail] = useState(null);
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);
  const [resultMessage, setResultMessage] = useState("");
  const [isMatch, setIsMatch] = useState(null);
  const [verifiedPainting, setVerifiedPainting] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError("");
      setResultMessage("");
      setIsMatch(null);
      setVerifiedPainting(null);
      setSelectedFile(null);
      setPreviewUrl(null);

      try {
        try {
          await progressService.startOrResumeRoute(routeId);
        } catch {
          // no-op
        }

        const [routeRes, progressRes] = await Promise.all([
          museumService.getRouteDetails(museumId, routeId),
          progressService.getForRoute(routeId),
        ]);

        const routeData = routeRes.data;
        setProgress(progressRes.data || null);
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
            // no-op
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

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const allHints = useMemo(() => {
    if (!paintingDetail) return [];
    const standard = (paintingDetail.standardHints || []).map((h) => h.text);
    const extra = (paintingDetail.extraHints || []).map((h) => h.text);
    return [...standard, ...extra].filter(Boolean);
  }, [paintingDetail]);

  const [visibleHintCount, setVisibleHintCount] = useState(1);

  useEffect(() => {
    setVisibleHintCount(allHints.length === 0 ? 0 : 1);
  }, [allHints]);

  const totalStops = useMemo(() => {
    if (!route) return 0;
    if (typeof route.totalStops === "number") return route.totalStops;
    return route.stops ? route.stops.length : 0;
  }, [route]);

  const completedPaintingIds = useMemo(() => {
    return new Set(progress?.completedPaintingIds || []);
  }, [progress]);

  const isAlreadyFound = Boolean(stop?.paintingId && completedPaintingIds.has(stop.paintingId));

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setSelectedFile(file);
    setResultMessage("");
    setIsMatch(null);
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stop?.paintingId) return;
    if (!selectedFile) {
      setResultMessage("Kies eerst een foto om te scannen.");
      setIsMatch(false);
      return;
    }

    setResultMessage("");
    setIsMatch(null);
    setUploading(true);

    try {
      const res = await verificationService.verifyPainting(routeId, stop.paintingId, selectedFile);
      const data = res.data || {};

      setIsMatch(Boolean(data.isMatch));
      setResultMessage(
        data.message ||
          (data.isMatch ? "Scan geslaagd! Goed gedaan." : "Scan mislukt. Probeer het nog eens.")
      );

      if (data.paintingDetails) {
        setVerifiedPainting(data.paintingDetails);
      }

      try {
        const updated = await progressService.getForRoute(routeId);
        setProgress(updated.data || null);
      } catch {
        // no-op
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
    navigate(`/quest/museums/${museumId}/routes/${routeId}/stops/${nextNumber}`);
  };

  const goToPreviousStop = () => {
    if (!stop) return;
    const prevNumber = (stop.sequenceNumber || 0) - 1;
    if (prevNumber < 1) return;
    navigate(`/quest/museums/${museumId}/routes/${routeId}/stops/${prevNumber}`);
  };

  const stopQuest = () => {
    navigate(`/quest/museums/${museumId}/routes/${routeId}`);
  };

  const isLastStop = stop && totalStops && stop.sequenceNumber >= totalStops;
  const isFirstStop = stop && stop.sequenceNumber <= 1;
  const activePainting = verifiedPainting || paintingDetail;

  return (
    <div className="min-h-screen bg-[#f4f1e9] text-[#2c3e54] flex flex-col">
      <div className="max-w-2xl mx-auto w-full px-4 pt-5 pb-10">
        <QuestNav museumId={museumId} routeId={routeId} />

        <div className="flex items-center justify-between mb-5">
          <Link
            to={`/quest/museums/${museumId}/routes/${routeId}`}
            className="flex items-center gap-1.5 text-[#2c3e54]/70 hover:text-[#2c3e54] text-sm font-semibold"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 5l-7 7 7 7" />
            </svg>
            Terug naar route
          </Link>
          <button
            type="button"
            onClick={stopQuest}
            className="rounded-xl border border-[#2c3e54]/20 bg-white px-3 py-2 text-xs font-bold text-[#2c3e54] hover:border-[#2c3e54]/40"
          >
            Speurtocht stoppen
          </button>
        </div>

        {loading && (
          <div className="bg-white border border-[#2c3e54]/10 rounded-2xl px-5 py-12 text-center text-sm text-[#2c3e54]/70">
            Stop wordt geladen...
          </div>
        )}

        {!loading && error && (
          <div className="bg-red-50 border border-red-100 text-red-600 rounded-2xl px-5 py-4 text-sm">
            {error}
          </div>
        )}

        {!loading && !error && stop && (
          <>
            <div className="bg-white border border-[#2c3e54]/10 rounded-2xl p-5 shadow-[0_10px_40px_rgba(44,62,84,0.05)] mb-4">
              <p className="text-xs font-bold uppercase tracking-widest text-[#2c3e54]/60 mb-1">
                Stop {stop.sequenceNumber} van {totalStops}
              </p>
              <h1 className="text-2xl font-bold text-[#2c3e54]">{route?.name}</h1>
              <p className="text-sm text-[#2c3e54]/60 mt-1">
                {progress?.completedStops || 0} van {progress?.totalStops || totalStops} gevonden
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-4">
              <button
                type="button"
                disabled={isFirstStop}
                onClick={goToPreviousStop}
                className="rounded-xl border border-[#2c3e54]/20 bg-white px-4 py-3 text-sm font-bold text-[#2c3e54] disabled:opacity-40 disabled:cursor-not-allowed"
              >
                ← Vorige stop
              </button>
              <button
                type="button"
                disabled={isLastStop}
                onClick={goToNextStop}
                className="rounded-xl border border-[#2c3e54]/20 bg-white px-4 py-3 text-sm font-bold text-[#2c3e54] disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Volgende stop →
              </button>
            </div>

            {(isMatch || isAlreadyFound) && (
              <div className="bg-white border border-[#2c3e54]/10 rounded-2xl overflow-hidden shadow-[0_10px_40px_rgba(44,62,84,0.05)] mb-4">
                <div className="px-5 py-4 border-b border-[#2c3e54]/10 bg-[#f4f1e9]">
                  <div className="flex items-center gap-2 text-[#2c3e54] font-bold">
                    <div className="w-8 h-8 rounded-full bg-[#2c3e54] text-[#f4f1e9] flex items-center justify-center">
                      <CheckIcon />
                    </div>
                    {isAlreadyFound && !isMatch ? "Al gevonden" : "Gevonden"}
                  </div>
                  <p className="text-sm text-[#2c3e54]/70 mt-2">
                    {resultMessage || "Dit schilderij is correct geïdentificeerd."}
                  </p>
                </div>

                {activePainting && (
                  <div className="px-5 py-4 space-y-2">
                    <h2 className="text-lg font-bold text-[#2c3e54]">{activePainting.title}</h2>
                    {(activePainting.artist || activePainting.year) && (
                      <p className="text-sm text-[#2c3e54]/70">
                        {[activePainting.artist, activePainting.year].filter(Boolean).join(" • ")}
                      </p>
                    )}
                    {activePainting.infoText && (
                      <p className="text-sm leading-relaxed text-[#2c3e54]/80">{activePainting.infoText}</p>
                    )}
                  </div>
                )}
              </div>
            )}

            {!isMatch && !isAlreadyFound && (
              <div className="space-y-4">
                <div className="bg-white border border-[#2c3e54]/10 rounded-2xl p-5 shadow-[0_10px_40px_rgba(44,62,84,0.05)]">
                  <div className="flex items-center gap-2 mb-3 text-[#2c3e54]">
                    <LightbulbIcon />
                    <p className="text-xs font-bold uppercase tracking-widest">
                      Hint {visibleHintCount > 1 ? `${visibleHintCount} van ${allHints.length}` : ""}
                    </p>
                  </div>

                  {allHints.length > 0 ? (
                    <div className="space-y-2">
                      {allHints.slice(0, visibleHintCount).map((text, index) => (
                        <p key={index} className="text-sm leading-relaxed text-[#2c3e54]/80">
                          {text}
                        </p>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm leading-relaxed text-[#2c3e54]/60">
                      De hint voor deze stop is nog niet beschikbaar. Kijk goed rond in de zaal.
                    </p>
                  )}

                  {visibleHintCount < allHints.length && (
                    <button
                      type="button"
                      onClick={() => setVisibleHintCount((count) => Math.min(count + 1, allHints.length))}
                      className="mt-3 rounded-full border border-[#2c3e54]/20 px-3 py-1 text-xs font-bold text-[#2c3e54] hover:border-[#2c3e54]/40"
                    >
                      Extra hint tonen
                    </button>
                  )}
                </div>

                <div className="bg-white border border-[#2c3e54]/10 rounded-2xl p-5 shadow-[0_10px_40px_rgba(44,62,84,0.05)]">
                  <p className="text-xs font-bold uppercase tracking-widest text-[#2c3e54]/60 mb-4">Scan het schilderij</p>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full rounded-xl border-2 border-dashed border-[#2c3e54]/20 hover:border-[#2c3e54]/40 overflow-hidden group"
                    >
                      {previewUrl ? (
                        <div className="relative">
                          <img
                            src={previewUrl}
                            alt="Geselecteerde foto"
                            className="w-full h-52 object-cover"
                          />
                          <div className="absolute inset-0 bg-[#2c3e54]/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-[#f4f1e9] text-sm font-semibold">
                            Andere foto kiezen
                          </div>
                        </div>
                      ) : (
                        <div className="py-10 flex flex-col items-center gap-3">
                          <div className="w-14 h-14 rounded-full bg-[#f4f1e9] border border-[#2c3e54]/20 flex items-center justify-center text-[#2c3e54]">
                            <CameraIcon />
                          </div>
                          <div className="text-center">
                            <p className="text-sm font-semibold text-[#2c3e54]">Foto maken of kiezen</p>
                            <p className="text-xs text-[#2c3e54]/60 mt-0.5">Zorg dat het schilderij goed in beeld is</p>
                          </div>
                        </div>
                      )}
                    </button>

                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      capture="environment"
                      onChange={handleFileChange}
                      className="hidden"
                    />

                    {resultMessage && isMatch === false && (
                      <div className="bg-red-50 border border-red-100 text-red-600 rounded-xl px-4 py-3 text-sm">
                        {resultMessage}
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={uploading || !selectedFile}
                      className="w-full bg-[#2c3e54] hover:bg-[#233247] text-[#f4f1e9] font-bold py-3.5 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {uploading ? "Foto wordt gecontroleerd..." : "Scan schilderij"}
                    </button>
                  </form>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default StopScan;
