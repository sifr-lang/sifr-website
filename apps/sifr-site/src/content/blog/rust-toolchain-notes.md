---
title: Building a language toolchain on top of Rust
excerpt: Early prototyping notes and why developer ergonomics matter.
date: 2026-02-05
---

Choosing Rust for a language toolchain gives us a lot of room for predictable
performance and robust internals, but implementation details still need to be
guided by user workflows.

Current priorities:

- Keep syntax approachable for Python users
- Reduce friction in local development loops
- Maintain clear error messages when things fail

As the compiler and runtime evolve, this blog will track tradeoffs and design
decisions in public.
