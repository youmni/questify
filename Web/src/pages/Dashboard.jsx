import { useAuth } from "../hooks/useAuth";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-[#f4f1e9] text-[#2c3e54]">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-8 pb-10">
        {/* Header */}
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
          <div className="flex items-center gap-3">
            {user?.userType === "ADMIN" && (
              <Link to="/admin" className="text-sm font-semibold text-[#2c3e54]/70 hover:text-[#2c3e54] transition-colors">
                Admin
              </Link>
            )}
            <Link
              to="/auth/logout"
              className="text-sm px-4 py-1.5 rounded-lg border border-[#2c3e54]/20 text-[#2c3e54]/70 hover:border-[#2c3e54]/40 hover:text-[#2c3e54] transition-colors font-medium"
            >
              Uitloggen
            </Link>
          </div>
        </div>

        {/* Welcome */}
        <div className="mb-6">
          <p className="text-xs font-bold uppercase tracking-widest text-[#2c3e54]/60 mb-1">Welkom terug</p>
          <h1 className="text-3xl font-bold text-[#2c3e54]">
            {user?.firstName || "Avonturier"}
          </h1>
        </div>

        {/* Profile card */}
        <div className="bg-white border border-[#2c3e54]/10 rounded-2xl shadow-[0_4px_20px_rgba(44,62,84,0.06)] overflow-hidden mb-6">
          <div className="px-6 py-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-[#2c3e54] flex items-center justify-center text-[#f4f1e9] font-bold text-lg">
              {(user?.firstName?.[0] || "?").toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="text-[#2c3e54] font-semibold text-base truncate">
                {user?.firstName} {user?.lastName}
              </p>
              <p className="text-[#2c3e54]/50 text-xs truncate">{user?.email}</p>
            </div>
            <div className="ml-auto shrink-0">
              <span className={`text-xs font-semibold px-3 py-1 rounded-full border ${
                user?.userType === "ADMIN"
                  ? "border-[#2c3e54]/20 bg-[#2c3e54]/8 text-[#2c3e54]"
                  : "border-[#2c3e54]/10 bg-[#f4f1e9] text-[#2c3e54]/60"
              }`}>
                {user?.userType === "ADMIN" ? "Beheerder" : "Bezoeker"}
              </span>
            </div>
          </div>
          <div className="h-px bg-[#2c3e54]/8 mx-6" />
          <div className="px-6 py-4 text-sm">
            <p className="text-[#2c3e54]/50 text-xs uppercase tracking-wider mb-1">Account status</p>
            <div className="flex items-center gap-1.5">
              <div className={`w-2 h-2 rounded-full ${user?.enabled ? "bg-green-500" : "bg-red-400"}`} />
              <span className="font-medium text-[#2c3e54]">{user?.enabled ? "Actief" : "Inactief"}</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <p className="text-xs font-bold uppercase tracking-widest text-[#2c3e54]/60 mb-3">Snelle acties</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link
            to="/quest/museums"
            className="flex items-center gap-4 bg-white border border-[#2c3e54]/10 rounded-2xl px-5 py-4 hover:border-[#2c3e54]/25 hover:shadow-sm transition-all group"
          >
            <div className="w-10 h-10 rounded-xl bg-[#2c3e54]/8 border border-[#2c3e54]/10 flex items-center justify-center shrink-0">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2c3e54" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                <polyline points="9 22 9 12 15 12 15 22"/>
              </svg>
            </div>
            <div className="min-w-0">
              <p className="font-semibold text-[#2c3e54] text-sm">Musea verkennen</p>
              <p className="text-xs text-[#2c3e54]/50">Kies een museum en start een speurtocht</p>
            </div>
            <svg className="ml-auto w-4 h-4 text-[#2c3e54]/40 group-hover:translate-x-0.5 transition-transform shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </Link>

          {user?.userType === "ADMIN" && (
            <Link
              to="/admin"
              className="flex items-center gap-4 bg-white border border-[#2c3e54]/10 rounded-2xl px-5 py-4 hover:border-[#2c3e54]/25 hover:shadow-sm transition-all group"
            >
              <div className="w-10 h-10 rounded-xl bg-[#2c3e54]/8 border border-[#2c3e54]/10 flex items-center justify-center shrink-0">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2c3e54" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
                </svg>
              </div>
              <div className="min-w-0">
                <p className="font-semibold text-[#2c3e54] text-sm">Admin Paneel</p>
                <p className="text-xs text-[#2c3e54]/50">Beheer musea, routes en schilderijen</p>
              </div>
              <svg className="ml-auto w-4 h-4 text-[#2c3e54]/40 group-hover:translate-x-0.5 transition-transform shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
