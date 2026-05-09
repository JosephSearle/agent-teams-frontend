# Contributing to Agent Teams UI

Thank you for taking the time to contribute. This guide covers everything you need to get started: the branch model, commit format, code standards, test requirements, and the PR review checklist.

---

## Table of Contents

- [Prerequisites](#prerequisites)
- [Getting started](#getting-started)
- [Branch model](#branch-model)
- [Commit conventions](#commit-conventions)
- [Code standards](#code-standards)
- [Test-Driven Development](#test-driven-development)
- [Project structure](#project-structure)
- [Pull request process](#pull-request-process)
- [Definition of done](#definition-of-done)

---

## Prerequisites

| Tool    | Version    | Purpose         |
| ------- | ---------- | --------------- |
| Node.js | ≥ 22       | Runtime         |
| npm     | ≥ 10       | Package manager |
| Git     | any recent | Version control |

A running LangGraph server is not required for unit/integration tests — MSW mocks all HTTP calls. You only need it to test the live streaming integration manually.

---

## Getting started

```bash
# 1. Fork and clone
git clone https://github.com/your-fork/agent-teams-frontend.git
cd agent-teams-frontend

# 2. Install dependencies (Husky hooks are installed automatically via "prepare")
npm install

# 3. Set up environment
cp .env.example .env
# Edit .env with your LangGraph server URL

# 4. Start the dev server
npm run dev

# 5. Run the test suite
npm run test:run
```

---

## Branch model

| Branch           | Purpose                                                    |
| ---------------- | ---------------------------------------------------------- |
| `main`           | Production-ready code; protected, never pushed to directly |
| `develop`        | Integration branch; all feature PRs target this            |
| `feature/<slug>` | New features or enhancements                               |
| `fix/<slug>`     | Bug fixes                                                  |
| `chore/<slug>`   | Tooling, config, dependency bumps                          |
| `docs/<slug>`    | Documentation-only changes                                 |

Create your branch from `develop`:

```bash
git checkout develop
git pull origin develop
git checkout -b feature/interrupt-card-edit-mode
```

---

## Commit conventions

This project follows [Conventional Commits](https://www.conventionalcommits.org/). Husky enforces this via a `commit-msg` hook.

```
<type>(<scope>): <short description>

[optional body]

[optional footer]
```

### Types

| Type       | When to use                                                |
| ---------- | ---------------------------------------------------------- |
| `feat`     | A new feature visible to users or consumers of the library |
| `fix`      | A bug fix                                                  |
| `test`     | Adding or updating tests (no production code change)       |
| `refactor` | Code change that is not a feature or fix                   |
| `chore`    | Tooling, build, dependency changes                         |
| `docs`     | Documentation only                                         |
| `style`    | Formatting, whitespace (no logic change)                   |
| `perf`     | Performance improvement                                    |
| `ci`       | CI/CD pipeline changes                                     |

### Examples

```
feat(interrupt-card): add edit mode with payload textarea

fix(stream): handle empty chunk on connection close

test(composer): add user-event tests for shift+enter newline

chore: bump @langchain/langgraph-sdk to 0.1.4
```

### Scope

Use the component or feature name as the scope. If the change spans the whole project, omit the scope: `chore: update Node requirement to 22`.

---

## Code standards

### TypeScript

- Strict mode (`strict: true`) is non-negotiable. Do not use `any`; use `unknown` and narrow types.
- Prefer `interface` for object shapes that may be extended; use `type` for unions, intersections, and utility types.
- Export types from `src/types/index.ts`; do not co-locate domain types with component files.
- Use `satisfies` to validate literal objects against interfaces where applicable.

### React

- All components are function components — no class components.
- Props interfaces are named `<ComponentName>Props` and co-located at the top of the file.
- Avoid `useEffect` for derived state; use `useMemo` / selector functions instead.
- Lift state up only as far as needed. Prefer Zustand slices over deeply threaded Context.

### Styling (Tailwind)

- Use the `cn()` helper (`src/lib/utils.ts`) for all conditional class joining — never template literals.
- Do not use inline `style` props unless the value is purely dynamic and cannot be expressed as a Tailwind utility.
- Tailwind variant order: layout → spacing → sizing → colour → typography → state modifiers (`hover:`, `focus:`, `aria-*:`).

### Imports

Order (enforced by ESLint `import/order`):

1. Node built-ins
2. External packages
3. Internal aliases (`@/components`, `@/stores`, …)
4. Relative imports
5. Type-only imports (`import type`)

### Comments

Only comment the **why**, never the what. One short line maximum. Delete comments that describe what the code obviously already does.

---

## Test-Driven Development

The project follows the Red → Green → Refactor cycle:

1. **Red** — write a failing test that describes the desired behaviour.
2. **Green** — write the minimum code to make the test pass.
3. **Refactor** — clean up while keeping the tests green.

### Rules

- Every new component ships with a co-located `.test.tsx`.
- Every new hook ships with a co-located `.test.ts`.
- Every new Zustand slice is tested through a component that uses it, not in isolation.
- MSW handlers for any new LangGraph SDK call must be added to `src/test/msw-handlers.ts` before writing the consuming code.

### Running tests

```bash
# Watch mode (development)
npm run test

# Single run (CI)
npm run test:run

# Coverage report (must meet thresholds before merging)
npm run test:coverage
```

### Coverage thresholds

Enforced in `vitest.config.ts`:

```
branches: 80 %
functions: 80 %
lines:     80 %
```

A PR that drops coverage below these thresholds will fail CI.

### What to test

| Layer         | What to assert                                                            |
| ------------- | ------------------------------------------------------------------------- |
| UI components | Renders expected elements; responds to user events; reflects prop changes |
| Hooks         | Returns correct state; calls SDK methods with correct arguments           |
| Stores        | State transitions from actions; selectors return derived values           |
| Integration   | Full send → stream → render cycle using MSW                               |

### What not to test

- Internal implementation details (private functions, store internals not exposed via selectors).
- Tailwind class names — test behaviour and accessible roles, not CSS.
- Third-party library internals.

---

## Project structure

```
agent-teams-frontend/
├── docs/
│   ├── ARCHITECTURE.md          # ADRs and tech-stack rationale
│   └── CONTRIBUTING.md          # This file
├── public/
├── src/
│   ├── components/
│   │   ├── layout/              # App shell (PanelLayout)
│   │   ├── panels/              # LeftPanel, CenterPanel, RightPanel
│   │   ├── messages/            # MessageRenderer, ToolCall, InterruptCard, MarkdownRenderer
│   │   └── ui/                  # Atomic components: Button, Badge, Pill, StatusDot, …
│   ├── features/
│   │   ├── graph/               # GraphSwitcherModal, GraphMetaBlock
│   │   ├── tasks/               # TaskList, PhaseGroup, TaskRow
│   │   ├── decisions/           # DecisionLog
│   │   └── chat/                # Composer, ContextWidget, TraceBar
│   ├── hooks/
│   │   ├── useLangGraphStream.ts  # Wraps useStream; exposes typed stream state
│   │   ├── useThread.ts           # Thread creation and history
│   │   └── useGraphList.ts        # TanStack Query hook for assistants list
│   ├── lib/
│   │   ├── langgraph/
│   │   │   └── client.ts          # Singleton LangGraph Client
│   │   └── utils.ts               # cn() helper, formatters
│   ├── stores/
│   │   ├── slices/
│   │   │   ├── threadSlice.ts
│   │   │   ├── uiSlice.ts
│   │   │   └── graphSlice.ts
│   │   └── useAppStore.ts
│   ├── styles/
│   │   └── globals.css            # Tailwind @theme tokens
│   ├── test/
│   │   ├── msw-handlers.ts        # MSW request handlers
│   │   └── setup.ts               # Vitest setup (RTL, MSW server)
│   ├── types/
│   │   └── index.ts               # All shared domain interfaces
│   └── main.tsx
├── .env.example
├── .eslintrc.js
├── .prettierrc
├── index.html
├── package.json
├── tsconfig.app.json
├── tsconfig.json
├── tsconfig.node.json
├── vite.config.ts
└── vitest.config.ts
```

---

## Pull request process

1. **Target `develop`** — never open a PR directly to `main`.
2. **Self-review first** — run `npm run lint && npm run typecheck && npm run test:run` locally before pushing.
3. **PR description** must include:
   - What changed and why.
   - How to test it manually (if applicable).
   - Screenshots for any UI change.
4. **All CI checks must be green** — lint, typecheck, tests, coverage thresholds.
5. **At least one approval** required before merging.
6. **Squash merge** is the default strategy on `develop`; rebase onto `develop` before requesting review to avoid noisy merge commits.

---

## Definition of done

A task is done when all of the following are true:

- [ ] Tests are written first (TDD) and passing.
- [ ] `npm run typecheck` exits with code 0.
- [ ] `npm run lint` exits with code 0.
- [ ] `npm run test:coverage` meets all thresholds.
- [ ] The feature works correctly in the browser against a local LangGraph server (or a credible MSW mock of it).
- [ ] Code is reviewed and approved.
- [ ] `ARCHITECTURE.md` is updated if a new architectural decision was made.
- [ ] `README.md` is updated if the public API, env vars, or setup steps changed.
