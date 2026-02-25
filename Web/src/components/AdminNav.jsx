import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const navItems = [
  { label: "Musea", to: "/admin/museums" },
  { label: "Routes", to: "/admin/routes" },
  { label: "Schilderijen", to: "/admin/paintings" },
  { label: "Route-stops", to: "/admin/route-stops" },
  { label: "Hints", to: "/admin/painting-hints" },
];

const AdminNav = ({ title }) => {
  const { user } = useAuth();
  const current = typeof window !== "undefined" ? window.location.pathname : "";

  return (
    <div className="bg-[#1c2e45]">
      <div className="h-1 bg-gradient-to-r from-[#c4952c] via-[#e8b84b] to-[#c4952c]" />
      <nav className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16">
        <div className="flex items-center gap-3">
          <Link to="/admin" className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#c4952c] flex items-center justify-center">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1c2e45" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/>
                <circle cx="12" cy="12" r="3"/>
              </svg>
            </div>
            <span className="font-serif text-lg font-bold text-[#f4f0e8]">Questify</span>
          </Link>
          <span className="text-[#2c4a6a] text-sm">/</span>
          <Link to="/admin" className="text-sm text-[#8a9ab0] hover:text-[#f4f0e8] transition-colors">
            Admin
          </Link>
          {title && (
            <>
              <span className="text-[#2c4a6a] text-sm">/</span>
              <span className="text-sm text-[#c4952c] font-medium">{title}</span>
            </>
          )}
        </div>
        <div className="flex items-center gap-4">
          <Link
            to="/"
            className="text-sm text-[#8a9ab0] hover:text-[#f4f0e8] transition-colors hidden sm:block"
          >
            Home
          </Link>
          <Link
            to="/auth/logout"
            className="text-sm px-4 py-1.5 rounded-lg border border-[#c4952c]/40 text-[#c4952c] hover:bg-[#c4952c]/10 transition-colors font-medium"
          >
            Uitloggen
          </Link>
        </div>
      </nav>
      {/* Sub-nav */}
      <div className="border-t border-[#243a54]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex gap-1 overflow-x-auto">
          {navItems.map((item) => {
            const isActive = current === item.to;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`px-4 py-3 text-xs font-semibold whitespace-nowrap transition-colors border-b-2 ${
                  isActive
                    ? "border-[#c4952c] text-[#c4952c]"
                    : "border-transparent text-[#8a9ab0] hover:text-[#f4f0e8]"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AdminNav;
