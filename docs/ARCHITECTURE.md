# Architecture Decision Records

This document captures the key architectural decisions made for Agent Teams UI. Each record explains the context, the decision, the alternatives considered, and the consequences.

---

## ADR-001: Migrate from JavaScript to TypeScript (strict)

**Status:** Accepted

**Context:** The original prototype was plain JavaScript (`.jsx`). As the app grows to handle complex streaming state, LangGraph SDK types, and domain models (agents, tasks, decisions, interrupts), untyped code becomes a liability — especially for contributors unfamiliar with the data shapes.

**Decision:** Migrate all source files to TypeScript with `strict: true`. Use `tsconfig.app.json` and `tsconfig.node.json` split (matching the reference website pattern) so Vite config files are typed correctly without polluting app types.

**Alternatives considered:**

- JSDoc annotations — avoids a build step change but gives incomplete inference and no structural typing for complex union types.
- Gradual migration (`allowJs: true`) — acceptable short-term but defers the actual work; since the codebase is small, a full migration now costs less than managing a hybrid.

**Consequences:** All contributors must write TypeScript. The `npm run typecheck` command (`tsc -b --noEmit`) must pass before any PR merges. Vite still handles transpilation, so build speed is unchanged.

---

## ADR-002: Tailwind CSS v4 for styling

**Status:** Accepted

**Context:** The original app used a single 1 000-line `index.css` file with CSS custom properties and hand-rolled utility classes. This works for a prototype but does not scale — design tokens are scattered, there is no system for spacing/colour consistency, and onboarding a contributor means learning the bespoke class names.

**Decision:** Replace the monolithic stylesheet with Tailwind CSS v4 (`@tailwindcss/vite` plugin). Design tokens (colour palette, spacing, typography) live in `src/styles/globals.css` as `@theme` variables. Tailwind utility classes replace the hand-rolled ones; component-level overrides use `cn()` (a `clsx` + `tailwind-merge` helper).

**Alternatives considered:**

- CSS Modules — strong scoping but no design-token system out of the box; requires a separate token library.
- Vanilla Extract / Panda CSS — type-safe at authoring time, but higher set-up overhead and less community tooling than Tailwind.
- Keep current approach — fastest short-term but does not scale; ruled out.

**Consequences:** Tailwind v4 uses a Vite plugin (not a PostCSS plugin), which is simpler. Contributors should be familiar with Tailwind utility classes. The `cn()` helper is the only approved way to conditionally join class names.

---

## ADR-003: `@langchain/langgraph-sdk` with `useStream` as the agent communication layer

**Status:** Accepted

**Context:** The app needs to:

1. Stream messages from LangGraph agent runs in real time.
2. Surface tool-call progress (starting / running / complete).
3. Handle human-in-the-loop (HITL) `__interrupt__` events.
4. Resume or reject paused runs.
5. Manage thread state across sessions.

Writing this from scratch over raw `fetch`/`EventSource` would be substantial and brittle.

**Decision:** Use `@langchain/langgraph-sdk` for all agent communication. The SDK's `useStream` hook (imported from `@langchain/langgraph-sdk/react`) handles SSE parsing, reconnection, and type-safe chunk events. The `Client` class manages threads, runs, and assistant lookups.

Key integration points:

- `useStream({ assistantId, streamMode: ['values', 'updates', 'messages-tuple'] })` drives the message thread.
- `stream.toolProgress` surfaces running tool calls.
- `stream.interrupt` surfaces HITL payloads.
- `client.runs.create` / `client.threads.create` for explicit thread management.

**Alternatives considered:**

- Raw `EventSource` + custom SSE parser — full control but high implementation cost; would need to reproduce what the SDK already does.
- Vercel AI SDK — excellent DX, but built around OpenAI-compatible APIs; LangGraph-specific features (graph state, interrupts, thread IDs) are not modelled.
- LangChain.js streaming primitives — lower-level than the SDK; would require wiring up the same abstractions manually.

**Consequences:** The app is tightly coupled to LangGraph as the backend runtime. This is intentional — the product's value proposition is LangGraph-native observability. If a different backend is needed, a `src/lib/adapters/` layer can translate between wire formats, but LangGraph remains the canonical target.

---

## ADR-004: Zustand (slices pattern) for client state

**Status:** Accepted

**Context:** The app has several independent state domains:

- **Thread** — active thread ID, messages (from `useStream`).
- **UI** — active panel layout, theme palette/accent/density, modal state.
- **Graph** — available graphs list, active graph selection.

React Context is sufficient for simple cases but causes re-renders across the tree for high-frequency streaming updates. Redux is heavyweight for this scope.

**Decision:** Use Zustand with the slices pattern. Each domain is a `StateCreator` slice; slices are composed into a single `useAppStore`. Devtools middleware is enabled in development for time-travel debugging.

Store layout:

```
src/stores/
  slices/
    threadSlice.ts   — threadId, messages, streaming status
    uiSlice.ts       — layout, theme tweaks, modal flags
    graphSlice.ts    — graphs[], activeGraph
  useAppStore.ts     — compose + devtools
```

**Alternatives considered:**

- React Context + useReducer — no external dependency, but lacks devtools, selector memoisation, and cross-component subscription without prop drilling.
- Jotai — atom-per-value model is elegant but composing atoms for the streaming message array is less ergonomic than a single Zustand slice.
- TanStack Store — newer, good TS types, but smaller community and fewer examples for streaming mutation patterns.

**Consequences:** Selectors must be written with proper equality functions (`useShallow`) to avoid excessive re-renders from shallow-compared object slices. Actions are co-located in slices, not dispatched from components.

---

## ADR-005: TanStack Query v5 for server/REST state

**Status:** Accepted

**Context:** Alongside the streaming agent thread there are conventional REST calls:

- Fetching the list of available graphs/assistants on mount.
- Fetching historical thread runs.
- Reading thread state for resumption.

These are best-served by a caching layer with stale-while-revalidate semantics, not by ad-hoc `useEffect`+`fetch`.

**Decision:** Use TanStack Query v5 (`@tanstack/react-query`) for all non-streaming server state. LangGraph SDK calls are wrapped in `queryFn` functions. The `QueryClient` is instantiated once and injected via `QueryClientProvider`.

**Alternatives considered:**

- SWR — similar feature set but smaller API surface than TanStack Query; TanStack Query v5 has better TypeScript inference and more granular cache invalidation.
- Manual fetch + Zustand — avoids a dependency but recreates caching, deduplication, and error handling from scratch.

**Consequences:** `useStream` (from the LangGraph SDK) drives the streaming thread. TanStack Query drives everything else. They do not share cache — this is intentional and clear. Zustand stores should not duplicate TanStack Query cache; components should call query hooks directly.

---

## ADR-006: react-markdown + remark-gfm for message rendering

**Status:** Accepted

**Context:** Agent messages contain Markdown: bold, inline code, fenced code blocks, and lists. The prototype used a hand-rolled `renderMarkdown()` function that only handled `**bold**` and `` `code` ``. This misses most real-world agent output.

**Decision:** Use `react-markdown` with the `remark-gfm` plugin (GitHub Flavoured Markdown). Code blocks are highlighted via `react-syntax-highlighter`. Custom component overrides are defined once in `src/components/messages/MarkdownRenderer.tsx`.

**Alternatives considered:**

- `markdown-to-jsx` — similar feature set, slightly smaller bundle, but `react-markdown` has wider adoption and better plugin ecosystem (`rehype-*`, `remark-*`).
- Extend the hand-rolled function — not scalable; every new Markdown construct needs a new regex.

**Consequences:** Message rendering is safe (no `dangerouslySetInnerHTML`). Code blocks can be copied. The custom component map (`components` prop) allows us to style rendered elements with Tailwind classes without losing Markdown semantics.

---

## ADR-007: Vitest + React Testing Library + MSW (TDD)

**Status:** Accepted

**Context:** The project adopts Test-Driven Development. Tests must run fast (Vite-native), be realistic (DOM-based, not unit-isolated), and be able to mock the LangGraph SDK's HTTP calls without shipping a real server in CI.

**Decision:**

- **Vitest** as the runner — Vite-native, zero-config with the existing Vite setup, Jest-compatible API so contributors familiar with Jest are not lost.
- **React Testing Library** — tests interact with components via accessible roles and labels, not implementation details.
- **MSW v2** — intercepts LangGraph SDK HTTP requests at the network layer; handlers live in `src/test/msw-handlers.ts`. Streaming SSE responses are mocked with MSW's `HttpResponse` with a `ReadableStream`.
- **`@testing-library/user-event`** — realistic keyboard/pointer interactions for the composer and interrupt card.

Test file co-location: every component/hook file has a sibling `.test.tsx`/`.test.ts`. Coverage thresholds (`80 %` branches, functions, lines) are enforced via `vitest.config.ts`.

**Alternatives considered:**

- Jest — compatible but requires Babel/ts-jest setup, slower than Vitest, and duplicates Vite's transform pipeline.
- Playwright for component tests — accurate browser APIs but slower feedback loop; reserved for E2E tests in a future phase.

**Consequences:** MSW handlers must be updated when the LangGraph SDK's HTTP contract changes. Tests focus on user-observable behaviour; internal implementation details (e.g. Zustand slice internals) are not tested in isolation — stores are tested through the components that consume them.

---

## ADR-008: Three-panel layout with CSS Grid

**Status:** Accepted

**Context:** The UI has a fixed three-column structure (left: agent nodes, centre: message thread, right: tasks). The prototype implemented this via flex with hardcoded widths in CSS. Responsive collapse (hiding the right panel on smaller viewports) required a separate CSS class toggle.

**Decision:** Use a CSS Grid layout defined in Tailwind with named areas (`grid-cols-[260px_1fr_300px]`). The active layout variant is stored in `uiSlice`. When `layout === 'two-panel'` the grid hides the right column. Breakpoint-driven collapse (`lg:` prefix) handles viewports narrower than 1024 px automatically.

**Consequences:** Panel widths are design tokens set in `globals.css` (`--panel-left`, `--panel-right`). Centre column is always `1fr`. The `TweaksPanel` remains a slide-over (fixed position), not a grid column.

---

## Technology Stack Summary

| Concern           | Library                          | Version  |
| ----------------- | -------------------------------- | -------- |
| Language          | TypeScript (strict)              | ~6.x     |
| UI framework      | React                            | ^19      |
| Build             | Vite                             | ^6       |
| Styling           | Tailwind CSS                     | ^4       |
| Agent streaming   | `@langchain/langgraph-sdk`       | latest   |
| React stream hook | `@langchain/langgraph-sdk/react` | latest   |
| Client state      | Zustand                          | ^5       |
| Server state      | TanStack Query                   | ^5       |
| Markdown          | react-markdown + remark-gfm      | latest   |
| Syntax highlight  | react-syntax-highlighter         | latest   |
| Class merging     | clsx + tailwind-merge            | latest   |
| Testing runner    | Vitest                           | ^3       |
| Component testing | React Testing Library            | ^16      |
| HTTP mocking      | MSW                              | ^2       |
| User events       | @testing-library/user-event      | ^14      |
| Linting           | ESLint + typescript-eslint       | ^10      |
| Formatting        | Prettier                         | ^3       |
| Git hooks         | Husky + lint-staged              | ^9 / ^15 |
