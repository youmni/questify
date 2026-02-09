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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between h-16 items-center">
          <h1 className="text-xl font-bold text-[#2c3e54]">Museums Management</h1>
          <div className="flex items-center space-x-4">
            <Link to="/admin" className="text-blue-600 hover:text-blue-800">
              Admin Home
            </Link>
            <Link to="/" className="text-blue-600 hover:text-blue-800">
              Dashboard
            </Link>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <section className="lg:col-span-1 bg-white rounded-3xl shadow-[0_10px_40px_rgba(44,62,84,0.05)] border border-[#2c3e54]/10 p-6">
            <h2 className="text-lg font-semibold mb-4">
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
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
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
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
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
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div className="flex items-center">
                <input
                  id="isActive"
                  type="checkbox"
                  name="isActive"
                  checked={form.isActive}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                />
                <label
                  htmlFor="isActive"
                  className="ml-2 block text-sm text-[#2c3e54]"
                >
                  Active
                </label>
              </div>
              <div className="flex space-x-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 disabled:opacity-50"
                >
                  {editingId ? "Save changes" : "Create"}
                </button>
                {editingId && (
                  <button
                    type="button"
                    onClick={handleCancelEdit}
                    className="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </section>

          <section className="lg:col-span-2 bg-white rounded-3xl shadow-[0_10px_40px_rgba(44,62,84,0.05)] border border-[#2c3e54]/10 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">All Museums</h2>
              <button
                type="button"
                onClick={loadMuseums}
                disabled={loading}
                className="px-3 py-1 text-sm rounded bg-gray-100 hover:bg-gray-200 disabled:opacity-50"
              >
                Refresh
              </button>
            </div>
            {loading && (
              <p className="text-sm text-gray-500">Loading...</p>
            )}
            {!loading && museums.length === 0 && (
              <p className="text-sm text-gray-500">No museums found.</p>
            )}
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left font-medium text-gray-700">
                      ID
                    </th>
                    <th className="px-4 py-2 text-left font-medium text-gray-700">
                      Name
                    </th>
                    <th className="px-4 py-2 text-left font-medium text-gray-700">
                      Address
                    </th>
                    <th className="px-4 py-2 text-left font-medium text-gray-700">
                      Active
                    </th>
                    <th className="px-4 py-2 text-right font-medium text-gray-700">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {museums.map((museum) => (
                    <tr key={museum.museumId}>
                      <td className="px-4 py-2 whitespace-nowrap">
                        {museum.museumId}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap">
                        {museum.name}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap">
                        {museum.address}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap">
                        <span
                          className={
                            museum.isActive
                              ? "inline-flex rounded-full bg-green-100 px-2 text-xs font-semibold text-green-800"
                              : "inline-flex rounded-full bg-gray-100 px-2 text-xs font-semibold text-gray-800"
                          }
                        >
                          {museum.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap text-right space-x-2">
                        <button
                          onClick={() => handleEdit(museum)}
                          className="text-blue-600 hover:text-blue-800 text-xs"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => toggleActive(museum)}
                          className="text-indigo-600 hover:text-indigo-800 text-xs"
                        >
                          {museum.isActive ? "Deactivate" : "Activate"}
                        </button>
                        <button
                          onClick={() => handleDelete(museum.museumId)}
                          className="text-red-600 hover:text-red-800 text-xs"
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
