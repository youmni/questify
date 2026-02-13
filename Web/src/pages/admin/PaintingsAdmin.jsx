import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import paintingAdminService from "../../services/paintingAdminService";

const emptyForm = {
  museumId: "",
  title: "",
  artist: "",
  year: "",
  museumLabel: "",
  imageRecognitionKey: "",
  infoTitle: "",
  infoText: "",
  externalLink: "",
};

const PaintingsAdmin = () => {
  const [paintings, setPaintings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);

  const loadPaintings = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await paintingAdminService.getAll();
      setPaintings(res.data || []);
    } catch (e) {
      setError("Failed to load paintings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPaintings();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const payload = {
        museumId: Number(form.museumId),
        title: form.title,
        artist: form.artist,
        year: form.year ? Number(form.year) : null,
        museumLabel: form.museumLabel,
        imageRecognitionKey: form.imageRecognitionKey,
        infoTitle: form.infoTitle,
        infoText: form.infoText,
        externalLink: form.externalLink,
      };
      if (editingId) {
        await paintingAdminService.update(editingId, payload);
      } else {
        await paintingAdminService.create(payload);
      }
      setForm(emptyForm);
      setEditingId(null);
      await loadPaintings();
    } catch (e) {
      setError("Failed to save painting");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (painting) => {
    setEditingId(painting.paintingId);
    setForm({
      museumId: painting.museumId?.toString() || "",
      title: painting.title || "",
      artist: painting.artist || "",
      year: painting.year?.toString() || "",
      museumLabel: painting.museumLabel || "",
      imageRecognitionKey: painting.imageRecognitionKey || "",
      infoTitle: painting.infoTitle || "",
      infoText: painting.infoText || "",
      externalLink: painting.externalLink || "",
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this painting?")) return;
    setLoading(true);
    setError("");
    try {
      await paintingAdminService.remove(id);
      await loadPaintings();
    } catch (e) {
      setError("Failed to delete painting");
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
          <h1 className="text-xl font-bold text-[#2c3e54]">Paintings Management</h1>
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
              {editingId ? "Edit Painting" : "Create Painting"}
            </h2>
            {error && (
              <p className="mb-2 text-sm text-red-600">{error}</p>
            )}
            <form onSubmit={handleSubmit} className="space-y-3 text-sm">
              <div>
                <label className="block font-medium text-[#2c3e54]">Museum ID</label>
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
                <label className="block font-medium text-[#2c3e54]">Title</label>
                <input
                  type="text"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border border-[#2c3e54]/20 p-2 text-sm focus:outline-none focus:ring-1 focus:ring-cyan-900"
                  required
                />
              </div>
              <div>
                <label className="block font-medium text-[#2c3e54]">Artist</label>
                <input
                  type="text"
                  name="artist"
                  value={form.artist}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border border-[#2c3e54]/20 p-2 text-sm focus:outline-none focus:ring-1 focus:ring-cyan-900"
                />
              </div>
              <div>
                <label className="block font-medium text-[#2c3e54]">Year</label>
                <input
                  type="number"
                  name="year"
                  value={form.year}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border border-[#2c3e54]/20 p-2 text-sm focus:outline-none focus:ring-1 focus:ring-cyan-900"
                />
              </div>
              <div>
                <label className="block font-medium text-[#2c3e54]">
                  Museum Label
                </label>
                <input
                  type="text"
                  name="museumLabel"
                  value={form.museumLabel}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border border-[#2c3e54]/20 p-2 text-sm focus:outline-none focus:ring-1 focus:ring-cyan-900"
                />
              </div>
              <div>
                <label className="block font-medium text-[#2c3e54]">
                  Image Recognition Key
                </label>
                <input
                  type="text"
                  name="imageRecognitionKey"
                  value={form.imageRecognitionKey}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border border-[#2c3e54]/20 p-2 text-sm focus:outline-none focus:ring-1 focus:ring-cyan-900"
                />
              </div>
              <div>
                <label className="block font-medium text-[#2c3e54]">Info Title</label>
                <input
                  type="text"
                  name="infoTitle"
                  value={form.infoTitle}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border border-[#2c3e54]/20 p-2 text-sm focus:outline-none focus:ring-1 focus:ring-cyan-900"
                />
              </div>
              <div>
                <label className="block font-medium text-[#2c3e54]">Info Text</label>
                <textarea
                  name="infoText"
                  value={form.infoText}
                  onChange={handleChange}
                  rows={3}
                  className="mt-1 block w-full rounded-md border border-[#2c3e54]/20 p-2 text-sm focus:outline-none focus:ring-1 focus:ring-cyan-900"
                />
              </div>
              <div>
                <label className="block font-medium text-[#2c3e54]">
                  External Link
                </label>
                <input
                  type="url"
                  name="externalLink"
                  value={form.externalLink}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border border-[#2c3e54]/20 p-2 text-sm focus:outline-none focus:ring-1 focus:ring-cyan-900"
                />
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
              <h2 className="text-lg font-semibold text-[#2c3e54]">All Paintings</h2>
              <button
                type="button"
                onClick={loadPaintings}
                disabled={loading}
                className="px-3 py-1 text-xs rounded bg-[#f4f1e9] text-[#2c3e54] hover:bg-[#ebe8de] transition-colors disabled:opacity-50"
              >
                Refresh
              </button>
            </div>
            
            {loading && (
              <p className="text-sm text-[#2c3e54]/70">Loading...</p>
            )}
            {!loading && paintings.length === 0 && (
              <p className="text-sm text-[#2c3e54]/70">No paintings found.</p>
            )}

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-[#2c3e54]/10 text-xs">
                <thead>
                  <tr className="text-[#2c3e54]/50">
                    <th className="px-2 py-2 text-left font-medium">ID</th>
                    <th className="px-2 py-2 text-left font-medium">Museum ID</th>
                    <th className="px-2 py-2 text-left font-medium">Title</th>
                    <th className="px-2 py-2 text-left font-medium">Artist</th>
                    <th className="px-2 py-2 text-left font-medium">Label</th>
                    <th className="px-2 py-2 text-right font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#2c3e54]/10">
                  {paintings.map((p) => (
                    <tr key={p.paintingId}>
                      <td className="px-2 py-3 whitespace-nowrap font-mono">{p.paintingId}</td>
                      <td className="px-2 py-3 whitespace-nowrap text-[#2c3e54]/70">{p.museumId}</td>
                      <td className="px-2 py-3 whitespace-nowrap font-medium text-[#2c3e54]">{p.title}</td>
                      <td className="px-2 py-3 whitespace-nowrap text-[#2c3e54]/70">{p.artist}</td>
                      <td className="px-2 py-3 whitespace-nowrap text-[#2c3e54]/70">{p.museumLabel}</td>
                      <td className="px-2 py-3 whitespace-nowrap text-right space-x-2">
                        <button
                          onClick={() => handleEdit(p)}
                          className="text-blue-600 hover:underline font-medium"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(p.paintingId)}
                          className="text-red-600 hover:underline font-medium"
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

export default PaintingsAdmin;