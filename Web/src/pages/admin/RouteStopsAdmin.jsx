import React, { useEffect, useState } from "react";
import AdminNav from "../../components/AdminNav";
import routeStopAdminService from "../../services/routeStopAdminService";
import routeAdminService from "../../services/routeAdminService";
import paintingAdminService from "../../services/paintingAdminService";

const selectClass =
  "mt-1 block w-full rounded-xl border border-[#e5ddcf] bg-white px-3 py-2.5 text-sm text-[#1c2e45] focus:outline-none focus:border-[#c4952c] focus:ring-1 focus:ring-[#c4952c]/20 transition-all";

const RouteStopsAdmin = () => {
  const [routes, setRoutes] = useState([]);
  const [selectedRouteId, setSelectedRouteId] = useState("");
  const [stops, setStops] = useState([]);
  const [paintings, setPaintings] = useState([]);
  const [form, setForm] = useState({ paintingId: "", sequenceNumber: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    routeAdminService.getAll().then((res) => { setRoutes(res.data || []); });
  }, []);

  const handleRouteSelect = async (e) => {
    const routeId = e.target.value;
    setSelectedRouteId(routeId);
    if (!routeId) { setStops([]); setPaintings([]); return; }
    await reloadStops(routeId);
  };

  const reloadStops = async (routeId) => {
    setLoading(true); setError("");
    try {
      const [routeRes, stopsRes] = await Promise.all([
        routeAdminService.getById(routeId),
        routeStopAdminService.getByRoute(routeId),
      ]);
      const museumId = routeRes.data.museumId;
      const paintingsRes = await paintingAdminService.getByMuseum(museumId);
      setPaintings(paintingsRes.data || []);
      setStops((stopsRes.data || []).sort((a, b) => a.sequenceNumber - b.sequenceNumber));
    } catch (err) {
      console.error(err); setError("Kan data niet laden.");
    } finally { setLoading(false); }
  };

  const handleAddStop = async (e) => {
    e.preventDefault(); setLoading(true); setError("");
    try {
      await routeStopAdminService.addToRoute(selectedRouteId, { paintingId: Number(form.paintingId), sequenceNumber: Number(form.sequenceNumber) });
      setForm({ paintingId: "", sequenceNumber: "" });
      await reloadStops(selectedRouteId);
    } catch (err) {
      console.error(err); setError("Toevoegen mislukt. Bestaat dit volgnummer al?"); setLoading(false);
    }
  };

  const handleDelete = async (stopId) => {
    if (!window.confirm("Weet je zeker dat je deze stop wilt verwijderen?")) return;
    setLoading(true); setError("");
    try { await routeStopAdminService.remove(stopId); await reloadStops(selectedRouteId); }
    catch (err) { console.error(err); setError("Verwijderen mislukt."); setLoading(false); }
  };

  const handleMove = async (index, direction) => {
    const newStops = [...stops];
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newStops.length) return;
    const temp = newStops[index]; newStops[index] = newStops[targetIndex]; newStops[targetIndex] = temp;
    const orderedIds = newStops.map((s) => s.routeStopId);
    setLoading(true); setError("");
    try { await routeStopAdminService.reorder(selectedRouteId, orderedIds); await reloadStops(selectedRouteId); }
    catch (err) { console.error(err); setError("Wisselen van volgorde mislukt."); setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-[#f4f0e8] text-[#1c2e45]">
      <AdminNav title="Route-stops" />
      <main className="max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <p className="text-[#8a7a60] text-xs font-bold uppercase tracking-widest mb-1">Beheer</p>
          <h1 className="font-serif text-2xl font-bold text-[#1c2e45]">Route-stops</h1>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Left: selectors + form */}
          <section className="lg:col-span-1 space-y-5">
            {/* Route selector */}
            <div className="bg-[#fdf9f2] rounded-2xl border border-[#e5ddcf] p-5 shadow-sm">
              <h2 className="font-semibold text-[#1c2e45] text-sm mb-4">Stap 1 — Route kiezen</h2>
              <div>
                <label className="block text-xs font-bold text-[#8a7a60] uppercase tracking-wide mb-1">Route</label>
                <select value={selectedRouteId} onChange={handleRouteSelect} className={selectClass}>
                  <option value="">Selecteer een route...</option>
                  {routes.map((r) => (<option key={r.routeId} value={r.routeId}>{r.name}</option>))}
                </select>
              </div>
            </div>

            {/* Add stop form */}
            {selectedRouteId && (
              <div className="bg-[#fdf9f2] rounded-2xl border border-[#e5ddcf] p-5 shadow-sm">
                <h2 className="font-semibold text-[#1c2e45] text-sm mb-4">Stap 2 — Stop toevoegen</h2>
                {error && <div className="mb-3 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">{error}</div>}
                <form onSubmit={handleAddStop} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-[#8a7a60] uppercase tracking-wide mb-1">Schilderij</label>
                    <select required value={form.paintingId} onChange={(e) => setForm({ ...form, paintingId: e.target.value })} className={selectClass}>
                      <option value="">Kies een schilderij...</option>
                      {paintings.map((p) => (<option key={p.paintingId} value={p.paintingId}>{p.title}</option>))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#8a7a60] uppercase tracking-wide mb-1">Volgnummer</label>
                    <input type="number" required value={form.sequenceNumber}
                      onChange={(e) => setForm({ ...form, sequenceNumber: e.target.value })}
                      className={selectClass} placeholder="1" />
                  </div>
                  <button type="submit" disabled={loading}
                    className="w-full py-2.5 rounded-xl bg-[#1c2e45] text-[#f4f0e8] font-semibold text-sm hover:bg-[#243a54] transition-colors disabled:opacity-50">
                    Toevoegen
                  </button>
                </form>
              </div>
            )}
          </section>

          {/* Right: stops list */}
          <section className="lg:col-span-2 bg-[#fdf9f2] rounded-2xl border border-[#e5ddcf] p-6 shadow-sm h-fit">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-semibold text-[#1c2e45] text-sm">Stops in volgorde</h2>
              <button type="button" onClick={() => reloadStops(selectedRouteId)} disabled={!selectedRouteId || loading}
                className="px-3 py-1.5 text-xs rounded-lg bg-[#f0eae0] text-[#6a7a60] hover:bg-[#e5ddcf] transition-colors disabled:opacity-50 font-medium">
                Vernieuwen
              </button>
            </div>

            {loading && <p className="text-sm text-[#8a7a60]">Laden...</p>}
            {!selectedRouteId && !loading && (
              <div className="text-center py-10">
                <p className="text-sm text-[#b0a898]">Selecteer eerst een route.</p>
              </div>
            )}
            {selectedRouteId && !loading && stops.length === 0 && (
              <p className="text-sm text-[#b0a898] text-center py-8">Geen stops gevonden voor deze route.</p>
            )}

            {selectedRouteId && stops.length > 0 && (
              <div className="space-y-2">
                {stops.map((stop, index) => (
                  <div key={stop.routeStopId} className="flex items-center gap-3 bg-[#f4f0e8] rounded-xl px-4 py-3 border border-[#e5ddcf]">
                    <div className="w-8 h-8 rounded-full bg-[#1c2e45] flex items-center justify-center text-[#c4952c] font-bold text-xs shrink-0">
                      {stop.sequenceNumber}
                    </div>
                    <span className="flex-1 text-sm font-medium text-[#1c2e45] truncate">
                      {stop.painting?.title || `ID: ${stop.paintingId}`}
                    </span>
                    <div className="flex items-center gap-1 shrink-0">
                      <button onClick={() => handleMove(index, "up")} disabled={index === 0 || loading}
                        className="w-7 h-7 rounded-lg border border-[#e5ddcf] flex items-center justify-center text-[#6a7a60] hover:bg-[#e5ddcf] hover:text-[#1c2e45] disabled:opacity-30 transition-colors">
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m18 15-6-6-6 6"/></svg>
                      </button>
                      <button onClick={() => handleMove(index, "down")} disabled={index === stops.length - 1 || loading}
                        className="w-7 h-7 rounded-lg border border-[#e5ddcf] flex items-center justify-center text-[#6a7a60] hover:bg-[#e5ddcf] hover:text-[#1c2e45] disabled:opacity-30 transition-colors">
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                      </button>
                      <button onClick={() => handleDelete(stop.routeStopId)} disabled={loading}
                        className="w-7 h-7 rounded-lg border border-red-200 flex items-center justify-center text-red-400 hover:bg-red-50 hover:text-red-600 disabled:opacity-30 transition-colors">
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18M19 6l-1 14H6L5 6M10 11v6M14 11v6M8 6V4h8v2"/></svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
};

export default RouteStopsAdmin;
