import React, { useState } from 'react';
import { LifecycleEvent, GovernanceEvent, ReceiptIngestRecord } from '../types/vision';
import { ShieldCheck, Activity, CheckCircle2, AlertTriangle, Key, Database, FileText } from 'lucide-react';

interface AuditEventsViewProps {
  lifecycleEvents: LifecycleEvent[];
  governanceEvents: GovernanceEvent[];
  receipts: ReceiptIngestRecord[];
}

export const AuditEventsView: React.FC<AuditEventsViewProps> = ({
  lifecycleEvents,
  governanceEvents,
  receipts
}) => {
  const safeLifecycle = Array.isArray(lifecycleEvents) ? lifecycleEvents : [];
  const safeGovernance = Array.isArray(governanceEvents) ? governanceEvents : [];
  const safeReceipts = Array.isArray(receipts) ? receipts : [];
  const [activeTab, setActiveTab] = useState<'lifecycle' | 'governance' | 'receipts'>('lifecycle');

  return (
    <div className="p-4 space-y-4 max-h-[calc(100vh-80px)] overflow-y-auto bg-[#050505] text-slate-100 font-sans">
      {/* Header */}
      <div className="flex items-center justify-between bg-[#0a0a0a] p-3.5 rounded-lg border border-white/10 font-mono text-sm shadow-xl">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span className="font-bold text-white text-sm tracking-wide">BITEMPORAL AUDIT & GOVERNANCE LEDGER</span>
        </div>
        <span className="text-slate-400">Schema: <strong className="text-indigo-400">vision.lifecycle_events</strong></span>
      </div>

      {/* Selector Tabs */}
      <div className="flex items-center gap-2 border-b border-white/5 pb-2 font-mono text-sm">
        <button
          onClick={() => setActiveTab('lifecycle')}
          className={`px-3 py-1.5 rounded-lg transition-all font-bold ${
            activeTab === 'lifecycle'
              ? 'bg-indigo-600 text-white shadow-[0_0_15px_rgba(79,70,229,0.4)]'
              : 'bg-white/5 text-slate-400 hover:text-slate-200 border border-white/5'
          }`}
        >
          Lifecycle Events ({safeLifecycle.length})
        </button>
        <button
          onClick={() => setActiveTab('governance')}
          className={`px-3 py-1.5 rounded-lg transition-all font-bold ${
            activeTab === 'governance'
              ? 'bg-indigo-600 text-white shadow-[0_0_15px_rgba(79,70,229,0.4)]'
              : 'bg-white/5 text-slate-400 hover:text-slate-200 border border-white/5'
          }`}
        >
          Governance Events ({safeGovernance.length})
        </button>
        <button
          onClick={() => setActiveTab('receipts')}
          className={`px-3 py-1.5 rounded-lg transition-all font-bold ${
            activeTab === 'receipts'
              ? 'bg-indigo-600 text-white shadow-[0_0_15px_rgba(79,70,229,0.4)]'
              : 'bg-white/5 text-slate-400 hover:text-slate-200 border border-white/5'
          }`}
        >
          Receipt Ingest Records ({safeReceipts.length})
        </button>
      </div>

      {/* Tab Contents */}
      {activeTab === 'lifecycle' && (
        <div className="bg-[#0d0d0d] border border-white/10 rounded-lg p-4 space-y-3 font-mono text-sm shadow-2xl">
          <h2 className="font-bold text-white border-b border-white/5 pb-2 uppercase tracking-wide flex items-center gap-2">
            <Activity className="w-3.5 h-3.5 text-indigo-400" />
            <span>WORK REQUEST LIFECYCLE TRANSITION LOGS</span>
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white/5 text-slate-400 border-b border-white/10 text-[11px] uppercase font-bold">
                  <th className="py-2.5 px-3">EVENT ID</th>
                  <th className="py-2.5 px-3">WR ID</th>
                  <th className="py-2.5 px-3">TRANSITION</th>
                  <th className="py-2.5 px-3">ACTOR</th>
                  <th className="py-2.5 px-3">REASON</th>
                  <th className="py-2.5 px-3">TIMESTAMP</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-slate-200">
                {safeLifecycle.map((e) => (
                  <tr key={e.event_id} className="hover:bg-indigo-500/5 transition-colors">
                    <td className="py-2.5 px-3 font-semibold text-indigo-400">{e.event_id}</td>
                    <td className="py-2.5 px-3 text-sky-300 font-bold">{e.wr_id}</td>
                    <td className="py-2.5 px-3">
                      <span className="text-slate-400">{e.from_state || 'NONE'}</span> &rarr;{' '}
                      <strong className="text-emerald-400">{e.to_state}</strong>
                    </td>
                    <td className="py-2.5 px-3 text-slate-300">{e.actor}</td>
                    <td className="py-2.5 px-3 font-sans text-slate-300 max-w-xs truncate">{e.reason}</td>
                    <td className="py-2.5 px-3 text-slate-400 text-[11px]">{e.created_at || 'just now'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'governance' && (
        <div className="bg-[#0d0d0d] border border-white/10 rounded-lg p-4 space-y-3 font-mono text-sm shadow-2xl">
          <h2 className="font-bold text-white border-b border-white/5 pb-2 uppercase tracking-wide flex items-center gap-2">
            <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
            <span>GOVERNANCE & POLICY CHECK AUDIT RECORDS</span>
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white/5 text-slate-400 border-b border-white/10 text-[11px] uppercase font-bold">
                  <th className="py-2.5 px-3">EVENT ID</th>
                  <th className="py-2.5 px-3">EVENT TYPE</th>
                  <th className="py-2.5 px-3">WR ID</th>
                  <th className="py-2.5 px-3">PAYLOAD / POLICY</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-slate-200">
                {safeGovernance.map((g) => (
                  <tr key={g.event_id} className="hover:bg-indigo-500/5 transition-colors">
                    <td className="py-2.5 px-3 font-semibold text-purple-300">{g.event_id}</td>
                    <td className="py-2.5 px-3 font-bold text-emerald-400">{g.event_type}</td>
                    <td className="py-2.5 px-3 text-sky-300 font-bold">{g.work_request_id}</td>
                    <td className="py-2.5 px-3 text-slate-300 max-w-md truncate">
                      {JSON.stringify(g.payload)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'receipts' && (
        <div className="bg-[#0d0d0d] border border-white/10 rounded-lg p-4 space-y-3 font-mono text-sm shadow-2xl">
          <h2 className="font-bold text-white border-b border-white/5 pb-2 uppercase tracking-wide flex items-center gap-2">
            <FileText className="w-3.5 h-3.5 text-amber-400" />
            <span>RECEIPT INGESTION SHA-256 HASH VERIFICATION</span>
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white/5 text-slate-400 border-b border-white/10 text-[11px] uppercase font-bold">
                  <th className="py-2.5 px-3">RECEIPT ID</th>
                  <th className="py-2.5 px-3">WR ID</th>
                  <th className="py-2.5 px-3">EXECUTOR</th>
                  <th className="py-2.5 px-3">SHA-256 HASH</th>
                  <th className="py-2.5 px-3">OUTCOME</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-slate-200">
                {safeReceipts.map((r) => (
                  <tr key={r.receipt_id} className="hover:bg-indigo-500/5 transition-colors">
                    <td className="py-2.5 px-3 font-semibold text-amber-300">{r.receipt_id}</td>
                    <td className="py-2.5 px-3 text-sky-300 font-bold">{r.work_request_id}</td>
                    <td className="py-2.5 px-3 text-slate-300">{r.executor_id}</td>
                    <td className="py-2.5 px-3 font-mono text-[10px] text-slate-400 truncate max-w-xs">
                      {r.receipt_hash}
                    </td>
                    <td className="py-2.5 px-3">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] border font-bold uppercase ${
                          r.result === 'SUCCESS'
                            ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                            : 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                        }`}
                      >
                        {r.result}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
