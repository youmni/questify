import { useAuth } from "../hooks/useAuth";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold">My App</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">
                {user?.firstName} {user?.lastName}
              </span>
              {user?.userType === 'ADMIN' && (
                <Link
                  to="/admin"
                  className="text-blue-600 hover:text-blue-800"
                >
                  Admin Panel
                </Link>
              )}
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
            <h2 className="text-2xl font-bold mb-4">Welcome, {user?.firstName}!</h2>
            <div className="space-y-2">
              <p><strong>Email:</strong> {user?.email}</p>
              <p><strong>Role:</strong> {user?.userType}</p>
              <p><strong>Account Status:</strong> {user?.enabled ? 'Active' : 'Inactive'}</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;