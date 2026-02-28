---
title: Building a programming language with AI agents
excerpt: A practical workflow for using AI agents to build a real compiler without losing quality, ownership, or velocity.
date: 2026-02-28
eyebrow: "Engineering Workflow"
author: "Yaser Alnajjar"
---

I built a compiled programming language with AI agents, but not by letting them run wild.

The difference between a demo and a production-ready system is process. This post covers the exact workflow I used to build Sifr, where it worked, where it failed, and what I would do differently if I started again.

## Why most agent-driven projects collapse

Most AI coding experiments fail for predictable reasons:

- Too much code is generated before architecture is stable
- The same agent writes and "reviews" changes
- PRs become hard to reason about
- Context drifts and regressions sneak in

The fix is not a better prompt. The fix is engineering structure.

## The project target

Sifr is designed with three goals:

- Python-like syntax and readability
- Compilation to Rust for performance and safety
- A strict static type system with ownership-oriented semantics

That means the system is more than a parser. It includes a full pipeline:

- Lexer
- Parser + AST
- Semantic analysis and HIR
- Type checking
- Code generation
- Tooling and runtime integration

For a project at this scope, agent discipline matters more than raw model quality.

## The operating model: architect + specialist agents

I used a role-based model instead of one general-purpose agent.

- Architect (human): sets constraints, sequencing, acceptance criteria
- Implementer agent: writes code for a narrowly scoped task
- Reviewer agent: audits behavior, tests, and risks
- Judge agent: performs phase-level quality gates

The most important rule: the implementer and reviewer are always different.

## The task loop that made this work

Every unit of work followed the same lifecycle:

1. Draft task with clear scope and acceptance criteria
2. Place in backlog and refine dependency order
3. Implement in a focused PR
4. Review with a separate agent
5. Run local validation
6. Merge only after passing checks

This sounds simple, but consistency is what prevents chaos.

## PRDS before epics

For larger features, no coding starts immediately.

Each epic begins with a PRDS document (product requirements + solution design):

- Problem statement
- Non-goals
- Architecture changes
- Data and API impact
- Validation strategy
- Rollout and risk notes

This changed everything. Reviewing design upfront is faster and safer than reviewing dozens of reactive fixes later.

## Sequential phases beat parallel entropy

A compiler has strong dependency chains. If you parallelize too early, you create contradictory assumptions.

I organized work into explicit phases and only moved forward when the current phase was stable. Foundations first, then feature depth.

Examples:

- Phase 1: Core compiler infrastructure
- Phase 2: Type system foundations
- Phase 3: Error reporting and diagnostics
- Later phases: Generics, advanced inference, optimization passes

This reduced rework and kept each phase testable.

## Validation strategy

Each task had required local checks, and each phase had broader audits.

Task-level checks:

- Unit tests for touched behavior
- Integration tests for affected pipeline stages
- Fast smoke demos for critical user flows

Phase-level checks:

- Judge-agent review of architecture drift
- Regression scan against previously completed phases
- Demo scripts to prove milestone behavior end-to-end

If a phase failed review, it went back to planning instead of patching blindly.

## What worked especially well

- Small, reviewable PRs with explicit acceptance criteria
- Separate implementation and review responsibilities
- Upfront design docs for complex work
- Strict phase sequencing for dependency-heavy systems
- Frequent local validation instead of relying on CI feedback loops

## What failed and how I corrected it

Early on, I let tasks become too broad. That created noisy diffs and fragile reviews.

Correction:

- Split large tasks into smaller contracts
- Tighten "definition of done" per task
- Reject PRs that mix unrelated concerns

Another recurring issue was optimistic assumptions in generated code.

Correction:

- Require explicit invariants in task descriptions
- Add negative tests for failure paths, not only happy paths

## Practical template you can reuse

If you want to run agents on a serious codebase, start with this:

1. Use planning artifacts before coding (at least for epics)
2. Keep one concern per PR
3. Use different agents for implementation and review
4. Require local test validation before merge
5. Add periodic "judge" reviews to detect drift
6. Prefer phase progression over unbounded parallel work

## Final takeaway

AI agents can dramatically accelerate delivery, but only if you enforce software engineering discipline.

The leverage comes from orchestration, not autonomy. Treat agents as specialists in a controlled workflow, and you can ship ambitious systems with quality still intact.
