# AS-0003 Package CLI For Daily Use

- Ticket: AS-0003
- Board: ~/obsidian_notes/pocock-skills-vault/projects/utilities/agent-sync/Agent Sync Kanban.md
- Card: AS-0003 Package CLI For Daily Use
- Created: 2026-06-19

## Summary

Decide how this CLI should be invoked day to day, such as a global npm link, npm script, or shell alias.

## Context

The primary CLI entrypoint is `bin/agent-sync.js`, and the primary package bin name is `agent-sync`. The old `skill-organizer` bin remains as a compatibility alias.

## Plan

- [ ] Pick the preferred invocation path
- [ ] Document the chosen setup in `README.md`
- [ ] Verify the command from outside the project directory

## Verification

- [ ] `agent-sync --help`
- [ ] `agent-sync --dry-run --all-providers`
- [ ] `skill-organizer --help`
- [ ] `skill-organizer --dry-run --all-providers`

## Outcome

Pending.
