# AS-0006 Generalize agent-sync beyond skills

- Ticket: AS-0006
- Board: derived from `$PROJECT_WORKFLOW_OBSIDIAN_VAULT` and `docs/agents/project-workflow.json`
- Card: AS-0006 Generalize agent-sync beyond skills
- Created: 2026-06-19

## Summary

Introduce a config-driven artifact registry that preserves current skill sync behavior and adds a first global-instructions artifact group for shared agent instruction Markdown.

## Context

The previous implementation only understood skill directories. This ticket introduces an artifact registry without changing the default `--claude-code` behavior: provider flags still sync only default artifacts unless an artifact is selected explicitly.

## Plan

- [x] Add `agent-sync.json` with `skills` and `global-instructions` artifact groups
- [x] Keep `skills` as the only default artifact
- [x] Add `--artifact <id>` and `--all-artifacts`
- [x] Add file-artifact sync behavior for global instructions
- [x] Sync Codex global instructions via symlink to `~/.codex/AGENTS.md`
- [x] Sync Claude Code global instructions via import wrapper at `~/.claude/CLAUDE.md`
- [x] Preserve legacy provider-only config parsing for compatibility tests

## Acceptance Criteria

- [x] `--claude-code` alone still syncs only skills
- [x] `--artifact global-instructions --codex` syncs `~/.agents/AGENTS.md` to `~/.codex/AGENTS.md`
- [x] `--artifact global-instructions --claude-code` syncs `~/.agents/AGENTS.md` through a `~/.claude/CLAUDE.md` import wrapper
- [x] Missing, imported, linked, replaced, and skipped file-artifact states are represented with the existing action vocabulary

## Verification

- [x] `npm run lint`
- [x] `npm test`
- [x] `node bin/agent-sync.js --dry-run --artifact global-instructions --codex`
- [x] `node bin/agent-sync.js --dry-run --artifact global-instructions --claude-code`

## Outcome

Implemented the first generalized artifact path. Memory, plugin, `CONTEXT.md`, and provider-specific rules are intentionally deferred until their harness ownership and write behavior are verified.
