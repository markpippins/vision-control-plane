import {
  PlanningTask,
  Artifact,
  Branch,
  WorkRequestDAG,
  PathResult,
  ValidationResult,
  LifecycleEvent,
  GovernanceEvent,
  ReceiptIngestRecord,
  WorkStatus,
  PipelineStage
} from '../types/vision';
import {
  INITIAL_WORK_REQUESTS,
  INITIAL_ARTIFACTS,
  INITIAL_BRANCHES,
  INITIAL_DAG,
  INITIAL_LIFECYCLE_EVENTS,
  INITIAL_GOVERNANCE_EVENTS,
  INITIAL_RECEIPTS
} from './mockData';

const MOCK_STORAGE_KEY_WR = 'losm_mock_work_requests_v1';
const MOCK_STORAGE_KEY_ART = 'losm_mock_artifacts_v1';
const MOCK_STORAGE_KEY_BR = 'losm_mock_branches_v1';
const MOCK_STORAGE_KEY_MODE = 'losm_mock_mode_active';

export class VisionService {
  private mockMode: boolean;
  private apiBaseUrl: string;

  constructor() {
    const savedMode = localStorage.getItem(MOCK_STORAGE_KEY_MODE);
    this.mockMode = savedMode !== null ? savedMode === 'true' : true;
    this.apiBaseUrl = (import.meta as any).env?.VITE_VISION_SRV_URL || '/api';
    this.initMockStorage();
  }

  public isMockMode(): boolean {
    return this.mockMode;
  }

  public setMockMode(active: boolean): void {
    this.mockMode = active;
    localStorage.setItem(MOCK_STORAGE_KEY_MODE, String(active));
  }

  public resetMockData(): void {
    localStorage.setItem(MOCK_STORAGE_KEY_WR, JSON.stringify(INITIAL_WORK_REQUESTS));
    localStorage.setItem(MOCK_STORAGE_KEY_ART, JSON.stringify(INITIAL_ARTIFACTS));
    localStorage.setItem(MOCK_STORAGE_KEY_BR, JSON.stringify(INITIAL_BRANCHES));
  }

  private initMockStorage(): void {
    try {
      const wr = localStorage.getItem(MOCK_STORAGE_KEY_WR);
      if (!wr || !Array.isArray(JSON.parse(wr))) {
        localStorage.setItem(MOCK_STORAGE_KEY_WR, JSON.stringify(INITIAL_WORK_REQUESTS));
      }
    } catch {
      localStorage.setItem(MOCK_STORAGE_KEY_WR, JSON.stringify(INITIAL_WORK_REQUESTS));
    }

    try {
      const art = localStorage.getItem(MOCK_STORAGE_KEY_ART);
      if (!art || !Array.isArray(JSON.parse(art))) {
        localStorage.setItem(MOCK_STORAGE_KEY_ART, JSON.stringify(INITIAL_ARTIFACTS));
      }
    } catch {
      localStorage.setItem(MOCK_STORAGE_KEY_ART, JSON.stringify(INITIAL_ARTIFACTS));
    }

    try {
      const br = localStorage.getItem(MOCK_STORAGE_KEY_BR);
      if (!br || !Array.isArray(JSON.parse(br))) {
        localStorage.setItem(MOCK_STORAGE_KEY_BR, JSON.stringify(INITIAL_BRANCHES));
      }
    } catch {
      localStorage.setItem(MOCK_STORAGE_KEY_BR, JSON.stringify(INITIAL_BRANCHES));
    }
  }

  private getStoredWorkRequests(): PlanningTask[] {
    try {
      const data = localStorage.getItem(MOCK_STORAGE_KEY_WR);
      if (!data) return INITIAL_WORK_REQUESTS;
      const parsed = JSON.parse(data);
      return Array.isArray(parsed) ? parsed : INITIAL_WORK_REQUESTS;
    } catch {
      return INITIAL_WORK_REQUESTS;
    }
  }

  private saveStoredWorkRequests(tasks: PlanningTask[]): void {
    localStorage.setItem(MOCK_STORAGE_KEY_WR, JSON.stringify(Array.isArray(tasks) ? tasks : INITIAL_WORK_REQUESTS));
  }

  private getStoredArtifacts(): Artifact[] {
    try {
      const data = localStorage.getItem(MOCK_STORAGE_KEY_ART);
      if (!data) return INITIAL_ARTIFACTS;
      const parsed = JSON.parse(data);
      return Array.isArray(parsed) ? parsed : INITIAL_ARTIFACTS;
    } catch {
      return INITIAL_ARTIFACTS;
    }
  }

  private saveStoredArtifacts(artifacts: Artifact[]): void {
    localStorage.setItem(MOCK_STORAGE_KEY_ART, JSON.stringify(Array.isArray(artifacts) ? artifacts : INITIAL_ARTIFACTS));
  }

  private getStoredBranches(): Branch[] {
    try {
      const data = localStorage.getItem(MOCK_STORAGE_KEY_BR);
      if (!data) return INITIAL_BRANCHES;
      const parsed = JSON.parse(data);
      return Array.isArray(parsed) ? parsed : INITIAL_BRANCHES;
    } catch {
      return INITIAL_BRANCHES;
    }
  }

  private saveStoredBranches(branches: Branch[]): void {
    localStorage.setItem(MOCK_STORAGE_KEY_BR, JSON.stringify(branches));
  }

  // --- API METHODS ---

  public async healthCheck(): Promise<{ status: string; mode: string; time: string }> {
    if (this.mockMode) {
      return { status: 'ok', mode: 'MOCK_ENGINE', time: new Date().toISOString() };
    }
    try {
      const res = await fetch(`${this.apiBaseUrl}/health`);
      if (!res.ok) throw new Error('Health check failed');
      const data = await res.json();
      return { ...data, mode: 'LIVE_FASTAPI_8003', time: new Date().toISOString() };
    } catch (err) {
      return { status: 'degraded_fallback_mock', mode: 'MOCK_FALLBACK', time: new Date().toISOString() };
    }
  }

  public async getWorkRequests(limit: number = 100, skip: number = 0): Promise<PlanningTask[]> {
    if (this.mockMode) {
      const all = this.getStoredWorkRequests();
      return all.slice(skip, skip + limit);
    }
    try {
      const res = await fetch(`${this.apiBaseUrl}/work-requests?limit=${limit}&skip=${skip}`);
      if (!res.ok) throw new Error('Failed to fetch work requests');
      return await res.json();
    } catch (err) {
      console.warn('Live API error, falling back to mock:', err);
      return this.getStoredWorkRequests().slice(skip, skip + limit);
    }
  }

  public async getWorkRequest(wr_id: string): Promise<PlanningTask | null> {
    if (this.mockMode) {
      const all = this.getStoredWorkRequests();
      return all.find((w) => w.wr_id === wr_id) || null;
    }
    try {
      const res = await fetch(`${this.apiBaseUrl}/work-requests/${wr_id}`);
      if (res.status === 404) return null;
      if (!res.ok) throw new Error('Failed to fetch work request');
      return await res.json();
    } catch {
      const all = this.getStoredWorkRequests();
      return all.find((w) => w.wr_id === wr_id) || null;
    }
  }

  public async createWorkRequest(payload: {
    intent: string;
    constraints?: Record<string, any>;
    priority?: number;
    context_data?: Record<string, any>;
    parent_request_id?: string | null;
  }): Promise<PlanningTask> {
    if (this.mockMode) {
      const all = this.getStoredWorkRequests();
      const newWr: PlanningTask = {
        wr_id: `wr-${Math.random().toString(36).substring(2, 10)}-${Date.now().toString().slice(-4)}`,
        parent_request_id: payload.parent_request_id || null,
        intent: payload.intent,
        constraints: payload.constraints || null,
        priority: payload.priority || 5,
        context_data: payload.context_data || { source: 'user-created-ui' },
        status: 'NEW',
        created_at: new Date().toISOString(),
        recorded_on_dt: new Date().toISOString(),
        recorded_until_dt: null
      };
      all.unshift(newWr);
      this.saveStoredWorkRequests(all);
      return newWr;
    }
    try {
      const res = await fetch(`${this.apiBaseUrl}/work-requests`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error('Failed to create work request');
      return await res.json();
    } catch {
      return this.createWorkRequest(payload); // fallback mock creation
    }
  }

  public async updateWorkRequest(
    wr_id: string,
    updates: Partial<{
      intent: string;
      constraints: Record<string, any>;
      priority: number;
      context_data: Record<string, any>;
      status: WorkStatus;
    }>
  ): Promise<PlanningTask | null> {
    if (this.mockMode) {
      const all = this.getStoredWorkRequests();
      const idx = all.findIndex((w) => w.wr_id === wr_id);
      if (idx === -1) return null;
      const updated: PlanningTask = {
        ...all[idx],
        ...updates,
        updated_at: new Date().toISOString(),
        recorded_on_dt: new Date().toISOString()
      };
      all[idx] = updated;
      this.saveStoredWorkRequests(all);
      return updated;
    }
    try {
      const res = await fetch(`${this.apiBaseUrl}/work-requests/${wr_id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
      if (!res.ok) throw new Error('Failed to update work request');
      return await res.json();
    } catch {
      return this.updateWorkRequest(wr_id, updates);
    }
  }

  public async deleteWorkRequest(wr_id: string): Promise<boolean> {
    if (this.mockMode) {
      const all = this.getStoredWorkRequests();
      const filtered = all.filter((w) => w.wr_id !== wr_id);
      this.saveStoredWorkRequests(filtered);
      return true;
    }
    try {
      const res = await fetch(`${this.apiBaseUrl}/work-requests/${wr_id}`, {
        method: 'DELETE'
      });
      return res.ok;
    } catch {
      return this.deleteWorkRequest(wr_id);
    }
  }

  public async getBranches(wr_id?: string, limit: number = 100, skip: number = 0): Promise<Branch[]> {
    if (this.mockMode) {
      let all = this.getStoredBranches();
      if (wr_id) {
        all = all.filter((b) => b.wr_id === wr_id);
      }
      return all.slice(skip, skip + limit);
    }
    try {
      const url = wr_id
        ? `${this.apiBaseUrl}/branches?wr_id=${wr_id}&limit=${limit}&skip=${skip}`
        : `${this.apiBaseUrl}/branches?limit=${limit}&skip=${skip}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error('Failed to fetch branches');
      return await res.json();
    } catch {
      let all = this.getStoredBranches();
      if (wr_id) all = all.filter((b) => b.wr_id === wr_id);
      return all.slice(skip, skip + limit);
    }
  }

  public async createBranch(payload: {
    wr_id: string;
    label?: string;
    parent_branch_id?: string | null;
    fork_point?: string | null;
  }): Promise<Branch> {
    if (this.mockMode) {
      const all = this.getStoredBranches();
      const newBranch: Branch = {
        branch_id: `br-${Math.random().toString(36).substring(2, 8)}-${Date.now().toString().slice(-4)}`,
        wr_id: payload.wr_id,
        parent_branch_id: payload.parent_branch_id || null,
        fork_point: payload.fork_point || null,
        label: payload.label || 'experimental-branch',
        score: Math.round((0.75 + Math.random() * 0.22) * 100) / 100,
        status: 'active',
        created_at: new Date().toISOString()
      };
      all.unshift(newBranch);
      this.saveStoredBranches(all);
      return newBranch;
    }
    try {
      const res = await fetch(`${this.apiBaseUrl}/branches`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error('Failed to create branch');
      return await res.json();
    } catch {
      return this.createBranch(payload);
    }
  }

  public async getArtifacts(wr_id?: string, limit: number = 100, skip: number = 0): Promise<Artifact[]> {
    if (this.mockMode) {
      let all = this.getStoredArtifacts();
      if (wr_id) {
        all = all.filter((a) => a.wr_id === wr_id);
      }
      return all.slice(skip, skip + limit);
    }
    try {
      const url = wr_id
        ? `${this.apiBaseUrl}/artifacts?wr_id=${wr_id}&limit=${limit}&skip=${skip}`
        : `${this.apiBaseUrl}/artifacts?limit=${limit}&skip=${skip}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error('Failed to fetch artifacts');
      return await res.json();
    } catch {
      let all = this.getStoredArtifacts();
      if (wr_id) all = all.filter((a) => a.wr_id === wr_id);
      return all.slice(skip, skip + limit);
    }
  }

  public async createArtifact(payload: {
    type: 'PLAN' | 'CRITIQUE' | 'SPEC' | 'EXECUTION' | 'PATCH' | 'SUMMARY';
    content: Record<string, any>;
    stage?: PipelineStage;
    title?: string;
    summary?: string;
    confidence?: number;
    provenance?: Record<string, any>;
    wr_id?: string | null;
    parent_artifact_id?: string | null;
    template_metadata?: Record<string, any>;
  }): Promise<Artifact> {
    if (this.mockMode) {
      const all = this.getStoredArtifacts();
      const newArtifact: Artifact = {
        artifact_id: `art-${Math.random().toString(36).substring(2, 8)}-${Date.now().toString().slice(-4)}`,
        type: payload.type,
        stage: payload.stage || 'CANDIDATE',
        title: payload.title || `${payload.type} Artifact`,
        summary: payload.summary || 'Created via LOSM Vision Control Plane UI',
        content: payload.content,
        confidence: payload.confidence ?? 0.9,
        provenance: payload.provenance || { model: 'nvidia/nemotron-3-ultra-550b-a55b', role: 'user-editor' },
        wr_id: payload.wr_id || null,
        parent_artifact_id: payload.parent_artifact_id || null,
        template_metadata: payload.template_metadata || { template: 'ui-created-v1' },
        created_at: new Date().toISOString()
      };
      all.unshift(newArtifact);
      this.saveStoredArtifacts(all);
      return newArtifact;
    }
    try {
      const res = await fetch(`${this.apiBaseUrl}/artifacts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error('Failed to create artifact');
      return await res.json();
    } catch {
      return this.createArtifact(payload);
    }
  }

  public async getDAG(wr_id: string): Promise<WorkRequestDAG> {
    if (this.mockMode) {
      const wrs = this.getStoredWorkRequests();
      const root = wrs.find((w) => w.wr_id === wr_id) || wrs[0];

      // Build dynamic DAG representation from stored work requests
      const nodes: Record<string, any> = {};
      const edges: any[] = [];

      wrs.forEach((w) => {
        const children = wrs.filter((c) => c.parent_request_id === w.wr_id).map((c) => c.wr_id);
        nodes[w.wr_id] = {
          wr_id: w.wr_id,
          parent_request_id: w.parent_request_id,
          intent: w.intent,
          status: w.status,
          priority: w.priority,
          depth: w.parent_request_id ? 1 : 0,
          children,
          edge_type: w.parent_request_id ? 'depends_on' : null
        };

        if (w.parent_request_id) {
          edges.push({
            edge_id: `edg-${w.parent_request_id.slice(-4)}-${w.wr_id.slice(-4)}`,
            parent_wr_id: w.parent_request_id,
            child_wr_id: w.wr_id,
            edge_type: 'depends_on',
            created_at: w.created_at
          });
        }
      });

      return {
        ...INITIAL_DAG,
        root_wr_id: root.wr_id,
        nodes: Object.keys(nodes).length > 0 ? nodes : INITIAL_DAG.nodes,
        edges: edges.length > 0 ? edges : INITIAL_DAG.edges,
        total_nodes: Object.keys(nodes).length || 6,
        depth: 3,
        compiled_at: new Date().toISOString()
      };
    }
    try {
      const res = await fetch(`${this.apiBaseUrl}/work-requests/${wr_id}/dag`);
      if (!res.ok) throw new Error('Failed to fetch DAG');
      return await res.json();
    } catch {
      return this.getDAG(wr_id);
    }
  }

  public async findPath(source_wr_id: string, target_wr_id: string): Promise<PathResult> {
    if (this.mockMode) {
      const wrs = this.getStoredWorkRequests();
      const s = wrs.find((w) => w.wr_id === source_wr_id);
      const t = wrs.find((w) => w.wr_id === target_wr_id);
      if (!s || !t) {
        return { source_wr_id, target_wr_id, path: [], length: 0, exists: false };
      }
      return {
        source_wr_id,
        target_wr_id,
        path: [source_wr_id, 'wr-b2c3d4e5-9922', target_wr_id],
        length: 3,
        exists: true
      };
    }
    try {
      const res = await fetch(`${this.apiBaseUrl}/work-requests/${source_wr_id}/dag/path/${target_wr_id}`);
      if (!res.ok) throw new Error('Failed to calculate path');
      return await res.json();
    } catch {
      return this.findPath(source_wr_id, target_wr_id);
    }
  }

  public async validateDAG(wr_id: string): Promise<ValidationResult> {
    if (this.mockMode) {
      const wrs = this.getStoredWorkRequests();
      const target = wrs.find((w) => w.wr_id === wr_id);
      const blocked = wrs.filter((w) => w.status === 'BLOCKED');

      const issues = blocked.map((b) => ({
        wr_id: b.wr_id,
        issue_type: 'concurrency_lock',
        message: `Concurrency deadlock detected for node ${b.wr_id}: PostgreSQL lock contention`,
        detail: { intent: b.intent, status: b.status }
      }));

      return {
        wr_id,
        valid: issues.length === 0,
        issues,
        warnings: target?.priority && target.priority >= 9 ? ['High priority node requires explicit human-in-the-loop review'] : [],
        node_count: wrs.length,
        edge_count: Math.max(1, wrs.length - 1)
      };
    }
    try {
      const res = await fetch(`${this.apiBaseUrl}/work-requests/${wr_id}/dag/validate`);
      if (!res.ok) throw new Error('Validation request failed');
      return await res.json();
    } catch {
      return this.validateDAG(wr_id);
    }
  }

  public getLifecycleEvents(): LifecycleEvent[] {
    return INITIAL_LIFECYCLE_EVENTS;
  }

  public getGovernanceEvents(): GovernanceEvent[] {
    return INITIAL_GOVERNANCE_EVENTS;
  }

  public getReceipts(): ReceiptIngestRecord[] {
    return INITIAL_RECEIPTS;
  }
}

export const visionService = new VisionService();
