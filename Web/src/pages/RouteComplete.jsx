import React, { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import museumService from "../services/museumService";
import paintingService from "../services/paintingService";
import progressService from "../services/progressService";

const CONFETTI_ITEMS = [
  { left: "10%", delay: "0s",   duration: "3.2s", color: "#2c3e54", size: 8,  shape: "circle" },
  { left: "20%", delay: "0.4s", duration: "2.8s", color: "#2c3e54", size: 6,  shape: "square" },
  { left: "33%", delay: "0.2s", duration: "3.5s", color: "#2c3e54", size: 10, shape: "circle" },
  { left: "45%", delay: "0.7s", duration: "2.6s", color: "#2c3e54", size: 7,  shape: "square" },
  { left: "58%", delay: "0.1s", duration: "3.8s", color: "#2c3e54", size: 9,  shape: "circle" },
  { left: "68%", delay: "0.5s", duration: "2.9s", color: "#2c3e54", size: 5,  shape: "square" },
  { left: "78%", delay: "0.3s", duration: "3.3s", color: "#2c3e54", size: 8,  shape: "circle" },
  { left: "88%", delay: "0.6s", duration: "3.0s", color: "#2c3e54", size: 6,  shape: "square" },
  { left: "15%", delay: "0.9s", duration: "2.7s", color: "#8fa8c0", size: 5,  shape: "circle" },
  { left: "52%", delay: "0.8s", duration: "3.6s", color: "#8fa8c0", size: 7,  shape: "square" },
  { left: "72%", delay: "1.1s", duration: "2.5s", color: "#8fa8c0", size: 6,  shape: "circle" },
  { left: "38%", delay: "1.0s", duration: "3.1s", color: "#8fa8c0", size: 9,  shape: "square" },
];

const RouteComplete = () => {
  const { museumId, routeId } = useParams();
  const navigate = useNavigate();

  const [route, setRoute] = useState(null);
  const [progress, setProgress] = useState(null);
  const [hintsByPainting, setHintsByPainting] = useState({});
  const [loading, setLoading] = useState(true);
  const [restarting, setRestarting] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const [routeRes, progressRes] = await Promise.all([
          museumService.getRouteDetails(museumId, routeId),
          progressService.getForRoute(routeId),
        ]);
        const routeData = routeRes.data;
        setRoute(routeData);
        setProgress(progressRes.data || null);

        const stops = routeData?.stops || [];
        const ids = [...new Set(stops.map((s) => s.paintingId).filter(Boolean))];
        if (ids.length > 0) {
          const entries = await Promise.all(
            ids.map(async (id) => {
              try {
                const res = await paintingService.getDetails(id);
                return [id, res.data];
              } catch {
                return [id, null];
              }
            })
          );
          setHintsByPainting(
            Object.fromEntries(entries.filter(([, d]) => d))
          );
        }
      } catch {
        // route couldn't be loaded, go back
      } finally {
        setLoading(false);
        setTimeout(() => setVisible(true), 60);
      }
    };
    if (museumId && routeId) load();
  }, [museumId, routeId]);

  const handleRestart = async () => {
    if (!window.confirm("Weet je zeker dat je de route opnieuw wilt starten? Je voortgang wordt gewist.")) return;
    setRestarting(true);
    try {
      await progressService.restartRoute(routeId);
      navigate(`/quest/museums/${museumId}/routes/${routeId}/stops/1`);
    } catch {
      setRestarting(false);
    }
  };

  const sortedStops = [...(route?.stops || [])].sort(
    (a, b) => (a.sequenceNumber || 0) - (b.sequenceNumber || 0)
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f4f1e9] flex items-center justify-center">
        <p className="text-[#2c3e54]/40 text-sm">Laden...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f4f1e9] text-[#2c3e54] overflow-x-hidden">
      <style>{`
        @keyframes confettiFall {
          0%   { transform: translateY(-20px) rotate(0deg);   opacity: 1; }
          80%  { opacity: 1; }
          100% { transform: translateY(110vh) rotate(720deg); opacity: 0; }
        }
        @keyframes trophyPop {
          0%   { transform: scale(0.4) rotate(-8deg); opacity: 0; }
          60%  { transform: scale(1.12) rotate(3deg); opacity: 1; }
          80%  { transform: scale(0.96) rotate(-1deg); }
          100% { transform: scale(1) rotate(0deg); opacity: 1; }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(18px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .anim-trophy { animation: trophyPop 0.7s cubic-bezier(.34,1.56,.64,1) both; }
        .anim-fade-1 { animation: fadeUp 0.5s ease-out 0.3s both; }
        .anim-fade-2 { animation: fadeUp 0.5s ease-out 0.5s both; }
        .anim-fade-3 { animation: fadeUp 0.5s ease-out 0.7s both; }
        .anim-fade-4 { animation: fadeUp 0.5s ease-out 0.9s both; }
        .confetti-piece {
          position: fixed;
          top: -20px;
          border-radius: 2px;
          animation: confettiFall linear infinite;
          pointer-events: none;
          z-index: 0;
        }
      `}</style>

      {/* Confetti */}
      {visible && CONFETTI_ITEMS.map((c, i) => (
        <span
          key={i}
          className="confetti-piece"
          style={{
            left: c.left,
            width: c.size,
            height: c.size,
            backgroundColor: c.color,
            borderRadius: c.shape === "circle" ? "50%" : "2px",
            animationDelay: c.delay,
            animationDuration: c.duration,
            opacity: 0.35,
          }}
        />
      ))}

      <div className="relative z-10 max-w-xl mx-auto px-4 sm:px-6 py-10">
        {/* Trophy hero */}
        <div className={`flex flex-col items-center text-center mb-8 ${visible ? "anim-trophy" : "opacity-0"}`}>
          <div className="w-24 h-24 rounded-full bg-[#2c3e54] flex items-center justify-center shadow-[0_8px_32px_rgba(44,62,84,0.25)] mb-5">
            <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="#f4f1e9" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/>
              <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/>
              <path d="M4 22h16"/>
              <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/>
              <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/>
              <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/>
            </svg>
          </div>
          <p className="text-xs font-bold uppercase tracking-widest text-[#2c3e54]/50 mb-2">
            Route voltooid
          </p>
          <h1 className="text-4xl font-bold text-[#2c3e54] mb-2">Gefeliciteerd!</h1>
          <p className="text-[#2c3e54]/65 text-sm max-w-xs leading-relaxed">
            Je hebt alle schilderijen gevonden op de route{" "}
            <span className="font-semibold text-[#2c3e54]">{route?.name}</span>.
          </p>
        </div>

        {/* Stats */}
        <div className={`grid grid-cols-3 gap-3 mb-5 ${visible ? "anim-fade-1" : "opacity-0"}`}>
          <div className="bg-white border border-[#2c3e54]/10 rounded-2xl p-4 text-center shadow-sm">
            <p className="text-2xl font-bold text-[#2c3e54]">{progress?.totalStops ?? sortedStops.length}</p>
            <p className="text-xs text-[#2c3e54]/50 mt-0.5">Schilderijen</p>
          </div>
          <div className="bg-white border border-[#2c3e54]/10 rounded-2xl p-4 text-center shadow-sm">
            <p className="text-2xl font-bold text-[#2c3e54]">100%</p>
            <p className="text-xs text-[#2c3e54]/50 mt-0.5">Voltooid</p>
          </div>
          <div className="bg-white border border-[#2c3e54]/10 rounded-2xl p-4 text-center shadow-sm">
            <p className="text-2xl font-bold text-[#2c3e54]">
              <svg className="inline" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#2c3e54" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 6 9 17l-5-5"/>
              </svg>
            </p>
            <p className="text-xs text-[#2c3e54]/50 mt-0.5">Klaar</p>
          </div>
        </div>

        {/* Paintings list */}
        {sortedStops.length > 0 && (
          <div className={`bg-white border border-[#2c3e54]/10 rounded-2xl p-5 mb-5 shadow-sm ${visible ? "anim-fade-2" : "opacity-0"}`}>
            <p className="text-xs font-bold uppercase tracking-widest text-[#2c3e54]/50 mb-4">
              Gevonden schilderijen
            </p>
            <ul className="space-y-3">
              {sortedStops.map((stop, idx) => {
                const detail = hintsByPainting[stop.paintingId];
                const title = detail?.title || `Stop ${stop.sequenceNumber}`;
                const artist = detail?.artist || "";
                return (
                  <li
                    key={stop.routeStopId}
                    className="flex items-center gap-3"
                    style={{ animation: visible ? `fadeUp 0.4s ease-out ${0.7 + idx * 0.08}s both` : "none" }}
                  >
                    <div className="w-7 h-7 rounded-full bg-[#2c3e54] text-[#f4f1e9] flex items-center justify-center shrink-0 text-xs font-bold">
                      {stop.sequenceNumber}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-[#2c3e54] truncate">{title}</p>
                      {artist && (
                        <p className="text-xs text-[#2c3e54]/50 truncate">{artist}</p>
                      )}
                    </div>
                    <div className="ml-auto shrink-0 text-[#2c3e54]/40">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20 6 9 17l-5-5"/>
                      </svg>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        )}

        {/* Actions */}
        <div className={`flex flex-col gap-3 ${visible ? "anim-fade-3" : "opacity-0"}`}>
          <Link
            to="/"
            className="w-full flex items-center justify-center gap-2 bg-[#2c3e54] hover:bg-[#233247] text-[#f4f1e9] font-bold py-4 rounded-xl transition-all shadow-[0_4px_16px_rgba(44,62,84,0.2)]"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
              <polyline points="9 22 9 12 15 12 15 22"/>
            </svg>
            Terug naar home
          </Link>
          <button
            type="button"
            onClick={handleRestart}
            disabled={restarting}
            className="w-full border border-[#2c3e54]/20 hover:border-[#2c3e54]/40 text-[#2c3e54] font-semibold py-3.5 rounded-xl transition-all text-sm disabled:opacity-50 bg-white"
          >
            {restarting ? "Route wordt herstart..." : "Route opnieuw spelen"}
          </button>
        </div>

        <p className={`text-center text-xs text-[#2c3e54]/35 mt-6 ${visible ? "anim-fade-4" : "opacity-0"}`}>
          Questify · Museum Speurtocht
        </p>
      </div>
    </div>
  );
};

export default RouteComplete;
