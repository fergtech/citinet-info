// Who is actually working on Citinet, taken from the repo's own commit history at build time.
//
// A collaborator is a real GitHub user account that has committed since `since` (see the overrides file),
// is not the owner (the owner is named on the page already), and is not a bot or a known AI agent account.
// GitHub cannot reliably tell an AI agent apart from a person when it commits as an ordinary user, so the
// deny list below and src/data/collaborators.overrides.json (allow / deny) are the manual safety valve.
// Co-authored-by trailers (aider, Claude, ...) are never contributors and never appear here.
//
// If GitHub can't be reached (offline build, rate limit) the last known list in
// src/data/collaborators.fallback.json is used, so the page never breaks or goes blank.

import fallback from '../data/collaborators.fallback.json';
import overrides from '../data/collaborators.overrides.json';

export interface Collaborator {
  login: string;
  url: string;
  avatar: string;
}

const REPO = 'fergtech/citinet';
const MAX_PAGES = 5; // 500 commits is far more than a collaborator list needs

// Accounts that are AI agents or automation even when GitHub types them as a normal User.
const AI_OR_AUTOMATION: RegExp[] = [
  /^copilot/i,
  /^claude/i,
  /^anthropic/i,
  /^aider/i,
  /^cursor/i,
  /^devin/i,
  /^codex/i,
  /^openai/i,
  /^gemini/i,
  /^sweep/i,
  /^github-actions/i,
  /^dependabot/i,
  /^renovate/i,
  /^vercel/i,
  /\[bot\]$/i,
  /-bot$/i,
];

interface GhAuthor {
  login: string;
  type: string;
  avatar_url: string;
  html_url: string;
}

const lower = (s: string) => s.toLowerCase();

function isAiOrAutomation(a: GhAuthor): boolean {
  return a.type !== 'User' || AI_OR_AUTOMATION.some((re) => re.test(a.login));
}

async function fetchAuthorsSince(since: string, token?: string): Promise<GhAuthor[]> {
  const found = new Map<string, GhAuthor>();
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 10_000);
  try {
    for (let page = 1; page <= MAX_PAGES; page++) {
      const res = await fetch(`https://api.github.com/repos/${REPO}/commits?since=${encodeURIComponent(since)}&per_page=100&page=${page}`, {
        signal: ctrl.signal,
        headers: {
          Accept: 'application/vnd.github+json',
          'User-Agent': 'citinet-info-build',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
      if (!res.ok) throw new Error(`GitHub responded ${res.status}`);
      const commits = (await res.json()) as Array<{ author: GhAuthor | null }>;
      for (const c of commits) {
        // keep the first-seen entry so a handle's casing stays stable
        if (c.author?.login && !found.has(lower(c.author.login))) found.set(lower(c.author.login), c.author);
      }
      if (commits.length < 100) break;
    }
  } finally {
    clearTimeout(timer);
  }
  return [...found.values()];
}

const toCollaborator = (login: string, url?: string, avatar?: string): Collaborator => ({
  login,
  url: url ?? `https://github.com/${login}`,
  avatar: avatar ?? `https://github.com/${login}.png?size=48`,
});

export async function getCollaborators(): Promise<Collaborator[]> {
  const owners = new Set((overrides.owners ?? []).map(lower));
  const deny = new Set((overrides.deny ?? []).map(lower));
  const token = (import.meta.env.GITHUB_TOKEN as string | undefined) || process.env.GITHUB_TOKEN;

  let list: Collaborator[];
  let source = 'github';
  try {
    const authors = await fetchAuthorsSince(overrides.since, token);
    list = authors
      .filter((a) => !isAiOrAutomation(a))
      .map((a) => toCollaborator(a.login, a.html_url, `${a.avatar_url}${a.avatar_url.includes('?') ? '&' : '?'}s=48`));
  } catch (err) {
    source = 'fallback';
    list = (fallback.collaborators as Collaborator[]).map((c) => ({ ...c }));
    console.warn(`[collaborators] could not read GitHub (${(err as Error).message}); using the last known list`);
  }

  for (const login of overrides.allow ?? []) {
    if (!list.some((c) => lower(c.login) === lower(login))) list.push(toCollaborator(login));
  }

  const result = list
    .filter((c) => !owners.has(lower(c.login)) && !deny.has(lower(c.login)))
    .sort((a, b) => lower(a.login).localeCompare(lower(b.login)));

  console.info(`[collaborators] ${result.length} from ${source}: ${result.map((c) => '@' + c.login).join(', ') || '(none)'}`);
  return result;
}
