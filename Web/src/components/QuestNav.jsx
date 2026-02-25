import React from "react";
import { Link } from "react-router-dom";

const QuestNav = ({ museumId, routeId }) => {
  const routeOverviewLink =
    museumId && routeId
      ? `/quest/museums/${museumId}/routes/${routeId}`
      : "/quest/museums";

  return (
    <div className="sticky top-0 z-30 mb-4">
      <div className="bg-white/95 backdrop-blur border border-[#2c3e54]/10 rounded-2xl px-4 py-3 shadow-[0_10px_30px_rgba(44,62,84,0.06)] flex items-center justify-between gap-2">
        <Link
          to="/quest/museums"
          className="inline-flex items-center gap-2 rounded-xl border border-[#2c3e54]/20 px-3 py-2 text-xs sm:text-sm font-semibold text-[#2c3e54] hover:border-[#2c3e54]/40 bg-white"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            <polyline points="9 22 9 12 15 12 15 22" />
          </svg>
          Home
        </Link>

        <Link
          to={routeOverviewLink}
          className="inline-flex items-center gap-2 rounded-xl bg-[#2c3e54] px-3 py-2 text-xs sm:text-sm font-semibold text-[#f4f1e9] hover:bg-[#233247]"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M8 6h13" />
            <path d="M8 12h13" />
            <path d="M8 18h13" />
            <path d="M3 6h.01" />
            <path d="M3 12h.01" />
            <path d="M3 18h.01" />
          </svg>
          Route-overzicht
        </Link>
      </div>
    </div>
  );
};

export default QuestNav;
