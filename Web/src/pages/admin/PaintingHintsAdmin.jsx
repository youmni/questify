import React, { useEffect, useState } from "react";
import AdminNav from "../../components/AdminNav";
import museumAdminService from "../../services/museumAdminService";
import paintingAdminService from "../../services/paintingAdminService";

const selectClass =
  "mt-1 block w-full rounded-xl border border-[#e5ddcf] bg-white px-3 py-2.5 text-sm text-[#1c2e45] focus:outline-none focus:border-[#c4952c] focus:ring-1 focus:ring-[#c4952c]/20 transition-all";

const inputClass =
  "mt-1 block w-full rounded-xl border border-[#e5ddcf] bg-white px-3 py-2.5 text-sm text-[#1c2e45] placeholder-[#b0a898] focus:outline-none focus:border-[#c4952c] focus:ring-1 focus:ring-[#c4952c]/20 transition-all";

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
      setLoading(true); setError("");
      try { const res = await museumAdminService.getAll(); setMuseums(res.data || []); }
      catch (e) { setError("Laden van musea mislukt: " + e.message); }
      finally { setLoading(false); }
    };
    loadMuseums();
  }, []);

  const handleMuseumChange = async (e) => {
    const id = e.target.value;
    setSelectedMuseumId(id); setSelectedPaintingId("");
    setCurrentHints({ standardHints: [], extraHints: [] });
    if (!id) { setPaintings([]); return; }
    setLoading(true); setError("");
    try { const res = await paintingAdminService.getByMuseum(id); setPaintings(res.data || []); }
    catch (e) { setError("Laden van schilderijen mislukt: " + e.message); setPaintings([]); }
    finally { setLoading(false); }
  };

  const handlePaintingChange = async (e) => {
    const id = e.target.value;
    setSelectedPaintingId(id); setCurrentHints({ standardHints: [], extraHints: [] });
    if (!id) return;
    setLoading(true); setError("");
    try {
      const res = await paintingAdminService.getById(id);
      const data = res.data || {};
      setCurrentHints({ standardHints: data.standardHints || [], extraHints: data.extraHints || [] });
    } catch (e) { setError("Laden van hints mislukt: " + e.message); }
    finally { setLoading(false); }
  };

  const handleAddHint = async (e) => {
    e.preventDefault();
    if (!selectedPaintingId || !hintForm.text.trim()) return;
    setLoading(true); setError("");
    try {
      await paintingAdminService.addHint(selectedPaintingId, { text: hintForm.text.trim(), hintType: hintForm.hintType });
      setHintForm({ hintType: hintForm.hintType, text: "" });
      await handlePaintingChange({ target: { value: selectedPaintingId } });
    } catch (e) { setError("Toevoegen van hint mislukt: " + e.message); }
    finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-[#f4f0e8] text-[#1c2e45]">
      <AdminNav title="Hints" />
      <main className="max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="mb-2">
          <p className="text-[#8a7a60] text-xs font-bold uppercase tracking-widest mb-1">Beheer</p>
          <h1 className="font-serif text-2xl font-bold text-[#1c2e45]">Hints</h1>
        </div>

        {/* Selector section */}
        <section className="bg-[#fdf9f2] rounded-2xl border border-[#e5ddcf] p-6 shadow-sm">
          <h2 className="font-semibold text-[#1c2e45] text-sm mb-5">Schilderij kiezen</h2>
          {error && <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">{error}</div>}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#8a7a60] uppercase tracking-wide mb-1">Museum</label>
              <select value={selectedMuseumId} onChange={handleMuseumChange} className={selectClass}>
                <option value="">Selecteer een museum...</option>
                {museums.map((m) => (<option key={m.museumId} value={m.museumId}>{m.name}</option>))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-[#8a7a60] uppercase tracking-wide mb-1">Schilderij</label>
              <select value={selectedPaintingId} onChange={handlePaintingChange} className={selectClass} disabled={!selectedMuseumId}>
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

        {/* Hints section */}
        {selectedPaintingId && (
          <section className="bg-[#fdf9f2] rounded-2xl border border-[#e5ddcf] p-6 shadow-sm">
            <h2 className="font-semibold text-[#1c2e45] text-sm mb-5">Hints beheren</h2>

            {/* Add hint form */}
            <form onSubmit={handleAddHint} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end mb-6 pb-6 border-b border-[#e5ddcf]">
              <div>
                <label className="block text-xs font-bold text-[#8a7a60] uppercase tracking-wide mb-1">Type hint</label>
                <select name="hintType" value={hintForm.hintType}
                  onChange={(e) => setHintForm((p) => ({ ...p, hintType: e.target.value }))}
                  className={selectClass}>
                  <option value="STANDARD">Standaardhint</option>
                  <option value="EXTRA">Extra hint</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-[#8a7a60] uppercase tracking-wide mb-1">Hint tekst</label>
                <input type="text" name="text" value={hintForm.text}
                  onChange={(e) => setHintForm((p) => ({ ...p, text: e.target.value }))}
                  className={inputClass} placeholder="Tekst van de hint..." />
              </div>
              <button type="submit" disabled={loading || !hintForm.text.trim()}
                className="py-2.5 rounded-xl bg-[#1c2e45] text-[#f4f0e8] font-semibold text-sm hover:bg-[#243a54] transition-colors disabled:opacity-50">
                Hint toevoegen
              </button>
            </form>

            {/* Hints overview */}
            {loading && <p className="text-sm text-[#8a7a60]">Laden...</p>}
            {!loading && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-5 h-5 rounded bg-[#1c2e45] flex items-center justify-center">
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#c4952c" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"/>
                        <path d="M9 18h6"/><path d="M10 22h4"/>
                      </svg>
                    </div>
                    <h3 className="text-xs font-bold text-[#1c2e45] uppercase tracking-wide">Standaardhints</h3>
                    <span className="ml-auto text-xs font-bold text-[#c4952c] bg-[#c4952c]/10 px-2 py-0.5 rounded-full">
                      {currentHints.standardHints.length}
                    </span>
                  </div>
                  {currentHints.standardHints.length === 0 && (
                    <p className="text-xs text-[#b0a898] italic px-3 py-2">Nog geen standaardhints.</p>
                  )}
                  <ul className="space-y-2">
                    {currentHints.standardHints.map((h) => (
                      <li key={h.hintId} className="flex items-start gap-2 bg-[#f4f0e8] border border-[#e5ddcf] rounded-xl px-3 py-2.5 text-xs">
                        <span className="font-mono text-[#c4952c] font-bold shrink-0">#{h.displayOrder}</span>
                        <span className="text-[#1c2e45]">{h.text}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-5 h-5 rounded bg-[#1c2e45] flex items-center justify-center">
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#c4952c" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/>
                      </svg>
                    </div>
                    <h3 className="text-xs font-bold text-[#1c2e45] uppercase tracking-wide">Extra hints</h3>
                    <span className="ml-auto text-xs font-bold text-[#c4952c] bg-[#c4952c]/10 px-2 py-0.5 rounded-full">
                      {currentHints.extraHints.length}
                    </span>
                  </div>
                  {currentHints.extraHints.length === 0 && (
                    <p className="text-xs text-[#b0a898] italic px-3 py-2">Nog geen extra hints.</p>
                  )}
                  <ul className="space-y-2">
                    {currentHints.extraHints.map((h) => (
                      <li key={h.hintId} className="flex items-start gap-2 bg-[#f4f0e8] border border-[#e5ddcf] rounded-xl px-3 py-2.5 text-xs">
                        <span className="font-mono text-[#c4952c] font-bold shrink-0">#{h.displayOrder}</span>
                        <span className="text-[#1c2e45]">{h.text}</span>
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

export default PaintingHintsAdmin;
