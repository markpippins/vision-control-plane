import React, { useState } from 'react';
import { WorkRequestDAG, PathResult, ValidationResult } from '../types/vision';
import {
  GitGraph,
  Play,
  Search,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ArrowRight,
  Layers,
  Cpu,
  RefreshCw,
  Zap,
  Activity,
  Sliders
} from 'lucide-react';

interface DAGVisualizerProps {
  dag: WorkRequestDAG;
  onRunPathFinder: (sourceId: string, targetId: string) => Promise<PathResult>;
  onRunValidation: (wrId: string) => Promise<ValidationResult>;
  onRefreshDAG: () => void;
}

export const DAGVisualizer: React.FC<DAGVisualizerProps> = ({
  dag,
  onRunPathFinder,
  onRunValidation,
  onRefreshDAG
}) => {
  const safeDag = dag && typeof dag === 'object' ? dag : { nodes: {}, edges: [], total_nodes: 0, depth: 0, compilation_status: 'UNKNOWN', root_wr_id: '' };
  const safeNodes = safeDag.nodes && typeof safeDag.nodes === 'object' ? safeDag.nodes : {};
  const safeEdges = Array.isArray(safeDag.edges) ? safeDag.edges : [];
  const nodeKeys = Object.keys(safeNodes);

  const [selectedNodeId, setSelectedNodeId] = useState<string>(safeDag.root_wr_id || nodeKeys[0] || '');
  const [sourceNodeId, setSourceNodeId] = useState<string>(safeDag.root_wr_id || nodeKeys[0] || '');
  const [targetNodeId, setTargetNodeId] = useState<string>(nodeKeys[nodeKeys.length - 1] || '');

  const [pathResult, setPathResult] = useState<PathResult | null>(null);
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null);
  const [loadingPath, setLoadingPath] = useState<boolean>(false);
  const [loadingValidation, setLoadingValidation] = useState<boolean>(false);

  const selectedNode = safeNodes[selectedNodeId] || safeNodes[nodeKeys[0]] || null;

  const handlePathSearch = async () => {
    if (!sourceNodeId || !targetNodeId) return;
    setLoadingPath(true);
    try {
      const res = await onRunPathFinder(sourceNodeId, targetNodeId);
      setPathResult(res);
    } finally {
      setLoadingPath(false);
    }
  };

  const handleValidate = async () => {
    if (!selectedNodeId) return;
    setLoadingValidation(true);
    try {
      const res = await onRunValidation(selectedNodeId);
      setValidationResult(res);
    } finally {
      setLoadingValidation(false);
    }
  };

  // Group nodes by depth
  const depthGroups: Record<number, any[]> = {};
  Object.values(safeNodes).forEach((node: any) => {
    if (!node) return;
    const d = node.depth ?? 0;
    if (!depthGroups[d]) depthGroups[d] = [];
    depthGroups[d].push(node);
  });

  const isNodeInPath = (wr_id: string) => {
    return Array.isArray(pathResult?.path) && pathResult.path.includes(wr_id);
  };

  return (
    <div className="p-4 space-y-4 max-h-[calc(100vh-80px)] overflow-y-auto bg-[#050505] text-slate-100 font-sans">
      {/* Top Controls Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between bg-[#0a0a0a] p-3.5 rounded-lg border border-white/10 space-y-2 md:space-y-0 font-mono text-xs shadow-xl">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <GitGraph className="w-4 h-4 text-sky-400" />
            <span className="font-bold text-white text-sm tracking-wide">DAG COMPILER & PATH TRAVERSAL ENGINE</span>
          </div>
          <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded font-bold uppercase tracking-wider">
            {(safeDag.compilation_status || 'COMPLETED').toUpperCase()}
          </span>
        </div>

        <div className="flex items-center gap-3 text-slate-400">
          <span>DAG_ID: <strong className="text-indigo-400">{safeDag.dag_id || 'dag-root'}</strong></span>
          <span>Nodes: <strong className="text-slate-200">{safeDag.total_nodes || nodeKeys.length}</strong></span>
          <span>Edges: <strong className="text-slate-200">{safeEdges.length}</strong></span>
          <button
            onClick={onRefreshDAG}
            className="p-1 text-slate-400 hover:text-slate-100 bg-white/5 hover:bg-white/10 border border-white/10 rounded transition-colors"
            title="Re-compile DAG"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Grid: Graph Visualizer (Left 8 cols) + Path Finding & Validation Tools (Right 4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left Column: Interactive Graph Topology */}
        <div className="lg:col-span-8 bg-[#0d0d0d] border border-white/10 rounded-lg p-4 flex flex-col space-y-4 shadow-2xl">
          <div className="flex items-center justify-between border-b border-white/5 pb-2 font-mono text-xs">
            <h2 className="font-bold text-white flex items-center gap-2 uppercase tracking-wide">
              <Layers className="w-3.5 h-3.5 text-indigo-400" />
              <span>HIERARCHICAL NODE TOPOLOGY (DEPTH LEVELS 0 - {dag.depth})</span>
            </h2>
            <span className="text-[10px] text-slate-500">Click node to inspect metadata</span>
          </div>

          {/* Depth Level Rows */}
          <div className="space-y-4 py-2">
            {Object.keys(depthGroups)
              .sort()
              .map((depthStr) => {
                const depth = Number(depthStr);
                const nodesAtDepth = depthGroups[depth];

                return (
                  <div key={depth} className="space-y-1.5 font-mono text-xs">
                    <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
                      <span>DEPTH LEVEL {depth}</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                      {nodesAtDepth.map((node) => {
                        const isSelected = selectedNodeId === node.wr_id;
                        const inPath = isNodeInPath(node.wr_id);

                        return (
                          <div
                            key={node.wr_id}
                            onClick={() => setSelectedNodeId(node.wr_id)}
                            className={`p-3 rounded-lg border cursor-pointer transition-all space-y-2 relative ${
                              inPath
                                ? 'bg-amber-500/20 border-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.3)]'
                                : isSelected
                                ? 'bg-white/10 border-indigo-500 shadow-[0_0_15px_rgba(79,70,229,0.3)]'
                                : 'bg-white/5 border-white/5 hover:border-white/15'
                            }`}
                          >
                            <div className="flex items-center justify-between text-[11px]">
                              <span className="font-bold text-indigo-400">{node.wr_id}</span>
                              <span className="px-1.5 py-0.2 bg-black/40 border border-white/5 rounded text-[10px] text-slate-300 font-bold">
                                P{node.priority}
                              </span>
                            </div>

                            <div className="text-xs font-sans text-slate-200 line-clamp-2 leading-snug font-medium">
                              {node.intent}
                            </div>

                            <div className="flex items-center justify-between pt-1 border-t border-white/5 text-[10px] text-slate-500 font-mono">
                              <span>Status: <strong className="text-slate-200">{node.status}</strong></span>
                              <span>Childs: {node.children?.length || 0}</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
          </div>

          {/* Explicit DAG Edges Table */}
          <div className="pt-2 border-t border-white/5 font-mono text-xs space-y-2">
            <h3 className="font-bold text-slate-300 text-[11px] uppercase tracking-wide">EXPLICIT DIRECTED EDGES ({dag.edges.length})</h3>
            <div className="overflow-x-auto max-h-36">
              <table className="w-full text-left text-[11px] border-collapse">
                <thead>
                  <tr className="bg-white/5 text-slate-400 border-b border-white/10 uppercase font-bold">
                    <th className="py-1.5 px-2">Edge ID</th>
                    <th className="py-1.5 px-2">Parent WR</th>
                    <th className="py-1.5 px-2">Child WR</th>
                    <th className="py-1.5 px-2">Edge Type</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-slate-300">
                  {dag.edges.map((e) => (
                    <tr key={e.edge_id} className="hover:bg-indigo-500/5 transition-colors">
                      <td className="py-1.5 px-2 font-semibold text-indigo-400">{e.edge_id}</td>
                      <td className="py-1.5 px-2 text-slate-200">{e.parent_wr_id}</td>
                      <td className="py-1.5 px-2 text-sky-300">{e.child_wr_id}</td>
                      <td className="py-1.5 px-2">
                        <span className="px-1.5 py-0.2 bg-black/40 text-purple-300 border border-white/5 rounded text-[10px]">
                          {e.edge_type}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column: Path Finder & Structural Validator Tooling */}
        <div className="lg:col-span-4 space-y-4">
          {/* Path Finder Widget */}
          <div className="bg-[#0d0d0d] border border-white/10 rounded-lg p-4 space-y-3 font-mono text-xs shadow-2xl">
            <div className="flex items-center gap-2 text-amber-400 font-bold border-b border-white/5 pb-2 uppercase tracking-wide">
              <Zap className="w-4 h-4" />
              <span>SHORTEST PATH TRAVERSAL FINDER</span>
            </div>

            <div className="space-y-2">
              <div>
                <label className="text-[10px] text-slate-400 font-bold uppercase">SOURCE WORK REQUEST</label>
                <select
                  value={sourceNodeId}
                  onChange={(e) => setSourceNodeId(e.target.value)}
                  className="w-full bg-black/40 border border-white/5 rounded p-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500/50 mt-1"
                >
                  {nodeKeys.map((id) => (
                    <option key={id} value={id}>
                      {id}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[10px] text-slate-400 font-bold uppercase">TARGET WORK REQUEST</label>
                <select
                  value={targetNodeId}
                  onChange={(e) => setTargetNodeId(e.target.value)}
                  className="w-full bg-black/40 border border-white/5 rounded p-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500/50 mt-1"
                >
                  {nodeKeys.map((id) => (
                    <option key={id} value={id}>
                      {id}
                    </option>
                  ))}
                </select>
              </div>

              <button
                onClick={handlePathSearch}
                disabled={loadingPath}
                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2 rounded-lg transition-all shadow-[0_0_15px_rgba(79,70,229,0.4)] flex items-center justify-center gap-1.5 mt-2"
              >
                {loadingPath ? (
                  <span>Searching Graph...</span>
                ) : (
                  <>
                    <span>Calculate Shortest Path</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </div>

            {pathResult && (
              <div className="bg-black/40 p-3 rounded-lg border border-white/10 space-y-2">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-400">PATH EXISTS:</span>
                  <span className={pathResult.exists ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
                    {pathResult.exists ? 'YES' : 'NO'}
                  </span>
                </div>

                {pathResult.exists && (
                  <div className="space-y-1">
                    <div className="text-[10px] text-slate-500 font-bold uppercase">TRAVERSAL SEQUENCE ({pathResult.length} NODES):</div>
                    <div className="p-2.5 bg-black/60 rounded border border-white/5 font-mono text-[11px] text-amber-300 break-all space-y-1">
                      {pathResult.path.map((nodeId, idx) => (
                        <div key={nodeId} className="flex items-center gap-1.5">
                          <span className="text-slate-500">{idx + 1}.</span>
                          <span className="font-bold text-slate-100">{nodeId}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Structural Validation Runner Widget */}
          <div className="bg-[#0d0d0d] border border-white/10 rounded-lg p-4 space-y-3 font-mono text-xs shadow-2xl">
            <div className="flex items-center gap-2 text-emerald-400 font-bold border-b border-white/5 pb-2 uppercase tracking-wide">
              <CheckCircle2 className="w-4 h-4" />
              <span>6-PASS STRUCTURAL VALIDATOR</span>
            </div>

            <p className="text-[11px] text-slate-400 font-sans leading-relaxed">
              Checks Tarjan SCC cycles, orphan nodes, depth violations, and governance policies.
            </p>

            <button
              onClick={handleValidate}
              disabled={loadingValidation}
              className="w-full bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10 py-2 rounded-lg font-bold transition-colors flex items-center justify-center gap-1.5"
            >
              {loadingValidation ? <span>Running 6-Pass Validations...</span> : <span>Run DAG Structural Check</span>}
            </button>

            {validationResult && (
              <div className="bg-black/40 p-3 rounded-lg border border-white/10 space-y-2">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-400">GRAPH VALIDITY:</span>
                  <span className={validationResult.valid ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
                    {validationResult.valid ? 'VALID (PASSED)' : 'INVALID (ISSUES FOUND)'}
                  </span>
                </div>

                {validationResult.issues.length > 0 ? (
                  <div className="space-y-1">
                    <div className="text-[10px] text-rose-400 font-bold">ISSUES DETECTED:</div>
                    {validationResult.issues.map((iss, idx) => (
                      <div key={idx} className="p-2 bg-rose-500/10 border border-rose-500/30 rounded text-rose-200 text-[10px] space-y-0.5">
                        <div className="font-bold">{iss.issue_type.toUpperCase()}: {iss.wr_id}</div>
                        <div>{iss.message}</div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-[11px] text-emerald-400 font-mono">
                    ✓ 0 Cycles, 0 Orphans, 0 Depth Violations detected in DAG topology.
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
