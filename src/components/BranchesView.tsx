import React, { useState } from 'react';
import { Branch, PlanningTask } from '../types/vision';
import { GitBranch, Plus, CheckCircle2, XCircle, AlertCircle, ArrowRight, Layers } from 'lucide-react';

interface BranchesViewProps {
  branches: Branch[];
  workRequests: PlanningTask[];
  onCreateBranch: (payload: { wr_id: string; label?: string; parent_branch_id?: string | null; fork_point?: string | null }) => void;
}

export const BranchesView: React.FC<BranchesViewProps> = ({
  branches,
  workRequests,
  onCreateBranch
}) => {
  const safeBranches = Array.isArray(branches) ? branches : [];
  const safeWorkRequests = Array.isArray(workRequests) ? workRequests : [];
  const [selectedWrId, setSelectedWrId] = useState<string>(safeWorkRequests[0]?.wr_id || '');
  const [labelInput, setLabelInput] = useState<string>('experimental-branch-fork');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedWrId) return;
    onCreateBranch({
      wr_id: selectedWrId,
      label: labelInput
    });
    setLabelInput('');
  };

  return (
    <div className="p-4 space-y-4 max-h-[calc(100vh-80px)] overflow-y-auto bg-[#050505] text-slate-100 font-sans">
      {/* Top Header */}
      <div className="flex items-center justify-between bg-[#0a0a0a] p-3.5 rounded-lg border border-white/10 font-mono text-sm shadow-xl">
        <div className="flex items-center gap-2">
          <GitBranch className="w-4 h-4 text-sky-400" />
          <span className="font-bold text-white text-sm tracking-wide">BRANCH & FORK EXECUTION PATH MANAGER</span>
        </div>
        <span className="text-slate-400">Total Active Branches: <strong className="text-indigo-400">{safeBranches.length}</strong></span>
      </div>

      {/* Grid: Create New Branch (Left 4 cols) + Branches Table (Right 8 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Create Form */}
        <div className="lg:col-span-4 bg-[#0d0d0d] border border-white/10 rounded-lg p-4 space-y-3 font-mono text-sm shadow-2xl">
          <h2 className="font-bold text-white border-b border-white/5 pb-2 flex items-center gap-2 uppercase tracking-wide">
            <Plus className="w-4 h-4 text-indigo-400" />
            <span>FORK NEW EXECUTION BRANCH</span>
          </h2>

          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="text-[10px] text-slate-400 font-bold uppercase">TARGET WORK REQUEST</label>
              <select
                value={selectedWrId}
                onChange={(e) => setSelectedWrId(e.target.value)}
                className="w-full bg-black/40 border border-white/5 rounded p-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-500/50 mt-1"
              >
                {safeWorkRequests.map((w) => (
                  <option key={w.wr_id} value={w.wr_id}>
                    {w.wr_id} - {(w.intent || '').slice(0, 32)}...
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[10px] text-slate-400 font-bold uppercase">HUMAN READABLE BRANCH LABEL</label>
              <input
                type="text"
                value={labelInput}
                onChange={(e) => setLabelInput(e.target.value)}
                placeholder="e.g. async-optimization-fork"
                className="w-full bg-black/40 border border-white/5 rounded p-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-500/50 mt-1"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2 rounded-lg transition-all shadow-[0_0_15px_rgba(79,70,229,0.4)] flex items-center justify-center gap-1.5 mt-2"
            >
              <GitBranch className="w-3.5 h-3.5" />
              <span>Create Branch Fork</span>
            </button>
          </form>
        </div>

        {/* Branch Cards & Table */}
        <div className="lg:col-span-8 bg-[#0d0d0d] border border-white/10 rounded-lg p-4 space-y-3 font-mono text-sm shadow-2xl">
          <h2 className="font-bold text-white border-b border-white/5 pb-2 uppercase tracking-wide">
            ACTIVE & HISTORICAL BRANCHES ({safeBranches.length})
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="bg-white/5 text-slate-400 border-b border-white/10 text-[11px] uppercase font-bold">
                  <th className="py-2.5 px-3">BRANCH ID</th>
                  <th className="py-2.5 px-3">LABEL</th>
                  <th className="py-2.5 px-3">PARENT WR</th>
                  <th className="py-2.5 px-3">SCORE</th>
                  <th className="py-2.5 px-3">STATUS</th>
                  <th className="py-2.5 px-3">CREATED AT</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-slate-200">
                {safeBranches.map((b) => {
                  const statusBadge =
                    b.status === 'active'
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                      : b.status === 'merged'
                      ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30'
                      : 'bg-rose-500/20 text-rose-300 border-rose-500/30';

                  return (
                    <tr key={b.branch_id} className="hover:bg-indigo-500/5 transition-colors">
                      <td className="py-2.5 px-3 font-semibold text-indigo-400">{b.branch_id}</td>
                      <td className="py-2.5 px-3 font-sans text-slate-100 font-medium">{b.label || 'unlabeled'}</td>
                      <td className="py-2.5 px-3 text-sky-300 font-bold">{b.wr_id}</td>
                      <td className="py-2.5 px-3 text-emerald-400 font-bold">{Math.round((b.score || 0.8) * 100)}%</td>
                      <td className="py-2.5 px-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] border font-bold uppercase ${statusBadge}`}>
                          {b.status.toUpperCase()}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-slate-400 text-[11px]">
                        {new Date(b.created_at).toLocaleTimeString()}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
