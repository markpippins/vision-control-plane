import React from 'react';
import {
  PlanningTask,
  Artifact,
  WorkRequestDAG,
  CompilationPassInfo
} from '../types/vision';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  AreaChart,
  Area,
  CartesianGrid
} from 'recharts';
import {
  Activity,
  Layers,
  GitGraph,
  ShieldAlert,
  Zap,
  CheckCircle2,
  Clock,
  ArrowRight,
  TrendingUp,
  Sliders,
  Cpu
} from 'lucide-react';
import { INITIAL_COMPILATION_PASSES } from '../api/mockData';

interface DashboardProps {
  workRequests: PlanningTask[];
  artifacts: Artifact[];
  dag: WorkRequestDAG;
  onNavigateToTab: (tab: any) => void;
  onSelectWR: (wr_id: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  workRequests,
  artifacts,
  dag,
  onNavigateToTab,
  onSelectWR
}) => {
  // Status breakdown calculations
  const statusCounts = workRequests.reduce((acc, curr) => {
    acc[curr.status] = (acc[curr.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const chartData = [
    { name: 'NEW', count: statusCounts['NEW'] || 0, color: '#94a3b8' },
    { name: 'INTAKE', count: statusCounts['INTAKE'] || 0, color: '#38bdf8' },
    { name: 'PLAN_GEN', count: statusCounts['PLAN_GENERATION'] || 0, color: '#a855f7' },
    { name: 'PLAN_REV', count: statusCounts['PLAN_REVIEW'] || 0, color: '#c084fc' },
    { name: 'SPEC_GEN', count: statusCounts['SPEC_GENERATION'] || 0, color: '#818cf8' },
    { name: 'EXECUTION', count: statusCounts['EXECUTION'] || 0, color: '#3b82f6' },
    { name: 'VALIDATION', count: statusCounts['VALIDATION'] || 0, color: '#f59e0b' },
    { name: 'COMPLETE', count: statusCounts['COMPLETION'] || 0, color: '#10b981' },
    { name: 'BLOCKED', count: statusCounts['BLOCKED'] || 0, color: '#f43f5e' }
  ];

  // Stage counts for artifact pipeline
  const stageCounts = artifacts.reduce((acc, curr) => {
    const st = curr.stage || 'CANDIDATE';
    acc[st] = (acc[st] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const passChartData = INITIAL_COMPILATION_PASSES.map((p) => ({
    name: `Pass ${p.pass_number}: ${p.name}`,
    ms: p.duration_ms
  }));

  const totalPriorityAvg = Math.round(
    (workRequests.reduce((sum, w) => sum + w.priority, 0) / (workRequests.length || 1)) * 10
  ) / 10;

  return (
    <div className="p-4 space-y-4 overflow-y-auto max-h-[calc(100vh-80px)] bg-[#050505] text-slate-100 font-sans">
      {/* Top Banner & Quick Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between bg-white/5 border border-white/10 p-4 rounded-lg shadow-2xl space-y-3 md:space-y-0 backdrop-blur-sm">
        <div>
          <h1 className="text-sm font-bold text-white flex items-center gap-2 uppercase tracking-wide font-mono">
            <Cpu className="w-4 h-4 text-indigo-400" />
            <span>LOSM Operational State Machine Control Surface</span>
          </h1>
          <p className="text-xs text-slate-400 font-mono mt-0.5">
            Process Control Plane & 6-Pass DAG Compiler Engine · Schema: <span className="text-indigo-400 font-bold">vision</span>
          </p>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs">
          <button
            onClick={() => onNavigateToTab('kanban')}
            className="flex items-center gap-1.5 bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-200 border border-indigo-500/40 px-3 py-1.5 rounded transition-all font-semibold shadow-[0_0_10px_rgba(79,70,229,0.2)]"
          >
            <span>Open Kanban Board</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onNavigateToTab('dag')}
            className="flex items-center gap-1.5 bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10 px-3 py-1.5 rounded transition-colors"
          >
            <span>View DAG Graph</span>
            <GitGraph className="w-3.5 h-3.5 text-sky-400" />
          </button>
        </div>
      </div>

      {/* Process Pipeline HUD Row */}
      <div className="space-y-2">
        <div className="flex items-center justify-between px-1 font-mono text-xs">
          <span className="text-slate-400 uppercase font-bold tracking-wider text-[11px]">Process Pipeline HUD</span>
          <span className="text-[10px] text-slate-500">Live Stage Tracker</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {[
            { label: 'INTAKE', count: (statusCounts['NEW'] || 0) + (statusCounts['INTAKE'] || 0), sub: 'Harvests & Candidates', active: true, color: 'bg-indigo-500' },
            { label: 'PLAN GEN', count: (statusCounts['PLAN_GENERATION'] || 0) + (statusCounts['PLAN_REVIEW'] || 0), sub: 'Agendas & Feasibility', active: false, color: 'bg-purple-500' },
            { label: 'SPEC GEN', count: statusCounts['SPEC_GENERATION'] || 0, sub: 'Subsystems & Specs', active: false, color: 'bg-sky-500' },
            { label: 'EXECUTION', count: statusCounts['EXECUTION'] || 0, sub: 'Work Requests', active: false, color: 'bg-blue-500' },
            { label: 'VALIDATION', count: statusCounts['VALIDATION'] || 0, sub: 'Audit & Bitemporal', active: false, color: 'bg-amber-500' },
            { label: 'COMPLETE', count: statusCounts['COMPLETION'] || 0, sub: 'Promoted & Archived', active: false, color: 'bg-emerald-500' }
          ].map((hud, idx) => (
            <div
              key={idx}
              className={`bg-white/5 border border-white/10 p-3 rounded-lg flex flex-col justify-between relative overflow-hidden transition-all hover:bg-white/10 ${
                hud.count > 0 ? 'border-white/20' : ''
              }`}
            >
              <div className="text-[10px] font-mono text-slate-400 font-bold uppercase tracking-wider flex justify-between">
                <span>{hud.label}</span>
                <span className="text-white font-mono">{hud.count}</span>
              </div>
              <div className="my-1.5">
                <div className="text-xl font-bold font-mono text-white">{hud.count}</div>
                <div className="text-[10px] text-slate-500 font-mono truncate">{hud.sub}</div>
              </div>
              <div className={`absolute bottom-0 left-0 w-full h-[2px] ${hud.color}`}></div>
            </div>
          ))}
        </div>
      </div>

      {/* Metric Cards Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-white/5 border border-white/10 p-3.5 rounded-lg space-y-1 relative overflow-hidden">
          <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
            <span>Work Requests</span>
            <Layers className="w-3.5 h-3.5 text-indigo-400" />
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-mono font-bold text-white">{workRequests.length}</span>
            <span className="text-[11px] font-mono text-emerald-400 font-medium">Avg P{totalPriorityAvg}/10</span>
          </div>
          <div className="text-[10px] text-slate-500 font-mono">
            {statusCounts['COMPLETION'] || 0} Complete · {statusCounts['BLOCKED'] || 0} Blocked
          </div>
        </div>

        <div className="bg-white/5 border border-white/10 p-3.5 rounded-lg space-y-1 relative overflow-hidden">
          <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
            <span>DAG Nodes & Depth</span>
            <GitGraph className="w-3.5 h-3.5 text-sky-400" />
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-mono font-bold text-sky-300">{dag.total_nodes}</span>
            <span className="text-[11px] font-mono text-slate-400">Depth {dag.depth}</span>
          </div>
          <div className="text-[10px] text-slate-500 font-mono">
            Edges: {dag.edges.length} · Status: <span className="text-emerald-400">{dag.compilation_status}</span>
          </div>
        </div>

        <div className="bg-white/5 border border-white/10 p-3.5 rounded-lg space-y-1 relative overflow-hidden">
          <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
            <span>Artifact Items</span>
            <Zap className="w-3.5 h-3.5 text-purple-400" />
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-mono font-bold text-purple-300">{artifacts.length}</span>
            <span className="text-[11px] font-mono text-purple-400 font-medium">8 Stages</span>
          </div>
          <div className="text-[10px] text-slate-500 font-mono">
            {stageCounts['HARVEST'] || 0} Harvests · {stageCounts['DELIBERATION'] || 0} Deliberations
          </div>
        </div>

        <div className="bg-white/5 border border-white/10 p-3.5 rounded-lg space-y-1 relative overflow-hidden">
          <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
            <span>Compiler Latency</span>
            <Clock className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-mono font-bold text-emerald-400">12.5ms</span>
            <span className="text-[11px] font-mono text-emerald-400 font-medium">6 Passes</span>
          </div>
          <div className="text-[10px] text-slate-500 font-mono">
            Target: &lt;50ms · Zero Cycle Errors
          </div>
        </div>
      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Chart 1: Lifecycle Distribution */}
        <div className="bg-white/5 border border-white/10 p-4 rounded-lg space-y-2">
          <div className="flex items-center justify-between border-b border-white/5 pb-2">
            <h2 className="text-xs font-mono font-bold text-white flex items-center gap-2 uppercase tracking-wide">
              <Activity className="w-3.5 h-3.5 text-indigo-400" />
              <span>WORK REQUEST LIFECYCLE DISTRIBUTION</span>
            </h2>
            <span className="text-[10px] font-mono text-slate-500">FastAPI REST :8003</span>
          </div>
          <div className="h-48 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                <XAxis dataKey="name" stroke="#64748b" fontSize={10} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={10} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#000000', borderColor: '#334155', borderRadius: '4px', fontSize: '11px', color: '#ffffff' }}
                />
                <Bar dataKey="count" radius={[2, 2, 0, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: 6-Pass Compilation Engine Timings */}
        <div className="bg-white/5 border border-white/10 p-4 rounded-lg space-y-2">
          <div className="flex items-center justify-between border-b border-white/5 pb-2">
            <h2 className="text-xs font-mono font-bold text-white flex items-center gap-2 uppercase tracking-wide">
              <Sliders className="w-3.5 h-3.5 text-emerald-400" />
              <span>6-PASS DAG COMPILATION LATENCY (MS)</span>
            </h2>
            <span className="text-[10px] font-mono text-emerald-400 font-semibold">100% PASSED</span>
          </div>
          <div className="h-48 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={passChartData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                <XAxis dataKey="name" stroke="#64748b" fontSize={9} tickLine={false} interval={0} />
                <YAxis stroke="#64748b" fontSize={10} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#000000', borderColor: '#334155', borderRadius: '4px', fontSize: '11px', color: '#ffffff' }}
                />
                <Bar dataKey="ms" fill="#10b981" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* 6-Pass Compilation Status Visual Row */}
      <div className="bg-white/5 border border-white/10 p-4 rounded-lg space-y-3">
        <h2 className="text-xs font-mono font-bold text-white flex items-center justify-between uppercase tracking-wide">
          <span className="flex items-center gap-2">
            <GitGraph className="w-3.5 h-3.5 text-sky-400" />
            <span>DAG 6-PASS COMPILATION PIPELINE STATUS</span>
          </span>
          <span className="text-[10px] text-slate-500 font-normal">Tenant: vision-srv · Kernel: kernel-01</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-2 font-mono text-xs">
          {INITIAL_COMPILATION_PASSES.map((pass) => (
            <div
              key={pass.pass_number}
              className="bg-black/40 border border-white/10 p-3 rounded-lg space-y-1 flex flex-col justify-between"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-slate-500 font-bold">PASS {pass.pass_number}</span>
                <span className="flex items-center gap-1 text-emerald-400 text-[10px]">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>{pass.duration_ms}ms</span>
                </span>
              </div>
              <div className="font-bold text-white text-xs">{pass.name}</div>
              <div className="text-[10px] text-slate-400 line-clamp-2 leading-tight font-sans">{pass.description}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Active Work Requests Table */}
      <div className="bg-black/40 border border-white/10 rounded-lg p-4 space-y-3 shadow-2xl">
        <div className="flex items-center justify-between border-b border-white/5 pb-2">
          <h2 className="text-xs font-mono font-bold text-white flex items-center gap-2 uppercase tracking-wide">
            <Layers className="w-3.5 h-3.5 text-indigo-400" />
            <span>RECENT WORK REQUESTS IN LOSM PIPELINE</span>
          </h2>
          <button
            onClick={() => onNavigateToTab('kanban')}
            className="text-xs text-indigo-400 hover:text-indigo-300 font-mono font-bold"
          >
            View All in Kanban &rarr;
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-xs border-collapse">
            <thead>
              <tr className="bg-white/5 text-slate-400 border-b border-white/10 text-[11px] uppercase font-bold">
                <th className="py-2.5 px-3">WR_ID</th>
                <th className="py-2.5 px-3">INTENT / GOAL</th>
                <th className="py-2.5 px-3">STATUS</th>
                <th className="py-2.5 px-3">PRIORITY</th>
                <th className="py-2.5 px-3">CREATED AT</th>
                <th className="py-2.5 px-3 text-right">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {workRequests.slice(0, 6).map((wr) => {
                const priorityColor =
                  wr.priority >= 9
                    ? 'text-rose-400 bg-rose-500/10 border-rose-500/30'
                    : wr.priority >= 7
                    ? 'text-amber-400 bg-amber-500/10 border-amber-500/30'
                    : 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30';

                return (
                  <tr key={wr.wr_id} className="hover:bg-indigo-500/5 group cursor-pointer transition-colors">
                    <td className="py-2.5 px-3 font-semibold text-indigo-400">{wr.wr_id}</td>
                    <td className="py-2.5 px-3 text-slate-200 max-w-md truncate font-sans">{wr.intent}</td>
                    <td className="py-2.5 px-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-white/5 text-slate-300 border border-white/10">
                        {wr.status}
                      </span>
                    </td>
                    <td className="py-2.5 px-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${priorityColor}`}>
                        P{wr.priority}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-slate-400 text-[11px]">
                      {new Date(wr.created_at).toLocaleTimeString()}
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      <button
                        onClick={() => {
                          onSelectWR(wr.wr_id);
                          onNavigateToTab('kanban');
                        }}
                        className="text-xs text-indigo-400 hover:text-white bg-white/5 hover:bg-indigo-600 px-2.5 py-1 rounded border border-white/10 transition-all font-bold"
                      >
                        Inspect
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
