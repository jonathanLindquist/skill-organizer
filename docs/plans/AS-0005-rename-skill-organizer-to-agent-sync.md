# AS-0005 Rename skill-organizer to agent-sync

- Ticket: AS-0005
- Board: derived from `$PROJECT_WORKFLOW_OBSIDIAN_VAULT` and `docs/agents/project-workflow.json`
- Card: AS-0005 Rename skill-organizer to agent-sync
- Created: 2026-06-19

## Summary

Rename the package, CLI, docs, GitHub project identity, local tracker paths, and ticket namespace from skill-organizer/SO to agent-sync/AS while keeping skill-organizer as a silent compatibility alias.

## Context

This rename happens after `v0.1.0` is tagged so consumers can pin the old project identity. The old `skill-organizer` executable remains as a silent compatibility alias.

## Plan

- [x] Rename package metadata to `agent-sync`
- [x] Add primary `bin/agent-sync.js`
- [x] Keep `bin/skill-organizer.js` as a compatibility alias
- [x] Rename the legacy provider config file to `agent-sync.json`
- [x] Rewrite repo docs and plan filenames to the `AS-*` ticket namespace
- [x] Update the Obsidian board path and project tag to `agent-sync`
- [ ] Rename the GitHub repository to `agent-sync`
- [ ] Rename the active local checkout directory to `agent-sync`

## Acceptance Criteria

- [x] `node bin/agent-sync.js --help` works
- [x] `node bin/skill-organizer.js --help` works
- [x] New tickets use the `AS` prefix with next number `7`
- [ ] GitHub remote points at the renamed repository
- [ ] The active checkout directory is `~/projects/utilities/agent-sync`

## Verification

- [x] `npm run lint`
- [x] `npm test`
- [x] `node bin/agent-sync.js --help`
- [x] `node bin/skill-organizer.js --help`
- [ ] `git remote -v`

## Outcome

Code, docs, committed tracker files, and the Obsidian board were migrated to `agent-sync` / `AS-*`. GitHub repository rename and local checkout directory rename remain external follow-ups because GitHub CLI is unauthenticated and renaming the active workspace would invalidate the current session path.
