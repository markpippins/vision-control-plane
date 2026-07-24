import React, { useState } from 'react';
import { Terminal, Play, Copy, Check, Code2, Globe } from 'lucide-react';
import { visionService } from '../api/visionService';

export const ApiWorkbench: React.FC = () => {
  const [selectedEndpoint, setSelectedEndpoint] = useState<string>('GET /api/work-requests');
  const [wrIdInput, setWrIdInput] = useState<string>('wr-a1b2c3d4-8811');
  const [targetWrIdInput, setTargetWrIdInput] = useState<string>('wr-e5f6a7b8-3055');
  const [postPayload, setPostPayload] = useState<string>(
    JSON.stringify(
      {
        intent: 'Synthesize Autonomous Agent Memory Cache Synchronization',
        priority: 8,
        constraints: { must_support: ['nexus-console', 'nebula-ui'] }
      },
      null,
      2
    )
  );

  const [responseStatus, setResponseStatus] = useState<number | null>(null);
  const [responseData, setResponseData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [copiedCurl, setCopiedCurl] = useState<boolean>(false);

  const endpoints = [
    { method: 'GET', path: '/health', desc: 'Liveness & service health check' },
    { method: 'GET', path: '/api/work-requests', desc: 'List work requests (paginated)' },
    { method: 'GET', path: '/api/work-requests/{wr_id}', desc: 'Get single work request by UUID' },
    { method: 'POST', path: '/api/work-requests', desc: 'Create a new work request' },
    { method: 'GET', path: '/api/branches', desc: 'List execution branches' },
    { method: 'GET', path: '/api/artifacts', desc: 'List structured artifacts' },
    { method: 'GET', path: '/api/work-requests/{wr_id}/dag', desc: 'Compile & fetch WorkRequestDAG' },
    { method: 'GET', path: '/api/work-requests/{source}/dag/path/{target}', desc: 'Shortest path traversal in DAG' },
    { method: 'GET', path: '/api/work-requests/{wr_id}/dag/validate', desc: 'Run 6-pass structural validation' }
  ];

  const getCurlCommand = () => {
    const isMock = visionService.isMockMode();
    const host = isMock ? 'http://localhost:3000' : 'http://localhost:8003';

    if (selectedEndpoint === 'GET /health') return `curl -X GET ${host}/health`;
    if (selectedEndpoint === 'GET /api/work-requests') return `curl -X GET ${host}/api/work-requests?limit=10`;
    if (selectedEndpoint === 'GET /api/work-requests/{wr_id}') return `curl -X GET ${host}/api/work-requests/${wrIdInput}`;
    if (selectedEndpoint === 'POST /api/work-requests') return `curl -X POST ${host}/api/work-requests -H "Content-Type: application/json" -d '${postPayload.replace(/\n/g, '')}'`;
    if (selectedEndpoint === 'GET /api/branches') return `curl -X GET ${host}/api/branches`;
    if (selectedEndpoint === 'GET /api/artifacts') return `curl -X GET ${host}/api/artifacts`;
    if (selectedEndpoint === 'GET /api/work-requests/{wr_id}/dag') return `curl -X GET ${host}/api/work-requests/${wrIdInput}/dag`;
    if (selectedEndpoint === 'GET /api/work-requests/{source}/dag/path/{target}') return `curl -X GET ${host}/api/work-requests/${wrIdInput}/dag/path/${targetWrIdInput}`;
    if (selectedEndpoint === 'GET /api/work-requests/{wr_id}/dag/validate') return `curl -X GET ${host}/api/work-requests/${wrIdInput}/dag/validate`;

    return `curl -X GET ${host}/health`;
  };

  const handleExecute = async () => {
    setLoading(true);
    setResponseStatus(null);
    setResponseData(null);

    try {
      if (selectedEndpoint === 'GET /health') {
        const res = await visionService.healthCheck();
        setResponseStatus(200);
        setResponseData(res);
      } else if (selectedEndpoint === 'GET /api/work-requests') {
        const res = await visionService.getWorkRequests();
        setResponseStatus(200);
        setResponseData(res);
      } else if (selectedEndpoint === 'GET /api/work-requests/{wr_id}') {
        const res = await visionService.getWorkRequest(wrIdInput);
        setResponseStatus(res ? 200 : 404);
        setResponseData(res || { detail: 'Work request not found' });
      } else if (selectedEndpoint === 'POST /api/work-requests') {
        const parsed = JSON.parse(postPayload);
        const res = await visionService.createWorkRequest(parsed);
        setResponseStatus(201);
        setResponseData(res);
      } else if (selectedEndpoint === 'GET /api/branches') {
        const res = await visionService.getBranches();
        setResponseStatus(200);
        setResponseData(res);
      } else if (selectedEndpoint === 'GET /api/artifacts') {
        const res = await visionService.getArtifacts();
        setResponseStatus(200);
        setResponseData(res);
      } else if (selectedEndpoint === 'GET /api/work-requests/{wr_id}/dag') {
        const res = await visionService.getDAG(wrIdInput);
        setResponseStatus(200);
        setResponseData(res);
      } else if (selectedEndpoint === 'GET /api/work-requests/{source}/dag/path/{target}') {
        const res = await visionService.findPath(wrIdInput, targetWrIdInput);
        setResponseStatus(200);
        setResponseData(res);
      } else if (selectedEndpoint === 'GET /api/work-requests/{wr_id}/dag/validate') {
        const res = await visionService.validateDAG(wrIdInput);
        setResponseStatus(200);
        setResponseData(res);
      }
    } catch (err: any) {
      setResponseStatus(500);
      setResponseData({ error: true, message: err.message });
    } finally {
      setLoading(false);
    }
  };

  const handleCopyCurl = () => {
    navigator.clipboard.writeText(getCurlCommand());
    setCopiedCurl(true);
    setTimeout(() => setCopiedCurl(false), 2000);
  };

  return (
    <div className="p-4 space-y-4 max-h-[calc(100vh-80px)] overflow-y-auto bg-[#050505] text-slate-100 font-sans">
      {/* Header */}
      <div className="flex items-center justify-between bg-[#0a0a0a] p-3.5 rounded-lg border border-white/10 font-mono text-xs shadow-xl">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-indigo-400" />
          <span className="font-bold text-white text-sm tracking-wide">INTERACTIVE REST API EXPLORER & WORKBENCH</span>
        </div>
        <span className="text-slate-400">Target Server: <strong className="text-emerald-400">:8003 (FastAPI)</strong></span>
      </div>

      {/* Grid: Endpoint List (Left 4 cols) + Tester Workbench (Right 8 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Endpoint List */}
        <div className="lg:col-span-4 bg-[#0d0d0d] border border-white/10 rounded-lg p-3.5 space-y-2 font-mono text-xs shadow-2xl">
          <h2 className="font-bold text-white border-b border-white/5 pb-2 uppercase tracking-wide">
            REST API ENDPOINTS ({endpoints.length})
          </h2>

          <div className="space-y-1.5 overflow-y-auto max-h-[500px]">
            {endpoints.map((ep) => {
              const fullKey = `${ep.method} ${ep.path}`;
              const isSelected = selectedEndpoint === fullKey;

              const methodBadge =
                ep.method === 'GET'
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                  : 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30';

              return (
                <div
                  key={fullKey}
                  onClick={() => setSelectedEndpoint(fullKey)}
                  className={`p-2.5 rounded-lg border cursor-pointer transition-all space-y-1 ${
                    isSelected
                      ? 'bg-indigo-500/10 border-indigo-500/50 shadow-[0_0_15px_rgba(79,70,229,0.2)]'
                      : 'bg-black/30 border-white/5 hover:border-white/10'
                  }`}
                >
                  <div className="flex items-center gap-2 font-bold text-[11px]">
                    <span className={`px-1.5 py-0.2 rounded border text-[10px] uppercase font-bold ${methodBadge}`}>
                      {ep.method}
                    </span>
                    <span className="text-slate-200 truncate">{ep.path}</span>
                  </div>
                  <div className="text-[10px] text-slate-400 font-sans truncate">{ep.desc}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Tester & Request/Response Inspector */}
        <div className="lg:col-span-8 bg-[#0d0d0d] border border-white/10 rounded-lg p-4 space-y-4 font-mono text-xs shadow-2xl">
          <div className="flex items-center justify-between border-b border-white/5 pb-2.5">
            <h2 className="font-bold text-indigo-300 flex items-center gap-2">
              <Globe className="w-4 h-4 text-indigo-400" />
              <span>{selectedEndpoint}</span>
            </h2>
            <button
              onClick={handleExecute}
              disabled={loading}
              className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-3.5 py-1.5 rounded-lg flex items-center gap-1.5 transition-all shadow-[0_0_15px_rgba(79,70,229,0.4)]"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>{loading ? 'Executing...' : 'SEND REQUEST'}</span>
            </button>
          </div>

          {/* Dynamic Inputs based on selected endpoint */}
          {selectedEndpoint.includes('{wr_id}') && (
            <div>
              <label className="text-[10px] text-slate-400 font-bold uppercase">PARAMETER: wr_id</label>
              <input
                type="text"
                value={wrIdInput}
                onChange={(e) => setWrIdInput(e.target.value)}
                className="w-full bg-black/40 border border-white/5 rounded-lg p-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500/50 mt-1"
              />
            </div>
          )}

          {selectedEndpoint.includes('{target}') && (
            <div>
              <label className="text-[10px] text-slate-400 font-bold uppercase">PARAMETER: target_wr_id</label>
              <input
                type="text"
                value={targetWrIdInput}
                onChange={(e) => setTargetWrIdInput(e.target.value)}
                className="w-full bg-black/40 border border-white/5 rounded-lg p-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500/50 mt-1"
              />
            </div>
          )}

          {selectedEndpoint.startsWith('POST') && (
            <div>
              <label className="text-[10px] text-slate-400 font-bold uppercase">POST REQUEST JSON PAYLOAD</label>
              <textarea
                rows={5}
                value={postPayload}
                onChange={(e) => setPostPayload(e.target.value)}
                className="w-full bg-black/40 border border-white/5 rounded-lg p-2 text-xs text-emerald-300 font-mono focus:outline-none focus:border-indigo-500/50 mt-1"
              />
            </div>
          )}

          {/* Generated cURL Box */}
          <div className="bg-black/40 p-3 rounded-lg border border-white/5 space-y-1.5">
            <div className="flex items-center justify-between text-[10px] text-slate-400 font-bold uppercase">
              <span>GENERATED cURL COMMAND</span>
              <button
                onClick={handleCopyCurl}
                className="text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition-colors"
              >
                {copiedCurl ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copiedCurl ? 'Copied' : 'Copy cURL'}</span>
              </button>
            </div>
            <code className="block font-mono text-[11px] text-amber-300 break-all bg-black/60 p-2.5 rounded-lg border border-white/5">
              {getCurlCommand()}
            </code>
          </div>

          {/* Response Console */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-slate-400 font-bold uppercase">RESPONSE CONSOLE</span>
              {responseStatus !== null && (
                <span
                  className={`px-2 py-0.5 rounded border font-bold ${
                    responseStatus < 300
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                      : 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                  }`}
                >
                  HTTP {responseStatus}
                </span>
              )}
            </div>

            <div className="bg-black/60 p-3 rounded-lg border border-white/10 font-mono text-xs text-slate-300 max-h-72 overflow-y-auto shadow-inner">
              {responseData ? (
                <pre>{JSON.stringify(responseData, null, 2)}</pre>
              ) : (
                <span className="text-slate-600 italic">Click "SEND REQUEST" to inspect API response payload...</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
