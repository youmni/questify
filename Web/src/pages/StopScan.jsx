import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import museumService from "../services/museumService";
import paintingService from "../services/paintingService";
import verificationService from "../services/verificationService";
import progressService from "../services/progressService";

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
          // Progress is helpful but not required
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
            // Hints are optional
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
    setVisibleHintCount(allHints.length === 0 ? 0 : 1);
  }, [allHints]);

  const totalStops = useMemo(() => {
    if (!route) return 0;
    if (typeof route.totalStops === "number") return route.totalStops;
    return route.stops ? route.stops.length : 0;
  }, [route]);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
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

  const isLastStop = stop && totalStops && stop.sequenceNumber >= totalStops;

  return (
    <div className="min-h-screen bg-[#1c2e45] text-[#f4f0e8] flex flex-col">
      <div className="h-1 bg-gradient-to-r from-[#c4952c] via-[#e8b84b] to-[#c4952c]" />

      {/* Nav */}
      <div className="max-w-2xl mx-auto w-full px-4 pt-4 flex items-center justify-between">
        <Link
          to={`/quest/museums/${museumId}/routes/${routeId}`}
          className="flex items-center gap-1.5 text-[#8a9ab0] hover:text-[#f4f0e8] text-sm transition-colors"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 5l-7 7 7 7"/>
          </svg>
          Terug naar route
        </Link>
        {totalStops > 0 && stop && (
          <div className="flex items-center gap-1.5">
            {Array.from({ length: totalStops }, (_, i) => (
              <div
                key={i}
                className={`h-1.5 rounded-full transition-all ${
                  i + 1 < stop.sequenceNumber
                    ? "w-4 bg-[#c4952c]"
                    : i + 1 === stop.sequenceNumber
                    ? "w-6 bg-[#e8b84b]"
                    : "w-4 bg-[#2c4a6a]"
                }`}
              />
            ))}
          </div>
        )}
      </div>

      <main className="flex-1 flex flex-col items-center px-4 pb-10 pt-6">
        <div className="w-full max-w-2xl">

          {loading && (
            <div className="flex items-center justify-center py-20 text-[#8a9ab0] text-sm">
              Stop wordt geladen...
            </div>
          )}

          {!loading && error && (
            <div className="bg-red-900/30 border border-red-500/30 text-red-300 rounded-2xl px-5 py-4 text-sm">
              {error}
            </div>
          )}

          {!loading && !error && stop && (
            <>
              {/* Stop header */}
              {!isMatch && (
                <div className="mb-6 text-center">
                  <p className="text-[#c4952c] text-xs font-bold uppercase tracking-widest mb-1">
                    Stop {stop.sequenceNumber} van {totalStops}
                  </p>
                  <h1 className="font-serif text-2xl font-bold text-[#f4f0e8]">{route?.name}</h1>
                </div>
              )}

              {/* SUCCESS STATE */}
              {isMatch && verifiedPainting && (
                <div className="animate-in fade-in duration-500">
                  {/* Success badge */}
                  <div className="flex flex-col items-center mb-6 text-center">
                    <div className="w-16 h-16 rounded-full bg-[#c4952c] flex items-center justify-center mb-3 shadow-lg">
                      <CheckIcon />
                    </div>
                    <h1 className="font-serif text-2xl font-bold text-[#f4f0e8]">Gevonden!</h1>
                    <p className="text-[#8a9ab0] text-sm mt-1">Je hebt het schilderij correct geïdentificeerd</p>
                  </div>

                  {/* Painting info card */}
                  <div className="bg-[#fdf9f2] text-[#1c2e45] rounded-2xl overflow-hidden border border-[#e5ddcf] shadow-xl mb-5">
                    <div className="bg-[#243a54] px-6 py-5">
                      <h2 className="font-serif text-xl font-bold text-[#f4f0e8] mb-1">
                        {verifiedPainting.title}
                      </h2>
                      <div className="flex flex-wrap items-center gap-3 text-xs text-[#8a9ab0]">
                        {verifiedPainting.artist && (
                          <span className="flex items-center gap-1">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="4"/><path d="M6 20v-2a6 6 0 0 1 12 0v2"/></svg>
                            {verifiedPainting.artist}
                          </span>
                        )}
                        {verifiedPainting.year && (
                          <span className="flex items-center gap-1">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>
                            {verifiedPainting.year}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="px-6 py-5 space-y-3">
                      {verifiedPainting.infoText && (
                        <p className="text-sm leading-relaxed text-[#3a4a5a]">
                          {verifiedPainting.infoText}
                        </p>
                      )}
                      {verifiedPainting.infoTitle && (
                        <div className="rounded-xl border border-[#f0e0b5] bg-[#fdf3d8] px-4 py-3 text-xs text-[#6d5a32]">
                          <p className="font-bold mb-1">{verifiedPainting.infoTitle}</p>
                          {verifiedPainting.extraHints?.[0]?.text && (
                            <p>{verifiedPainting.extraHints[0].text}</p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={isLastStop ? () => navigate(`/quest/museums/${museumId}/routes/${routeId}`) : goToNextStop}
                    className="w-full bg-[#c4952c] hover:bg-[#d4a53c] text-[#1c2e45] font-bold py-4 rounded-xl transition-all shadow-lg"
                  >
                    {isLastStop ? "Route voltooien" : "Volgende stop →"}
                  </button>
                </div>
              )}

              {/* SCAN STATE */}
              {!isMatch && (
                <div className="space-y-4">
                  {/* Hint card */}
                  <div className="bg-[#243a54] rounded-2xl border border-[#2c4a6a] p-5">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="text-[#c4952c]"><LightbulbIcon /></div>
                      <p className="text-[11px] font-bold uppercase tracking-widest text-[#c4952c]">
                        Hint {visibleHintCount > 1 ? `${visibleHintCount} van ${allHints.length}` : ""}
                      </p>
                    </div>

                    {allHints.length > 0 ? (
                      <div className="space-y-2">
                        {allHints.slice(0, visibleHintCount).map((text, index) => (
                          <p key={index} className="text-sm leading-relaxed text-[#c8d0dc]">
                            {text}
                          </p>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm leading-relaxed text-[#8a9ab0]">
                        De hint voor deze stop is nog niet beschikbaar. Kijk goed rond in de zaal!
                      </p>
                    )}

                    {visibleHintCount < allHints.length && (
                      <button
                        type="button"
                        onClick={() => setVisibleHintCount((c) => Math.min(c + 1, allHints.length))}
                        className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-[#c4952c]/40 px-3 py-1 text-[11px] font-semibold text-[#c4952c] hover:bg-[#c4952c]/10 transition-colors"
                      >
                        <LightbulbIcon />
                        Extra hint tonen
                      </button>
                    )}
                  </div>

                  {/* Upload card */}
                  <div className="bg-[#243a54] rounded-2xl border border-[#2c4a6a] p-5">
                    <p className="text-xs font-bold uppercase tracking-widest text-[#8a9ab0] mb-4">
                      Scan het schilderij
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-4">
                      {/* Drop zone / preview */}
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="w-full rounded-xl border-2 border-dashed border-[#2c4a6a] hover:border-[#c4952c] transition-colors overflow-hidden group"
                      >
                        {previewUrl ? (
                          <div className="relative">
                            <img
                              src={previewUrl}
                              alt="Geselecteerde foto"
                              className="w-full h-48 object-cover"
                            />
                            <div className="absolute inset-0 bg-[#1c2e45]/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                              <div className="text-[#f4f0e8] text-sm font-semibold flex items-center gap-2">
                                <CameraIcon />
                                Andere foto kiezen
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="py-10 flex flex-col items-center gap-3">
                            <div className="w-14 h-14 rounded-full bg-[#1c2e45] border border-[#2c4a6a] flex items-center justify-center text-[#c4952c] group-hover:border-[#c4952c] transition-colors">
                              <CameraIcon />
                            </div>
                            <div className="text-center">
                              <p className="text-sm font-semibold text-[#f4f0e8]">Foto maken of kiezen</p>
                              <p className="text-xs text-[#6a7a90] mt-0.5">Zorg dat het schilderij goed in beeld is</p>
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
                        <div className="flex items-start gap-3 bg-red-900/30 border border-red-500/30 text-red-300 rounded-xl px-4 py-3 text-sm">
                          <svg className="shrink-0 mt-0.5" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/>
                          </svg>
                          <span>{resultMessage}</span>
                        </div>
                      )}

                      <button
                        type="submit"
                        disabled={uploading || !selectedFile}
                        className="w-full flex items-center justify-center gap-2 bg-[#c4952c] hover:bg-[#d4a53c] disabled:opacity-50 disabled:cursor-not-allowed text-[#1c2e45] font-bold py-3.5 rounded-xl transition-all"
                      >
                        {uploading ? (
                          <>
                            <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
                            </svg>
                            Foto wordt gecontroleerd...
                          </>
                        ) : (
                          "Scan schilderij"
                        )}
                      </button>
                    </form>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default StopScan;
