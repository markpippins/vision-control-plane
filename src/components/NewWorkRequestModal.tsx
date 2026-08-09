import React, { useState } from 'react';
import { X, Plus, Layers } from 'lucide-react';

interface NewWorkRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (payload: {
    intent: string;
    priority: number;
    parent_request_id?: string | null;
    constraints?: Record<string, any>;
  }) => void;
  existingWrIds: string[];
}

export const NewWorkRequestModal: React.FC<NewWorkRequestModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  existingWrIds
}) => {
  const [intent, setIntent] = useState('');
  const [priority, setPriority] = useState<number>(7);
  const [parentId, setParentId] = useState<string>('');
  const [mustSupport, setMustSupport] = useState('nexus-console, nebula-ui');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!intent.trim()) return;

    onSubmit({
      intent: intent.trim(),
      priority,
      parent_request_id: parentId || null,
      constraints: {
        must_support: mustSupport.split(',').map((s) => s.trim()).filter(Boolean)
      }
    });

    setIntent('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 font-sans select-none">
      <div className="bg-[#0d0d0d] border border-white/10 rounded-xl w-full max-w-lg p-5 space-y-4 shadow-2xl">
        <div className="flex items-center justify-between border-b border-white/5 pb-3">
          <h2 className="text-sm font-mono font-bold text-white flex items-center gap-2 uppercase tracking-wide">
            <Plus className="w-4 h-4 text-indigo-400" />
            <span>CREATE NEW WORK REQUEST (LOSM)</span>
          </h2>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-white rounded">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3 font-mono text-sm">
          <div>
            <label className="text-[10px] text-slate-400 font-bold uppercase">INTENT STATEMENT / GOAL *</label>
            <textarea
              required
              rows={3}
              value={intent}
              onChange={(e) => setIntent(e.target.value)}
              placeholder="e.g. Synthesize Cross-Subsystem Autonomous Memory Synchronization Protocol"
              className="w-full bg-black/40 border border-white/5 rounded-lg p-2.5 text-sm text-slate-200 focus:outline-none focus:border-indigo-500/50 font-sans mt-1"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] text-slate-400 font-bold uppercase">PRIORITY (1-10)</label>
              <input
                type="number"
                min={1}
                max={10}
                value={priority}
                onChange={(e) => setPriority(Number(e.target.value))}
                className="w-full bg-black/40 border border-white/5 rounded-lg p-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-500/50 mt-1"
              />
            </div>

            <div>
              <label className="text-[10px] text-slate-400 font-bold uppercase">OPTIONAL PARENT WR_ID</label>
              <select
                value={parentId}
                onChange={(e) => setParentId(e.target.value)}
                className="w-full bg-black/40 border border-white/5 rounded-lg p-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-500/50 mt-1"
              >
                <option value="">-- Root Level Task --</option>
                {existingWrIds.map((id) => (
                  <option key={id} value={id}>
                    {id}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="text-[10px] text-slate-400 font-bold uppercase">MUST SUPPORT CONSTRAINTS (CSV)</label>
            <input
              type="text"
              value={mustSupport}
              onChange={(e) => setMustSupport(e.target.value)}
              placeholder="nexus-console, nebula-ui"
              className="w-full bg-black/40 border border-white/5 rounded-lg p-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-500/50 mt-1"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 bg-white/5 hover:bg-white/10 text-slate-300 rounded-lg border border-white/10 font-bold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-lg shadow-[0_0_15px_rgba(79,70,229,0.4)] transition-all"
            >
              Post Work Request
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
