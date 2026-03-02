import React, { useEffect, useState } from "react";
import AdminNav from "../../components/AdminNav";
import webhookAdminService from "../../services/webhookAdminService";

const EVENT_TYPES = ["ROUTE_COMPLETED", "PAINTING_SCANNED", "USER_REGISTERED"];

const emptyForm = { url: "", eventType: "ROUTE_COMPLETED", description: "" };

const inputClass =
  "mt-1 block w-full rounded-xl border border-[#e5ddcf] bg-white px-3 py-2.5 text-sm text-[#1c2e45] placeholder-[#b0a898] focus:outline-none focus:border-[#c4952c] focus:ring-1 focus:ring-[#c4952c]/20 transition-all";

const WebhooksAdmin = () => {
  const [webhooks, setWebhooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState(emptyForm);

  const load = async () => {
    setLoading(true); setError("");
    try { const res = await webhookAdminService.getAll(); setWebhooks(res.data || []); }
    catch (e) { setError("Laden mislukt: " + e.message); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); setLoading(true); setError("");
    try {
      await webhookAdminService.create(form);
      setForm(emptyForm);
      await load();
    } catch (e) { setError("Aanmaken mislukt: " + e.message); }
    finally { setLoading(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Webhook verwijderen?")) return;
    setLoading(true); setError("");
    try { await webhookAdminService.remove(id); await load(); }
    catch (e) { setError("Verwijderen mislukt: " + e.message); }
    finally { setLoading(false); }
  };

  const toggleActive = async (webhook) => {
    setLoading(true); setError("");
    try {
      if (webhook.active) { await webhookAdminService.deactivate(webhook.id); }
      else { await webhookAdminService.activate(webhook.id); }
      await load();
    } catch (e) { setError("Status bijwerken mislukt: " + e.message); }
    finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-[#f4f0e8] text-[#1c2e45]">
      <AdminNav title="Webhooks" />
      <main className="max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <p className="text-[#8a7a60] text-xs font-bold uppercase tracking-widest mb-1">Beheer</p>
          <h1 className="font-serif text-2xl font-bold text-[#1c2e45]">Webhooks</h1>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Form */}
          <section className="lg:col-span-1 bg-[#fdf9f2] rounded-2xl border border-[#e5ddcf] p-6 h-fit shadow-sm">
            <h2 className="font-semibold text-[#1c2e45] text-sm mb-5">Webhook toevoegen</h2>
            {error && <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">{error}</div>}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#8a7a60] uppercase tracking-wide mb-1">Event type</label>
                <select name="eventType" value={form.eventType} onChange={handleChange} className={inputClass + " bg-white"} required>
                  {EVENT_TYPES.map((t) => (<option key={t} value={t}>{t}</option>))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-[#8a7a60] uppercase tracking-wide mb-1">URL</label>
                <input type="url" name="url" value={form.url} onChange={handleChange} className={inputClass} required placeholder="https://..." />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#8a7a60] uppercase tracking-wide mb-1">Beschrijving</label>
                <input type="text" name="description" value={form.description} onChange={handleChange} className={inputClass} placeholder="bijv. Power Automate - Excel logging" />
              </div>
              <button type="submit" disabled={loading}
                className="w-full py-2.5 rounded-xl bg-[#1c2e45] text-[#f4f0e8] font-semibold text-sm hover:bg-[#243a54] transition-colors disabled:opacity-50">
                Toevoegen
              </button>
            </form>
          </section>

          {/* Table */}
          <section className="lg:col-span-2 bg-[#fdf9f2] rounded-2xl border border-[#e5ddcf] p-6 shadow-sm">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-semibold text-[#1c2e45] text-sm">Alle webhooks</h2>
              <button type="button" onClick={load} disabled={loading}
                className="px-3 py-1.5 text-xs rounded-lg bg-[#f0eae0] text-[#6a7a60] hover:bg-[#e5ddcf] transition-colors disabled:opacity-50 font-medium">
                Vernieuwen
              </button>
            </div>
            {loading && <p className="text-sm text-[#8a7a60]">Laden...</p>}
            {!loading && webhooks.length === 0 && (
              <p className="text-sm text-[#b0a898] text-center py-8">Geen webhooks gevonden.</p>
            )}
            <div className="overflow-x-auto">
              <table className="min-w-full text-xs">
                <thead>
                  <tr className="border-b border-[#e5ddcf]">
                    <th className="pb-2 px-3 text-left font-bold text-[#8a7a60] uppercase tracking-wide">Event</th>
                    <th className="pb-2 px-3 text-left font-bold text-[#8a7a60] uppercase tracking-wide">Beschrijving</th>
                    <th className="pb-2 px-3 text-left font-bold text-[#8a7a60] uppercase tracking-wide">Status</th>
                    <th className="pb-2 px-3 text-right font-bold text-[#8a7a60] uppercase tracking-wide">Acties</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f0eae0]">
                  {webhooks.map((wh) => (
                    <tr key={wh.id} className="hover:bg-[#f4f0e8] transition-colors">
                      <td className="px-3 py-3 font-mono text-[#1c2e45] font-semibold">{wh.eventType}</td>
                      <td className="px-3 py-3 text-[#6a7a60] max-w-[180px] truncate" title={wh.description || wh.url}>
                        {wh.description || <span className="text-[#b0a898] italic">geen beschrijving</span>}
                      </td>
                      <td className="px-3 py-3">
                        <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${wh.active ? "bg-[#c4952c]/10 text-[#c4952c] border border-[#c4952c]/20" : "bg-[#f0eae0] text-[#b0a898] border border-[#e5ddcf]"}`}>
                          {wh.active ? "Actief" : "Inactief"}
                        </span>
                      </td>
                      <td className="px-3 py-3 text-right space-x-3">
                        <button onClick={() => toggleActive(wh)} className="text-[#6a7a60] hover:text-[#1c2e45] font-semibold transition-colors">
                          {wh.active ? "Deactiveren" : "Activeren"}
                        </button>
                        <button onClick={() => handleDelete(wh.id)} className="text-red-500 hover:text-red-700 font-semibold transition-colors">
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

export default WebhooksAdmin;
