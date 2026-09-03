export interface RepoStats {
  stars: number;
  lastCommitSha: string;
  lastCommitDate: string;
}

export async function getRepoStats(githubRepo: string): Promise<RepoStats | null> {
  const token = process.env.GITHUB_TOKEN;
  const headers: Record<string, string> = { Accept: 'application/vnd.github+json' };
  if (token) headers.Authorization = `Bearer ${token}`;

  try {
    const [repoRes, commitsRes] = await Promise.all([
      fetch(`https://api.github.com/repos/${githubRepo}`, { headers }),
      fetch(`https://api.github.com/repos/${githubRepo}/commits?per_page=1`, { headers }),
    ]);

    if (!repoRes.ok || !commitsRes.ok) return null;

    const repoJson = await repoRes.json();
    const commitsJson = await commitsRes.json();
    const latestCommit = Array.isArray(commitsJson) ? commitsJson[0] : null;
    if (!latestCommit) return null;

    return {
      stars: repoJson.stargazers_count ?? 0,
      lastCommitSha: String(latestCommit.sha).slice(0, 7),
      lastCommitDate: latestCommit.commit.committer.date,
    };
  } catch {
    return null;
  }
}
