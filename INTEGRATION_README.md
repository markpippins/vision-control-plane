# Vision Service (vision-srv) UI Integration Guide

This frontend application is designed as the primary control plane and IDE-suite interface for the **LOSM (Layered Operational State Machine)** process management backend (`vision-srv`).

---

## 1. Architecture & Mocking Scheme

The UI operates on a clean, dual-mode architecture:

```
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
 localStorage)            http://localhost:8006
```

- **Mock Mode (Default)**: Uses realistic in-memory state initialized with rich dummy data (Harvests, Candidates, Intent Records, Requirements, Specs, Deliberation Agendas, Plans, Work Requests, Branches, DAGs, and Audit Logs). All mutations update client state immediately.
- **Live Mode**: Calls the Node Express server proxy (`/api/*`), which forwards requests directly to `http://localhost:8006` where `vision-srv` FastAPI runs.

---

## 2. Environment Configuration

To configure the live backend connection, copy `.env.example` to `.env`:

```bash
# Set to false to connect to live FastAPI backend
VITE_MOCK_MODE=false

# Target URL for the vision-srv REST API
VISION_SRV_URL=http://localhost:8006
```

---

## 3. Endpoints Handled

The `visionService` maps directly to all `vision-srv` FastAPI routes:

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/health` | GET | Check vision-srv backend status |
| `/api/work-requests` | GET, POST | List & Create Work Requests |
| `/api/work-requests/{wr_id}` | GET, PATCH, DELETE | Work Request details & updates |
| `/api/branches` | GET, POST | Branch listing & creation |
| `/api/artifacts` | GET, POST | Artifact list & creation |
| `/api/work-requests/{wr_id}/dag` | GET | Compile & fetch full WorkRequestDAG |
| `/api/work-requests/{wr_id}/dag/path/{target_wr_id}` | GET | Shortest path graph traversal |
| `/api/work-requests/{wr_id}/dag/validate` | GET | Run 6-pass structural validation |

---

## 4. Deploying to Production / Cloud Run

1. **Build the Application**:
   ```bash
   npm run build
   ```
   This compiles the React SPA into `dist/` and bundles `server.ts` into `dist/server.cjs`.

2. **Start the Production Proxy Server**:
   ```bash
   VISION_SRV_URL=http://your-vision-srv-host:8006 npm start
   ```

3. **Connecting directly from UI**:
   You can also toggle between Live Mode and Mock Mode directly from the top Addressbar "Branding Box" in the UI.

---

## 5. Artifact Pipeline Lifecycle

The UI enforces the full 8-pass artifact progression pipeline:
1. **Harvests**: Raw HTML transcript ingestion from agentic execution sessions.
2. **Candidates**: Extracted actionable items from transcripts.
3. **Intent Records**: Formatted representations of intent & goal constraints.
4. **Requirements**: Features promoted for technical implementation.
5. **Specifications**: System & subsystem canonical boundaries.
6. **Deliberation**: Agendas, multi-role participant votes (Architect, Safety Critic, Execution Agent, Reviewer), and feasibility scoring.
7. **Implementation Plans**: Step-by-step breakdown with model provenance (`nvidia/nemotron-3-ultra-550b-a55b`).
8. **Work Requests**: Actionable DAG tasks compiled into LOSM lifecycle.
