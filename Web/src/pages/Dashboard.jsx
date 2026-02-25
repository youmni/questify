import { useAuth } from "../hooks/useAuth";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-[#f4f0e8] text-[#1c2e45]">
      {/* Top bar */}
      <div className="bg-[#1c2e45]">
        <div className="h-1 bg-gradient-to-r from-[#c4952c] via-[#e8b84b] to-[#c4952c]" />
        <nav className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#c4952c] flex items-center justify-center">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1c2e45" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/>
                <circle cx="12" cy="12" r="3"/>
              </svg>
            </div>
            <span className="font-serif text-lg font-bold text-[#f4f0e8]">Questify</span>
          </div>
          <div className="flex items-center gap-4">
            {user?.userType === "ADMIN" && (
              <Link to="/admin" className="text-sm text-[#c4952c] hover:text-[#e8b84b] font-semibold transition-colors">
                Admin Paneel
              </Link>
            )}
            <Link
              to="/auth/logout"
              className="text-sm px-4 py-1.5 rounded-lg border border-[#c4952c]/40 text-[#c4952c] hover:bg-[#c4952c]/10 transition-colors font-medium"
            >
              Uitloggen
            </Link>
          </div>
        </nav>
      </div>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Welcome section */}
        <div className="mb-8">
          <p className="text-[#8a7a60] text-sm font-medium uppercase tracking-widest mb-1">Welkom terug</p>
          <h1 className="font-serif text-3xl font-bold text-[#1c2e45]">
            {user?.firstName || "Avonturier"}
          </h1>
        </div>

        {/* Profile card */}
        <div className="bg-[#fdf9f2] rounded-2xl border border-[#e5ddcf] shadow-sm overflow-hidden mb-6">
          <div className="bg-[#1c2e45] px-6 py-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-[#c4952c] flex items-center justify-center text-[#1c2e45] font-bold text-lg font-serif">
              {(user?.firstName?.[0] || "?").toUpperCase()}
            </div>
            <div>
              <p className="text-[#f4f0e8] font-semibold text-base">
                {user?.firstName} {user?.lastName}
              </p>
              <p className="text-[#8a9ab0] text-xs">{user?.email}</p>
            </div>
            <div className="ml-auto">
              <span className={`text-xs font-semibold px-3 py-1 rounded-full ${
                user?.userType === "ADMIN"
                  ? "bg-[#c4952c]/20 text-[#c4952c]"
                  : "bg-[#2c4a6a] text-[#8a9ab0]"
              }`}>
                {user?.userType === "ADMIN" ? "Beheerder" : "Bezoeker"}
              </span>
            </div>
          </div>
          <div className="px-6 py-4 grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-[#8a7a60] text-xs uppercase tracking-wider mb-0.5">Account status</p>
              <div className="flex items-center gap-1.5">
                <div className={`w-2 h-2 rounded-full ${user?.enabled ? "bg-green-500" : "bg-red-400"}`} />
                <span className="font-medium text-[#1c2e45]">{user?.enabled ? "Actief" : "Inactief"}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <h2 className="text-xs font-bold uppercase tracking-widest text-[#8a7a60] mb-3">Snelle acties</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link
            to="/quest/museums"
            className="flex items-center gap-4 bg-[#fdf9f2] rounded-2xl border border-[#e5ddcf] px-5 py-4 hover:border-[#c4952c] hover:shadow-sm transition-all group"
          >
            <div className="w-10 h-10 rounded-xl bg-[#1c2e45] flex items-center justify-center shrink-0">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#c4952c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                <polyline points="9 22 9 12 15 12 15 22"/>
              </svg>
            </div>
            <div>
              <p className="font-semibold text-[#1c2e45] text-sm">Musea verkennen</p>
              <p className="text-xs text-[#8a7a60]">Kies een museum en start een speurtocht</p>
            </div>
            <svg className="ml-auto w-4 h-4 text-[#c4952c] group-hover:translate-x-0.5 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </Link>

          {user?.userType === "ADMIN" && (
            <Link
              to="/admin"
              className="flex items-center gap-4 bg-[#fdf9f2] rounded-2xl border border-[#e5ddcf] px-5 py-4 hover:border-[#c4952c] hover:shadow-sm transition-all group"
            >
              <div className="w-10 h-10 rounded-xl bg-[#1c2e45] flex items-center justify-center shrink-0">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#c4952c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
                </svg>
              </div>
              <div>
                <p className="font-semibold text-[#1c2e45] text-sm">Admin Paneel</p>
                <p className="text-xs text-[#8a7a60]">Beheer musea, routes en schilderijen</p>
              </div>
              <svg className="ml-auto w-4 h-4 text-[#c4952c] group-hover:translate-x-0.5 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </Link>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
