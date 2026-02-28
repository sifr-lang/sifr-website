---
title: Building a programming language with AI agents
excerpt: I built a compiled programming language using AI agents over a single weekend.
date: 2026-02-24
---

I built a compiled programming language using AI agents over a single weekend.

Not by letting them spam 1,000 commits/hour.
But by forcing them to act like disciplined software engineers.

Here is the 3-step workflow that makes AI development actually scalable 🧵👇

---

1/ The Problem with "Self-Driving" Codebases

We've all seen the demos: "Thousands of agents! Infinite commits!"

But throughput ≠ progress.
10 meaningful commits > 1,000 lines of chaotic code.

I wanted agents that follow a process, not just generate text.

---

2/ The Project: Sifr

I set out to build Sifr:
• Python syntax 🐍
• Compiles to Rust 🦀
• Static typing & borrow-by-default

It’s a full compiler pipeline (Lexer -> AST -> HIR -> Binary).
And it was built almost entirely by AI agents following a strict workflow.

---

3/ Strategy #1: The "Disciplined" Task Loop

Agents don't just "write code." They follow the lifecycle:
Draft Task 📝 -> Backlog -> Refine -> Implement 💻 -> Review 🔍 -> Merge

Crucially: One agent writes code. A DIFFERENT agent reviews it.
No merging without passing tests.

---

4/ Strategy #2: The PRDS (The Secret Weapon)

For complex features (Epics), agents aren't allowed to code immediately.
They must write a PRDS first:
• PRD (Requirements)
• Solution Design (Architecture)

I review the PRDS. That’s my "Human-in-the-loop" moment.
I review the PLAN, not 50 tiny PRs.

---

5/ Strategy #3: Phased Execution

You can't build a compiler all at once.
We organized work into 21 Phases.
• Phase 1: Foundations
• Phase 2: Type System
• ...
• Phase 13: Generics

Sequential execution prevents "dependency spaghetti."
Foundations first. Features second.

---

6/ The "Judge" Model

After each Phase, I bring in a "Judge" agent (usually a smarter model).
It evaluates the entire phase.
It decides if we need to re-plan or if we can proceed.

It’s like having a Staff Engineer review the team's output every sprint.

---

7/ The Results?

In just a weekend for the core (and continuing since):
✅ 11 Phases completed
✅ 80+ Epics shipped
✅ Full type system + 45 stdlib modules
✅ Zero-panic guarantees

All without me writing the boilerplate. I acted as the Architect; they were the Engineers.

---

8/ Want to try this workflow?

1. Force agents to plan before coding (PRDS).
2. Use different agents for implementation vs. review.
3. Don't be the bottleneck—review plans, not just lines of code.

Check out the full compiler written by AI here:
https://github.com/yaseralnajjar/sifr

And the full article explaining the workflow:
[LINK TO ARTICLE]
