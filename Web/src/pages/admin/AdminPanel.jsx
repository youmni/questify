import { useAuth } from "../../hooks/useAuth";
import { Link } from "react-router-dom";

const sections = [
  {
    title: "Musea",
    desc: "Aanmaken, bewerken en verwijderen van musea.",
    to: "/admin/museums",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
        <polyline points="9 22 9 12 15 12 15 22"/>
      </svg>
    ),
  },
  {
    title: "Routes",
    desc: "Beheer museumroutes en hun status.",
    to: "/admin/routes",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="6" cy="19" r="3"/><path d="M9 19h8.5a3.5 3.5 0 0 0 0-7h-11a3.5 3.5 0 0 1 0-7H15"/><circle cx="18" cy="5" r="3"/>
      </svg>
    ),
  },
  {
    title: "Schilderijen",
    desc: "Beheer kunstwerken, details en afbeeldingen.",
    to: "/admin/paintings",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>
      </svg>
    ),
  },
  {
    title: "Route-stops",
    desc: "Configureer welke schilderijen in elke route staan.",
    to: "/admin/route-stops",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/>
      </svg>
    ),
  },
  {
    title: "Hints",
    desc: "Beheer standaard- en extra hints per schilderij.",
    to: "/admin/painting-hints",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"/>
        <path d="M9 18h6"/><path d="M10 22h4"/>
      </svg>
    ),
  },
];

const AdminPanel = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-[#f4f0e8] text-[#1c2e45]">
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
            <span className="text-[#2c4a6a] text-sm">/</span>
            <span className="text-sm text-[#8a9ab0]">Admin</span>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/" className="text-sm text-[#8a9ab0] hover:text-[#f4f0e8] transition-colors">
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
      </div>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Welcome */}
        <div className="mb-8">
          <p className="text-[#8a7a60] text-xs font-bold uppercase tracking-widest mb-1">Beheerder</p>
          <h1 className="font-serif text-3xl font-bold text-[#1c2e45]">Admin Paneel</h1>
          <p className="text-[#6a7a60] text-sm mt-1">
            Welkom, {user?.firstName}. Beheer hier de volledige Questify applicatie.
          </p>
        </div>

        {/* Section cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {sections.map((section) => (
            <Link
              key={section.to}
              to={section.to}
              className="group bg-[#fdf9f2] rounded-2xl border border-[#e5ddcf] p-5 hover:border-[#c4952c] hover:shadow-md transition-all"
            >
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-[#1c2e45] flex items-center justify-center text-[#c4952c] shrink-0 group-hover:bg-[#243a54] transition-colors">
                  {section.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-[#1c2e45] text-sm mb-0.5">{section.title}</h3>
                  <p className="text-xs text-[#8a7a60] leading-relaxed">{section.desc}</p>
                </div>
              </div>
              <div className="mt-4 flex items-center justify-end">
                <div className="flex items-center gap-1 text-[#c4952c] text-xs font-semibold group-hover:gap-2 transition-all">
                  Beheren
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
};

export default AdminPanel;
