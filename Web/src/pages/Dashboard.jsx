import { useAuth } from "../hooks/useAuth";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-[#f4f1e9] text-[#2c3e54]">
      <nav className="bg-white shadow-sm border-b border-[#2c3e54]/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-bold tracking-wider">QUESTIFY</h1>
              <Link
                to="/quest"
                className="text-sm text-[#2c3e54] hover:underline"
              >
                Start speurtocht
              </Link>
            </div>
            <div className="flex items-center space-x-4 text-sm">
              {user?.userType === 'ADMIN' && (
                <Link
                  to="/admin"
                  className="text-[#2c3e54] font-semibold hover:underline"
                >
                  Admin Paneel
                </Link>
              )}
              <Link
                to="/auth/logout"
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Uitloggen
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-bold mb-4">Welkom, {user?.firstName}!</h2>
            <div className="space-y-2">
              <p><strong>Email:</strong> {user?.email}</p>
              <p><strong>Role:</strong> {user?.userType}</p>
              <p><strong>Account Status:</strong> {user?.enabled ? 'Actief' : 'Inactief'}</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;