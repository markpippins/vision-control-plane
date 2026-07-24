import React, { useState } from 'react';
import { X, Zap, FileCode2 } from 'lucide-react';
import { PipelineStage, ArtifactType } from '../types/vision';

interface NewArtifactModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (payload: {
    title: string;
    stage: PipelineStage;
    type: ArtifactType;
    summary: string;
    wr_id?: string | null;
    content: Record<string, any>;
  }) => void;
  existingWrIds: string[];
}

export const NewArtifactModal: React.FC<NewArtifactModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  existingWrIds
}) => {
  const [title, setTitle] = useState('');
  const [stage, setStage] = useState<PipelineStage>('HARVEST');
  const [type, setType] = useState<ArtifactType>('SUMMARY');
  const [summary, setSummary] = useState('');
  const [wrId, setWrId] = useState<string>('');
  const [rawHtmlContent, setRawHtmlContent] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onSubmit({
      title: title.trim(),
      stage,
      type,
      summary: summary.trim(),
      wr_id: wrId || null,
      content: {
        raw_html: rawHtmlContent || undefined,
        note: 'Ingested via LOSM Vision UI Control Surface'
      }
    });

    setTitle('');
    setSummary('');
    setRawHtmlContent('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 font-sans select-none">
      <div className="bg-[#0d0d0d] border border-white/10 rounded-xl w-full max-w-lg p-5 space-y-4 shadow-2xl">
        <div className="flex items-center justify-between border-b border-white/5 pb-3">
          <h2 className="text-sm font-mono font-bold text-white flex items-center gap-2 uppercase tracking-wide">
            <Zap className="w-4 h-4 text-purple-400" />
            <span>ATTACH PROCESS ARTIFACT</span>
          </h2>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-white rounded">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3 font-mono text-xs">
          <div>
            <label className="text-[10px] text-slate-400 font-bold uppercase">ARTIFACT TITLE *</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. HTML Session Harvest #9912 or Specification Spec-01"
              className="w-full bg-black/40 border border-white/5 rounded-lg p-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500/50 font-sans mt-1"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] text-slate-400 font-bold uppercase">PIPELINE STAGE</label>
              <select
                value={stage}
                onChange={(e) => setStage(e.target.value as PipelineStage)}
                className="w-full bg-black/40 border border-white/5 rounded-lg p-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500/50 mt-1"
              >
                <option value="HARVEST">1. Harvest (HTML Transcript)</option>
                <option value="CANDIDATE">2. Candidate</option>
                <option value="INTENT">3. Intent Record</option>
                <option value="REQUIREMENT">4. Requirement</option>
                <option value="SPECIFICATION">5. Specification</option>
                <option value="DELIBERATION">6. Deliberation Agenda</option>
                <option value="PLAN">7. Implementation Plan</option>
                <option value="WORK_REQUEST">8. Work Request Item</option>
              </select>
            </div>

            <div>
              <label className="text-[10px] text-slate-400 font-bold uppercase">ARTIFACT TYPE</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as ArtifactType)}
                className="w-full bg-black/40 border border-white/5 rounded-lg p-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500/50 mt-1"
              >
                <option value="SUMMARY">SUMMARY</option>
                <option value="PLAN">PLAN</option>
                <option value="CRITIQUE">CRITIQUE</option>
                <option value="SPEC">SPEC</option>
                <option value="EXECUTION">EXECUTION</option>
                <option value="PATCH">PATCH</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-[10px] text-slate-400 font-bold uppercase">ASSOCIATED WR_ID</label>
            <select
              value={wrId}
              onChange={(e) => setWrId(e.target.value)}
              className="w-full bg-black/40 border border-white/5 rounded-lg p-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500/50 mt-1"
            >
              <option value="">-- Unlinked --</option>
              {existingWrIds.map((id) => (
                <option key={id} value={id}>
                  {id}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-[10px] text-slate-400 font-bold uppercase">SUMMARY OVERVIEW</label>
            <textarea
              rows={2}
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              placeholder="Brief summary..."
              className="w-full bg-black/40 border border-white/5 rounded-lg p-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500/50 font-sans mt-1"
            />
          </div>

          {stage === 'HARVEST' && (
            <div>
              <label className="text-[10px] text-slate-400 font-bold uppercase">OPTIONAL RAW HTML TRANSCRIPT</label>
              <textarea
                rows={3}
                value={rawHtmlContent}
                onChange={(e) => setRawHtmlContent(e.target.value)}
                placeholder="<div className='font-mono'>[14:00] Agent log...</div>"
                className="w-full bg-black/40 border border-white/5 rounded-lg p-2 text-xs text-emerald-300 font-mono focus:outline-none focus:border-indigo-500/50 mt-1"
              />
            </div>
          )}

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
              className="px-4 py-1.5 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-lg shadow-[0_0_15px_rgba(168,85,247,0.4)] transition-all"
            >
              Attach Artifact
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
