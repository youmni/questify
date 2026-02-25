import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import museumAdminService from "../../services/museumAdminService";

const emptyForm = {
  name: "",
  address: "",
  description: "",
  isActive: true,
};

const inputClass = "mt-1 block w-full rounded-lg border border-[#2c3e54]/15 bg-[#f4f1e9]/40 px-3 py-2 text-sm text-[#2c3e54] placeholder-[#2c3e54]/30 focus:outline-none focus:border-[#2c3e54] focus:ring-1 focus:ring-[#2c3e54]/20 transition-all";

const MuseumsAdmin = () => {
  const [museums, setMuseums] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);

  const loadMuseums = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await museumAdminService.getAll();
      setMuseums(res.data || []);
    } catch (e) {
      setError("Laden van musea mislukt");
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
    setSuccess("");
    try {
      if (editingId) {
        await museumAdminService.update(editingId, form);
        setSuccess("Museum bijgewerkt.");
      } else {
        await museumAdminService.create(form);
        setSuccess("Museum aangemaakt.");
      }
      setForm(emptyForm);
      setEditingId(null);
      await loadMuseums();
    } catch (e) {
      setError("Opslaan van museum mislukt: " + e.message);
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
      isActive: museum.active ?? true,
    });
    setSuccess("");
    setError("");
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Weet je zeker dat je dit museum wilt verwijderen?")) return;
    setLoading(true);
    setError("");
    try {
      await museumAdminService.remove(id);
      await loadMuseums();
    } catch (e) {
      setError("Verwijderen van museum mislukt: " + e.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleActive = async (museum) => {
    setLoading(true);
    setError("");
    try {
      if (museum.active) {
        await museumAdminService.deactivate(museum.museumId);
      } else {
        await museumAdminService.activate(museum.museumId);
      }
      await loadMuseums();
    } catch (e) {
      setError("Bijwerken van status mislukt: " + e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setForm(emptyForm);
    setSuccess("");
    setError("");
  };

  return (
    <div className="min-h-screen bg-[#f4f1e9] text-[#2c3e54]">
      {/* Navbar */}
      <nav className="bg-white shadow-sm border-b border-[#2c3e54]/10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between h-16 items-center">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 bg-[#2c3e54] rounded-md flex items-center justify-center text-white font-bold text-sm">Q</div>
            <span className="font-bold text-[#2c3e54]">Museabeheer</span>
          </div>
          <div className="flex items-center gap-4 text-sm">
            <Link to="/admin" className="text-[#2c3e54]/60 hover:text-[#2c3e54] transition-colors">Admin</Link>
            <Link to="/" className="text-[#2c3e54]/60 hover:text-[#2c3e54] transition-colors">Home</Link>
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

          {/* Form */}
          <section className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-[#2c3e54]/10 p-6 h-fit">
            <h2 className="text-base font-bold text-[#2c3e54] mb-5">
              {editingId ? "Museum bewerken" : "Museum aanmaken"}
            </h2>

            {error && (
              <div className="mb-4 bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-xl text-sm">{error}</div>
            )}
            {success && (
              <div className="mb-4 bg-green-50 border border-green-100 text-green-700 px-4 py-3 rounded-xl text-sm">{success}</div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#2c3e54] mb-1">Naam</label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  className={inputClass}
                  placeholder="Rijksmuseum"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#2c3e54] mb-1">Adres</label>
                <input
                  type="text"
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  className={inputClass}
                  placeholder="Museumstraat 1, Amsterdam"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#2c3e54] mb-1">Beschrijving</label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  rows={3}
                  className={inputClass}
                  placeholder="Korte omschrijving van het museum..."
                />
              </div>
              <div className="flex items-center gap-3 py-1">
                <button
                  type="button"
                  role="switch"
                  aria-checked={form.isActive}
                  onClick={() => setForm((prev) => ({ ...prev, isActive: !prev.isActive }))}
                  className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${form.isActive ? 'bg-[#2c3e54]' : 'bg-[#2c3e54]/20'}`}
                >
                  <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform ${form.isActive ? 'translate-x-4.5' : 'translate-x-0.5'}`} />
                </button>
                <label className="text-sm text-[#2c3e54] font-medium cursor-pointer select-none"
                  onClick={() => setForm((prev) => ({ ...prev, isActive: !prev.isActive }))}>
                  {form.isActive ? "Actief" : "Inactief"}
                </label>
              </div>
              <div className="flex flex-col gap-2 pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 rounded-xl bg-[#2c3e54] text-white font-semibold text-sm hover:bg-[#2c3e54]/90 transition-colors disabled:opacity-50"
                >
                  {editingId ? "Wijzigingen opslaan" : "Museum aanmaken"}
                </button>
                {editingId && (
                  <button
                    type="button"
                    onClick={handleCancelEdit}
                    className="w-full py-2.5 rounded-xl border border-[#2c3e54]/20 text-[#2c3e54]/70 font-semibold text-sm hover:bg-[#f4f1e9] transition-colors"
                  >
                    Annuleren
                  </button>
                )}
              </div>
            </form>
          </section>

          {/* Table */}
          <section className="lg:col-span-3 bg-white rounded-2xl shadow-sm border border-[#2c3e54]/10 p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-base font-bold text-[#2c3e54]">Alle musea</h2>
              <button
                type="button"
                onClick={loadMuseums}
                disabled={loading}
                className="px-3 py-1.5 text-xs rounded-lg bg-[#f4f1e9] text-[#2c3e54] hover:bg-[#ebe8de] transition-colors disabled:opacity-50 font-medium"
              >
                Vernieuwen
              </button>
            </div>

            {loading && <p className="text-sm text-[#2c3e54]/50">Laden...</p>}
            {!loading && museums.length === 0 && (
              <p className="text-sm text-[#2c3e54]/40 text-center py-8">Geen musea gevonden.</p>
            )}

            <div className="overflow-x-auto">
              <table className="min-w-full text-xs">
                <thead>
                  <tr className="border-b border-[#2c3e54]/10">
                    <th className="pb-2 px-3 text-left font-semibold text-[#2c3e54]/40 uppercase tracking-wide">ID</th>
                    <th className="pb-2 px-3 text-left font-semibold text-[#2c3e54]/40 uppercase tracking-wide">Naam</th>
                    <th className="pb-2 px-3 text-left font-semibold text-[#2c3e54]/40 uppercase tracking-wide">Adres</th>
                    <th className="pb-2 px-3 text-left font-semibold text-[#2c3e54]/40 uppercase tracking-wide">Status</th>
                    <th className="pb-2 px-3 text-right font-semibold text-[#2c3e54]/40 uppercase tracking-wide">Acties</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#2c3e54]/5">
                  {museums.map((museum) => (
                    <tr key={museum.museumId} className="hover:bg-[#f4f1e9]/50 transition-colors">
                      <td className="px-3 py-3 font-mono text-[#2c3e54]/40">{museum.museumId}</td>
                      <td className="px-3 py-3 font-medium text-[#2c3e54]">{museum.name}</td>
                      <td className="px-3 py-3 text-[#2c3e54]/60">{museum.address}</td>
                      <td className="px-3 py-3">
                        <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${
                          museum.active
                            ? "bg-green-50 text-green-700 border border-green-100"
                            : "bg-[#f4f1e9] text-[#2c3e54]/40 border border-[#2c3e54]/10"
                        }`}>
                          {museum.active ? "Actief" : "Inactief"}
                        </span>
                      </td>
                      <td className="px-3 py-3 text-right space-x-3">
                        <button onClick={() => handleEdit(museum)}
                          className="text-[#2c3e54] hover:underline font-semibold">
                          Bewerken
                        </button>
                        <button onClick={() => toggleActive(museum)}
                          className="text-[#2c3e54]/60 hover:text-[#2c3e54] hover:underline font-semibold">
                          {museum.active ? "Deactiveren" : "Activeren"}
                        </button>
                        <button onClick={() => handleDelete(museum.museumId)}
                          className="text-red-500 hover:underline font-semibold">
                          Verwijderen
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
