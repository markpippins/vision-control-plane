import React, { useState, useEffect } from 'react';
import { NavTab, Sidebar } from './components/Sidebar';
import { HeaderAddressBar } from './components/HeaderAddressBar';
import { Dashboard } from './components/Dashboard';
import { KanbanBoard } from './components/KanbanBoard';
import { ArtifactsReviewSurface } from './components/ArtifactsReviewSurface';
import { DAGVisualizer } from './components/DAGVisualizer';
import { BranchesView } from './components/BranchesView';
import { AuditEventsView } from './components/AuditEventsView';
import { ApiWorkbench } from './components/ApiWorkbench';
import { IntegrationReadmeView } from './components/IntegrationReadmeView';
import { NewWorkRequestModal } from './components/NewWorkRequestModal';
import { NewArtifactModal } from './components/NewArtifactModal';

import { ThemeProvider, useTheme } from './context/ThemeContext';
import { visionService } from './api/visionService';
import {
  PlanningTask,
  Artifact,
  Branch,
  WorkRequestDAG,
  WorkStatus,
  PipelineStage,
  ArtifactType
} from './types/vision';

function MainAppContent() {
  const { uiPort } = useTheme();
  const [activeTab, setActiveTab] = useState<NavTab>('dashboard');
  const [isMockMode, setIsMockMode] = useState<boolean>(visionService.isMockMode());
  const [currentRoutePath, setCurrentRoutePath] = useState<string>(`http://localhost:${uiPort}/api/work-requests`);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Data state
  const [workRequests, setWorkRequests] = useState<PlanningTask[]>([]);
  const [artifacts, setArtifacts] = useState<Artifact[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [dag, setDag] = useState<WorkRequestDAG | null>(null);

  // Modals state
  const [isNewWRModalOpen, setIsNewWRModalOpen] = useState<boolean>(false);
  const [isNewArtifactModalOpen, setIsNewArtifactModalOpen] = useState<boolean>(false);

  // Initial load
  useEffect(() => {
    loadData();
  }, [isMockMode]);

  const loadData = async () => {
    try {
      const [wrs, arts, brs] = await Promise.all([
        visionService.getWorkRequests(),
        visionService.getArtifacts(),
        visionService.getBranches()
      ]);

      setWorkRequests(wrs);
      setArtifacts(arts);
      setBranches(brs);

      if (wrs.length > 0) {
        const dagRes = await visionService.getDAG(wrs[0].wr_id);
        setDag(dagRes);
      }
    } catch (err) {
      console.error('Error loading vision data:', err);
    }
  };

  const handleUpdateStatus = async (wr_id: string, newStatus: WorkStatus) => {
    await visionService.updateWorkRequest(wr_id, { status: newStatus });
    await loadData();
  };

  const handleDeleteWR = async (wr_id: string) => {
    await visionService.deleteWorkRequest(wr_id);
    await loadData();
  };

  const handleCreateWR = async (payload: {
    intent: string;
    priority: number;
    parent_request_id?: string | null;
    constraints?: Record<string, any>;
  }) => {
    await visionService.createWorkRequest(payload);
    await loadData();
  };

  const handleCreateBranch = async (payload: {
    wr_id: string;
    label?: string;
    parent_branch_id?: string | null;
    fork_point?: string | null;
  }) => {
    await visionService.createBranch(payload);
    await loadData();
  };

  const handleCreateArtifact = async (payload: {
    title: string;
    stage: PipelineStage;
    type: ArtifactType;
    summary: string;
    wr_id?: string | null;
    content: Record<string, any>;
  }) => {
    await visionService.createArtifact({
      ...payload,
      confidence: 0.95
    });
    await loadData();
  };

  const handlePromoteArtifactStage = async (artifactId: string, nextStage: PipelineStage) => {
    const art = artifacts.find((a) => a.artifact_id === artifactId);
    if (!art) return;

    await visionService.createArtifact({
      type: art.type,
      stage: nextStage,
      title: `[Promoted to ${nextStage}] ${art.title || art.artifact_id}`,
      summary: art.summary,
      wr_id: art.wr_id,
      parent_artifact_id: art.artifact_id,
      content: art.content,
      confidence: (art.confidence || 0.9) + 0.02
    });

    await loadData();
  };

  const handleToggleMockMode = (active: boolean) => {
    visionService.setMockMode(active);
    setIsMockMode(active);
  };

  const handleRunPathFinder = async (sourceId: string, targetId: string) => {
    return await visionService.findPath(sourceId, targetId);
  };

  const handleRunValidation = async (wrId: string) => {
    return await visionService.validateDAG(wrId);
  };

  const handleNavigateRoute = (route: string) => {
    setCurrentRoutePath(route);
    if (route.includes('dag')) {
      setActiveTab('dag');
    } else if (route.includes('artifacts')) {
      setActiveTab('artifacts');
    } else if (route.includes('branches')) {
      setActiveTab('branches');
    } else if (route.includes('work-requests')) {
      setActiveTab('kanban');
    }
  };

  const blockedCount = workRequests.filter((w) => w.status === 'BLOCKED').length;
  const existingWrIds = workRequests.map((w) => w.wr_id);

  return (
    <div className="min-h-screen bg-[#050505] text-slate-100 flex flex-col font-sans select-none antialiased">
      {/* Addressbar & Branding Box */}
      <HeaderAddressBar
        currentRoutePath={currentRoutePath}
        onNavigateRoute={handleNavigateRoute}
        onOpenNewWRModal={() => setIsNewWRModalOpen(true)}
        onOpenNewArtifactModal={() => setIsNewArtifactModalOpen(true)}
        onRefreshData={loadData}
        onSearchChange={setSearchQuery}
        searchQuery={searchQuery}
        isMockMode={isMockMode}
        onToggleMockMode={handleToggleMockMode}
      />

      {/* Main Body with Sidebar + Tab Content */}
      <div className="flex-1 flex overflow-hidden">
        <Sidebar
          activeTab={activeTab}
          onSelectTab={setActiveTab}
          counts={{
            workRequests: workRequests.length,
            artifacts: artifacts.length,
            branches: branches.length,
            blocked: blockedCount
          }}
        />

        <main className="flex-1 overflow-hidden bg-[#050505]">
          {activeTab === 'dashboard' && (
            <Dashboard
              workRequests={workRequests}
              artifacts={artifacts}
              dag={
                dag || {
                  dag_id: 'dag-001',
                  root_wr_id: 'wr-01',
                  nodes: {},
                  edges: [],
                  tenant_id: 'vision-srv',
                  trace_id: null,
                  kernel_id: null,
                  depth: 0,
                  total_nodes: 0,
                  compilation_status: 'compiled',
                  compilation_errors: [],
                  compiled_at: new Date().toISOString(),
                  metadata: {}
                }
              }
              onNavigateToTab={setActiveTab}
              onSelectWR={(id) => {
                setSearchQuery(id);
                setActiveTab('kanban');
              }}
            />
          )}

          {activeTab === 'kanban' && (
            <KanbanBoard
              workRequests={workRequests}
              onUpdateStatus={handleUpdateStatus}
              onDeleteWR={handleDeleteWR}
              onOpenNewWRModal={() => setIsNewWRModalOpen(true)}
              searchQuery={searchQuery}
            />
          )}

          {activeTab === 'artifacts' && (
            <ArtifactsReviewSurface
              artifacts={artifacts}
              onOpenNewArtifactModal={() => setIsNewArtifactModalOpen(true)}
              onPromoteArtifactStage={handlePromoteArtifactStage}
              searchQuery={searchQuery}
            />
          )}

          {activeTab === 'dag' && (
            <DAGVisualizer
              dag={
                dag || {
                  dag_id: 'dag-001',
                  root_wr_id: 'wr-01',
                  nodes: {},
                  edges: [],
                  tenant_id: 'vision-srv',
                  trace_id: null,
                  kernel_id: null,
                  depth: 0,
                  total_nodes: 0,
                  compilation_status: 'compiled',
                  compilation_errors: [],
                  compiled_at: new Date().toISOString(),
                  metadata: {}
                }
              }
              onRunPathFinder={handleRunPathFinder}
              onRunValidation={handleRunValidation}
              onRefreshDAG={loadData}
            />
          )}

          {activeTab === 'branches' && (
            <BranchesView
              branches={branches}
              workRequests={workRequests}
              onCreateBranch={handleCreateBranch}
            />
          )}

          {activeTab === 'audit' && (
            <AuditEventsView
              lifecycleEvents={visionService.getLifecycleEvents()}
              governanceEvents={visionService.getGovernanceEvents()}
              receipts={visionService.getReceipts()}
            />
          )}

          {activeTab === 'workbench' && <ApiWorkbench />}

          {activeTab === 'readme' && <IntegrationReadmeView />}
        </main>
      </div>

      {/* Modals */}
      <NewWorkRequestModal
        isOpen={isNewWRModalOpen}
        onClose={() => setIsNewWRModalOpen(false)}
        onSubmit={handleCreateWR}
        existingWrIds={existingWrIds}
      />

      <NewArtifactModal
        isOpen={isNewArtifactModalOpen}
        onClose={() => setIsNewArtifactModalOpen(false)}
        onSubmit={handleCreateArtifact}
        existingWrIds={existingWrIds}
      />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <MainAppContent />
    </ThemeProvider>
  );
}

