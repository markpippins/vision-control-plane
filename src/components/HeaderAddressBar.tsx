import React, { useState } from 'react';
import {
  Terminal,
  Activity,
  Server,
  Zap,
  Search,
  Plus,
  RefreshCw,
  Sliders,
  Database,
  CheckCircle2,
  Globe,
  Sun,
  Moon,
  Shield,
  Monitor
} from 'lucide-react';
import { visionService } from '../api/visionService';
import { useTheme, ThemeMode } from '../context/ThemeContext';

interface HeaderAddressBarProps {
  currentRoutePath: string;
  onNavigateRoute: (path: string) => void;
  onOpenNewWRModal: () => void;
  onOpenNewArtifactModal: () => void;
  onRefreshData: () => void;
  onSearchChange: (query: string) => void;
  searchQuery: string;
  isMockMode: boolean;
  onToggleMockMode: (active: boolean) => void;
}

export const HeaderAddressBar: React.FC<HeaderAddressBarProps> = ({
  currentRoutePath,
  onNavigateRoute,
  onOpenNewWRModal,
  onOpenNewArtifactModal,
  onRefreshData,
  onSearchChange,
  searchQuery,
  isMockMode,
  onToggleMockMode
}) => {
  const [addressInput, setAddressInput] = useState(currentRoutePath);
  const { theme, setTheme, uiPort } = useTheme();

  const handleAddressSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNavigateRoute(addressInput);
  };

  return (
    <header className="bg-[#0a0a0a] border-b border-white/10 text-slate-200 select-none flex flex-col transition-colors duration-200">
      {/* Top Utility / Branding Bar */}
      <div className="flex flex-wrap items-center justify-between px-4 py-2 bg-black/40 text-xs border-b border-white/5 gap-2">
        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Project Box */}
          <div className="flex items-center gap-2 bg-black/60 px-2.5 py-1 rounded border border-white/5 font-mono">
            <span className="text-xs text-slate-500 uppercase tracking-tighter font-bold">PRJ:</span>
            <span className="text-xs text-indigo-400 font-mono font-bold">vision-srv-core</span>
            <span className="text-[10px] px-1.5 py-0.2 bg-indigo-500/20 text-indigo-300 rounded border border-indigo-500/30">v1.1.0</span>
          </div>

          {/* UI Port Badge (4211) */}
          <div className="flex items-center gap-2 bg-sky-500/10 border border-sky-500/30 px-2.5 py-1 rounded font-mono text-[11px] text-sky-300">
            <Monitor className="w-3 h-3 text-sky-400" />
            <span className="text-slate-400 font-bold">UI PORT:</span>
            <span className="font-bold text-sky-300">:{uiPort}</span>
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-sky-500"></span>
            </span>
          </div>

          {/* Backend Service Status Badge */}
          <div className="flex items-center gap-2 bg-black/60 border border-white/5 px-2.5 py-1 rounded font-mono text-[11px]">
            <Server className="w-3 h-3 text-emerald-400" />
            <span className="text-slate-500">vision-srv:</span>
            <span className="text-emerald-400 font-semibold">:8003</span>
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
          </div>

          {/* Active Tenant / Kernel context */}
          <div className="hidden xl:flex items-center gap-2 text-slate-500 font-mono text-[10px]">
            <span className="px-2 py-0.5 bg-white/5 border border-white/5 rounded">tenant: vision-srv</span>
            <span className="px-2 py-0.5 bg-white/5 border border-white/5 rounded">kernel: kernel-01</span>
            <span className="px-2 py-0.5 bg-white/5 border border-white/5 rounded text-slate-300">db: vision.work_requests_losm</span>
          </div>
        </div>

        {/* Right side: Theme Switcher & Mock Mode Toggle */}
        <div className="flex items-center gap-2.5 font-mono">
          {/* Theme Selector (Dark, Light, Steel) */}
          <div className="flex items-center bg-black/60 p-0.5 rounded border border-white/10 gap-0.5">
            <button
              onClick={() => setTheme('dark')}
              className={`flex items-center gap-1 px-2 py-1 rounded text-[11px] transition-all font-bold ${
                theme === 'dark'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
              }`}
              title="Dark Obsidian Theme"
            >
              <Moon className="w-3 h-3" />
              <span>DARK</span>
            </button>

            <button
              onClick={() => setTheme('light')}
              className={`flex items-center gap-1 px-2 py-1 rounded text-[11px] transition-all font-bold ${
                theme === 'light'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
              }`}
              title="Clean Light Slate Theme"
            >
              <Sun className="w-3 h-3" />
              <span>LIGHT</span>
            </button>

            <button
              onClick={() => setTheme('steel')}
              className={`flex items-center gap-1 px-2 py-1 rounded text-[11px] transition-all font-bold ${
                theme === 'steel'
                  ? 'bg-cyan-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
              }`}
              title="Industrial Metallic Steel Theme"
            >
              <Shield className="w-3 h-3" />
              <span>STEEL</span>
            </button>
          </div>

          <button
            onClick={() => onToggleMockMode(!isMockMode)}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded border transition-colors text-xs ${
              isMockMode
                ? 'bg-amber-500/10 border-amber-500/30 text-amber-300 hover:bg-amber-500/20'
                : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/20'
            }`}
            title="Toggle between in-memory Mock Engine and live FastAPI server on port 8003"
          >
            <Database className="w-3 h-3" />
            <span className="font-semibold">{isMockMode ? 'MOCK DATA ACTIVE' : 'LIVE REST API'}</span>
          </button>

          <button
            onClick={onRefreshData}
            className="p-1 text-slate-400 hover:text-slate-100 bg-white/5 hover:bg-white/10 border border-white/5 rounded transition-colors"
            title="Refresh Service Data"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Primary Addressbar & Search Control Row */}
      <div className="flex items-center justify-between px-4 py-2 gap-3 bg-[#0a0a0a]">
        {/* Address bar input simulating IDE REST address bar */}
        <form onSubmit={handleAddressSubmit} className="flex-1 flex items-center h-8 bg-black/40 rounded px-3 border border-white/5 gap-2 focus-within:border-indigo-500/50 transition-colors">
          <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-mono font-bold px-1.5 py-0.2 rounded text-[10px]">GET</span>
          <Globe className="w-3.5 h-3.5 text-slate-500 shrink-0" />
          <input
            type="text"
            value={addressInput}
            onChange={(e) => setAddressInput(e.target.value)}
            placeholder={`http://localhost:${uiPort}/api/work-requests`}
            className="w-full bg-transparent text-xs text-white font-mono focus:outline-none placeholder-slate-600"
          />
          <button type="submit" className="text-slate-400 hover:text-indigo-400 text-[11px] font-mono px-1 font-bold">
            EXECUTE
          </button>
        </form>

        {/* Global Search Bar */}
        <div className="relative w-64 hidden md:block">
          <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search WR ID, intent..."
            className="w-full h-8 bg-black/40 border border-white/5 rounded pl-8 pr-3 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500/50 font-mono"
          />
        </div>

        {/* Primary Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenNewWRModal}
            className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-1.5 rounded text-xs font-bold shadow-[0_0_15px_rgba(79,70,229,0.4)] transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Request</span>
          </button>

          <button
            onClick={onOpenNewArtifactModal}
            className="flex items-center gap-1.5 bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10 px-3 py-1.5 rounded text-xs font-semibold transition-colors"
          >
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span>Attach Artifact</span>
          </button>
        </div>
      </div>
    </header>
  );
};

