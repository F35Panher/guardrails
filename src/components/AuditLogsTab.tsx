import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Search, 
  Trash2, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  Download,
  Filter,
  Eye,
  X
} from "lucide-react";
import { AuditLog } from "../types";

interface AuditLogsTabProps {
  auditLogs: AuditLog[];
  handleClearLogs: () => void;
}

export default function AuditLogsTab({ auditLogs, handleClearLogs }: AuditLogsTabProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | "PASSED" | "BLOCKED" | "WARNING">("ALL");
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);

  // Filter logs nicely
  const filtered = auditLogs.filter(log => {
    const matchesSearch = 
      log.prompt.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.userId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (log.reason && log.reason.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesStatus = 
      statusFilter === "ALL" || 
      log.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Handle mock CSV export
  const exportCSV = () => {
    if (auditLogs.length === 0) {
      alert("No log records available to export.");
      return;
    }
    const headers = ["ID", "Timestamp", "User ID", "IP Address", "Status", "Violations", "Prompt"];
    const rows = auditLogs.map(log => [
      log.id,
      new Date(log.timestamp).toISOString(),
      log.userId,
      log.userIP,
      log.status,
      log.reason || "None",
      log.prompt.replace(/"/g, '""')
    ]);
    
    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(","), ...rows.map(e => e.map(val => `"${val}"`).join(","))].join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `guardrail_audit_ledger_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Audit Ledger Timeline</h2>
          <p className="text-sm text-slate-500">Chronological history of evaluated prompts, threat classes, and metadata.</p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={exportCSV}
            className="px-3 py-2 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl text-slate-700 font-bold text-xs inline-flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download CSV</span>
          </button>

          <button
            onClick={handleClearLogs}
            className="px-3 py-2 bg-rose-50 border border-rose-100 hover:bg-rose-100 text-rose-700 rounded-xl font-bold text-xs inline-flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Purge Ledger</span>
          </button>
        </div>
      </div>

      {/* Filter and search bar card */}
      <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-xs flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <span className="absolute inset-y-0 left-3 flex items-center text-slate-400">
            <Search className="w-4 h-4" />
          </span>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 pl-9 pr-4 text-xs font-semibold focus:outline-none focus:border-indigo-500 text-slate-800 placeholder-slate-400"
            placeholder="Search by username, prompt text, or attack reason..."
          />
        </div>

        <div className="flex gap-2 shrink-0 overflow-x-auto">
          {(["ALL", "PASSED", "BLOCKED", "WARNING"] as const).map((filterVal) => (
            <button
              key={filterVal}
              onClick={() => setStatusFilter(filterVal)}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                statusFilter === filterVal
                  ? "bg-slate-900 text-white"
                  : "bg-slate-50 text-slate-500 hover:bg-slate-100 border border-slate-200"
              }`}
            >
              {filterVal}
            </button>
          ))}
        </div>
      </div>

      {/* Logs Table Area */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/50 text-[10px] uppercase font-bold tracking-widest text-slate-400">
                <th className="px-6 py-3.5">Timestamp</th>
                <th className="px-6 py-3.5">User Identity</th>
                <th className="px-6 py-3.5">Breaches</th>
                <th className="px-6 py-3.5">Status</th>
                <th className="px-6 py-3.5 text-right w-24">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-400">
                    <AlertTriangle className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                    <p className="text-xs font-bold">No ledger logs match current parameters.</p>
                    <p className="text-[10px] text-slate-400 mt-1">Simulate prompts in the Sandbox playground to record transactions here.</p>
                  </td>
                </tr>
              ) : (
                filtered.map((log) => {
                  const dateStr = new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
                  return (
                    <tr key={log.id} className="hover:bg-slate-50/70 transition-colors group">
                      <td className="px-6 py-3.5 text-xs font-mono text-slate-400 italic">
                        {dateStr}
                      </td>
                      <td className="px-6 py-3.5">
                        <div className="text-xs font-bold text-slate-800">{log.userId}</div>
                        <div className="text-[10px] text-slate-400 font-mono mt-0.5">{log.userIP}</div>
                      </td>
                      <td className="px-6 py-3.5">
                        {log.reason ? (
                          <span className="px-2 py-0.5 rounded-md bg-rose-50 text-rose-700 text-[10px] font-extrabold uppercase tracking-tight border border-rose-100">
                            {log.reason}
                          </span>
                        ) : (
                          <span className="text-[11px] text-slate-400 font-medium">No violations found</span>
                        )}
                      </td>
                      <td className="px-6 py-3.5">
                        <span className={`inline-flex items-center gap-1.5 text-xs font-bold ${
                          log.status === "PASSED"
                            ? "text-emerald-600"
                            : log.status === "BLOCKED"
                            ? "text-rose-600"
                            : "text-amber-600"
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${
                            log.status === "PASSED"
                              ? "bg-emerald-500"
                              : log.status === "BLOCKED"
                              ? "bg-rose-500"
                              : "bg-amber-500"
                          }`}></span>
                          {log.status}
                        </span>
                      </td>
                      <td className="px-6 py-3.5 text-right">
                        <button
                          onClick={() => setSelectedLog(log)}
                          className="px-2.5 py-1.5 bg-slate-50 hover:bg-indigo-50 hover:text-indigo-600 group-hover:bg-indigo-50 border border-slate-200 group-hover:border-indigo-100 rounded-lg text-slate-500 text-xs font-bold inline-flex items-center gap-1 transition-all cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Inspect</span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Inspect Modal overlay */}
      <AnimatePresence>
        {selectedLog && (
          <div className="fixed inset-0 bg-slate-900/60 z-[999] flex items-center justify-center p-4 backdrop-blur-xs">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white border border-slate-250 w-full max-w-xl rounded-2xl overflow-hidden shadow-xl"
            >
              <div className="px-6 py-4 border-b border-slate-200 bg-slate-50/50 flex justify-between items-center">
                <h4 className="font-bold text-slate-800 text-sm">Payload Transaction Inspector</h4>
                <button
                  onClick={() => setSelectedLog(null)}
                  className="w-7 h-7 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg flex items-center justify-center transition-all"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 text-[11px]">
                    <span className="font-bold text-slate-400 block mb-0.5">TRANSACTION ID</span>
                    <span className="font-mono text-slate-700 font-semibold">{selectedLog.id}</span>
                  </div>

                  <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 text-[11px]">
                    <span className="font-bold text-slate-400 block mb-0.5">ORIGINATING USER</span>
                    <span className="font-mono text-slate-700 font-semibold">{selectedLog.userId}</span>
                  </div>

                  <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 text-[11px]">
                    <span className="font-bold text-slate-400 block mb-0.5">CREATION TIME</span>
                    <span className="text-slate-700 font-semibold">{new Date(selectedLog.timestamp).toLocaleString()}</span>
                  </div>

                  <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 text-[11px]">
                    <span className="font-bold text-slate-400 block mb-0.5">EVALUATION STATUS</span>
                    <span className={`font-bold uppercase tracking-wide ${
                      selectedLog.status === "PASSED" ? "text-emerald-600" : "text-rose-600"
                    }`}>
                      {selectedLog.status}
                    </span>
                  </div>
                </div>

                {/* Raw Prompt display area */}
                <div>
                  <span className="text-xs font-bold text-slate-400 block mb-1.5">Submitted Ingress Prompt Payload</span>
                  <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl font-mono text-xs leading-relaxed text-slate-200 select-all cursor-pointer h-32 overflow-y-auto">
                    "{selectedLog.prompt}"
                  </div>
                </div>

                {/* Breach comments reasons if any */}
                {selectedLog.reason && (
                  <div>
                    <span className="text-xs font-bold text-slate-400 block mb-1.5">Primary Infraction Comment</span>
                    <div className="bg-rose-50 border border-rose-100 text-[11px] font-medium leading-relaxed rounded-xl p-3.5 text-rose-850">
                      We detected a breach classification labelled: <strong className="uppercase font-extrabold">{selectedLog.reason}</strong>. This prompt sequence was halted at the ingress proxy layer and did not transit.
                    </div>
                  </div>
                )}
              </div>

              <div className="px-6 py-4 border-t border-slate-250 bg-slate-50/50 flex justify-end gap-2 text-xs">
                <button
                  onClick={() => setSelectedLog(null)}
                  className="px-4 py-2 bg-slate-900 text-white font-bold rounded-lg cursor-pointer"
                >
                  Dismiss Payload
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
