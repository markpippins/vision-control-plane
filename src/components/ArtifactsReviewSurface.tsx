import React, { useState } from 'react';
import { Artifact, PipelineStage, DeliberationParticipant } from '../types/vision';
import {
  FileCode2,
  Terminal,
  Search,
  CheckCircle2,
  XCircle,
  AlertCircle,
  UserCheck,
  Zap,
  ArrowRight,
  Plus,
  Code2,
  Sparkles,
  Layers,
  ChevronRight,
  HelpCircle
} from 'lucide-react';

interface ArtifactsReviewSurfaceProps {
  artifacts: Artifact[];
  onOpenNewArtifactModal: () => void;
  onPromoteArtifactStage: (artifactId: string, nextStage: PipelineStage) => void;
  searchQuery: string;
}

const STAGES: { id: PipelineStage; label: string; desc: string; color: string }[] = [
  { id: 'HARVEST', label: '1. Harvests', desc: 'Raw HTML Transcripts', color: 'text-emerald-400 bg-emerald-950/60 border-emerald-800' },
  { id: 'CANDIDATE', label: '2. Candidates', desc: 'Decomposed Action Items', color: 'text-sky-400 bg-sky-950/60 border-sky-800' },
  { id: 'INTENT', label: '3. Intent Records', desc: 'Granular Interests', color: 'text-indigo-400 bg-indigo-950/60 border-indigo-800' },
  { id: 'REQUIREMENT', label: '4. Requirements', desc: 'Promoted Features', color: 'text-purple-400 bg-purple-950/60 border-purple-800' },
  { id: 'SPECIFICATION', label: '5. Specifications', desc: 'Canonical Systems', color: 'text-blue-400 bg-blue-950/60 border-blue-800' },
  { id: 'DELIBERATION', label: '6. Deliberations', desc: 'Agendas & Role Votes', color: 'text-amber-400 bg-amber-950/60 border-amber-800' },
  { id: 'PLAN', label: '7. Tech Plans', desc: 'Execution Steps', color: 'text-teal-400 bg-teal-950/60 border-teal-800' },
  { id: 'WORK_REQUEST', label: '8. Work Requests', desc: 'Compiled DAG Tasks', color: 'text-rose-400 bg-rose-950/60 border-rose-800' }
];

export const ArtifactsReviewSurface: React.FC<ArtifactsReviewSurfaceProps> = ({
  artifacts,
  onOpenNewArtifactModal,
  onPromoteArtifactStage,
  searchQuery
}) => {
  const safeArtifacts = Array.isArray(artifacts) ? artifacts : [];
  const [activeStage, setActiveStage] = useState<PipelineStage>('HARVEST');
  const [selectedArtifactId, setSelectedArtifactId] = useState<string | null>(
    safeArtifacts[0]?.artifact_id || null
  );
  const [localSearch, setLocalSearch] = useState<string>('');
  const [showRawJson, setShowRawJson] = useState<boolean>(false);

  const q = (searchQuery || localSearch).toLowerCase();

  const stageArtifacts = safeArtifacts.filter((a) => {
    if (!a) return false;
    const stage = a.stage || 'CANDIDATE';
    if (stage !== activeStage) return false;
    if (q) {
      const matchTitle = (a.title || '').toLowerCase().includes(q);
      const matchSummary = (a.summary || '').toLowerCase().includes(q);
      const matchId = (a.artifact_id || '').toLowerCase().includes(q);
      if (!matchTitle && !matchSummary && !matchId) return false;
    }
    return true;
  });

  const selectedArtifact =
    safeArtifacts.find((a) => a?.artifact_id === selectedArtifactId) || stageArtifacts[0] || safeArtifacts[0];

  const getNextStage = (current: PipelineStage): PipelineStage | null => {
    const order: PipelineStage[] = [
      'HARVEST',
      'CANDIDATE',
      'INTENT',
      'REQUIREMENT',
      'SPECIFICATION',
      'DELIBERATION',
      'PLAN',
      'WORK_REQUEST'
    ];
    const idx = order.indexOf(current);
    return idx !== -1 && idx < order.length - 1 ? order[idx + 1] : null;
  };

  return (
    <div className="p-4 space-y-4 h-[calc(100vh-80px)] flex flex-col bg-[#050505] text-slate-100 font-sans">
      {/* Top Stage Navigation Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2 bg-[#0a0a0a] p-2.5 rounded-lg border border-white/10 shadow-xl">
        {STAGES.map((st) => {
          const count = safeArtifacts.filter((a) => (a?.stage || 'CANDIDATE') === st.id).length;
          const isActive = activeStage === st.id;

          return (
            <button
              key={st.id}
              onClick={() => {
                setActiveStage(st.id);
                const first = artifacts.find((a) => (a.stage || 'CANDIDATE') === st.id);
                if (first) setSelectedArtifactId(first.artifact_id);
              }}
              className={`p-2.5 rounded-lg text-left font-mono transition-all border ${
                isActive
                  ? 'bg-indigo-600/20 border-indigo-500/60 text-indigo-300 shadow-[0_0_15px_rgba(79,70,229,0.2)]'
                  : 'bg-black/40 border-white/5 hover:border-white/15 text-slate-400'
              }`}
            >
              <div className="flex items-center justify-between text-xs font-bold">
                <span className={isActive ? 'text-indigo-300' : 'text-slate-200'}>{st.label}</span>
                <span className="px-1.5 py-0.2 text-[10px] bg-white/10 rounded text-slate-300 font-bold">{count}</span>
              </div>
              <div className="text-[10px] text-slate-500 truncate mt-1 font-sans">{st.desc}</div>
            </button>
          );
        })}
      </div>

      {/* Main Split Surface: Artifact List (Left) + Detail & Deliberation Panel (Right) */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-4 overflow-hidden">
        {/* Left Column: Artifact List */}
        <div className="lg:col-span-4 bg-[#0d0d0d] border border-white/10 rounded-lg p-3 flex flex-col gap-2 overflow-hidden shadow-2xl">
          <div className="flex items-center justify-between border-b border-white/5 pb-2">
            <h2 className="text-xs font-mono font-bold text-white flex items-center gap-2 uppercase tracking-wide">
              <FileCode2 className="w-3.5 h-3.5 text-purple-400" />
              <span>{activeStage} ARTIFACTS</span>
            </h2>
            <button
              onClick={onOpenNewArtifactModal}
              className="text-xs text-indigo-400 hover:text-indigo-300 font-mono flex items-center gap-1 font-bold"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>New</span>
            </button>
          </div>

          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-2.5" />
            <input
              type="text"
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              placeholder="Search stage artifacts..."
              className="w-full bg-black/40 border border-white/5 rounded pl-8 pr-3 py-1.5 text-xs text-slate-200 font-mono focus:outline-none focus:border-indigo-500/50"
            />
          </div>

          <div className="flex-1 overflow-y-auto space-y-2 pr-1">
            {stageArtifacts.length === 0 ? (
              <div className="text-center py-12 text-slate-500 font-mono text-xs italic">
                No artifacts in stage {activeStage}
              </div>
            ) : (
              stageArtifacts.map((art) => {
                const isSelected = selectedArtifact?.artifact_id === art.artifact_id;

                return (
                  <div
                    key={art.artifact_id}
                    onClick={() => setSelectedArtifactId(art.artifact_id)}
                    className={`p-3 rounded-lg border cursor-pointer transition-all space-y-1.5 font-mono text-xs ${
                      isSelected
                        ? 'bg-white/10 border-indigo-500/60 shadow-[0_0_15px_rgba(79,70,229,0.2)]'
                        : 'bg-white/5 border-white/5 hover:border-white/15'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-indigo-400 font-bold text-[11px]">{art.artifact_id}</span>
                      <span className="px-1.5 py-0.2 bg-black/40 border border-white/5 rounded text-[10px] text-slate-400">
                        {art.type}
                      </span>
                    </div>

                    <div className="font-sans font-bold text-white text-xs line-clamp-2">
                      {art.title || art.artifact_id}
                    </div>

                    <div className="text-[10px] text-slate-400 font-sans line-clamp-2">
                      {art.summary || 'No summary provided.'}
                    </div>

                    <div className="flex items-center justify-between pt-1 border-t border-white/5 text-[10px] text-slate-500">
                      <span>Conf: {Math.round((art.confidence || 0.9) * 100)}%</span>
                      <span>Model: {art.provenance?.model || 'nemotron-3-ultra'}</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column: Detailed Surface & Deliberation Inspector */}
        <div className="lg:col-span-8 bg-[#0d0d0d] border border-white/10 rounded-lg p-4 flex flex-col overflow-y-auto space-y-4 shadow-2xl">
          {selectedArtifact ? (
            <>
              {/* Header Details */}
              <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-white/5 pb-3 gap-2">
                <div>
                  <div className="flex items-center gap-2 font-mono text-xs">
                    <span className="text-indigo-400 font-bold">{selectedArtifact.artifact_id}</span>
                    <span className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30 text-[10px] uppercase font-bold tracking-widest">
                      STAGE: {selectedArtifact.stage || activeStage}
                    </span>
                    <span className="text-slate-400">Type: {selectedArtifact.type}</span>
                  </div>
                  <h1 className="text-base font-bold text-white mt-1 font-sans">
                    {selectedArtifact.title || selectedArtifact.artifact_id}
                  </h1>
                </div>

                <div className="flex items-center gap-2 font-mono text-xs">
                  <button
                    onClick={() => setShowRawJson(!showRawJson)}
                    className="px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded text-slate-300 flex items-center gap-1.5 font-bold"
                  >
                    <Code2 className="w-3.5 h-3.5" />
                    <span>{showRawJson ? 'View Rendered' : 'Raw JSON'}</span>
                  </button>

                  {getNextStage(selectedArtifact.stage || activeStage) && (
                    <button
                      onClick={() => {
                        const next = getNextStage(selectedArtifact.stage || activeStage);
                        if (next) onPromoteArtifactStage(selectedArtifact.artifact_id, next);
                      }}
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.3)] text-white rounded font-bold flex items-center gap-1.5 transition-all"
                    >
                      <span>Promote &rarr; {getNextStage(selectedArtifact.stage || activeStage)}</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Provenance Metadata Box */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 bg-black/40 p-3 rounded-lg border border-white/10 font-mono text-xs">
                <div>
                  <span className="text-slate-500 text-[10px] uppercase font-bold">PROVENANCE MODEL</span>
                  <div className="text-indigo-300 font-semibold truncate mt-0.5">
                    {selectedArtifact.provenance?.model || 'nvidia/nemotron-3-ultra-550b-a55b'}
                  </div>
                </div>
                <div>
                  <span className="text-slate-500 text-[10px] uppercase font-bold">ROLE / AUTHOR</span>
                  <div className="text-slate-200 mt-0.5">{selectedArtifact.provenance?.role || 'planner'}</div>
                </div>
                <div>
                  <span className="text-slate-500 text-[10px] uppercase font-bold">CONFIDENCE SCORE</span>
                  <div className="text-emerald-400 font-semibold mt-0.5">
                    {Math.round((selectedArtifact.confidence || 0.95) * 100)}%
                  </div>
                </div>
                <div>
                  <span className="text-slate-500 text-[10px] uppercase font-bold">ASSOCIATED WR_ID</span>
                  <div className="text-sky-300 mt-0.5">{selectedArtifact.wr_id || 'unlinked'}</div>
                </div>
              </div>

              {/* Content Render Surface */}
              {showRawJson ? (
                <div className="bg-black/60 p-4 rounded-lg border border-white/10 font-mono text-xs text-emerald-400 overflow-x-auto shadow-inner">
                  <pre>{JSON.stringify(selectedArtifact, null, 2)}</pre>
                </div>
              ) : (
                <div className="space-y-4 font-sans text-xs">
                  {/* Summary Box */}
                  <div className="bg-white/5 p-4 rounded-lg border border-white/10 space-y-1">
                    <h3 className="font-mono text-[11px] font-bold text-slate-400 uppercase tracking-wide">Artifact Overview</h3>
                    <p className="text-slate-200 leading-relaxed font-sans text-xs">
                      {selectedArtifact.summary || 'No summary overview defined for this artifact.'}
                    </p>
                  </div>

                  {/* HTML Transcript Harvest View */}
                  {selectedArtifact.html_transcript && (
                    <div className="space-y-2">
                      <h3 className="font-mono text-[11px] font-bold text-slate-400 uppercase tracking-wide flex items-center gap-1.5">
                        <Terminal className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Captured HTML Session Transcript</span>
                      </h3>
                      <div
                        className="bg-black/60 p-4 rounded-lg border border-white/10 font-mono text-xs"
                        dangerouslySetInnerHTML={{ __html: selectedArtifact.html_transcript }}
                      />
                    </div>
                  )}

                  {/* Deliberation Participants Panel */}
                  {selectedArtifact.participants && selectedArtifact.participants.length > 0 && (
                    <div className="space-y-2">
                      <h3 className="font-mono text-[11px] font-bold text-slate-400 uppercase tracking-wide flex items-center gap-1.5">
                        <UserCheck className="w-3.5 h-3.5 text-amber-400" />
                        <span>Deliberation Participants & Agent Votes</span>
                      </h3>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {selectedArtifact.participants.map((p) => {
                          const voteBadge =
                            p.vote === 'APPROVE'
                              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                              : p.vote === 'REJECT'
                              ? 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                              : 'bg-amber-500/20 text-amber-300 border-amber-500/30';

                          return (
                            <div key={p.id} className="bg-white/5 border border-white/10 p-3.5 rounded-lg space-y-2">
                              <div className="flex items-center justify-between">
                                <span className="font-bold text-white font-sans text-xs">{p.name}</span>
                                <span className={`px-2 py-0.5 text-[10px] font-mono font-bold border rounded ${voteBadge}`}>
                                  {p.vote}
                                </span>
                              </div>
                              <div className="text-[10px] font-mono text-slate-400">
                                Role: <strong className="text-slate-200">{p.role}</strong> · Feasibility:{' '}
                                <strong className="text-emerald-400">{Math.round(p.score * 100)}%</strong>
                              </div>
                              <p className="text-slate-300 text-[11px] leading-snug italic font-sans">
                                "{p.rationale}"
                              </p>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Key Content JSON Parameters */}
                  {selectedArtifact.content && (
                    <div className="space-y-2">
                      <h3 className="font-mono text-[11px] font-bold text-slate-400 uppercase tracking-wide">Payload Data</h3>
                      <div className="bg-black/60 p-3.5 rounded-lg border border-white/10 font-mono text-[11px] text-slate-300 overflow-x-auto space-y-1.5">
                        {Object.entries(selectedArtifact.content).map(([k, v]) => (
                          <div key={k} className="flex flex-col sm:flex-row sm:items-baseline border-b border-white/5 pb-1.5">
                            <span className="text-indigo-400 font-bold w-48 shrink-0">{k}:</span>
                            <span className="text-slate-200 truncate">
                              {typeof v === 'object' ? JSON.stringify(v) : String(v)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </>
          ) : (
            <div className="py-24 text-center text-slate-500 font-mono text-xs">
              Select an artifact on the left to inspect deliberation surfaces
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
