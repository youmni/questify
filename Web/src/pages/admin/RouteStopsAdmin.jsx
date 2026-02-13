import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import routeStopAdminService from "../../services/routeStopAdminService";

const emptyForm = {
  routeIdInput: "",
  paintingId: "",
  sequenceNumber: "",
};

const RouteStopsAdmin = () => {
  const [routeId, setRouteId] = useState(null);
  const [stops, setStops] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState(emptyForm);

  const loadStops = async (id) => {
    if (!id) return;
    setLoading(true);
    setError("");
    try {
      const res = await routeStopAdminService.getByRoute(id);
      setStops(res.data || []);
      setRouteId(id);
    } catch (e) {
      setError("Failed to load route stops");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // no auto-load; user selects route
  }, []);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleLoadRoute = (e) => {
    e.preventDefault();
    if (!form.routeIdInput) return;
    const id = Number(form.routeIdInput);
    if (!Number.isFinite(id)) return;
    loadStops(id);
  };

  const handleAddStop = async (e) => {
    e.preventDefault();
    if (!routeId) return;
    setLoading(true);
    setError("");
    try {
      const payload = {
        paintingId: Number(form.paintingId),
        sequenceNumber: Number(form.sequenceNumber),
      };
      await routeStopAdminService.addToRoute(routeId, payload);
      setForm((prev) => ({ ...prev, paintingId: "", sequenceNumber: "" }));
      await loadStops(routeId);
    } catch (e) {
      setError("Failed to add stop");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteStop = async (stopId) => {
    if (!window.confirm("Delete this stop from route?")) return;
    setLoading(true);
    setError("");
    try {
      await routeStopAdminService.remove(stopId);
      await loadStops(routeId);
    } catch (e) {
      setError("Failed to delete stop");
    } finally {
      setLoading(false);
    }
  };

  const changeSequence = async (stop, direction) => {
    if (!routeId) return;
    const current = stop.sequenceNumber;
    const next = direction === "up" ? current - 1 : current + 1;
    if (next < 1) return;
    setLoading(true);
    setError("");
    try {
      await routeStopAdminService.updateSequence(stop.routeStopId, next);
      await loadStops(routeId);
    } catch (e) {
      setError("Failed to update sequence");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f4f1e9] text-[#2c3e54]">
      <nav className="bg-white shadow-sm border-b border-[#2c3e54]/10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between h-16 items-center">
          <h1 className="text-xl font-bold text-[#2c3e54]">Route Stops Management</h1>
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

      <main className="max-w-5xl mx-auto py-6 px-4 sm:px-6 lg:px-8 space-y-6">
        <section className="bg-white rounded-lg shadow p-4 border border-[#2c3e54]/10">
          <form
            onSubmit={handleLoadRoute}
            className="flex flex-wrap items-end gap-4"
          >
            <div className="flex-1 min-w-[160px]">
              <label className="block text-sm font-medium text-[#2c3e54]">
                Route ID
              </label>
              <input
                type="number"
                name="routeIdInput"
                value={form.routeIdInput}
                onChange={handleFormChange}
                className="mt-1 block w-full rounded-md border border-[#2c3e54]/20 p-2 text-sm focus:outline-none focus:ring-1 focus:ring-cyan-900"
                required
              />
            </div>
            <button
              type="submit"
              className="inline-flex items-center px-4 py-2 rounded-md border border-cyan-900 text-cyan-950 text-sm font-medium hover:bg-cyan-900 hover:text-white transition-colors disabled:opacity-50"
              disabled={loading}
            >
              Load stops
            </button>
            {routeId && (
              <p className="text-sm text-[#2c3e54]/70 mb-2">Currently viewing route {routeId}</p>
            )}
          </form>
        </section>

        {routeId && (
          <section className="bg-white rounded-lg shadow p-4 border border-[#2c3e54]/10">
            <h2 className="text-lg font-semibold mb-4 text-[#2c3e54]">Add stop to route</h2>
            {error && (
              <p className="mb-2 text-sm text-red-600">{error}</p>
            )}
            <form
              onSubmit={handleAddStop}
              className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm"
            >
              <div>
                <label className="block font-medium text-[#2c3e54]">
                  Painting ID
                </label>
                <input
                  type="number"
                  name="paintingId"
                  value={form.paintingId}
                  onChange={handleFormChange}
                  className="mt-1 block w-full rounded-md border border-[#2c3e54]/20 p-2 focus:outline-none focus:ring-1 focus:ring-cyan-900"
                  required
                />
              </div>
              <div>
                <label className="block font-medium text-[#2c3e54]">
                  Sequence number
                </label>
                <input
                  type="number"
                  name="sequenceNumber"
                  value={form.sequenceNumber}
                  onChange={handleFormChange}
                  className="mt-1 block w-full rounded-md border border-[#2c3e54]/20 p-2 focus:outline-none focus:ring-1 focus:ring-cyan-900"
                  required
                />
              </div>
              <div className="flex items-end">
                <button
                  type="submit"
                  disabled={loading}
                  className="block w-full text-center px-4 py-2 rounded-md border border-cyan-900 text-cyan-950 font-medium hover:bg-cyan-900 hover:text-white transition-colors disabled:opacity-50"
                >
                  Add stop
                </button>
              </div>
            </form>
          </section>
        )}

        {routeId && (
          <section className="bg-white rounded-lg shadow p-4 border border-[#2c3e54]/10">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-[#2c3e54]">Stops for route {routeId}</h2>
              {loading && (
                <p className="text-sm text-[#2c3e54]/70">Loading...</p>
              )}
            </div>
            {!loading && stops.length === 0 && (
              <p className="text-sm text-[#2c3e54]/70 italic">
                No stops defined for this route yet.
              </p>
            )}
            {stops.length > 0 && (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-[#2c3e54]/10 text-sm">
                  <thead>
                    <tr className="text-[#2c3e54]/50">
                      <th className="px-4 py-2 text-left font-medium">ID</th>
                      <th className="px-4 py-2 text-left font-medium">Sequence</th>
                      <th className="px-4 py-2 text-left font-medium">Painting ID</th>
                      <th className="px-4 py-2 text-right font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#2c3e54]/10">
                    {stops.map((s) => (
                      <tr key={s.routeStopId}>
                        <td className="px-4 py-3 whitespace-nowrap font-mono text-xs">
                          {s.routeStopId}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap font-medium text-[#2c3e54]">
                          {s.sequenceNumber}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-[#2c3e54]/70">
                          {s.paintingId}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-right space-x-3">
                          <button
                            onClick={() => changeSequence(s, "up")}
                            className="text-blue-600 hover:underline text-xs font-medium"
                          >
                            Move up
                          </button>
                          <button
                            onClick={() => changeSequence(s, "down")}
                            className="text-blue-600 hover:underline text-xs font-medium"
                          >
                            Move down
                          </button>
                          <button
                            onClick={() => handleDeleteStop(s.routeStopId)}
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
            )}
          </section>
        )}
      </main>
    </div>
  );
};

export default RouteStopsAdmin;