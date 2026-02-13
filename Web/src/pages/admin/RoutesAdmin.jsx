import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import routeAdminService from "../../services/routeAdminService";

const emptyForm = {
  museumId: "",
  name: "",
  description: "",
  isActive: true,
};

const RoutesAdmin = () => {
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);

  const loadRoutes = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await routeAdminService.getAll();
      setRoutes(res.data || []);
    } catch (e) {
      setError("Failed to load routes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRoutes();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const payload = {
        museumId: Number(form.museumId),
        name: form.name,
        description: form.description,
        isActive: form.isActive,
      };
      if (editingId) {
        await routeAdminService.update(editingId, {
          name: payload.name,
          description: payload.description,
          isActive: payload.isActive,
        });
      } else {
        await routeAdminService.create(payload);
      }
      setForm(emptyForm);
      setEditingId(null);
      await loadRoutes();
    } catch (e) {
      setError("Failed to save route");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (route) => {
    setEditingId(route.routeId);
    setForm({
      museumId: route.museumId?.toString() || "",
      name: route.name || "",
      description: route.description || "",
      isActive: route.isActive ?? true,
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this route?")) return;
    setLoading(true);
    setError("");
    try {
      await routeAdminService.remove(id);
      await loadRoutes();
    } catch (e) {
      setError("Failed to delete route");
    } finally {
      setLoading(false);
    }
  };

  const toggleActive = async (route) => {
    setLoading(true);
    setError("");
    try {
      if (route.isActive) {
        await routeAdminService.deactivate(route.routeId);
      } else {
        await routeAdminService.activate(route.routeId);
      }
      await loadRoutes();
    } catch (e) {
      setError("Failed to update status");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setForm(emptyForm);
  };

  return (
    <div className="min-h-screen bg-[#f4f1e9] text-[#2c3e54]">
      <nav className="bg-white shadow-sm border-b border-[#2c3e54]/10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between h-16 items-center">
          <h1 className="text-xl font-bold text-[#2c3e54]">Routes Management</h1>
          <div className="flex items-center space-x-4">
            <Link to="/admin" className="text-sm text-[#2c3e54] hover:underline">
              Admin Home
            </Link>
            <Link to="/" className="text-sm text-[#2c3e54] hover:underline">
              Home
            </Link>
          </div>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          <section className="lg:col-span-1 bg-white rounded-lg shadow p-4 border border-[#2c3e54]/10 h-fit">
            <h2 className="text-lg font-semibold mb-4 text-[#2c3e54]">
              {editingId ? "Edit Route" : "Create Route"}
            </h2>
            {error && (
              <p className="mb-2 text-sm text-red-600">{error}</p>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#2c3e54]">
                  Museum ID
                </label>
                <input
                  type="number"
                  name="museumId"
                  value={form.museumId}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border border-[#2c3e54]/20 p-2 text-sm focus:outline-none focus:ring-1 focus:ring-cyan-900"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#2c3e54]">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border border-[#2c3e54]/20 p-2 text-sm focus:outline-none focus:ring-1 focus:ring-cyan-900"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#2c3e54]">
                  Description
                </label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  rows={3}
                  className="mt-1 block w-full rounded-md border border-[#2c3e54]/20 p-2 text-sm focus:outline-none focus:ring-1 focus:ring-cyan-900"
                />
              </div>
              <div className="flex items-center">
                <input
                  id="isActive"
                  type="checkbox"
                  name="isActive"
                  checked={form.isActive}
                  onChange={handleChange}
                  className="h-4 w-4 text-cyan-900 border-[#2c3e54]/20 rounded focus:ring-cyan-900"
                />
                <label
                  htmlFor="isActive"
                  className="ml-2 block text-sm text-[#2c3e54]"
                >
                  Active
                </label>
              </div>
              <div className="flex flex-col space-y-2 pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="block w-full text-center px-3 py-2 rounded-md border border-cyan-900 text-cyan-950 text-sm font-medium hover:bg-cyan-900 hover:text-white transition-colors disabled:opacity-50"
                >
                  {editingId ? "Save changes" : "Create"}
                </button>
                {editingId && (
                  <button
                    type="button"
                    onClick={handleCancelEdit}
                    className="block w-full text-center px-3 py-2 rounded-md border border-gray-300 text-gray-700 text-sm font-medium hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </section>

          <section className="lg:col-span-2 bg-white rounded-lg shadow p-4 border border-[#2c3e54]/10">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-[#2c3e54]">All Routes</h2>
              <button
                type="button"
                onClick={loadRoutes}
                disabled={loading}
                className="px-3 py-1 text-xs rounded bg-[#f4f1e9] text-[#2c3e54] hover:bg-[#ebe8de] transition-colors disabled:opacity-50"
              >
                Refresh
              </button>
            </div>
            
            {loading && (
              <p className="text-sm text-[#2c3e54]/70">Loading...</p>
            )}
            {!loading && routes.length === 0 && (
              <p className="text-sm text-[#2c3e54]/70">No routes found.</p>
            )}

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-[#2c3e54]/10 text-sm">
                <thead>
                  <tr className="text-[#2c3e54]/50">
                    <th className="px-4 py-2 text-left font-medium">ID</th>
                    <th className="px-4 py-2 text-left font-medium">Museum ID</th>
                    <th className="px-4 py-2 text-left font-medium">Name</th>
                    <th className="px-4 py-2 text-left font-medium">Status</th>
                    <th className="px-4 py-2 text-right font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#2c3e54]/10">
                  {routes.map((route) => (
                    <tr key={route.routeId}>
                      <td className="px-4 py-3 whitespace-nowrap font-mono text-xs">
                        {route.routeId}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-[#2c3e54]/70">
                        {route.museumId}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap font-medium text-[#2c3e54]">
                        {route.name}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span
                          className={
                            route.isActive
                              ? "inline-flex rounded-full bg-green-100 px-2 text-[10px] font-bold uppercase text-green-800"
                              : "inline-flex rounded-full bg-gray-100 px-2 text-[10px] font-bold uppercase text-gray-800"
                          }
                        >
                          {route.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-right space-x-3">
                        <button
                          onClick={() => handleEdit(route)}
                          className="text-blue-600 hover:underline text-xs font-medium"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => toggleActive(route)}
                          className="text-cyan-900 hover:underline text-xs font-medium"
                        >
                          {route.isActive ? "Deactivate" : "Activate"}
                        </button>
                        <button
                          onClick={() => handleDelete(route.routeId)}
                          className="text-red-600 hover:underline text-xs font-medium"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default RoutesAdmin;