import React, { useState } from "react";
import { MedicalScan, CancerType } from "../types";
import { 
  Search, 
  Trash2, 
  CheckCircle, 
  AlertTriangle, 
  Calendar, 
  Filter, 
  Eye, 
  RefreshCw 
} from "lucide-react";

interface HistoryListProps {
  scans: MedicalScan[];
  onSelectScan: (scan: MedicalScan) => void;
  onDeleteScan: (id: string) => void;
  onUpdateNotes: (id: string, notes: string) => void;
}

export default function HistoryListView({ scans, onSelectScan, onDeleteScan, onUpdateNotes }: HistoryListProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCancerType, setFilterCancerType] = useState<string>("All");
  const [isDeletingId, setIsDeletingId] = useState<string | null>(null);
  const [notesState, setNotesState] = useState<Record<string, string>>({});
  const [savingNotesId, setSavingNotesId] = useState<string | null>(null);

  const handleNotesChange = (id: string, text: string) => {
    setNotesState(prev => ({
      ...prev,
      [id]: text
    }));
  };

  const handleSaveNotes = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    const notesText = notesState[id];
    if (notesText === undefined) return;

    setSavingNotesId(id);
    try {
      const response = await fetch(`/api/scans/${id}/notes`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notes: notesText })
      });
      if (response.ok) {
        onUpdateNotes(id, notesText);
        // Clear edited state on success to hide save button
        setNotesState(prev => {
          const updated = { ...prev };
          delete updated[id];
          return updated;
        });
      }
    } catch (err) {
      console.error("Failed to save clinical notes:", err);
    } finally {
      setSavingNotesId(null);
    }
  };

  // Filter scans
  const categories = ["All", "Brain Tumor", "Lung Cancer", "Skin Cancer", "Breast Cancer"];

  const filteredScans = scans.filter(scan => {
    const matchesSearch = scan.patientName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          scan.prediction.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          scan.id.includes(searchTerm);
    const matchesFilter = filterCancerType === "All" || scan.cancerType === filterCancerType;
    return matchesSearch && matchesFilter;
  });

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setIsDeletingId(id);
    
    try {
      const response = await fetch(`/api/scans/${id}`, { method: 'DELETE' });
      if (response.ok) {
        onDeleteScan(id);
      }
    } catch (err) {
      console.error("Failed to delete record", err);
    } finally {
      setIsDeletingId(null);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-100 font-sans tracking-tight">Diagnostic Studies Directory</h2>
          <p className="text-slate-400 text-sm mt-1">Search, audit, and filter chronological clinical scans and patient logs.</p>
        </div>
      </div>

      {/* Filter and Search Bar Row */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-4 rounded-xl">
        <div className="relative w-full md:w-96 flex">
          <span className="absolute left-3 top-3.5 text-slate-500">
            <Search className="w-4 h-4" />
          </span>
          <input
            type="text"
            id="history-search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 text-slate-200 text-xs pl-9 pr-4 py-3 rounded-xl focus:outline-none focus:border-teal-500/40"
            placeholder="Search by Patient Name, Forecast or Study Node ID..."
          />
        </div>

        {/* Categories toggles */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-slate-500 text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-1">
            <Filter className="w-3.5 h-3.5 text-teal-400" /> Filter Targeted Tissue:
          </span>
          {categories.map((cat, idx) => (
            <button
              key={idx}
              id={`filter-cat-${idx}`}
              onClick={() => setFilterCancerType(cat)}
              className={`text-xs px-3 py-1.5 rounded-lg border font-mono transition-all duration-300 font-medium ${
                filterCancerType === cat
                  ? "bg-teal-500/10 text-teal-400 border-teal-500/35"
                  : "bg-slate-950 text-slate-400 border-slate-850 hover:text-slate-300"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Main Studies List Render */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredScans.length === 0 ? (
          <div className="col-span-2 bg-slate-900/45 border border-slate-850 text-slate-500 text-center py-16 rounded-2xl flex flex-col items-center justify-center gap-2">
            <Calendar className="w-10 h-10 text-slate-600" />
            <span>No clinical records matches search. Generate new medical reports.</span>
          </div>
        ) : (
          filteredScans.map((scan) => (
            <div
              key={scan.id}
              onClick={() => onSelectScan(scan)}
              className="bg-slate-900 hover:bg-slate-900/80 border border-slate-800 hover:border-teal-900/50 p-5 rounded-2xl cursor-pointer transition-all duration-300 flex justify-between gap-4 group relative text-left"
            >
              <div className="flex-1 space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-slate-100 font-bold text-base group-hover:text-teal-400 transition-colors font-sans">{scan.patientName}</h3>
                    <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400 mt-1 font-mono">
                      <span>Age: {scan.patientAge}y</span>
                      <span>Sex: {scan.patientSex}</span>
                      <span>ID: #{scan.id}</span>
                    </div>
                  </div>
                  
                  {/* Risk Level Badge */}
                  <span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                    scan.riskLevel === 'High' 
                      ? 'bg-red-500/10 text-red-400 border border-red-500/25' 
                      : scan.riskLevel === 'Medium'
                      ? 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/25'
                      : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/25'
                  }`}>
                    {scan.riskLevel}
                  </span>
                </div>

                <div className="bg-slate-950 p-3 rounded-lg border border-slate-850">
                  <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
                    <span className="bg-slate-900 text-teal-400 px-1.5 py-0.5 rounded border border-slate-800 text-[10px] font-mono font-bold uppercase">{scan.scanType}</span>
                    <span>Anatomy Location Target ({scan.cancerType})</span>
                  </div>
                  <p className="text-slate-200 text-xs font-semibold leading-relaxed truncate">{scan.prediction}</p>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-500 font-mono">
                  <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> Checked {scan.date}</span>
                  <span className="text-teal-400 font-bold">Accuracy Model Score: {scan.confidence.toFixed(1)}%</span>
                </div>

                {/* Clinical Notes Section */}
                <div 
                  className="mt-3 pt-3 border-t border-slate-800/50 space-y-1.5"
                  onClick={(e) => e.stopPropagation()}
                >
                  <label htmlFor={`notes-input-${scan.id}`} className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500 block">
                    Confidential Clinical Notes
                  </label>
                  <textarea
                    id={`notes-input-${scan.id}`}
                    value={notesState[scan.id] !== undefined ? notesState[scan.id] : (scan.notes || "")}
                    onChange={(e) => handleNotesChange(scan.id, e.target.value)}
                    placeholder="Enter diagnostic assessments, biopsy notes, or treatment plans..."
                    rows={2}
                    className="w-full bg-slate-950 border border-slate-850 hover:border-slate-800 focus:border-teal-500/30 focus:outline-none rounded-xl p-2.5 text-xs text-slate-300 placeholder-slate-650 resize-none transition-all duration-300"
                  />
                  {(notesState[scan.id] !== undefined && notesState[scan.id] !== (scan.notes || "")) && (
                    <div className="flex justify-end pt-1">
                      <button
                        id={`btn-save-notes-${scan.id}`}
                        onClick={(e) => handleSaveNotes(e, scan.id)}
                        disabled={savingNotesId === scan.id}
                        className="text-[10px] font-mono font-bold uppercase py-1.5 px-3 bg-teal-500/15 hover:bg-teal-500/25 disabled:bg-slate-800 disabled:text-slate-500 text-teal-400 border border-teal-500/25 rounded-xl transition-all cursor-pointer"
                      >
                        {savingNotesId === scan.id ? "Saving Notes..." : "Save Notes"}
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Functional Actions bar */}
              <div className="flex flex-col justify-between items-end shrink-0">
                <div className="w-12 h-12 rounded-xl bg-slate-950 overflow-hidden border border-slate-800 select-none">
                  <img src={scan.imageUrl} alt="Thumbnail Scan" className="w-full h-full object-cover" />
                </div>

                <div className="flex items-center gap-2 mt-4">
                  <button
                    onClick={(e) => handleDelete(e, scan.id)}
                    id={`btn-delete-${scan.id}`}
                    disabled={isDeletingId === scan.id}
                    className="p-2 text-slate-500 hover:text-red-400 bg-slate-950 hover:bg-red-950/20 rounded-xl transition-all border border-slate-850"
                    title="Delete Clinical study"
                  >
                    {isDeletingId === scan.id ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={() => onSelectScan(scan)}
                    className="p-2 text-slate-400 hover:text-teal-400 bg-slate-950 rounded-xl border border-slate-850"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                </div>
              </div>

            </div>
          ))
        )}
      </div>

    </div>
  );
}
