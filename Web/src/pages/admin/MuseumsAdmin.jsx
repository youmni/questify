import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import museumAdminService from "../../services/museumAdminService";

const emptyForm = {
  name: "",
  address: "",
  description: "",
  isActive: true,
};

const MuseumsAdmin = () => {
  const [museums, setMuseums] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);

  const loadMuseums = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await museumAdminService.getAll();
      setMuseums(res.data || []);
    } catch (e) {
      setError("Failed to load museums");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMuseums();
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
      if (editingId) {
        await museumAdminService.update(editingId, form);
      } else {
        await museumAdminService.create(form);
      }
      setForm(emptyForm);
      setEditingId(null);
      await loadMuseums();
    } catch (e) {
      setError("Failed to save museum");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (museum) => {
    setEditingId(museum.museumId);
    setForm({
      name: museum.name || "",
      address: museum.address || "",
      description: museum.description || "",
      isActive: museum.isActive ?? true,
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this museum?")) return;
    setLoading(true);
    setError("");
    try {
      await museumAdminService.remove(id);
      await loadMuseums();
    } catch (e) {
      setError("Failed to delete museum");
    } finally {
      setLoading(false);
    }
  };

  const toggleActive = async (museum) => {
    setLoading(true);
    setError("");
    try {
      if (museum.isActive) {
        await museumAdminService.deactivate(museum.museumId);
      } else {
        await museumAdminService.activate(museum.museumId);
      }
      await loadMuseums();
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
          <h1 className="text-xl font-bold text-[#2c3e54]">Museums Management</h1>
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
              {editingId ? "Edit Museum" : "Create Museum"}
            </h2>
            {error && (
              <p className="mb-2 text-sm text-red-600">{error}</p>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
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
                  Address
                </label>
                <input
                  type="text"
                  name="address"
                  value={form.address}
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
              <h2 className="text-lg font-semibold text-[#2c3e54]">All Museums</h2>
              <button
                type="button"
                onClick={loadMuseums}
                disabled={loading}
                className="px-3 py-1 text-xs rounded bg-[#f4f1e9] text-[#2c3e54] hover:bg-[#ebe8de] transition-colors disabled:opacity-50"
              >
                Refresh
              </button>
            </div>
            
            {loading && (
              <p className="text-sm text-[#2c3e54]/70">Loading...</p>
            )}
            {!loading && museums.length === 0 && (
              <p className="text-sm text-[#2c3e54]/70">No museums found.</p>
            )}

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-[#2c3e54]/10 text-sm">
                <thead>
                  <tr className="text-[#2c3e54]/50">
                    <th className="px-4 py-2 text-left font-medium">ID</th>
                    <th className="px-4 py-2 text-left font-medium">Name</th>
                    <th className="px-4 py-2 text-left font-medium">Address</th>
                    <th className="px-4 py-2 text-left font-medium">Status</th>
                    <th className="px-4 py-2 text-right font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#2c3e54]/10">
                  {museums.map((museum) => (
                    <tr key={museum.museumId}>
                      <td className="px-4 py-3 whitespace-nowrap font-mono text-xs">
                        {museum.museumId}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap font-medium text-[#2c3e54]">
                        {museum.name}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-[#2c3e54]/70">
                        {museum.address}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span
                          className={
                            museum.isActive
                              ? "inline-flex rounded-full bg-green-100 px-2 text-[10px] font-bold uppercase text-green-800"
                              : "inline-flex rounded-full bg-gray-100 px-2 text-[10px] font-bold uppercase text-gray-800"
                          }
                        >
                          {museum.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-right space-x-3">
                        <button
                          onClick={() => handleEdit(museum)}
                          className="text-blue-600 hover:underline text-xs font-medium"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => toggleActive(museum)}
                          className="text-cyan-900 hover:underline text-xs font-medium"
                        >
                          {museum.isActive ? "Deactivate" : "Activate"}
                        </button>
                        <button
                          onClick={() => handleDelete(museum.museumId)}
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

export default MuseumsAdmin;