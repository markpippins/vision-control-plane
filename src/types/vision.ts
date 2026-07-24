/**
 * LOSM Vision Service Domain Models & API Types
 * Port 8003 · FastAPI + PostgreSQL schema: vision
 */

export type WorkStatus =
  | 'NEW'
  | 'INTAKE'
  | 'PLAN_GENERATION'
  | 'PLAN_REVIEW'
  | 'PLAN_APPROVAL_GATE'
  | 'SPEC_GENERATION'
  | 'EXECUTION'
  | 'VALIDATION'
  | 'COMPLETION'
  | 'BLOCKED'
  | 'FAILED';

export type WorkflowState =
  | 'NEW'
  | 'PLAN_DONE'
  | 'SPEC_READY'
  | 'EXECUTED'
  | 'VALIDATED'
  | 'COMPLETE'
  | 'BLOCKED'
  | 'FAILED';

export type ArtifactType =
  | 'PLAN'
  | 'CRITIQUE'
  | 'SPEC'
  | 'EXECUTION'
  | 'PATCH'
  | 'SUMMARY';

export type PipelineStage =
  | 'HARVEST'
  | 'CANDIDATE'
  | 'INTENT'
  | 'REQUIREMENT'
  | 'SPECIFICATION'
  | 'DELIBERATION'
  | 'PLAN'
  | 'WORK_REQUEST';

export type EdgeType =
  | 'depends_on'
  | 'parent_of'
  | 'child_of'
  | 'derived_from'
  | 'supersedes'
  | 'branches_from'
  | 'references'
  | 'triggered_by';

export interface PlanningTask {
  wr_id: string;
  parent_request_id: string | null;
  intent: string;
  constraints: Record<string, any> | null;
  priority: number; // 1-10
  context_data: Record<string, any> | null;
  status: WorkStatus;
  created_at: string;
  updated_at?: string;
  recorded_on_dt: string;
  recorded_until_dt: string | null;
}

export interface ArtifactProvenance {
  model?: string;
  role?: string;
  source?: string;
  author?: string;
  timestamp?: string;
  [key: string]: any;
}

export interface DeliberationParticipant {
  id: string;
  name: string;
  role: 'Architect' | 'Safety Critic' | 'Execution Agent' | 'Domain Lead' | 'Reviewer';
  vote: 'APPROVE' | 'REJECT' | 'NEUTRAL' | 'CHANGES_REQUESTED';
  score: number; // 0.0 - 1.0
  rationale: string;
  avatar_color?: string;
}

export interface Artifact {
  artifact_id: string;
  type: ArtifactType;
  content: Record<string, any> | { raw_html?: string; text?: string; [key: string]: any };
  confidence: number | null; // 0.0 - 1.0
  provenance: ArtifactProvenance | null;
  wr_id: string | null;
  parent_artifact_id: string | null;
  template_metadata: Record<string, any> | null;
  created_at: string;
  // Extended UI fields for process breakdown
  stage?: PipelineStage;
  title?: string;
  summary?: string;
  participants?: DeliberationParticipant[];
  html_transcript?: string;
}

export interface Branch {
  branch_id: string;
  wr_id: string;
  parent_branch_id: string | null;
  fork_point: string | null;
  label: string | null;
  score: number | null;
  status: 'active' | 'merged' | 'abandoned';
  created_at: string;
}

export interface DAGEdge {
  edge_id: string;
  parent_wr_id: string;
  child_wr_id: string;
  edge_type: EdgeType;
  metadata?: Record<string, any>;
  created_at: string;
}

export interface WorkRequestNode {
  wr_id: string;
  parent_request_id: string | null;
  intent: string;
  status: WorkStatus;
  priority: number;
  depth: number;
  children: string[];
  edge_type: EdgeType | null;
  metadata?: Record<string, any>;
  compiled_properties?: Record<string, any>;
}

export interface WorkRequestDAG {
  dag_id: string;
  root_wr_id: string;
  nodes: Record<string, WorkRequestNode>;
  edges: DAGEdge[];
  tenant_id: string;
  trace_id: string | null;
  kernel_id: string | null;
  depth: number;
  total_nodes: number;
  compilation_status: 'compiled' | 'pending' | 'failed';
  compilation_errors: string[];
  compiled_at: string;
  metadata: Record<string, any>;
  _metadata?: {
    node_count: number;
    edge_count: number;
    compilation_time_ms: number;
  };
}

export interface PathResult {
  source_wr_id: string;
  target_wr_id: string;
  path: string[];
  length: number;
  exists: boolean;
}

export interface ValidationIssue {
  wr_id: string;
  issue_type: 'cycle' | 'orphan' | 'depth_violation' | 'duplicate_edge' | 'missing_parent' | string;
  message: string;
  detail?: Record<string, any>;
}

export interface ValidationResult {
  wr_id: string;
  valid: boolean;
  issues: ValidationIssue[];
  warnings: string[];
  node_count: number;
  edge_count: number;
}

export interface LifecycleEvent {
  event_id: string;
  wr_id: string;
  from_state: WorkStatus | null;
  to_state: WorkStatus;
  actor: string;
  reason: string;
  metadata?: Record<string, any>;
  created_at?: string;
}

export interface GovernanceEvent {
  event_id: string;
  event_type: string;
  work_request_id: string;
  lineage_parent: string | null;
  payload: Record<string, any>;
  created_at?: string;
}

export interface ReceiptIngestRecord {
  receipt_id: string;
  work_request_id: string;
  executor_id: string;
  receipt_hash: string;
  result: 'SUCCESS' | 'FAILURE' | 'RETRY' | string;
  lineage_parent: string | null;
  payload: Record<string, any>;
  recorded_on_dt?: string;
}

export interface EventEnvelope {
  event_id: string;
  wrp_id: '1.1';
  type: string;
  timestamp: string;
  version: number;
  causation_id: string | null;
  correlation_id: string;
  tenant_id: string;
  trace_id: string;
  kernel_id: string;
}

export interface CompilationPassInfo {
  pass_number: number;
  name: string;
  description: string;
  status: 'passed' | 'running' | 'failed' | 'pending';
  duration_ms: number;
  logs: string[];
}
