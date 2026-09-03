import { describe, it, expect, vi, afterEach } from 'vitest';
import { getRepoStats } from '../src/lib/github';

describe('getRepoStats', () => {
  const originalFetch = global.fetch;

  afterEach(() => {
    global.fetch = originalFetch;
    vi.restoreAllMocks();
  });

  it('returns stars and last commit info when both requests succeed', async () => {
    global.fetch = vi.fn(async (url: string) => {
      if (url.endsWith('/repos/KuxarStudio/PDF-Blender')) {
        return {
          ok: true,
          json: async () => ({ stargazers_count: 3 }),
        } as Response;
      }
      if (url.includes('/commits')) {
        return {
          ok: true,
          json: async () => [
            { sha: 'abc1234567890', commit: { committer: { date: '2026-08-01T00:00:00Z' } } },
          ],
        } as Response;
      }
      throw new Error(`unexpected url: ${url}`);
    }) as unknown as typeof fetch;

    const stats = await getRepoStats('KuxarStudio/PDF-Blender');
    expect(stats).toEqual({
      stars: 3,
      lastCommitSha: 'abc1234',
      lastCommitDate: '2026-08-01T00:00:00Z',
    });
  });

  it('returns null when the repo request is not ok', async () => {
    global.fetch = vi.fn(async () => ({ ok: false, json: async () => ({}) }) as Response) as unknown as typeof fetch;
    const stats = await getRepoStats('KuxarStudio/private-repo');
    expect(stats).toBeNull();
  });

  it('returns null when fetch throws', async () => {
    global.fetch = vi.fn(async () => {
      throw new Error('network down');
    }) as unknown as typeof fetch;
    const stats = await getRepoStats('KuxarStudio/PDF-Blender');
    expect(stats).toBeNull();
  });

  it('returns null when the repo has no commits', async () => {
    global.fetch = vi.fn(async (url: string) => {
      if (url.endsWith('/repos/KuxarStudio/empty-repo')) {
        return { ok: true, json: async () => ({ stargazers_count: 0 }) } as Response;
      }
      if (url.includes('/commits')) {
        return { ok: true, json: async () => [] } as Response;
      }
      throw new Error(`unexpected url: ${url}`);
    }) as unknown as typeof fetch;

    const stats = await getRepoStats('KuxarStudio/empty-repo');
    expect(stats).toBeNull();
  });
});
