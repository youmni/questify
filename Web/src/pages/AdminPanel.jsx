import { useAuth } from "../hooks/useAuth";
import { Link } from "react-router-dom";

const AdminPanel = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-[#f4f1e9] text-[#2c3e54]">
      <nav className="bg-white shadow-sm border-b border-[#2c3e54]/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-[#2c3e54]">Admin Panel</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                to="/"
                className="text-blue-600 hover:text-blue-800"
              >
                Home
              </Link>
              <Link
                to="/auth/logout"
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Logout
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0 space-y-6">
          <div className="bg-white rounded-3xl shadow-[0_10px_40px_rgba(44,62,84,0.05)] border border-[#2c3e54]/10 p-6">
            <h2 className="text-2xl font-bold mb-4 text-[#2c3e54]">Admin Dashboard</h2>
            <p className="text-[#2c3e54]/70">
              Welcome to the admin panel, {user?.firstName}!
            </p>
            <p className="text-[#2c3e54]/70 mt-2">
              Use the sections below to manage museums, routes, paintings and route stops.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link
              to="/admin/museums"
              className="block bg-white rounded-2xl shadow-[0_10px_30px_rgba(44,62,84,0.05)] border border-[#2c3e54]/10 p-4 hover:shadow-lg transition-shadow"
            >
              <h3 className="text-lg font-semibold mb-1">Museums</h3>
              <p className="text-sm text-[#2c3e54]/70">
                Create, edit, activate and remove museums.
              </p>
            </Link>

            <Link
              to="/admin/routes"
              className="block bg-white rounded-2xl shadow-[0_10px_30px_rgba(44,62,84,0.05)] border border-[#2c3e54]/10 p-4 hover:shadow-lg transition-shadow"
            >
              <h3 className="text-lg font-semibold mb-1">Routes</h3>
              <p className="text-sm text-[#2c3e54]/70">
                Manage museum routes and their status.
              </p>
            </Link>

            <Link
              to="/admin/paintings"
              className="block bg-white rounded-2xl shadow-[0_10px_30px_rgba(44,62,84,0.05)] border border-[#2c3e54]/10 p-4 hover:shadow-lg transition-shadow"
            >
              <h3 className="text-lg font-semibold mb-1">Paintings</h3>
              <p className="text-sm text-[#2c3e54]/70">
                Manage paintings and their details.
              </p>
            </Link>

            <Link
              to="/admin/route-stops"
              className="block bg-white rounded-2xl shadow-[0_10px_30px_rgba(44,62,84,0.05)] border border-[#2c3e54]/10 p-4 hover:shadow-lg transition-shadow"
            >
              <h3 className="text-lg font-semibold mb-1">Route stops</h3>
              <p className="text-sm text-[#2c3e54]/70">
                Configure which paintings appear in each route.
              </p>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminPanel;