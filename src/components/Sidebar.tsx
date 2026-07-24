import React from 'react';
import {
  LayoutDashboard,
  Kanban,
  FileCode2,
  GitGraph,
  GitBranch,
  ShieldCheck,
  Terminal,
  BookOpen,
  Layers,
  Activity,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';

export type NavTab =
  | 'dashboard'
  | 'kanban'
  | 'artifacts'
  | 'dag'
  | 'branches'
  | 'audit'
  | 'workbench'
  | 'readme';

interface SidebarProps {
  activeTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  counts: {
    workRequests: number;
    artifacts: number;
    branches: number;
    blocked: number;
  };
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, onSelectTab, counts }) => {
  const navItems: { id: NavTab; label: string; icon: React.ReactNode; badge?: number; badgeColor?: string }[] = [
    {
      id: 'dashboard',
      label: 'Control Overview',
      icon: <LayoutDashboard className="w-4 h-4" />
    },
    {
      id: 'kanban',
      label: 'Work Request Kanban',
      icon: <Kanban className="w-4 h-4" />,
      badge: counts.workRequests,
      badgeColor: 'bg-indigo-900/80 text-indigo-300'
    },
    {
      id: 'artifacts',
      label: 'Artifact Deliberation',
      icon: <FileCode2 className="w-4 h-4" />,
      badge: counts.artifacts,
      badgeColor: 'bg-purple-900/80 text-purple-300'
    },
    {
      id: 'dag',
      label: 'DAG Compiler & Path',
      icon: <GitGraph className="w-4 h-4" />
    },
    {
      id: 'branches',
      label: 'Branch Fork Manager',
      icon: <GitBranch className="w-4 h-4" />,
      badge: counts.branches,
      badgeColor: 'bg-sky-900/80 text-sky-300'
    },
    {
      id: 'audit',
      label: 'Bitemporal Audit Trail',
      icon: <ShieldCheck className="w-4 h-4" />
    },
    {
      id: 'workbench',
      label: 'REST API Tester',
      icon: <Terminal className="w-4 h-4" />
    },
    {
      id: 'readme',
      label: 'Integration Guide',
      icon: <BookOpen className="w-4 h-4" />
    }
  ];

  return (
    <aside className="w-64 bg-[#0a0a0a] border-r border-white/10 flex flex-col justify-between shrink-0 select-none">
      <div className="flex flex-col">
        {/* Top App Branding Header */}
        <div className="p-4 flex items-center gap-3 border-b border-white/5 bg-black/20">
          <div className="w-8 h-8 bg-indigo-600 rounded flex items-center justify-center font-bold text-white shadow-[0_0_15px_rgba(79,70,229,0.4)]">
            V
          </div>
          <div>
            <div className="text-xs font-bold text-white tracking-widest uppercase">Vision-Srv</div>
            <div className="text-[10px] text-slate-500 font-mono">LOSM v1.1.0-alpha</div>
          </div>
        </div>

        {/* Section Header */}
        <nav className="py-4 px-2 space-y-1">
          <div className="text-[10px] uppercase tracking-wider text-slate-600 px-3 mb-2 font-bold">
            Operations Control
          </div>

          {/* Nav Items List */}
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded text-xs transition-colors font-medium ${
                  isActive
                    ? 'bg-indigo-500/10 text-indigo-400 border-l-2 border-indigo-500 font-semibold'
                    : 'text-slate-500 hover:text-slate-300 hover:bg-white/5'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={isActive ? 'text-indigo-400' : 'text-slate-500'}>{item.icon}</span>
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && (
                  <span className={`px-1.5 py-0.2 text-[10px] font-mono font-semibold rounded ${item.badgeColor}`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* System Status Footbar */}
      <div className="p-4 border-t border-white/5 bg-black/40 font-mono text-[11px] space-y-2">
        <div className="flex items-center gap-2 text-[10px] text-emerald-500 font-mono">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]"></span>
          <span>NODE-01: CONNECTED</span>
        </div>

        {counts.blocked > 0 && (
          <div className="flex items-center justify-between text-amber-400 bg-amber-500/10 p-1.5 rounded border border-amber-500/30 text-[10px]">
            <span className="flex items-center space-x-1">
              <AlertTriangle className="w-3 h-3 text-amber-400" />
              <span>Blocked Tasks:</span>
            </span>
            <span className="font-bold">{counts.blocked}</span>
          </div>
        )}

        <div className="pt-1 text-[9px] text-slate-600 flex justify-between uppercase">
          <span>6-Pass Compiler</span>
          <span>FastAPI :8003</span>
        </div>
      </div>
    </aside>
  );
};
