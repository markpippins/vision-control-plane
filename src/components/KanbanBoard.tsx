import React, { useState } from 'react';
import { PlanningTask, WorkStatus } from '../types/vision';
import {
  Plus,
  ArrowRight,
  ArrowLeft,
  Sliders,
  AlertTriangle,
  CheckCircle2,
  Trash2,
  Layers,
  Search,
  Zap,
  Tag
} from 'lucide-react';

interface KanbanBoardProps {
  workRequests: PlanningTask[];
  onUpdateStatus: (wr_id: string, newStatus: WorkStatus) => void;
  onDeleteWR: (wr_id: string) => void;
  onOpenNewWRModal: () => void;
  searchQuery: string;
}

const ALL_STATUSES: { id: WorkStatus; label: string; color: string; group: string }[] = [
  { id: 'NEW', label: '1. NEW', color: 'border-slate-700 bg-slate-900/80 text-slate-300', group: 'Triage' },
  { id: 'INTAKE', label: '2. INTAKE', color: 'border-sky-700 bg-sky-950/40 text-sky-300', group: 'Triage' },
  { id: 'PLAN_GENERATION', label: '3. PLAN GEN', color: 'border-purple-700 bg-purple-950/40 text-purple-300', group: 'Planning' },
  { id: 'PLAN_REVIEW', label: '4. PLAN REV', color: 'border-purple-600 bg-purple-950/40 text-purple-200', group: 'Planning' },
  { id: 'PLAN_APPROVAL_GATE', label: '5. APPROVAL', color: 'border-amber-700 bg-amber-950/40 text-amber-300', group: 'Planning' },
  { id: 'SPEC_GENERATION', label: '6. SPEC GEN', color: 'border-indigo-700 bg-indigo-950/40 text-indigo-300', group: 'Spec' },
  { id: 'EXECUTION', label: '7. EXECUTION', color: 'border-blue-700 bg-blue-950/40 text-blue-300', group: 'Execution' },
  { id: 'VALIDATION', label: '8. VALIDATION', color: 'border-amber-600 bg-amber-950/40 text-amber-200', group: 'Validation' },
  { id: 'COMPLETION', label: '9. COMPLETE', color: 'border-emerald-700 bg-emerald-950/40 text-emerald-300', group: 'Done' },
  { id: 'BLOCKED', label: 'BLOCKED', color: 'border-rose-700 bg-rose-950/40 text-rose-300', group: 'Issues' },
  { id: 'FAILED', label: 'FAILED', color: 'border-red-800 bg-red-950/60 text-red-300', group: 'Issues' }
];

const STATUS_ORDER: WorkStatus[] = [
  'NEW',
  'INTAKE',
  'PLAN_GENERATION',
  'PLAN_REVIEW',
  'PLAN_APPROVAL_GATE',
  'SPEC_GENERATION',
  'EXECUTION',
  'VALIDATION',
  'COMPLETION'
];

export const KanbanBoard: React.FC<KanbanBoardProps> = ({
  workRequests,
  onUpdateStatus,
  onDeleteWR,
  onOpenNewWRModal,
  searchQuery
}) => {
  const safeWorkRequests = Array.isArray(workRequests) ? workRequests : [];
  const [priorityFilter, setPriorityFilter] = useState<number>(0);
  const [localSearch, setLocalSearch] = useState<string>('');

  const activeSearch = searchQuery || localSearch;

  // Filter tasks
  const filteredTasks = safeWorkRequests.filter((wr) => {
    if (!wr) return false;
    if (priorityFilter > 0 && (wr.priority || 0) < priorityFilter) return false;
    if (activeSearch) {
      const q = activeSearch.toLowerCase();
      const matchId = (wr.wr_id || '').toLowerCase().includes(q);
      const matchIntent = (wr.intent || '').toLowerCase().includes(q);
      const matchStatus = (wr.status || '').toLowerCase().includes(q);
      if (!matchId && !matchIntent && !matchStatus) return false;
    }
    return true;
  });

  const advanceStatus = (current: WorkStatus): WorkStatus | null => {
    const idx = STATUS_ORDER.indexOf(current);
    if (idx !== -1 && idx < STATUS_ORDER.length - 1) {
      return STATUS_ORDER[idx + 1];
    }
    return null;
  };

  const regressStatus = (current: WorkStatus): WorkStatus | null => {
    const idx = STATUS_ORDER.indexOf(current);
    if (idx > 0) {
      return STATUS_ORDER[idx - 1];
    }
    return null;
  };

  return (
    <div className="p-4 space-y-3 h-[calc(100vh-80px)] flex flex-col bg-[#050505] text-slate-100 font-sans">
      {/* Top Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 bg-[#0a0a0a] p-3 rounded-lg border border-white/10 text-sm font-mono shadow-xl">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-slate-400">
            <Sliders className="w-3.5 h-3.5 text-indigo-400" />
            <span className="font-bold">Filter Priority:</span>
          </div>
          <div className="flex items-center gap-1">
            {[0, 5, 7, 9].map((p) => (
              <button
                key={p}
                onClick={() => setPriorityFilter(p)}
                className={`px-2.5 py-1 rounded transition-colors ${
                  priorityFilter === p
                    ? 'bg-indigo-600 text-white font-bold shadow-[0_0_10px_rgba(79,70,229,0.4)]'
                    : 'bg-white/5 text-slate-400 hover:text-white border border-white/5'
                }`}
              >
                {p === 0 ? 'All' : `P${p}+`}
              </button>
            ))}
          </div>

          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-2" />
            <input
              type="text"
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              placeholder="Filter tasks..."
              className="bg-black/40 border border-white/5 rounded pl-8 pr-2 py-1 text-sm text-slate-200 focus:outline-none focus:border-indigo-500/50 w-48"
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-slate-400">
            Showing <strong className="text-indigo-400">{filteredTasks.length}</strong> of {safeWorkRequests.length} tasks
          </span>
          <button
            onClick={onOpenNewWRModal}
            className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-1.5 rounded font-sans font-bold shadow-[0_0_15px_rgba(79,70,229,0.4)] transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Work Request</span>
          </button>
        </div>
      </div>

      {/* Horizontal Scrollable Kanban Columns */}
      <div className="flex-1 overflow-x-auto flex gap-3 pb-2 pt-1">
        {ALL_STATUSES.map((column) => {
          const colTasks = filteredTasks.filter((t) => t.status === column.id);

          return (
            <div
              key={column.id}
              className="w-72 shrink-0 bg-[#0d0d0d] border border-white/10 rounded-lg flex flex-col max-h-full overflow-hidden shadow-2xl"
            >
              {/* Column Header */}
              <div className={`p-3 border-b border-white/5 flex items-center justify-between text-sm font-mono font-bold ${column.color}`}>
                <span className="uppercase tracking-wider">{column.label}</span>
                <span className="px-2 py-0.5 bg-black/60 rounded border border-white/10 text-[11px] text-white">
                  {colTasks.length}
                </span>
              </div>

              {/* Cards Container */}
              <div className="p-2.5 space-y-2.5 overflow-y-auto flex-1 text-sm">
                {colTasks.length === 0 ? (
                  <div className="py-12 text-center text-slate-600 font-mono text-[11px] italic">
                    No items in {column.id}
                  </div>
                ) : (
                  colTasks.map((task) => {
                    const nextSt = advanceStatus(task.status);
                    const prevSt = regressStatus(task.status);

                    const priorityColor =
                      task.priority >= 9
                        ? 'text-rose-400 bg-rose-500/10 border-rose-500/30'
                        : task.priority >= 7
                        ? 'text-amber-400 bg-amber-500/10 border-amber-500/30'
                        : 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30';

                    return (
                      <div
                        key={task.wr_id}
                        className="bg-white/5 border border-white/10 hover:border-indigo-500/40 p-3 rounded-lg space-y-2 transition-all shadow-md group"
                      >
                        {/* Card Top: ID & Priority */}
                        <div className="flex items-start justify-between font-mono">
                          <span className="text-indigo-400 font-bold text-[11px]">{task.wr_id}</span>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${priorityColor}`}>
                            P{task.priority}
                          </span>
                        </div>

                        {/* Intent Statement */}
                        <p className="text-slate-200 text-sm font-sans leading-snug line-clamp-3">
                          {task.intent}
                        </p>

                        {/* Constraints / Parent Badge */}
                        <div className="flex flex-wrap gap-1 font-mono text-[10px]">
                          {task.parent_request_id && (
                            <span className="px-1.5 py-0.5 bg-black/40 text-indigo-300 border border-white/5 rounded flex items-center gap-1">
                              <Layers className="w-2.5 h-2.5" />
                              <span>{task.parent_request_id.slice(-8)}</span>
                            </span>
                          )}
                          {task.constraints && typeof task.constraints === 'object' && (
                            <span className="px-1.5 py-0.5 bg-black/40 text-slate-400 border border-white/5 rounded">
                              {Object.keys(task.constraints).length} constraint(s)
                            </span>
                          )}
                        </div>

                        {/* Card Actions Footer */}
                        <div className="pt-2 border-t border-white/5 flex items-center justify-between font-mono text-[10px]">
                          <div className="flex items-center gap-1">
                            {prevSt && (
                              <button
                                onClick={() => onUpdateStatus(task.wr_id, prevSt)}
                                className="p-1 bg-white/5 hover:bg-white/10 text-slate-400 rounded border border-white/10"
                                title={`Regress to ${prevSt}`}
                              >
                                <ArrowLeft className="w-3 h-3" />
                              </button>
                            )}
                            {nextSt && (
                              <button
                                onClick={() => onUpdateStatus(task.wr_id, nextSt)}
                                className="px-2 py-1 bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-200 rounded border border-indigo-500/40 flex items-center gap-1 font-bold"
                                title={`Advance to ${nextSt}`}
                              >
                                <span>Advance</span>
                                <ArrowRight className="w-3 h-3" />
                              </button>
                            )}
                          </div>

                          <div className="flex items-center gap-1">
                            {task.status !== 'BLOCKED' ? (
                              <button
                                onClick={() => onUpdateStatus(task.wr_id, 'BLOCKED')}
                                className="p-1 text-rose-400 hover:bg-rose-500/10 rounded"
                                title="Mark as Blocked"
                              >
                                <AlertTriangle className="w-3 h-3" />
                              </button>
                            ) : (
                              <button
                                onClick={() => onUpdateStatus(task.wr_id, 'INTAKE')}
                                className="p-1 text-emerald-400 hover:bg-emerald-500/10 rounded"
                                title="Unblock Task"
                              >
                                <CheckCircle2 className="w-3 h-3" />
                              </button>
                            )}

                            <button
                              onClick={() => onDeleteWR(task.wr_id)}
                              className="p-1 text-slate-500 hover:text-rose-400 hover:bg-white/5 rounded"
                              title="Delete Work Request"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
