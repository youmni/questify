import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import routeStopAdminService from "../../services/routeStopAdminService";
import routeAdminService from "../../services/routeAdminService";
import paintingAdminService from "../../services/paintingAdminService";

const RouteStopsAdmin = () => {
  const [routes, setRoutes] = useState([]);
  const [selectedRouteId, setSelectedRouteId] = useState("");
  
  const [stops, setStops] = useState([]);
  const [paintings, setPaintings] = useState([]);
  
  const [form, setForm] = useState({ paintingId: "", sequenceNumber: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    routeAdminService.getAll().then((res) => {
      setRoutes(res.data || []);
    });
  }, []);

  const handleRouteSelect = async (e) => {
    const routeId = e.target.value;
    setSelectedRouteId(routeId);
    
    if (!routeId) {
      setStops([]);
      setPaintings([]);
      return;
    }

    await reloadStops(routeId);
  };

  const reloadStops = async (routeId) => {
    setLoading(true);
    setError("");
    try {
      const [routeRes, stopsRes] = await Promise.all([
        routeAdminService.getById(routeId),
        routeStopAdminService.getByRoute(routeId)
      ]);

      const museumId = routeRes.data.museumId;
      const paintingsRes = await paintingAdminService.getByMuseum(museumId);
      
      setPaintings(paintingsRes.data || []);
      
      const sortedStops = (stopsRes.data || []).sort((a, b) => a.sequenceNumber - b.sequenceNumber);
      setStops(sortedStops);
    } catch (err) {
      console.error(err);
      setError("Kan data niet laden.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddStop = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await routeStopAdminService.addToRoute(selectedRouteId, {
        paintingId: Number(form.paintingId),
        sequenceNumber: Number(form.sequenceNumber)
      });
      setForm({ paintingId: "", sequenceNumber: "" });
      await reloadStops(selectedRouteId);
    } catch (err) {
      console.error(err);
      setError("Toevoegen mislukt. Bestaat dit volgnummer al?");
      setLoading(false);
    }
  };

  const handleDelete = async (stopId) => {
    if (!window.confirm("Weet je zeker dat je deze stop wilt verwijderen?")) return;
    setLoading(true);
    setError("");
    try {
      await routeStopAdminService.remove(stopId);
      await reloadStops(selectedRouteId);
    } catch (err) {
      console.error(err);
      setError("Verwijderen mislukt.");
      setLoading(false);
    }
  };

  const handleMove = async (index, direction) => {
    const newStops = [...stops];
    const targetIndex = direction === "up" ? index - 1 : index + 1;

    if (targetIndex < 0 || targetIndex >= newStops.length) return;

    const temp = newStops[index];
    newStops[index] = newStops[targetIndex];
    newStops[targetIndex] = temp;

    const orderedIds = newStops.map(stop => stop.routeStopId);

    setLoading(true);
    setError("");
    try {
      await routeStopAdminService.reorder(selectedRouteId, orderedIds);
      await reloadStops(selectedRouteId);
    } catch (err) {
      console.error(err);
      setError("Wisselen van volgorde mislukt.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f4f1e9] text-[#2c3e54]">
      <nav className="bg-white shadow-sm border-b border-[#2c3e54]/10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between h-16 items-center">
          <h1 className="text-xl font-bold text-[#2c3e54]">Route-stops Beheer</h1>
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
          
          <section className="lg:col-span-1 space-y-6">
            
            <div className="bg-white rounded-lg shadow p-4 border border-[#2c3e54]/10">
              <h2 className="text-lg font-semibold mb-4 text-[#2c3e54]">Stap 1: Route Selecteren</h2>
              <div>
                <label className="block text-sm font-medium text-[#2c3e54]">
                  Route
                </label>
                <select
                  value={selectedRouteId}
                  onChange={handleRouteSelect}
                  className="mt-1 block w-full rounded-md border border-[#2c3e54]/20 p-2 text-sm bg-white focus:outline-none focus:ring-1 focus:ring-cyan-900"
                >
                  <option value="">Selecteer een route...</option>
                  {routes.map((r) => (
                    <option key={r.routeId} value={r.routeId}>
                      {r.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {selectedRouteId && (
              <div className="bg-white rounded-lg shadow p-4 border border-[#2c3e54]/10">
                <h2 className="text-lg font-semibold mb-4 text-[#2c3e54]">Stap 2: Stop Toevoegen</h2>
                {error && (
                  <p className="mb-4 text-sm text-red-600">{error}</p>
                )}
                <form onSubmit={handleAddStop} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-[#2c3e54]">
                      Schilderij
                    </label>
                    <select
                      required
                      value={form.paintingId}
                      onChange={(e) => setForm({ ...form, paintingId: e.target.value })}
                      className="mt-1 block w-full rounded-md border border-[#2c3e54]/20 p-2 text-sm bg-white focus:outline-none focus:ring-1 focus:ring-cyan-900"
                    >
                      <option value="">Kies een schilderij...</option>
                      {paintings.map((p) => (
                        <option key={p.paintingId} value={p.paintingId}>
                          {p.title}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#2c3e54]">
                      Volgnummer
                    </label>
                    <input
                      type="number"
                      required
                      value={form.sequenceNumber}
                      onChange={(e) => setForm({ ...form, sequenceNumber: e.target.value })}
                      className="mt-1 block w-full rounded-md border border-[#2c3e54]/20 p-2 text-sm focus:outline-none focus:ring-1 focus:ring-cyan-900"
                    />
                  </div>
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={loading}
                      className="block w-full text-center px-3 py-2 rounded-md border border-cyan-900 text-cyan-950 text-sm font-medium hover:bg-cyan-900 hover:text-white transition-colors disabled:opacity-50"
                    >
                      Toevoegen
                    </button>
                  </div>
                </form>
              </div>
            )}
          </section>

          <section className="lg:col-span-2 bg-white rounded-lg shadow p-4 border border-[#2c3e54]/10 h-fit">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-[#2c3e54]">Route-stops in overzicht</h2>
              <button
                type="button"
                onClick={() => reloadStops(selectedRouteId)}
                disabled={!selectedRouteId || loading}
                className="px-3 py-1 text-xs rounded bg-[#f4f1e9] text-[#2c3e54] hover:bg-[#ebe8de] transition-colors disabled:opacity-50"
              >
                Vernieuwen
              </button>
            </div>

            {loading && <p className="text-sm text-[#2c3e54]/70">Laden...</p>}
            
            {!selectedRouteId && !loading && (
              <p className="text-sm text-[#2c3e54]/70 italic">Selecteer eerst een route aan de linkerkant.</p>
            )}

            {selectedRouteId && !loading && stops.length === 0 && (
              <p className="text-sm text-[#2c3e54]/70">Geen stops gevonden voor deze route.</p>
            )}

            {selectedRouteId && stops.length > 0 && (
              <div className="overflow-x-auto mt-2">
                <table className="min-w-full divide-y divide-[#2c3e54]/10 text-sm">
                  <thead>
                    <tr className="text-[#2c3e54]/50">
                      <th className="px-4 py-2 text-left font-medium w-16">Nr.</th>
                      <th className="px-4 py-2 text-left font-medium">Schilderij</th>
                      <th className="px-4 py-2 text-right font-medium">Acties</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#2c3e54]/10">
                    {stops.map((stop, index) => (
                      <tr key={stop.routeStopId}>
                        <td className="px-4 py-3 whitespace-nowrap font-mono text-xs font-bold">
                          {stop.sequenceNumber}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap font-medium text-[#2c3e54]">
                          {stop.painting?.title || `ID: ${stop.paintingId}`}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-right space-x-3">
                          <button
                            onClick={() => handleMove(index, "up")}
                            disabled={index === 0 || loading}
                            className="text-blue-600 hover:underline text-xs font-medium disabled:opacity-30 disabled:no-underline"
                          >
                            Omhoog
                          </button>
                          <button
                            onClick={() => handleMove(index, "down")}
                            disabled={index === stops.length - 1 || loading}
                            className="text-blue-600 hover:underline text-xs font-medium disabled:opacity-30 disabled:no-underline"
                          >
                            Omlaag
                          </button>
                          <button
                            onClick={() => handleDelete(stop.routeStopId)}
                            disabled={loading}
                            className="text-red-600 hover:underline text-xs font-medium ml-2 disabled:opacity-30 disabled:no-underline"
                          >
                            Verwijderen
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
};

export default RouteStopsAdmin;