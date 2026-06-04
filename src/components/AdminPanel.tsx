import React, { useState, useEffect } from "react";
import { AuditLog } from "../types";
import { 
  ShieldCheck, 
  Activity, 
  Database, 
  Search, 
  AlertOctagon, 
  RefreshCw 
} from "lucide-react";

export default function AdminPanel() {
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchLogs = async () => {
    setIsRefreshing(true);
    try {
      const response = await fetch("/api/audits");
      if (response.ok) {
        setAuditLogs(await response.json());
      }
    } catch (e) {
      console.error("Failed to load audit logs", e);
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const filteredLogs = auditLogs.filter(log => 
    log.userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-100 font-sans tracking-tight">Oncology Clinic Admin Center</h2>
          <p className="text-slate-400 text-sm mt-1">Audit log trails tracking, ML dataset ingestion telemetry monitoring, and role authentications.</p>
        </div>
        <button
          onClick={fetchLogs}
          id="btn-refresh-audits"
          className="bg-slate-900 hover:bg-slate-800 text-teal-400 border border-slate-800 p-2.5 rounded-xl text-xs font-mono font-bold flex items-center gap-1.5"
        >
          <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          Refresh Registry Logs
        </button>
      </div>

      {/* Database/Telemetry Stats indicators */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl text-left">
          <div className="flex justify-between items-center">
            <span className="text-[10px] text-slate-400 uppercase font-mono tracking-wider">Clinical model cluster</span>
            <span className="w-2.5 h-2.5 bg-emerald-400 rounded-full animate-ping" />
          </div>
          <p className="text-3xl font-extrabold text-slate-100 mt-1">Healthy</p>
          <span className="text-[10px] text-emerald-400 font-mono">100% active operational</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl text-left">
          <div className="flex justify-between items-center">
            <span className="text-[10px] text-slate-400 uppercase font-mono tracking-wider">training samples ingested</span>
            <Database className="w-4 h-4 text-teal-500" />
          </div>
          <p className="text-3xl font-extrabold text-slate-100 mt-1">42,890</p>
          <span className="text-[10px] text-slate-400 font-mono">ResNet34 + EfficientNet-B7</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl text-left">
          <div className="flex justify-between items-center">
            <span className="text-[10px] text-slate-400 uppercase font-mono tracking-wider">Active telemetry pings</span>
            <Activity className="w-4 h-4 text-cyan-400" />
          </div>
          <p className="text-3xl font-extrabold text-slate-100 mt-1">100% Secure</p>
          <span className="text-[10px] text-teal-400 font-mono">HIPAA & GDPR active ledger</span>
        </div>
      </div>

      {/* Search Logs and Audit logs Render Table */}
      <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4 pb-3 border-b border-slate-850">
          <h3 className="text-slate-100 font-bold text-sm tracking-tight flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-teal-400" />
            Clinic Audit Trail Cryptographic Logs
          </h3>

          <div className="relative w-full sm:w-72">
            <span className="absolute left-3 top-3 text-slate-500">
              <Search className="w-3.5 h-3.5" />
            </span>
            <input
              type="text"
              id="admin-search-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-950 border border-slate-850 text-slate-200 text-[11px] pl-8 pr-4 py-2 rounded-lg text-left"
              placeholder="Filter audit action logs..."
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-850 text-slate-500 font-mono uppercase">
                <th className="py-2.5">Date & Time</th>
                <th className="py-2.5">Operator Identity</th>
                <th className="py-2.5">Clinic Role</th>
                <th className="py-2.5">Secured Action Logged</th>
                <th className="py-2.5">IP Address</th>
                <th className="py-2.5 text-center">Audit Severity</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-850/60 text-slate-300 font-mono">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-950/20 transition-colors">
                  <td className="py-2.5 text-slate-400">{log.timestamp.replace('T', ' ').replace('Z','')}</td>
                  <td className="py-2.5 font-bold text-slate-100">{log.userEmail}</td>
                  <td className="py-2.5 text-teal-400">{log.role}</td>
                  <td className="py-2.5 max-w-[240px] truncate text-slate-200">{log.action}</td>
                  <td className="py-2.5 text-slate-500">{log.ipAddress}</td>
                  <td className="py-2.5 text-center">
                    <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[9px] bg-teal-500/10 text-teal-400 border border-teal-500/25">
                      {log.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
