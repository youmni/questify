import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import routeStopAdminService from "../../services/routeStopAdminService";
import routeAdminService from "../../services/routeAdminService";
import paintingAdminService from "../../services/paintingAdminService";

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
  const [routes, setRoutes] = useState([]);
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [paintings, setPaintings] = useState([]);
  const [selectedStopIdForHints, setSelectedStopIdForHints] = useState("");
  const [hintsLoading, setHintsLoading] = useState(false);
  const [hintsError, setHintsError] = useState("");
  const [currentHints, setCurrentHints] = useState({ standardHints: [], extraHints: [] });
  const [hintForm, setHintForm] = useState({ hintType: "STANDARD", text: "" });

  const loadStops = async (id) => {
    if (!id) return;
    setLoading(true);
    setError("");
    try {
      const [stopsRes, routeRes] = await Promise.all([
        routeStopAdminService.getByRoute(id),
        routeAdminService.getById(id),
      ]);

      setStops(stopsRes.data || []);
      setRouteId(id);

      const routeData = routeRes.data;
      setSelectedRoute(routeData || null);

      if (routeData && routeData.museumId) {
        const paintsRes = await paintingAdminService.getByMuseum(routeData.museumId);
        setPaintings(paintsRes.data || []);
      } else {
        setPaintings([]);
      }

      // Reset hint selection when switching route
      setSelectedStopIdForHints("");
      setCurrentHints({ standardHints: [], extraHints: [] });
    } catch (e) {
      setError("Laden van route-stops mislukt: " + e.message);
      setSelectedRoute(null);
      setPaintings([]);
      setSelectedStopIdForHints("");
      setCurrentHints({ standardHints: [], extraHints: [] });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const loadRoutesList = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await routeAdminService.getAll();
        setRoutes(res.data || []);
      } catch (e) {
        setError("Laden van routes mislukt: " + e.message);
      } finally {
        setLoading(false);
      }
    };

    loadRoutesList();
  }, []);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleHintFormChange = (e) => {
    const { name, value } = e.target;
    setHintForm((prev) => ({ ...prev, [name]: value }));
  };

  const getPaintingLabel = (paintingId) => {
    if (!paintingId) return "";
    const p = paintings.find((pt) => pt.paintingId === paintingId);
    if (!p) return paintingId;
    if (p.artist) {
      return `${p.title} (${p.artist})`;
    }
    return p.title || paintingId;
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
      setError("Toevoegen van stop mislukt: " + e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteStop = async (stopId) => {
    if (!window.confirm("Deze stop uit de route verwijderen?")) return;
    setLoading(true);
    setError("");
    try {
      await routeStopAdminService.remove(stopId);
      await loadStops(routeId);
    } catch (e) {
      setError("Verwijderen van stop mislukt: " + e.message);
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
      setError("Bijwerken van volgorde mislukt: " + e.message);
    } finally {
      setLoading(false);
    }
  };

  const loadHintsForStop = async (stopId) => {
    if (!stopId) return;
    const stop = stops.find((s) => s.routeStopId === Number(stopId));
    if (!stop) return;
    setHintsLoading(true);
    setHintsError("");
    try {
      const res = await paintingAdminService.getById(stop.paintingId);
      const data = res.data || {};
      setCurrentHints({
        standardHints: data.standardHints || [],
        extraHints: data.extraHints || [],
      });
      setSelectedStopIdForHints(stopId.toString());
    } catch (e) {
      setHintsError("Laden van hints mislukt: " + e.message);
      setCurrentHints({ standardHints: [], extraHints: [] });
    } finally {
      setHintsLoading(false);
    }
  };

  const handleSelectStopForHints = async (e) => {
    const value = e.target.value;
    setSelectedStopIdForHints(value);
    if (value) {
      await loadHintsForStop(value);
    } else {
      setCurrentHints({ standardHints: [], extraHints: [] });
    }
  };

  const handleAddHintToStop = async (e) => {
    e.preventDefault();
    if (!selectedStopIdForHints || !hintForm.text.trim()) return;

    const stop = stops.find((s) => s.routeStopId === Number(selectedStopIdForHints));
    if (!stop) return;

    setHintsLoading(true);
    setHintsError("");
    try {
      await paintingAdminService.addHint(stop.paintingId, {
        text: hintForm.text.trim(),
        hintType: hintForm.hintType,
      });
      setHintForm({ hintType: hintForm.hintType, text: "" });
      await loadHintsForStop(selectedStopIdForHints);
    } catch (e) {
      setHintsError("Toevoegen van hint mislukt: " + e.message);
    } finally {
      setHintsLoading(false);
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

      <main className="max-w-5xl mx-auto py-6 px-4 sm:px-6 lg:px-8 space-y-6">
        <section className="bg-white rounded-lg shadow p-4 border border-[#2c3e54]/10">
          <form
            onSubmit={handleLoadRoute}
            className="flex flex-wrap items-end gap-4"
          >
            <div className="flex-1 min-w-[160px]">
              <label className="block text-sm font-medium text-[#2c3e54]">
                Route
              </label>
              <select
                name="routeIdInput"
                value={form.routeIdInput}
                onChange={handleFormChange}
                className="mt-1 block w-full rounded-md border border-[#2c3e54]/20 p-2 text-sm bg-white focus:outline-none focus:ring-1 focus:ring-cyan-900"
                required
              >
                <option value="">Selecteer een route...</option>
                {routes.map((r) => (
                  <option key={r.routeId} value={r.routeId}>
                    {r.name}
                  </option>
                ))}
              </select>
            </div>
            <button
              type="submit"
              className="inline-flex items-center px-4 py-2 rounded-md border border-cyan-900 text-cyan-950 text-sm font-medium hover:bg-cyan-900 hover:text-white transition-colors disabled:opacity-50"
              disabled={loading}
            >
              Stops laden
            </button>
            {routeId && (
              <p className="text-sm text-[#2c3e54]/70 mb-2">
                Je bekijkt momenteel route {routeId}
                {selectedRoute?.name ? ` – ${selectedRoute.name}` : ""}
              </p>
            )}
          </form>
        </section>

        {routeId && (
          <section className="bg-white rounded-lg shadow p-4 border border-[#2c3e54]/10">
            <h2 className="text-lg font-semibold mb-4 text-[#2c3e54]">Stop toevoegen aan route</h2>
            {error && (
              <p className="mb-2 text-sm text-red-600">{error}</p>
            )}
            <form
              onSubmit={handleAddStop}
              className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm"
            >
              <div>
                <label className="block font-medium text-[#2c3e54]">
                  Schilderij
                </label>
                <select
                  name="paintingId"
                  value={form.paintingId}
                  onChange={handleFormChange}
                  className="mt-1 block w-full rounded-md border border-[#2c3e54]/20 p-2 bg-white focus:outline-none focus:ring-1 focus:ring-cyan-900"
                  required
                  disabled={paintings.length === 0}
                >
                  <option value="">Selecteer een schilderij...</option>
                  {paintings.map((p) => (
                    <option key={p.paintingId} value={p.paintingId}>
                      {p.artist ? `${p.title} (${p.artist})` : p.title}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block font-medium text-[#2c3e54]">
                  Volgnummer
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
                  Stop toevoegen
                </button>
              </div>
            </form>
          </section>
        )}

        {routeId && (
          <section className="bg-white rounded-lg shadow p-4 border border-[#2c3e54]/10">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-[#2c3e54]">Stops voor route {routeId}</h2>
              {loading && (
                <p className="text-sm text-[#2c3e54]/70">Laden...</p>
              )}
            </div>
            {!loading && stops.length === 0 && (
              <p className="text-sm text-[#2c3e54]/70 italic">
                Nog geen stops gedefinieerd voor deze route.
              </p>
            )}
            {stops.length > 0 && (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-[#2c3e54]/10 text-sm">
                  <thead>
                    <tr className="text-[#2c3e54]/50">
                      <th className="px-4 py-2 text-left font-medium">ID</th>
                      <th className="px-4 py-2 text-left font-medium">Volgorde</th>
                      <th className="px-4 py-2 text-left font-medium">Schilderij</th>
                      <th className="px-4 py-2 text-right font-medium">Acties</th>
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
                          {getPaintingLabel(s.paintingId)}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-right space-x-3">
                          <button
                            onClick={() => changeSequence(s, "up")}
                            className="text-blue-600 hover:underline text-xs font-medium"
                          >
                            Omhoog
                          </button>
                          <button
                            onClick={() => changeSequence(s, "down")}
                            className="text-blue-600 hover:underline text-xs font-medium"
                          >
                            Omlaag
                          </button>
                          <button
                            onClick={() => loadHintsForStop(s.routeStopId)}
                            className="text-cyan-900 hover:underline text-xs font-medium"
                          >
                            Hints
                          </button>
                          <button
                            onClick={() => handleDeleteStop(s.routeStopId)}
                            className="text-red-600 hover:underline text-xs font-medium"
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
        )}

        {routeId && stops.length > 0 && (
          <section className="bg-white rounded-lg shadow p-4 border border-[#2c3e54]/10">
            <h2 className="text-lg font-semibold mb-3 text-[#2c3e54]">Hints per stop</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm mb-4">
              <div className="md:col-span-1">
                <label className="block font-medium text-[#2c3e54] mb-1">Kies een stop</label>
                <select
                  value={selectedStopIdForHints}
                  onChange={handleSelectStopForHints}
                  className="mt-1 block w-full rounded-md border border-[#2c3e54]/20 p-2 bg-white focus:outline-none focus:ring-1 focus:ring-cyan-900"
                >
                  <option value="">Selecteer een stop...</option>
                  {stops.map((s) => (
                    <option key={s.routeStopId} value={s.routeStopId}>
                      Stop {s.sequenceNumber} – {getPaintingLabel(s.paintingId)}
                    </option>
                  ))}
                </select>
                {hintsError && (
                  <p className="mt-2 text-xs text-red-600">{hintsError}</p>
                )}
              </div>

              <form
                onSubmit={handleAddHintToStop}
                className="md:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-3 items-end"
              >
                <div>
                  <label className="block font-medium text-[#2c3e54] mb-1">Type hint</label>
                  <select
                    name="hintType"
                    value={hintForm.hintType}
                    onChange={handleHintFormChange}
                    className="mt-1 block w-full rounded-md border border-[#2c3e54]/20 p-2 bg-white focus:outline-none focus:ring-1 focus:ring-cyan-900"
                    disabled={!selectedStopIdForHints}
                  >
                    <option value="STANDARD">Standaardhint</option>
                    <option value="EXTRA">Extra hint</option>
                  </select>
                </div>
                <div className="md:col-span-1">
                  <label className="block font-medium text-[#2c3e54] mb-1">Nieuwe hint</label>
                  <input
                    type="text"
                    name="text"
                    value={hintForm.text}
                    onChange={handleHintFormChange}
                    className="mt-1 block w-full rounded-md border border-[#2c3e54]/20 p-2 bg-white focus:outline-none focus:ring-1 focus:ring-cyan-900"
                    placeholder="Tekst van de hint"
                    disabled={!selectedStopIdForHints}
                  />
                </div>
                <div className="flex items-end">
                  <button
                    type="submit"
                    disabled={hintsLoading || !selectedStopIdForHints || !hintForm.text.trim()}
                    className="block w-full text-center px-4 py-2 rounded-md border border-cyan-900 text-cyan-950 font-medium hover:bg-cyan-900 hover:text-white transition-colors disabled:opacity-50"
                  >
                    Hint toevoegen
                  </button>
                </div>
              </form>
            </div>

            {selectedStopIdForHints && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div>
                  <h3 className="font-semibold text-[#2c3e54] mb-2">Standaardhints</h3>
                  {hintsLoading && (
                    <p className="text-[#2c3e54]/70">Laden...</p>
                  )}
                  {!hintsLoading && currentHints.standardHints.length === 0 && (
                    <p className="text-[#2c3e54]/60 italic">Nog geen standaardhints.</p>
                  )}
                  <ul className="space-y-1">
                    {currentHints.standardHints.map((h) => (
                      <li key={h.hintId} className="px-2 py-1 rounded bg-[#f4f1e9] border border-[#2c3e54]/10">
                        <span className="font-mono text-[10px] mr-1">#{h.displayOrder}</span>
                        {h.text}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-[#2c3e54] mb-2">Extra hints</h3>
                  {hintsLoading && (
                    <p className="text-[#2c3e54]/70">Laden...</p>
                  )}
                  {!hintsLoading && currentHints.extraHints.length === 0 && (
                    <p className="text-[#2c3e54]/60 italic">Nog geen extra hints.</p>
                  )}
                  <ul className="space-y-1">
                    {currentHints.extraHints.map((h) => (
                      <li key={h.hintId} className="px-2 py-1 rounded bg-[#f4f1e9] border border-[#2c3e54]/10">
                        <span className="font-mono text-[10px] mr-1">#{h.displayOrder}</span>
                        {h.text}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </section>
        )}
      </main>
    </div>
  );
};

export default RouteStopsAdmin;