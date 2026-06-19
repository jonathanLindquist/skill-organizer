# AS-0002 Add More Providers

- Ticket: AS-0002
- Board: ~/obsidian_notes/pocock-skills-vault/projects/utilities/agent-sync/Agent Sync Kanban.md
- Card: AS-0002 Add More Providers
- Created: 2026-06-19

## Summary

Add additional provider entries to `agent-sync.json` as new agent skill destinations become useful.

## Context

The sync engine already supports config-backed providers that use the same per-skill directory model.

Current project facts:

- Project path: `~/projects/utilities/agent-sync`
- Source of truth: `~/.agents/skills`
- Config file: `agent-sync.json`
- Current provider: `--claude-code` -> `~/.claude/skills`

## Plan

- [ ] Add the provider entry to `agent-sync.json`
- [ ] Run `node bin/agent-sync.js --help`
- [ ] Add or update tests if the provider uses a different directory model

## Verification

- [ ] `npm run lint`
- [ ] `npm test`

## Outcome

Pending.
