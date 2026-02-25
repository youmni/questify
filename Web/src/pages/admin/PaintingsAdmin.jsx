import React, { useEffect, useRef, useState } from "react";
import AdminNav from "../../components/AdminNav";
import paintingAdminService from "../../services/paintingAdminService";
import museumAdminService from "../../services/museumAdminService";

const ImageIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>
  </svg>
);
const UploadIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" x2="12" y1="3" y2="15"/>
  </svg>
);

const emptyForm = {
  museumId: "", title: "", artist: "", year: "", museumLabel: "",
  imageRecognitionKey: "", infoTitle: "", infoText: "", externalLink: "",
};

const inputClass =
  "mt-1 block w-full rounded-xl border border-[#e5ddcf] bg-white px-3 py-2.5 text-sm text-[#1c2e45] placeholder-[#b0a898] focus:outline-none focus:border-[#c4952c] focus:ring-1 focus:ring-[#c4952c]/20 transition-all";

const PaintingsAdmin = () => {
  const [paintings, setPaintings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [museums, setMuseums] = useState([]);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageUploadWarning, setImageUploadWarning] = useState("");
  const fileInputRef = useRef(null);

  const loadPaintings = async () => {
    setLoading(true); setError("");
    try { const res = await paintingAdminService.getAll(); setPaintings(res.data || []); }
    catch (e) { setError("Laden van schilderijen mislukt: " + e.message); }
    finally { setLoading(false); }
  };

  const loadMuseums = async () => {
    try { const res = await museumAdminService.getAll(); setMuseums(res.data || []); }
    catch (e) { console.error("Laden van musea mislukt", e); }
  };

  useEffect(() => { loadPaintings(); loadMuseums(); }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file); setImageUploadWarning("");
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);
    if (!form.imageRecognitionKey) {
      const key = file.name.replace(/\.[^.]+$/, "").replace(/\s+/g, "-").toLowerCase();
      setForm((prev) => ({ ...prev, imageRecognitionKey: key }));
    }
  };

  const clearImage = () => {
    setImageFile(null); setImagePreview(null); setImageUploadWarning("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const getMuseumName = (museumId) => {
    if (!museumId) return "";
    const museum = museums.find((m) => m.museumId === museumId);
    return museum ? museum.name : museumId;
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); setLoading(true); setError(""); setSuccess(""); setImageUploadWarning("");
    try {
      const payload = {
        museumId: Number(form.museumId), title: form.title, artist: form.artist,
        year: form.year ? Number(form.year) : null, museumLabel: form.museumLabel,
        imageRecognitionKey: form.imageRecognitionKey, infoTitle: form.infoTitle,
        infoText: form.infoText, externalLink: form.externalLink,
      };
      let savedId = editingId;
      if (editingId) { await paintingAdminService.update(editingId, payload); }
      else { const res = await paintingAdminService.create(payload); savedId = res.data?.paintingId; }

      if (imageFile && savedId) {
        try {
          await paintingAdminService.uploadImage(savedId, imageFile);
          setSuccess(`Opgeslagen en afbeelding geüpload: ${form.imageRecognitionKey}`);
        } catch {
          setImageUploadWarning(`Opgeslagen, maar afbeelding uploaden mislukt. Upload handmatig naar MinIO: paintings/${form.imageRecognitionKey}.jpg`);
        }
      } else {
        setSuccess(editingId ? "Schilderij bijgewerkt." : "Schilderij aangemaakt.");
      }
      setForm(emptyForm); setEditingId(null); clearImage(); await loadPaintings();
    } catch (e) { setError("Opslaan mislukt: " + e.message); }
    finally { setLoading(false); }
  };

  const handleEdit = (painting) => {
    setEditingId(painting.paintingId);
    setForm({
      museumId: painting.museumId?.toString() || "", title: painting.title || "",
      artist: painting.artist || "", year: painting.year?.toString() || "",
      museumLabel: painting.museumLabel || "", imageRecognitionKey: painting.imageRecognitionKey || "",
      infoTitle: painting.infoTitle || "", infoText: painting.infoText || "", externalLink: painting.externalLink || "",
    });
    clearImage(); setSuccess(""); setError("");
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Weet je zeker dat je dit schilderij wilt verwijderen?")) return;
    setLoading(true); setError("");
    try { await paintingAdminService.remove(id); await loadPaintings(); }
    catch (e) { setError("Verwijderen mislukt: " + e.message); }
    finally { setLoading(false); }
  };

  const handleCancelEdit = () => { setEditingId(null); setForm(emptyForm); clearImage(); setSuccess(""); setError(""); };

  return (
    <div className="min-h-screen bg-[#f4f0e8] text-[#1c2e45]">
      <AdminNav title="Schilderijen" />
      <main className="max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <p className="text-[#8a7a60] text-xs font-bold uppercase tracking-widest mb-1">Beheer</p>
          <h1 className="font-serif text-2xl font-bold text-[#1c2e45]">Schilderijen</h1>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

          {/* Form */}
          <section className="lg:col-span-2 bg-[#fdf9f2] rounded-2xl border border-[#e5ddcf] p-6 h-fit shadow-sm">
            <h2 className="font-semibold text-[#1c2e45] text-sm mb-5">
              {editingId ? "Schilderij bewerken" : "Schilderij aanmaken"}
            </h2>
            {error && <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">{error}</div>}
            {success && <div className="mb-4 bg-[#c4952c]/10 border border-[#c4952c]/20 text-[#8a6520] px-4 py-3 rounded-xl text-sm">{success}</div>}
            {imageUploadWarning && (
              <div className="mb-4 bg-amber-50 border border-amber-200 text-amber-700 px-4 py-3 rounded-xl text-sm">{imageUploadWarning}</div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3 text-sm">
              <div>
                <label className="block text-xs font-bold text-[#8a7a60] uppercase tracking-wide mb-1">Museum</label>
                <select name="museumId" value={form.museumId} onChange={handleChange} className={inputClass + " bg-white"} required>
                  <option value="">Selecteer een museum...</option>
                  {museums.map((m) => (<option key={m.museumId} value={m.museumId}>{m.name}</option>))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-[#8a7a60] uppercase tracking-wide mb-1">Titel</label>
                <input type="text" name="title" value={form.title} onChange={handleChange} className={inputClass} required placeholder="De Nachtwacht" />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#8a7a60] uppercase tracking-wide mb-1">Artiest</label>
                <input type="text" name="artist" value={form.artist} onChange={handleChange} className={inputClass} placeholder="Rembrandt van Rijn" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#8a7a60] uppercase tracking-wide mb-1">Jaar</label>
                  <input type="number" name="year" value={form.year} onChange={handleChange} className={inputClass} placeholder="1642" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#8a7a60] uppercase tracking-wide mb-1">Label</label>
                  <input type="text" name="museumLabel" value={form.museumLabel} onChange={handleChange} className={inputClass} placeholder="SK-C-5" />
                </div>
              </div>

              {/* Image upload */}
              <div>
                <label className="block text-xs font-bold text-[#8a7a60] uppercase tracking-wide mb-1">
                  Afbeelding <span className="font-normal normal-case text-[#b0a898]">(MinIO)</span>
                </label>
                {imagePreview ? (
                  <div className="relative rounded-xl overflow-hidden border border-[#e5ddcf] mb-2">
                    <img src={imagePreview} alt="Preview" className="w-full h-32 object-cover" />
                    <button type="button" onClick={clearImage}
                      className="absolute top-2 right-2 bg-white/90 text-[#1c2e45] rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold hover:bg-white transition-colors shadow">
                      ✕
                    </button>
                  </div>
                ) : (
                  <button type="button" onClick={() => fileInputRef.current?.click()}
                    className="w-full border-2 border-dashed border-[#e5ddcf] rounded-xl py-4 flex flex-col items-center gap-1 text-[#b0a898] hover:border-[#c4952c] hover:text-[#c4952c] transition-colors cursor-pointer">
                    <ImageIcon />
                    <span className="text-xs">Klik om een afbeelding te kiezen</span>
                  </button>
                )}
                <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#8a7a60] uppercase tracking-wide mb-1">Beeldherkenningssleutel</label>
                <input type="text" name="imageRecognitionKey" value={form.imageRecognitionKey} onChange={handleChange} className={inputClass} placeholder="nachtwacht-rembrandt" />
                <p className="mt-1 text-[11px] text-[#b0a898]">MinIO pad: <code>paintings/[sleutel].jpg</code></p>
              </div>
              <div>
                <label className="block text-xs font-bold text-[#8a7a60] uppercase tracking-wide mb-1">Info titel</label>
                <input type="text" name="infoTitle" value={form.infoTitle} onChange={handleChange} className={inputClass} placeholder="Over dit schilderij" />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#8a7a60] uppercase tracking-wide mb-1">Info tekst</label>
                <textarea name="infoText" value={form.infoText} onChange={handleChange} rows={3} className={inputClass} placeholder="Beschrijving..." />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#8a7a60] uppercase tracking-wide mb-1">Externe link</label>
                <input type="url" name="externalLink" value={form.externalLink} onChange={handleChange} className={inputClass} placeholder="https://..." />
              </div>

              <div className="flex flex-col gap-2 pt-2">
                <button type="submit" disabled={loading}
                  className="w-full py-2.5 rounded-xl bg-[#1c2e45] text-[#f4f0e8] font-semibold text-sm hover:bg-[#243a54] transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
                  {imageFile && <UploadIcon />}
                  {editingId ? "Wijzigingen opslaan" : "Schilderij aanmaken"}
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
              <h2 className="font-semibold text-[#1c2e45] text-sm">Alle schilderijen</h2>
              <button type="button" onClick={loadPaintings} disabled={loading}
                className="px-3 py-1.5 text-xs rounded-lg bg-[#f0eae0] text-[#6a7a60] hover:bg-[#e5ddcf] transition-colors disabled:opacity-50 font-medium">
                Vernieuwen
              </button>
            </div>
            {loading && <p className="text-sm text-[#8a7a60]">Laden...</p>}
            {!loading && paintings.length === 0 && (
              <div className="text-center py-10 text-[#b0a898]">
                <ImageIcon />
                <p className="mt-2 text-sm">Geen schilderijen gevonden.</p>
              </div>
            )}
            <div className="overflow-x-auto">
              <table className="min-w-full text-xs">
                <thead>
                  <tr className="border-b border-[#e5ddcf]">
                    <th className="pb-2 px-3 text-left font-bold text-[#8a7a60] uppercase tracking-wide">ID</th>
                    <th className="pb-2 px-3 text-left font-bold text-[#8a7a60] uppercase tracking-wide">Museum</th>
                    <th className="pb-2 px-3 text-left font-bold text-[#8a7a60] uppercase tracking-wide">Titel</th>
                    <th className="pb-2 px-3 text-left font-bold text-[#8a7a60] uppercase tracking-wide">Artiest</th>
                    <th className="pb-2 px-3 text-left font-bold text-[#8a7a60] uppercase tracking-wide">Label</th>
                    <th className="pb-2 px-3 text-right font-bold text-[#8a7a60] uppercase tracking-wide">Acties</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f0eae0]">
                  {paintings.map((p) => (
                    <tr key={p.paintingId} className="hover:bg-[#f4f0e8] transition-colors">
                      <td className="px-3 py-3 font-mono text-[#b0a898]">{p.paintingId}</td>
                      <td className="px-3 py-3 text-[#6a7a60]">{getMuseumName(p.museumId)}</td>
                      <td className="px-3 py-3 font-semibold text-[#1c2e45]">{p.title}</td>
                      <td className="px-3 py-3 text-[#6a7a60]">{p.artist}</td>
                      <td className="px-3 py-3 text-[#6a7a60]">{p.museumLabel}</td>
                      <td className="px-3 py-3 text-right space-x-3">
                        <button onClick={() => handleEdit(p)} className="text-[#1c2e45] hover:text-[#c4952c] font-semibold transition-colors">Bewerken</button>
                        <button onClick={() => handleDelete(p.paintingId)} className="text-red-500 hover:text-red-700 font-semibold transition-colors">Verwijderen</button>
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
