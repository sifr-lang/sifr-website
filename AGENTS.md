# AGENTS.md

## Core expectations

- Solve root causes, not superficial symptoms.
- Do NOT create fallback paths or solutions unless explicitly requested.
- No laziness and no shortcuts, make sure to ideally fix the root cause.
- Keep changes focused on the requested milestone/issue.
- Prefer small, reviewable PRs with clear validation.
- Do not wait on CI; run local validations.

## Required workflow

- Follow `.cursor/skills/project-workflow/SKILL.md`.
- Execute items one by one in a loop:
  1. Plan and define to-do list for all the parts of the item.
  2. Implement and validate locally (demo + tests).
  3. Open PR for that item.
  4. Review and merge.
  5. Move to the next item.
- Keep docs updated with status, checklist state, and merged PR links.

## References

- Design/style guide: `DESIGN.md`

## Safety rules

- Do not use destructive git operations unless explicitly requested.
- Do not revert unrelated user changes.
- If unexpected repo modifications appear, stop and ask before proceeding.
