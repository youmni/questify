import React, { useEffect, useState } from "react";
import AdminNav from "../../components/AdminNav";
import museumAdminService from "../../services/museumAdminService";

const emptyForm = {
  name: "",
  address: "",
  description: "",
  isActive: true,
};

const inputClass =
  "mt-1 block w-full rounded-xl border border-[#e5ddcf] bg-white px-3 py-2.5 text-sm text-[#1c2e45] placeholder-[#b0a898] focus:outline-none focus:border-[#c4952c] focus:ring-1 focus:ring-[#c4952c]/20 transition-all";

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
    } catch {
      setError("Laden van musea mislukt");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadMuseums(); }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
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
      setError("Opslaan mislukt: " + e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (museum) => {
    setEditingId(museum.museumId);
    setForm({ name: museum.name || "", address: museum.address || "", description: museum.description || "", isActive: museum.active ?? true });
    setSuccess(""); setError("");
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Weet je zeker dat je dit museum wilt verwijderen?")) return;
    setLoading(true); setError("");
    try { await museumAdminService.remove(id); await loadMuseums(); }
    catch (e) { setError("Verwijderen mislukt: " + e.message); }
    finally { setLoading(false); }
  };

  const toggleActive = async (museum) => {
    setLoading(true); setError("");
    try {
      if (museum.active) { await museumAdminService.deactivate(museum.museumId); }
      else { await museumAdminService.activate(museum.museumId); }
      await loadMuseums();
    } catch (e) { setError("Status bijwerken mislukt: " + e.message); }
    finally { setLoading(false); }
  };

  const handleCancelEdit = () => { setEditingId(null); setForm(emptyForm); setSuccess(""); setError(""); };

  return (
    <div className="min-h-screen bg-[#f4f0e8] text-[#1c2e45]">
      <AdminNav title="Musea" />
      <main className="max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <p className="text-[#8a7a60] text-xs font-bold uppercase tracking-widest mb-1">Beheer</p>
          <h1 className="font-serif text-2xl font-bold text-[#1c2e45]">Musea</h1>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

          {/* Form */}
          <section className="lg:col-span-2 bg-[#fdf9f2] rounded-2xl border border-[#e5ddcf] p-6 h-fit shadow-sm">
            <h2 className="font-semibold text-[#1c2e45] text-sm mb-5">
              {editingId ? "Museum bewerken" : "Museum aanmaken"}
            </h2>
            {error && <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">{error}</div>}
            {success && <div className="mb-4 bg-[#c4952c]/10 border border-[#c4952c]/20 text-[#8a6520] px-4 py-3 rounded-xl text-sm">{success}</div>}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#8a7a60] uppercase tracking-wide mb-1">Naam</label>
                <input type="text" name="name" value={form.name} onChange={handleChange} className={inputClass} placeholder="Museum naam" required />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#8a7a60] uppercase tracking-wide mb-1">Adres</label>
                <input type="text" name="address" value={form.address} onChange={handleChange} className={inputClass} placeholder="Straat 1, Stad" required />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#8a7a60] uppercase tracking-wide mb-1">Beschrijving</label>
                <textarea name="description" value={form.description} onChange={handleChange} rows={3} className={inputClass} placeholder="Korte omschrijving..." />
              </div>
              <div className="flex items-center gap-3 py-1">
                <button type="button" role="switch" aria-checked={form.isActive}
                  onClick={() => setForm((p) => ({ ...p, isActive: !p.isActive }))}
                  className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${form.isActive ? "bg-[#c4952c]" : "bg-[#d5cfc7]"}`}>
                  <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform ${form.isActive ? "translate-x-4" : "translate-x-0.5"}`} />
                </button>
                <span className="text-sm text-[#1c2e45] font-medium cursor-pointer select-none"
                  onClick={() => setForm((p) => ({ ...p, isActive: !p.isActive }))}>
                  {form.isActive ? "Actief" : "Inactief"}
                </span>
              </div>
              <div className="flex flex-col gap-2 pt-1">
                <button type="submit" disabled={loading}
                  className="w-full py-2.5 rounded-xl bg-[#1c2e45] text-[#f4f0e8] font-semibold text-sm hover:bg-[#243a54] transition-colors disabled:opacity-50">
                  {editingId ? "Wijzigingen opslaan" : "Museum aanmaken"}
                </button>
                {editingId && (
                  <button type="button" onClick={handleCancelEdit}
                    className="w-full py-2.5 rounded-xl border border-[#e5ddcf] text-[#8a7a60] font-semibold text-sm hover:bg-[#f0eae0] transition-colors">
                    Annuleren
                  </button>
                )}
              </div>
            </form>
          </section>

          {/* Table */}
          <section className="lg:col-span-3 bg-[#fdf9f2] rounded-2xl border border-[#e5ddcf] p-6 shadow-sm">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-semibold text-[#1c2e45] text-sm">Alle musea</h2>
              <button type="button" onClick={loadMuseums} disabled={loading}
                className="px-3 py-1.5 text-xs rounded-lg bg-[#f0eae0] text-[#6a7a60] hover:bg-[#e5ddcf] transition-colors disabled:opacity-50 font-medium">
                Vernieuwen
              </button>
            </div>
            {loading && <p className="text-sm text-[#8a7a60]">Laden...</p>}
            {!loading && museums.length === 0 && (
              <p className="text-sm text-[#b0a898] text-center py-8">Geen musea gevonden.</p>
            )}
            <div className="overflow-x-auto">
              <table className="min-w-full text-xs">
                <thead>
                  <tr className="border-b border-[#e5ddcf]">
                    <th className="pb-2 px-3 text-left font-bold text-[#8a7a60] uppercase tracking-wide">ID</th>
                    <th className="pb-2 px-3 text-left font-bold text-[#8a7a60] uppercase tracking-wide">Naam</th>
                    <th className="pb-2 px-3 text-left font-bold text-[#8a7a60] uppercase tracking-wide">Adres</th>
                    <th className="pb-2 px-3 text-left font-bold text-[#8a7a60] uppercase tracking-wide">Status</th>
                    <th className="pb-2 px-3 text-right font-bold text-[#8a7a60] uppercase tracking-wide">Acties</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f0eae0]">
                  {museums.map((museum) => (
                    <tr key={museum.museumId} className="hover:bg-[#f4f0e8] transition-colors">
                      <td className="px-3 py-3 font-mono text-[#b0a898]">{museum.museumId}</td>
                      <td className="px-3 py-3 font-semibold text-[#1c2e45]">{museum.name}</td>
                      <td className="px-3 py-3 text-[#6a7a60] truncate max-w-[120px]">{museum.address}</td>
                      <td className="px-3 py-3">
                        <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${museum.active ? "bg-[#c4952c]/10 text-[#c4952c] border border-[#c4952c]/20" : "bg-[#f0eae0] text-[#b0a898] border border-[#e5ddcf]"}`}>
                          {museum.active ? "Actief" : "Inactief"}
                        </span>
                      </td>
                      <td className="px-3 py-3 text-right space-x-3">
                        <button onClick={() => handleEdit(museum)} className="text-[#1c2e45] hover:text-[#c4952c] font-semibold transition-colors">Bewerken</button>
                        <button onClick={() => toggleActive(museum)} className="text-[#6a7a60] hover:text-[#1c2e45] font-semibold transition-colors">{museum.active ? "Deactiveren" : "Activeren"}</button>
                        <button onClick={() => handleDelete(museum.museumId)} className="text-red-500 hover:text-red-700 font-semibold transition-colors">Verwijderen</button>
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
