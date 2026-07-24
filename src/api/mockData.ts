import {
  PlanningTask,
  Artifact,
  Branch,
  WorkRequestDAG,
  LifecycleEvent,
  GovernanceEvent,
  ReceiptIngestRecord,
  CompilationPassInfo
} from '../types/vision';

export const INITIAL_WORK_REQUESTS: PlanningTask[] = [
  {
    wr_id: 'wr-a1b2c3d4-8811',
    parent_request_id: null,
    intent: 'Synthesize Cross-Subsystem Autonomous Memory Synchronization Protocol',
    constraints: { must_support: ['nexus-console', 'nebula-ui', 'agent-mesh'], max_latency_ms: 150 },
    priority: 9,
    context_data: { source: 'harvest-transcript-7721', channel: 'assembly', agent_mesh_version: 'v2.4' },
    status: 'PLAN_GENERATION',
    created_at: '2026-07-24T01:15:00Z',
    recorded_on_dt: '2026-07-24T01:15:00Z',
    recorded_until_dt: null
  },
  {
    wr_id: 'wr-b2c3d4e5-9922',
    parent_request_id: 'wr-a1b2c3d4-8811',
    intent: 'Implement High-Throughput Bitemporal State Ledger for PostgreSQL Schema vision',
    constraints: { storage_engine: 'PostgreSQL', isolation_level: 'REPEATABLE_READ' },
    priority: 8,
    context_data: { source: 'intent-decomposition', sub_agent: 'db-specialist-01' },
    status: 'SPEC_GENERATION',
    created_at: '2026-07-24T01:30:00Z',
    recorded_on_dt: '2026-07-24T01:30:00Z',
    recorded_until_dt: null
  },
  {
    wr_id: 'wr-c3d4e5f6-1033',
    parent_request_id: 'wr-a1b2c3d4-8811',
    intent: 'Deliberate Safety Constraints & Rollback Guardrails for Autonomous Agent Mutations',
    constraints: { governance_policy: 'POL-CRIT-901', human_in_loop_override: true },
    priority: 10,
    context_data: { source: 'deliberation-agenda-004' },
    status: 'PLAN_REVIEW',
    created_at: '2026-07-24T01:45:00Z',
    recorded_on_dt: '2026-07-24T01:45:00Z',
    recorded_until_dt: null
  },
  {
    wr_id: 'wr-d4e5f6a7-2044',
    parent_request_id: 'wr-b2c3d4e5-9922',
    intent: 'Construct DAG 6-Pass Compilation Pipeline with Cycle Detection and Policy Annotations',
    constraints: { max_depth: 8, pass_order: ['normalize', 'tenant_bind', 'dag_construct', 'structural_validate', 'execution_compatibility', 'policy_annotate'] },
    priority: 7,
    context_data: { source: 'requirement-spec-091' },
    status: 'EXECUTION',
    created_at: '2026-07-24T02:00:00Z',
    recorded_on_dt: '2026-07-24T02:00:00Z',
    recorded_until_dt: null
  },
  {
    wr_id: 'wr-e5f6a7b8-3055',
    parent_request_id: 'wr-d4e5f6a7-2044',
    intent: 'Build High-Density Dark Theme Process Management IDE Surface in Tailwind CSS',
    constraints: { framework: 'React/Vite', design_style: 'Dark IDE Suite' },
    priority: 8,
    context_data: { source: 'user-request', ticket_ref: 'LOSM-UI-4200' },
    status: 'VALIDATION',
    created_at: '2026-07-24T02:10:00Z',
    recorded_on_dt: '2026-07-24T02:10:00Z',
    recorded_until_dt: null
  },
  {
    wr_id: 'wr-f6a7b8c9-4066',
    parent_request_id: null,
    intent: 'Deploy Vision Service REST API Server to Port 8003 with FastAPI and AsyncPG',
    constraints: { port: 8003, runner: 'systemd' },
    priority: 6,
    context_data: { source: 'infra-spec' },
    status: 'COMPLETION',
    created_at: '2026-07-23T18:00:00Z',
    recorded_on_dt: '2026-07-23T18:00:00Z',
    recorded_until_dt: null
  },
  {
    wr_id: 'wr-a7b8c9d0-5077',
    parent_request_id: 'wr-c3d4e5f6-1033',
    intent: 'Automate Receipt Ingestion Verification Hash Chain for Multi-Kernel Executors',
    constraints: { hash_algorithm: 'SHA-256', immutable: true },
    priority: 9,
    context_data: { source: 'security-audit' },
    status: 'PLAN_APPROVAL_GATE',
    created_at: '2026-07-24T02:30:00Z',
    recorded_on_dt: '2026-07-24T02:30:00Z',
    recorded_until_dt: null
  },
  {
    wr_id: 'wr-b8c9d0e1-6088',
    parent_request_id: 'wr-a1b2c3d4-8811',
    intent: 'Real-time WebSocket Heartbeat Feed for Agent Execution Status',
    constraints: { fallback_poll_interval_ms: 3000 },
    priority: 5,
    context_data: { source: 'candidate-991' },
    status: 'INTAKE',
    created_at: '2026-07-24T03:00:00Z',
    recorded_on_dt: '2026-07-24T03:00:00Z',
    recorded_until_dt: null
  },
  {
    wr_id: 'wr-c9d0e1f2-7099',
    parent_request_id: null,
    intent: 'Ingest Raw Terminal HTML Session Harvest #8812 from Multi-Agent Code Review Session',
    constraints: { transcript_format: 'HTML' },
    priority: 4,
    context_data: { source: 'harvest-collector' },
    status: 'NEW',
    created_at: '2026-07-24T03:15:00Z',
    recorded_on_dt: '2026-07-24T03:15:00Z',
    recorded_until_dt: null
  },
  {
    wr_id: 'wr-d0e1f2a3-8100',
    parent_request_id: 'wr-b2c3d4e5-9922',
    intent: 'Resolve Bitemporal Concurrent Writer Lock Contention in PostgreSQL Schema vision',
    constraints: { max_retries: 5 },
    priority: 9,
    context_data: { error: 'DeadlockDetected: lock on table work_requests_losm' },
    status: 'BLOCKED',
    created_at: '2026-07-24T02:45:00Z',
    recorded_on_dt: '2026-07-24T02:45:00Z',
    recorded_until_dt: null
  },
  {
    wr_id: 'wr-e1f2a3b4-9111',
    parent_request_id: 'wr-a7b8c9d0-5077',
    intent: 'Integrate Deprecated Legacy Receipt Format in Pipeline Pass 5',
    constraints: { backward_compat: false },
    priority: 2,
    context_data: { reason: 'Incompatible payload schema version 0.9' },
    status: 'FAILED',
    created_at: '2026-07-23T22:00:00Z',
    recorded_on_dt: '2026-07-23T22:00:00Z',
    recorded_until_dt: null
  }
];

export const INITIAL_ARTIFACTS: Artifact[] = [
  // 1. HARVEST (HTML Transcript)
  {
    artifact_id: 'art-harv-001',
    type: 'SUMMARY',
    stage: 'HARVEST',
    title: 'HTML Session Harvest: Agentic Refactoring Transcript #8812',
    summary: 'Captured raw multi-turn transcript between Lead Architect Agent and Execution Sub-Agents discussing cross-subsystem memory protocols.',
    confidence: 0.98,
    provenance: { model: 'harvest-ingest-v1', source: 'session_harvest_8812.html', role: 'ingestor' },
    wr_id: 'wr-c9d0e1f2-7099',
    parent_artifact_id: null,
    template_metadata: { template: 'html-transcript-harvest-v1' },
    created_at: '2026-07-24T01:00:00Z',
    content: {
      session_id: 'sess-8812',
      lines_captured: 1420,
      format: 'HTML/ANSI',
      extracted_keywords: ['memory-sync', 'losm-ir', 'bitemporal', 'dag-compilation']
    },
    html_transcript: `
<div class="font-mono text-xs text-slate-300 bg-slate-950 p-4 rounded border border-slate-800 space-y-2">
  <div class="text-emerald-400 font-bold">[14:02:11] ARCHITECT_AGENT &gt; Initiating session harvest for LOSM Work Request #a1b2c3d4.</div>
  <div class="text-sky-300">[14:02:15] EXECUTION_AGENT_01 &gt; Analyzing target repository structure... Found PostgreSQL schema "vision".</div>
  <div class="text-amber-300">[14:02:22] SAFETY_CRITIC &gt; WARNING: Ensure all mutations produce bitemporal recorded_on_dt entries.</div>
  <div class="text-slate-400">[14:02:30] SYSTEM &gt; Extracted 14 candidates for intent decomposition.</div>
  <div class="text-purple-300">[14:02:45] CODEGEN_AGENT &gt; Generating DAG 6-pass compilation pipeline models...</div>
</div>`
  },

  // 2. CANDIDATE
  {
    artifact_id: 'art-cand-002',
    type: 'SUMMARY',
    stage: 'CANDIDATE',
    title: 'Candidate Item #8812-C1: Bitemporal State Ledger Ingestion',
    summary: 'Extracted candidate item recommending dedicated bitemporal table structure for work_requests_losm.',
    confidence: 0.91,
    provenance: { model: 'nvidia/nemotron-3-ultra-550b-a55b', role: 'decomposer' },
    wr_id: 'wr-a1b2c3d4-8811',
    parent_artifact_id: 'art-harv-001',
    template_metadata: { template: 'candidate-item-v1' },
    created_at: '2026-07-24T01:10:00Z',
    content: {
      candidate_id: 'CAND-8812-C1',
      source_harvest: 'art-harv-001',
      actionability_score: 0.94,
      proposed_scope: ['schema:vision', 'table:work_requests_losm', 'table:artifacts']
    }
  },

  // 3. INTENT RECORD
  {
    artifact_id: 'art-int-003',
    type: 'SUMMARY',
    stage: 'INTENT',
    title: 'Intent Record: Autonomous Memory Synchronization Architecture',
    summary: 'Granular representation of intent defining required parameters, strict operational invariants, and maximum response latency.',
    confidence: 0.95,
    provenance: { model: 'nvidia/nemotron-3-ultra-550b-a55b', role: 'intent-compiler' },
    wr_id: 'wr-a1b2c3d4-8811',
    parent_artifact_id: 'art-cand-002',
    template_metadata: { template: 'intent-record-v2' },
    created_at: '2026-07-24T01:18:00Z',
    content: {
      intent_statement: 'Synthesize Cross-Subsystem Autonomous Memory Synchronization Protocol',
      invariants: [
        'Non-blocking async ingestion',
        'Strict bitemporal audit trail with recorded_until_dt soft delete',
        'Deterministic 6-pass DAG compilation'
      ],
      target_subsystems: ['vision-srv', 'losm-ir', 'losm-store']
    }
  },

  // 4. REQUIREMENT
  {
    artifact_id: 'art-req-004',
    type: 'SPEC',
    stage: 'REQUIREMENT',
    title: 'Requirement REQ-VISION-901: DAG 6-Pass Compilation & Path Traversal',
    summary: 'Promoted feature requirement detailing 6 deterministic compilation passes and shortest path graph calculation.',
    confidence: 0.96,
    provenance: { model: 'nvidia/nemotron-3-ultra-550b-a55b', role: 'requirements-lead' },
    wr_id: 'wr-d4e5f6a7-2044',
    parent_artifact_id: 'art-int-003',
    template_metadata: { template: 'feature-requirement-v1' },
    created_at: '2026-07-24T01:25:00Z',
    content: {
      requirement_id: 'REQ-VISION-901',
      priority: 9,
      passes: [
        { pass: 1, name: 'normalize', desc: 'Sanitize raw node/edge data' },
        { pass: 2, name: 'tenant_bind', desc: 'Bind nodes to tenant namespace' },
        { pass: 3, name: 'dag_construct', desc: 'Build DAG graph' },
        { pass: 4, name: 'structural_validate', desc: 'Check cycles & orphans' },
        { pass: 5, name: 'execution_compatibility', desc: 'Verify constraints' },
        { pass: 6, name: 'policy_annotate', desc: 'Annotate governance policies' }
      ]
    }
  },

  // 5. SPECIFICATION
  {
    artifact_id: 'art-spec-005',
    type: 'SPEC',
    stage: 'SPECIFICATION',
    title: 'Specification SPEC-LOSM-REST-8003: FastAPI Open API Protocol Interface',
    summary: 'Canonical specification for FastAPI vision-srv endpoints on port 8003, detailing Pydantic models and PostgreSQL schemas.',
    confidence: 0.99,
    provenance: { model: 'nvidia/nemotron-3-ultra-550b-a55b', role: 'systems-architect' },
    wr_id: 'wr-b2c3d4e5-9922',
    parent_artifact_id: 'art-req-004',
    template_metadata: { template: 'canonical-spec-v3' },
    created_at: '2026-07-24T01:35:00Z',
    content: {
      spec_id: 'SPEC-LOSM-REST-8003',
      schema: 'vision',
      tables: ['work_requests_losm', 'artifacts', 'work_request_edges', 'branches', 'lifecycle_events', 'governance_events', 'receipt_ingest_records'],
      rest_endpoints: [
        'GET /health',
        'GET/POST/PATCH/DELETE /api/work-requests',
        'GET/POST /api/branches',
        'GET/POST /api/artifacts',
        'GET /api/work-requests/{wr_id}/dag',
        'GET /api/work-requests/{wr_id}/dag/path/{target_wr_id}',
        'GET /api/work-requests/{wr_id}/dag/validate'
      ]
    }
  },

  // 6. DELIBERATION (Agendas, Participants, Votes, Roles)
  {
    artifact_id: 'art-delib-006',
    type: 'CRITIQUE',
    stage: 'DELIBERATION',
    title: 'Deliberation Round #004: Implementation Feasibility & Governance Review',
    summary: 'Multi-role agentic deliberation panel evaluating system safety, deadlocks, and bitemporal isolation constraints.',
    confidence: 0.93,
    provenance: { model: 'deliberation-engine-v2', role: 'moderator' },
    wr_id: 'wr-c3d4e5f6-1033',
    parent_artifact_id: 'art-spec-005',
    template_metadata: { template: 'deliberation-round-v2' },
    created_at: '2026-07-24T01:50:00Z',
    content: {
      agenda_id: 'AGENDA-DELIB-004',
      topic: 'Bitemporal Concurrency & Rollback Safety in Multi-Tenant Agent Environment',
      consensus_score: 0.88,
      status: 'APPROVED_WITH_CONDITIONS'
    },
    participants: [
      {
        id: 'p1',
        name: 'Nexus Lead Architect',
        role: 'Architect',
        vote: 'APPROVE',
        score: 0.95,
        rationale: 'Architecture satisfies modular isolation requirements. Standardized 6-pass compilation eliminates race conditions.',
        avatar_color: 'bg-indigo-600'
      },
      {
        id: 'p2',
        name: 'Autonomous Safety Critic',
        role: 'Safety Critic',
        vote: 'CHANGES_REQUESTED',
        score: 0.78,
        rationale: 'Must enforce strict human-in-the-loop override flag for priority >= 9 work requests before execution phase.',
        avatar_color: 'bg-rose-600'
      },
      {
        id: 'p3',
        name: 'LOSM Core Execution Subagent',
        role: 'Execution Agent',
        vote: 'APPROVE',
        score: 0.92,
        rationale: 'Execution paths and graph traversals tested against 500-node benchmarks. Average compilation latency < 15ms.',
        avatar_color: 'bg-emerald-600'
      },
      {
        id: 'p4',
        name: 'Governance & Compliance Agent',
        role: 'Domain Lead',
        vote: 'APPROVE',
        score: 0.89,
        rationale: 'Audit trail schema satisfies bitemporal recorded_until_dt soft delete compliance mandates.',
        avatar_color: 'bg-amber-600'
      }
    ]
  },

  // 7. IMPLEMENTATION PLAN
  {
    artifact_id: 'art-plan-007',
    type: 'PLAN',
    stage: 'PLAN',
    title: 'Technical Implementation Plan: Vision Control Plane & DAG Engine',
    summary: 'Concrete step-by-step breakdown with execution estimates and model provenance annotations.',
    confidence: 0.94,
    provenance: { model: 'nvidia/nemotron-3-ultra-550b-a55b', role: 'planner' },
    wr_id: 'wr-a1b2c3d4-8811',
    parent_artifact_id: 'art-delib-006',
    template_metadata: { template: 'implementation-plan-v2' },
    created_at: '2026-07-24T02:05:00Z',
    content: {
      plan_id: 'PLAN-LOSM-2026-07',
      estimated_total_time_ms: 1850,
      steps: [
        { step_id: 1, name: 'Setup FastAPI REST Endpoints & AsyncPG DB Connection Pool', est_ms: 250, status: 'COMPLETED' },
        { step_id: 2, name: 'Implement Pydantic DAG Models & 6-Pass Pipeline Engine', est_ms: 400, status: 'COMPLETED' },
        { step_id: 3, name: 'Construct React High-Density Dark Theme Process Control Plane UI', est_ms: 800, status: 'IN_PROGRESS' },
        { step_id: 4, name: 'Bind Interactive Artifact Deliberation Surfaces & Bitemporal Audit Trail', est_ms: 400, status: 'PENDING' }
      ]
    }
  },

  // 8. WORK REQUEST (Final Item)
  {
    artifact_id: 'art-wr-008',
    type: 'EXECUTION',
    stage: 'WORK_REQUEST',
    title: 'Compiled Work Request Item: wr-d4e5f6a7-2044',
    summary: 'Final compiled execution task linked to active DAG graph and branch execution line.',
    confidence: 0.97,
    provenance: { model: 'losm-ir-compiler-v1.1', role: 'compiler' },
    wr_id: 'wr-d4e5f6a7-2044',
    parent_artifact_id: 'art-plan-007',
    template_metadata: { template: 'work-request-compiled-v1' },
    created_at: '2026-07-24T02:15:00Z',
    content: {
      assigned_wr_id: 'wr-d4e5f6a7-2044',
      target_status: 'EXECUTION',
      edge_links: ['depends_on:wr-b2c3d4e5-9922', 'parent_of:wr-e5f6a7b8-3055'],
      execution_kernel: 'kernel-01'
    }
  }
];

export const INITIAL_BRANCHES: Branch[] = [
  {
    branch_id: 'br-001-main-line',
    wr_id: 'wr-a1b2c3d4-8811',
    parent_branch_id: null,
    fork_point: null,
    label: 'main-line-compilation',
    score: 0.96,
    status: 'active',
    created_at: '2026-07-24T01:20:00Z'
  },
  {
    branch_id: 'br-002-async-optim',
    wr_id: 'wr-a1b2c3d4-8811',
    parent_branch_id: 'br-001-main-line',
    fork_point: 'art-spec-005',
    label: 'asyncpg-zero-copy-fork',
    score: 0.89,
    status: 'active',
    created_at: '2026-07-24T01:40:00Z'
  },
  {
    branch_id: 'br-003-legacy-sync',
    wr_id: 'wr-f6a7b8c9-4066',
    parent_branch_id: null,
    fork_point: null,
    label: 'synchronous-psycopg2-legacy',
    score: 0.62,
    status: 'abandoned',
    created_at: '2026-07-23T19:00:00Z'
  }
];

export const INITIAL_DAG: WorkRequestDAG = {
  dag_id: 'dag-losm-master-001',
  root_wr_id: 'wr-a1b2c3d4-8811',
  tenant_id: 'vision-srv',
  trace_id: 'trace-losm-99218-a8',
  kernel_id: 'kernel-01',
  depth: 3,
  total_nodes: 6,
  compilation_status: 'compiled',
  compilation_errors: [],
  compiled_at: '2026-07-24T02:20:00Z',
  metadata: {
    compiler_version: 'losm-ir-v1.1',
    environment: 'production-cloud-run'
  },
  _metadata: {
    node_count: 6,
    edge_count: 5,
    compilation_time_ms: 12.5
  },
  nodes: {
    'wr-a1b2c3d4-8811': {
      wr_id: 'wr-a1b2c3d4-8811',
      parent_request_id: null,
      intent: 'Synthesize Cross-Subsystem Autonomous Memory Synchronization Protocol',
      status: 'PLAN_GENERATION',
      priority: 9,
      depth: 0,
      children: ['wr-b2c3d4e5-9922', 'wr-c3d4e5f6-1033', 'wr-b8c9d0e1-6088'],
      edge_type: null,
      metadata: { root: true }
    },
    'wr-b2c3d4e5-9922': {
      wr_id: 'wr-b2c3d4e5-9922',
      parent_request_id: 'wr-a1b2c3d4-8811',
      intent: 'Implement High-Throughput Bitemporal State Ledger for PostgreSQL Schema vision',
      status: 'SPEC_GENERATION',
      priority: 8,
      depth: 1,
      children: ['wr-d4e5f6a7-2044', 'wr-d0e1f2a3-8100'],
      edge_type: 'parent_of'
    },
    'wr-c3d4e5f6-1033': {
      wr_id: 'wr-c3d4e5f6-1033',
      parent_request_id: 'wr-a1b2c3d4-8811',
      intent: 'Deliberate Safety Constraints & Rollback Guardrails for Autonomous Agent Mutations',
      status: 'PLAN_REVIEW',
      priority: 10,
      depth: 1,
      children: ['wr-a7b8c9d0-5077'],
      edge_type: 'depends_on'
    },
    'wr-d4e5f6a7-2044': {
      wr_id: 'wr-d4e5f6a7-2044',
      parent_request_id: 'wr-b2c3d4e5-9922',
      intent: 'Construct DAG 6-Pass Compilation Pipeline with Cycle Detection and Policy Annotations',
      status: 'EXECUTION',
      priority: 7,
      depth: 2,
      children: ['wr-e5f6a7b8-3055'],
      edge_type: 'derived_from'
    },
    'wr-e5f6a7b8-3055': {
      wr_id: 'wr-e5f6a7b8-3055',
      parent_request_id: 'wr-d4e5f6a7-2044',
      intent: 'Build High-Density Dark Theme Process Management IDE Surface in Tailwind CSS',
      status: 'VALIDATION',
      priority: 8,
      depth: 3,
      children: [],
      edge_type: 'parent_of'
    },
    'wr-a7b8c9d0-5077': {
      wr_id: 'wr-a7b8c9d0-5077',
      parent_request_id: 'wr-c3d4e5f6-1033',
      intent: 'Automate Receipt Ingestion Verification Hash Chain for Multi-Kernel Executors',
      status: 'PLAN_APPROVAL_GATE',
      priority: 9,
      depth: 2,
      children: [],
      edge_type: 'depends_on'
    }
  },
  edges: [
    {
      edge_id: 'edg-001',
      parent_wr_id: 'wr-a1b2c3d4-8811',
      child_wr_id: 'wr-b2c3d4e5-9922',
      edge_type: 'parent_of',
      created_at: '2026-07-24T01:30:00Z'
    },
    {
      edge_id: 'edg-002',
      parent_wr_id: 'wr-a1b2c3d4-8811',
      child_wr_id: 'wr-c3d4e5f6-1033',
      edge_type: 'depends_on',
      created_at: '2026-07-24T01:45:00Z'
    },
    {
      edge_id: 'edg-003',
      parent_wr_id: 'wr-b2c3d4e5-9922',
      child_wr_id: 'wr-d4e5f6a7-2044',
      edge_type: 'derived_from',
      created_at: '2026-07-24T02:00:00Z'
    },
    {
      edge_id: 'edg-004',
      parent_wr_id: 'wr-d4e5f6a7-2044',
      child_wr_id: 'wr-e5f6a7b8-3055',
      edge_type: 'parent_of',
      created_at: '2026-07-24T02:10:00Z'
    },
    {
      edge_id: 'edg-005',
      parent_wr_id: 'wr-c3d4e5f6-1033',
      child_wr_id: 'wr-a7b8c9d0-5077',
      edge_type: 'depends_on',
      created_at: '2026-07-24T02:30:00Z'
    }
  ]
};

export const INITIAL_COMPILATION_PASSES: CompilationPassInfo[] = [
  {
    pass_number: 1,
    name: 'normalize',
    description: 'Sanitize and validate raw node/edge data structures and UUID types.',
    status: 'passed',
    duration_ms: 1.2,
    logs: ['[PASS 1] Checked 6 nodes, 5 edges.', '[PASS 1] UUID strings validated. ISO dates sanitized.']
  },
  {
    pass_number: 2,
    name: 'tenant_bind',
    description: 'Bind nodes to tenant/namespace scope ("vision-srv") and verify kernel lease.',
    status: 'passed',
    duration_ms: 0.8,
    logs: ['[PASS 2] Tenant namespace "vision-srv" bound.', '[PASS 2] Kernel "kernel-01" verified active.']
  },
  {
    pass_number: 3,
    name: 'dag_construct',
    description: 'Build directed acyclic graph topology, resolve child links, and compute node depths.',
    status: 'passed',
    duration_ms: 3.4,
    logs: ['[PASS 3] Adjacency lists constructed.', '[PASS 3] Max depth computed: 3. Root WR wr-a1b2c3d4-8811 verified.']
  },
  {
    pass_number: 4,
    name: 'structural_validate',
    description: 'Check for cycles (Tarjan SCC), orphans, depth violations, duplicate edges, missing parents.',
    status: 'passed',
    duration_ms: 2.1,
    logs: ['[PASS 4] Tarjan SCC cycle check: 0 cycles detected.', '[PASS 4] Orphan check: 0 orphan nodes found.']
  },
  {
    pass_number: 5,
    name: 'execution_compatibility',
    description: 'Verify execution constraints (PostgreSQL schema compatibility, max latency) are satisfiable.',
    status: 'passed',
    duration_ms: 2.9,
    logs: ['[PASS 5] Verified constraints for 6 nodes.', '[PASS 5] Isolation level REPEATABLE_READ compatible.']
  },
  {
    pass_number: 6,
    name: 'policy_annotate',
    description: 'Annotate nodes/edges with governance policies, compliance audit flags, and bitemporal timestamps.',
    status: 'passed',
    duration_ms: 2.1,
    logs: ['[PASS 6] Applied POL-CRIT-901 governance policy tags.', '[PASS 6] Compilation finished in 12.5ms.']
  }
];

export const INITIAL_LIFECYCLE_EVENTS: LifecycleEvent[] = [
  {
    event_id: 'evt-life-001',
    wr_id: 'wr-a1b2c3d4-8811',
    from_state: null,
    to_state: 'NEW',
    actor: 'system-harvest-ingestor',
    reason: 'Harvest ingestion complete from transcript sess-8812',
    created_at: '2026-07-24T01:15:00Z'
  },
  {
    event_id: 'evt-life-002',
    wr_id: 'wr-a1b2c3d4-8811',
    from_state: 'NEW',
    to_state: 'INTAKE',
    actor: 'triage-agent-01',
    reason: 'Triage complete; intent prioritized to 9',
    created_at: '2026-07-24T01:20:00Z'
  },
  {
    event_id: 'evt-life-003',
    wr_id: 'wr-a1b2c3d4-8811',
    from_state: 'INTAKE',
    to_state: 'PLAN_GENERATION',
    actor: 'planner-agent-nemotron',
    reason: 'Generated technical implementation plan art-plan-007',
    created_at: '2026-07-24T02:05:00Z'
  },
  {
    event_id: 'evt-life-004',
    wr_id: 'wr-d4e5f6a7-2044',
    from_state: 'SPEC_GENERATION',
    to_state: 'EXECUTION',
    actor: 'kernel-01-executor',
    reason: 'Approved by Deliberation Round #004; starting DAG 6-pass compilation build',
    created_at: '2026-07-24T02:15:00Z'
  },
  {
    event_id: 'evt-life-005',
    wr_id: 'wr-d0e1f2a3-8100',
    from_state: 'EXECUTION',
    to_state: 'BLOCKED',
    actor: 'postgres-db-driver',
    reason: 'DeadlockDetected: lock on table work_requests_losm',
    created_at: '2026-07-24T02:45:00Z'
  }
];

export const INITIAL_GOVERNANCE_EVENTS: GovernanceEvent[] = [
  {
    event_id: 'gov-001-pol',
    event_type: 'POL_CHECK_PASSED',
    work_request_id: 'wr-c3d4e5f6-1033',
    lineage_parent: null,
    payload: { policy: 'POL-CRIT-901', human_override_required: true, status: 'PASSED' },
    created_at: '2026-07-24T01:50:00Z'
  },
  {
    event_id: 'gov-002-audit',
    event_type: 'BITEMPORAL_LEDGER_AUDIT',
    work_request_id: 'wr-b2c3d4e5-9922',
    lineage_parent: 'gov-001-pol',
    payload: { schema: 'vision', recorded_on_dt: '2026-07-24T01:30:00Z', checksum: 'sha256-a918f0291e' },
    created_at: '2026-07-24T02:00:00Z'
  }
];

export const INITIAL_RECEIPTS: ReceiptIngestRecord[] = [
  {
    receipt_id: 'rcpt-001-exec',
    work_request_id: 'wr-f6a7b8c9-4066',
    executor_id: 'systemd-service-vision-srv-py',
    receipt_hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    result: 'SUCCESS',
    lineage_parent: null,
    payload: { port: 8003, pid: 14201, uptime_s: 36000 },
    recorded_on_dt: '2026-07-23T18:05:00Z'
  },
  {
    receipt_id: 'rcpt-002-dag',
    work_request_id: 'wr-d4e5f6a7-2044',
    executor_id: 'losm-ir-pass-engine',
    receipt_hash: '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08',
    result: 'SUCCESS',
    lineage_parent: 'rcpt-001-exec',
    payload: { passes_completed: 6, node_count: 6, edge_count: 5 },
    recorded_on_dt: '2026-07-24T02:20:00Z'
  },
  {
    receipt_id: 'rcpt-003-err',
    work_request_id: 'wr-e1f2a3b4-9111',
    executor_id: 'legacy-ingestor-v0.9',
    receipt_hash: '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8',
    result: 'FAILURE',
    lineage_parent: null,
    payload: { error: 'SchemaVersionMismatch: Expected v1.1, got v0.9' },
    recorded_on_dt: '2026-07-23T22:01:00Z'
  }
];
