import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import museumAdminService from "../../services/museumAdminService";
import paintingAdminService from "../../services/paintingAdminService";

const PaintingHintsAdmin = () => {
  const [museums, setMuseums] = useState([]);
  const [paintings, setPaintings] = useState([]);
  const [selectedMuseumId, setSelectedMuseumId] = useState("");
  const [selectedPaintingId, setSelectedPaintingId] = useState("");
  const [currentHints, setCurrentHints] = useState({ standardHints: [], extraHints: [] });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [hintForm, setHintForm] = useState({ hintType: "STANDARD", text: "" });

  useEffect(() => {
    const loadMuseums = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await museumAdminService.getAll();
        setMuseums(res.data || []);
      } catch (e) {
        setError("Laden van musea mislukt: " + e.message);
      } finally {
        setLoading(false);
      }
    };

    loadMuseums();
  }, []);

  const handleMuseumChange = async (e) => {
    const id = e.target.value;
    setSelectedMuseumId(id);
    setSelectedPaintingId("");
    setCurrentHints({ standardHints: [], extraHints: [] });
    if (!id) {
      setPaintings([]);
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await paintingAdminService.getByMuseum(id);
      setPaintings(res.data || []);
    } catch (e) {
      setError("Laden van schilderijen mislukt: " + e.message);
      setPaintings([]);
    } finally {
      setLoading(false);
    }
  };

  const handlePaintingChange = async (e) => {
    const id = e.target.value;
    setSelectedPaintingId(id);
    setCurrentHints({ standardHints: [], extraHints: [] });
    if (!id) return;
    setLoading(true);
    setError("");
    try {
      const res = await paintingAdminService.getById(id);
      const data = res.data || {};
      setCurrentHints({
        standardHints: data.standardHints || [],
        extraHints: data.extraHints || [],
      });
    } catch (e) {
      setError("Laden van hints mislukt: " + e.message);
      setCurrentHints({ standardHints: [], extraHints: [] });
    } finally {
      setLoading(false);
    }
  };

  const handleHintFormChange = (e) => {
    const { name, value } = e.target;
    setHintForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddHint = async (e) => {
    e.preventDefault();
    if (!selectedPaintingId || !hintForm.text.trim()) return;

    setLoading(true);
    setError("");
    try {
      await paintingAdminService.addHint(selectedPaintingId, {
        text: hintForm.text.trim(),
        hintType: hintForm.hintType,
      });
      setHintForm({ hintType: hintForm.hintType, text: "" });
      await handlePaintingChange({ target: { value: selectedPaintingId } });
    } catch (e) {
      setError("Toevoegen van hint mislukt: " + e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f4f1e9] text-[#2c3e54]">
      <nav className="bg-white shadow-sm border-b border-[#2c3e54]/10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between h-16 items-center">
          <h1 className="text-xl font-bold text-[#2c3e54]">Hints Beheer</h1>
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
          <h2 className="text-lg font-semibold mb-4 text-[#2c3e54]">Schilderij kiezen</h2>
          {error && (
            <p className="mb-2 text-sm text-red-600">{error}</p>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <label className="block font-medium text-[#2c3e54] mb-1">Museum</label>
              <select
                value={selectedMuseumId}
                onChange={handleMuseumChange}
                className="mt-1 block w-full rounded-md border border-[#2c3e54]/20 p-2 bg-white focus:outline-none focus:ring-1 focus:ring-cyan-900"
              >
                <option value="">Selecteer een museum...</option>
                {museums.map((m) => (
                  <option key={m.museumId} value={m.museumId}>
                    {m.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block font-medium text-[#2c3e54] mb-1">Schilderij</label>
              <select
                value={selectedPaintingId}
                onChange={handlePaintingChange}
                className="mt-1 block w-full rounded-md border border-[#2c3e54]/20 p-2 bg-white focus:outline-none focus:ring-1 focus:ring-cyan-900"
                disabled={!selectedMuseumId}
              >
                <option value="">Selecteer een schilderij...</option>
                {paintings.map((p) => (
                  <option key={p.paintingId} value={p.paintingId}>
                    {p.artist ? `${p.title} (${p.artist})` : p.title}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </section>

        {selectedPaintingId && (
          <section className="bg-white rounded-lg shadow p-4 border border-[#2c3e54]/10">
            <h2 className="text-lg font-semibold mb-3 text-[#2c3e54]">Hints voor geselecteerd schilderij</h2>

            <form
              onSubmit={handleAddHint}
              className="grid grid-cols-1 md:grid-cols-3 gap-3 items-end mb-4 text-sm"
            >
              <div>
                <label className="block font-medium text-[#2c3e54] mb-1">Type hint</label>
                <select
                  name="hintType"
                  value={hintForm.hintType}
                  onChange={handleHintFormChange}
                  className="mt-1 block w-full rounded-md border border-[#2c3e54]/20 p-2 bg-white focus:outline-none focus:ring-1 focus:ring-cyan-900"
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
                />
              </div>
              <div className="flex items-end">
                <button
                  type="submit"
                  disabled={loading || !hintForm.text.trim()}
                  className="block w-full text-center px-4 py-2 rounded-md border border-cyan-900 text-cyan-950 font-medium hover:bg-cyan-900 hover:text-white transition-colors disabled:opacity-50"
                >
                  Hint toevoegen
                </button>
              </div>
            </form>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div>
                <h3 className="font-semibold text-[#2c3e54] mb-2">Standaardhints</h3>
                {loading && (
                  <p className="text-[#2c3e54]/70">Laden...</p>
                )}
                {!loading && currentHints.standardHints.length === 0 && (
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
                {loading && (
                  <p className="text-[#2c3e54]/70">Laden...</p>
                )}
                {!loading && currentHints.extraHints.length === 0 && (
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
          </section>
        )}
      </main>
    </div>
  );
};

export default PaintingHintsAdmin;
