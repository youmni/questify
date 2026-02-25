import React, { useEffect, useState } from "react";
import AdminNav from "../../components/AdminNav";
import routeAdminService from "../../services/routeAdminService";
import museumAdminService from "../../services/museumAdminService";

const emptyForm = { museumId: "", name: "", description: "", isActive: true };

const inputClass =
  "mt-1 block w-full rounded-xl border border-[#e5ddcf] bg-white px-3 py-2.5 text-sm text-[#1c2e45] placeholder-[#b0a898] focus:outline-none focus:border-[#c4952c] focus:ring-1 focus:ring-[#c4952c]/20 transition-all";

const RoutesAdmin = () => {
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [museums, setMuseums] = useState([]);
  const [museumsLoading, setMuseumsLoading] = useState(false);

  const loadRoutes = async () => {
    setLoading(true); setError("");
    try { const res = await routeAdminService.getAll(); setRoutes(res.data || []); }
    catch (e) { setError("Laden van routes mislukt: " + e.message); }
    finally { setLoading(false); }
  };

  const loadMuseums = async () => {
    setMuseumsLoading(true);
    try { const res = await museumAdminService.getAll(); setMuseums(res.data || []); }
    catch (e) { console.error("Laden van musea mislukt", e); }
    finally { setMuseumsLoading(false); }
  };

  useEffect(() => { loadRoutes(); loadMuseums(); }, []);

  const getMuseumName = (museumId) => {
    if (!museumId) return "";
    const museum = museums.find((m) => m.museumId === museumId);
    return museum ? museum.name : museumId;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); setLoading(true); setError("");
    try {
      const payload = { museumId: Number(form.museumId), name: form.name, description: form.description, isActive: form.isActive };
      if (editingId) { await routeAdminService.update(editingId, payload); }
      else { await routeAdminService.create(payload); }
      setForm(emptyForm); setEditingId(null); await loadRoutes();
    } catch (e) { setError("Opslaan mislukt: " + e.message); }
    finally { setLoading(false); }
  };

  const handleEdit = (route) => {
    setEditingId(route.routeId);
    const isActive = route.active ?? route.isActive ?? true;
    setForm({ museumId: route.museumId?.toString() || "", name: route.name || "", description: route.description || "", isActive });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Weet je zeker dat je deze route wilt verwijderen?")) return;
    setLoading(true); setError("");
    try { await routeAdminService.remove(id); await loadRoutes(); }
    catch (e) { setError("Verwijderen mislukt: " + e.message); }
    finally { setLoading(false); }
  };

  const toggleActive = async (route) => {
    setLoading(true); setError("");
    const isActive = route.active ?? route.isActive;
    try {
      if (isActive) { await routeAdminService.deactivate(route.routeId); }
      else { await routeAdminService.activate(route.routeId); }
      await loadRoutes();
    } catch (e) { setError("Status bijwerken mislukt: " + e.message); }
    finally { setLoading(false); }
  };

  const handleCancelEdit = () => { setEditingId(null); setForm(emptyForm); };

  return (
    <div className="min-h-screen bg-[#f4f0e8] text-[#1c2e45]">
      <AdminNav title="Routes" />
      <main className="max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <p className="text-[#8a7a60] text-xs font-bold uppercase tracking-widest mb-1">Beheer</p>
          <h1 className="font-serif text-2xl font-bold text-[#1c2e45]">Routes</h1>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Form */}
          <section className="lg:col-span-1 bg-[#fdf9f2] rounded-2xl border border-[#e5ddcf] p-6 h-fit shadow-sm">
            <h2 className="font-semibold text-[#1c2e45] text-sm mb-5">
              {editingId ? "Route bewerken" : "Route aanmaken"}
            </h2>
            {error && <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">{error}</div>}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#8a7a60] uppercase tracking-wide mb-1">Museum</label>
                <select name="museumId" value={form.museumId} onChange={handleChange} className={inputClass + " bg-white"} required>
                  <option value="">Selecteer een museum...</option>
                  {museums.map((m) => (<option key={m.museumId} value={m.museumId}>{m.name}</option>))}
                </select>
                <p className="mt-1 text-[11px] text-[#b0a898]">{museumsLoading ? "Musea worden geladen..." : "Kies het museum voor deze route."}</p>
              </div>
              <div>
                <label className="block text-xs font-bold text-[#8a7a60] uppercase tracking-wide mb-1">Naam</label>
                <input type="text" name="name" value={form.name} onChange={handleChange} className={inputClass} required placeholder="Route naam" />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#8a7a60] uppercase tracking-wide mb-1">Beschrijving</label>
                <textarea name="description" value={form.description} onChange={handleChange} rows={3} className={inputClass} placeholder="Beschrijving van de route..." />
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
                  {editingId ? "Wijzigingen opslaan" : "Aanmaken"}
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
          <section className="lg:col-span-2 bg-[#fdf9f2] rounded-2xl border border-[#e5ddcf] p-6 shadow-sm">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-semibold text-[#1c2e45] text-sm">Alle routes</h2>
              <button type="button" onClick={loadRoutes} disabled={loading}
                className="px-3 py-1.5 text-xs rounded-lg bg-[#f0eae0] text-[#6a7a60] hover:bg-[#e5ddcf] transition-colors disabled:opacity-50 font-medium">
                Vernieuwen
              </button>
            </div>
            {loading && <p className="text-sm text-[#8a7a60]">Laden...</p>}
            {!loading && routes.length === 0 && <p className="text-sm text-[#b0a898] text-center py-8">Geen routes gevonden.</p>}
            <div className="overflow-x-auto">
              <table className="min-w-full text-xs">
                <thead>
                  <tr className="border-b border-[#e5ddcf]">
                    <th className="pb-2 px-3 text-left font-bold text-[#8a7a60] uppercase tracking-wide">ID</th>
                    <th className="pb-2 px-3 text-left font-bold text-[#8a7a60] uppercase tracking-wide">Museum</th>
                    <th className="pb-2 px-3 text-left font-bold text-[#8a7a60] uppercase tracking-wide">Naam</th>
                    <th className="pb-2 px-3 text-left font-bold text-[#8a7a60] uppercase tracking-wide">Status</th>
                    <th className="pb-2 px-3 text-right font-bold text-[#8a7a60] uppercase tracking-wide">Acties</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f0eae0]">
                  {routes.map((route) => {
                    const isActive = route.active ?? route.isActive;
                    return (
                      <tr key={route.routeId} className="hover:bg-[#f4f0e8] transition-colors">
                        <td className="px-3 py-3 font-mono text-[#b0a898]">{route.routeId}</td>
                        <td className="px-3 py-3 text-[#6a7a60]">{getMuseumName(route.museumId)}</td>
                        <td className="px-3 py-3 font-semibold text-[#1c2e45]">{route.name}</td>
                        <td className="px-3 py-3">
                          <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${isActive ? "bg-[#c4952c]/10 text-[#c4952c] border border-[#c4952c]/20" : "bg-[#f0eae0] text-[#b0a898] border border-[#e5ddcf]"}`}>
                            {isActive ? "Actief" : "Inactief"}
                          </span>
                        </td>
                        <td className="px-3 py-3 text-right space-x-3">
                          <button onClick={() => handleEdit(route)} className="text-[#1c2e45] hover:text-[#c4952c] font-semibold transition-colors">Bewerken</button>
                          <button onClick={() => toggleActive(route)} className="text-[#6a7a60] hover:text-[#1c2e45] font-semibold transition-colors">{isActive ? "Deactiveren" : "Activeren"}</button>
                          <button onClick={() => handleDelete(route.routeId)} className="text-red-500 hover:text-red-700 font-semibold transition-colors">Verwijderen</button>
                        </td>
                      </tr>
                    );
                  })}
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
