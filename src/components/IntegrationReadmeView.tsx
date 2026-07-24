import React, { useState } from 'react';
import { BookOpen, Copy, Check, Download, Terminal, Server } from 'lucide-react';

export const IntegrationReadmeView: React.FC = () => {
  const [copied, setCopied] = useState<boolean>(false);

  const markdownContent = `# Vision Service (vision-srv) UI Integration Guide

This frontend application is designed as the primary control plane and IDE-suite interface for the **LOSM (Layered Operational State Machine)** process management backend (\`vision-srv\`).

---

## 1. Architecture & Mocking Scheme

The UI operates on a clean, dual-mode architecture:

\`\`\`
┌────────────────────────────────────────┐
│  LOSM Vision Control Plane (React UI)  │
└──────────────────┬─────────────────────┘
                   │
         [ Client API Abstraction ]
         src/api/visionService.ts
                   │
     ┌─────────────┴─────────────┐
     ▼                           ▼
[ Mock Mode ]             [ Live Mode ]
(In-memory DB /           Proxy via Express ->
 localStorage)            http://localhost:8003
\`\`\`

- **Mock Mode (Default)**: Uses realistic in-memory state initialized with rich dummy data (Harvests, Candidates, Intent Records, Requirements, Specs, Deliberation Agendas, Plans, Work Requests, Branches, DAGs, and Audit Logs). All mutations update client state immediately.
- **Live Mode**: Calls the Node Express server proxy (\`/api/*\`), which forwards requests directly to \`http://localhost:8003\` where \`vision-srv\` FastAPI runs.

---

## 2. Environment Configuration

To configure the live backend connection, copy \`.env.example\` to \`.env\`:

\`\`\`bash
# Set to false to connect to live FastAPI backend
VITE_MOCK_MODE=false

# Target URL for the vision-srv REST API
VISION_SRV_URL=http://localhost:8003
\`\`\`

---

## 3. Endpoints Handled

The \`visionService\` maps directly to all \`vision-srv\` FastAPI routes:

| Endpoint | Method | Purpose |
|----------|--------|---------|
| \`/health\` | GET | Check vision-srv backend status |
| \`/api/work-requests\` | GET, POST | List & Create Work Requests |
| \`/api/work-requests/{wr_id}\` | GET, PATCH, DELETE | Work Request details & updates |
| \`/api/branches\` | GET, POST | Branch listing & creation |
| \`/api/artifacts\` | GET, POST | Artifact list & creation |
| \`/api/work-requests/{wr_id}/dag\` | GET | Compile & fetch full WorkRequestDAG |
| \`/api/work-requests/{wr_id}/dag/path/{target_wr_id}\` | GET | Shortest path graph traversal |
| \`/api/work-requests/{wr_id}/dag/validate\` | GET | Run 6-pass structural validation |

---

## 4. Deploying to Production / Cloud Run

1. **Build the Application**:
   \`\`\`bash
   npm run build
   \`\`\`
   This compiles the React SPA into \`dist/\` and bundles \`server.ts\` into \`dist/server.cjs\`.

2. **Start the Production Proxy Server**:
   \`\`\`bash
   VISION_SRV_URL=http://your-vision-srv-host:8003 npm start
   \`\`\`

3. **Connecting directly from UI**:
   You can also toggle between Live Mode and Mock Mode directly from the top Addressbar "Branding Box" in the UI.
`;

  const handleCopy = () => {
    navigator.clipboard.writeText(markdownContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="p-4 space-y-4 max-h-[calc(100vh-80px)] overflow-y-auto bg-[#050505] text-slate-100 font-sans">
      {/* Top Banner */}
      <div className="flex items-center justify-between bg-[#0a0a0a] p-3.5 rounded-lg border border-white/10 font-mono text-xs shadow-xl">
        <div className="flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-indigo-400" />
          <span className="font-bold text-white text-sm tracking-wide">INTEGRATION & LIVE DEPLOYMENT GUIDE</span>
        </div>

        <button
          onClick={handleCopy}
          className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-3.5 py-1.5 rounded-lg flex items-center gap-1.5 transition-all shadow-[0_0_15px_rgba(79,70,229,0.4)]"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
          <span>{copied ? 'Copied Markdown' : 'Copy Integration README'}</span>
        </button>
      </div>

      {/* Rendered Guide */}
      <div className="bg-[#0d0d0d] border border-white/10 rounded-lg p-6 font-mono text-xs text-slate-200 leading-relaxed space-y-4 shadow-2xl">
        <div className="bg-black/40 p-4 rounded-lg border border-white/5 whitespace-pre-wrap text-slate-300 shadow-inner font-mono text-[11px] leading-relaxed">
          {markdownContent}
        </div>
      </div>
    </div>
  );
};
