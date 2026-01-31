import { useAuth } from "../hooks/useAuth";
import { Link } from "react-router-dom";

const AdminPanel = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold">Admin Panel</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                to="/"
                className="text-blue-600 hover:text-blue-800"
              >
                Dashboard
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
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-bold mb-4">Admin Dashboard</h2>
            <p className="text-gray-600">Welcome to the admin panel, {user?.firstName}!</p>
            <p className="text-gray-600 mt-2">Here you can manage users, settings, and more.</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminPanel;