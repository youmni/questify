import { useAuth } from "../../hooks/useAuth";
import { Link } from "react-router-dom";

const AdminPanel = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-[#f4f1e9] text-[#2c3e54]">
      <nav className="bg-white shadow-sm border-b border-[#2c3e54]/10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between h-16 items-center">
          <h1 className="text-xl font-bold text-[#2c3e54]">Admin Paneel</h1>
          <div className="flex items-center space-x-4">
            <Link to="/" className="text-sm text-[#2c3e54] hover:underline">
              Home
            </Link>
            <Link
              to="/auth/logout"
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 text-sm transition-colors"
            >
              Uitloggen
            </Link>
          </div>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow p-4 border border-[#2c3e54]/10">
            <h2 className="text-lg font-semibold text-[#2c3e54]">Admin Dashboard</h2>
            <p className="text-sm text-[#2c3e54]/70 mt-1">
              Welkom bij het admin paneel, {user?.firstName}!
            </p>
            <p className="text-sm text-[#2c3e54]/70 mt-2">
              Gebruik de onderstaande secties om musea, routes, schilderijen en route-stops te beheren.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            <div className="bg-white rounded-lg shadow p-4 flex flex-col justify-between">
              <div>
                <h3 className="text-lg font-semibold text-[#2c3e54]">Musea</h3>
                <p className="text-sm text-[#2c3e54]/70 mb-4">
                  Musea aanmaken, bewerken, activeren en verwijderen.
                </p>
              </div>
              <Link
                to="/admin/museums"
                className="block w-full text-center px-3 py-2 rounded-md border border-cyan-900 text-cyan-950 text-sm font-medium hover:bg-cyan-900 hover:text-white transition-colors"
              >
                Musea Beheren
              </Link>
            </div>

            <div className="bg-white rounded-lg shadow p-4 flex flex-col justify-between">
              <div>
                <h3 className="text-lg font-semibold text-[#2c3e54]">Routes</h3>
                <p className="text-sm text-[#2c3e54]/70 mb-4">
                  Beheer museumroutes en hun status.
                </p>
              </div>
              <Link
                to="/admin/routes"
                className="block w-full text-center px-3 py-2 rounded-md border border-cyan-900 text-cyan-950 text-sm font-medium hover:bg-cyan-900 hover:text-white transition-colors"
              >
                Routes Beheren
              </Link>
            </div>

            <div className="bg-white rounded-lg shadow p-4 flex flex-col justify-between">
              <div>
                <h3 className="text-lg font-semibold text-[#2c3e54]">Schilderijen</h3>
                <p className="text-sm text-[#2c3e54]/70 mb-4">
                  Beheer schilderijen en hun details.
                </p>
              </div>
              <Link
                to="/admin/paintings"
                className="block w-full text-center px-3 py-2 rounded-md border border-cyan-900 text-cyan-950 text-sm font-medium hover:bg-cyan-900 hover:text-white transition-colors"
              >
                Schilderijen Beheren
              </Link>
            </div>

            <div className="bg-white rounded-lg shadow p-4 flex flex-col justify-between">
              <div>
                <h3 className="text-lg font-semibold text-[#2c3e54]">Route-stops</h3>
                <p className="text-sm text-[#2c3e54]/70 mb-4">
                  Configureer welke schilderijen in elke route verschijnen.
                </p>
              </div>
              <Link
                to="/admin/route-stops"
                className="block w-full text-center px-3 py-2 rounded-md border border-cyan-900 text-cyan-950 text-sm font-medium hover:bg-cyan-900 hover:text-white transition-colors"
              >
                Stops Beheren
              </Link>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminPanel;