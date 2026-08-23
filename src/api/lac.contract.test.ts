// @vitest-environment happy-dom
// LAC contract test (architect thread 83d2fd5c, rule 5) — vision-ui.
// Template variant for services with STATIC fixture imports: the import
// binding itself is allowed (tree-shaking concern, not a contract one);
// the contract is that live-mode RUNTIME paths never consume fixtures,
// never seed storage, and surface transport failures.

import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('./mockData', () => ({
  INITIAL_WORK_REQUESTS: [],
  INITIAL_ARTIFACTS: [],
  INITIAL_BRANCHES: [],
  INITIAL_DAG: { nodes: [], edges: [] },
  INITIAL_LIFECYCLE_EVENTS: [],
  INITIAL_GOVERNANCE_EVENTS: [],
  INITIAL_RECEIPTS: [],
}));

describe('LAC contract: vision-ui VisionService', () => {
  beforeEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
    localStorage.clear();
    // LIVE transport that always fails.
    vi.stubGlobal('fetch', vi.fn(async () => {
      throw new TypeError('simulate network failure');
    }));
  });

  it('defaults to LIVE mode (no implicit mock)', async () => {
    const { visionService } = await import('./visionService');
    expect(visionService.isMockMode()).toBe(false);
  });

  it('surfaces live-transport failures instead of falling back to fixtures', async () => {
    const { visionService } = await import('./visionService');
    await expect(visionService.getWorkRequests()).rejects.toThrow(/simulate network failure|Failed to fetch/);
  });

  it('never seeds mock storage during a live boot', async () => {
    const { visionService } = await import('./visionService');
    expect(visionService.isMockMode()).toBe(false);
    expect(localStorage.getItem('losm_mock_work_requests_v1')).toBeNull();
    expect(localStorage.getItem('losm_mock_artifacts_v1')).toBeNull();
    expect(localStorage.getItem('losm_mock_branches_v1')).toBeNull();
  });
});
