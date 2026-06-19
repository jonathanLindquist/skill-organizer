# SO-0002 Add More Providers

- Ticket: SO-0002
- Board: ~/obsidian_notes/pocock-skills-vault/projects/utilities/skill-organizer/Skill Organizer Kanban.md
- Card: SO-0002 Add More Providers
- Created: 2026-06-19

## Summary

Add additional provider entries to `providers.json` as new agent skill destinations become useful.

## Context

The sync engine already supports config-backed providers that use the same per-skill directory model.

Current project facts:

- Project path: `~/projects/utilities/skill-organizer`
- Source of truth: `~/.agents/skills`
- Config file: `providers.json`
- Current provider: `--claude-code` -> `~/.claude/skills`

## Plan

- [ ] Add the provider entry to `providers.json`
- [ ] Run `node bin/skill-organizer.js --help`
- [ ] Add or update tests if the provider uses a different directory model

## Verification

- [ ] `npm run lint`
- [ ] `npm test`

## Outcome

Pending.
