# Agent Teams UI

A professional, real-time frontend for monitoring and interacting with [LangGraph](https://github.com/langchain-ai/langgraph) multi-agent systems. Built with React 19, TypeScript, and the LangGraph SDK — featuring a three-panel layout for live agent status, message threads with tool-call inspection, human-in-the-loop interrupt handling, and task tracking.

---

## Table of Contents

- [Background](#background)
- [Screenshots](#screenshots)
- [Installation](#installation)
- [Usage](#usage)
- [Architecture](#architecture)
- [Development](#development)
- [Testing](#testing)
- [Contributing](#contributing)
- [License](#license)

---

## Background

Agent Teams UI provides a developer-grade cockpit for LangGraph agent graphs. It streams agent messages in real time, surfaces tool calls with input/output inspection, pauses execution for human approval on interrupt nodes, and tracks tasks and decisions across a run — all in a single browser window.

The project targets teams who build and operate multi-agent pipelines and need a reliable, extensible UI that speaks the LangGraph SDK natively rather than wrapping a generic chat widget.

---

## Screenshots

> _Screenshots will be added once the first complete UI milestone is shipped._

---

## Installation

**Prerequisites:** Node ≥ 22, a running [LangGraph server](https://langchain-ai.github.io/langgraph/concepts/langgraph_server/) (local or cloud).

```bash
# Clone the repo
git clone https://github.com/your-org/agent-teams-frontend.git
cd agent-teams-frontend

# Install dependencies
npm install

# Copy environment template and fill in your values
cp .env.example .env
```

### Environment variables

| Variable                    | Description                       | Default                 |
| --------------------------- | --------------------------------- | ----------------------- |
| `VITE_LANGGRAPH_API_URL`    | Base URL of your LangGraph server | `http://localhost:2024` |
| `VITE_LANGGRAPH_API_KEY`    | API key (LangSmith cloud only)    | —                       |
| `VITE_DEFAULT_ASSISTANT_ID` | Default graph/assistant to load   | `agent`                 |

---

## Usage

```bash
# Start the dev server
npm run dev

# Type-check without emitting
npm run typecheck

# Lint
npm run lint

# Format
npm run format
```

The app opens at `http://localhost:5173`. Select a graph from the team switcher (left panel), send a message in the composer, and watch the agent thread stream in real time.

### Human-in-the-loop

When an agent graph hits an `interrupt` node it pauses and surfaces an **Approve / Edit / Reject** card in the message thread. Clicking _Approve & continue_ resumes the run; clicking _Reject_ sends a rejection signal and the graph re-plans.

### Admin mode

Toggle _Admin_ in the top-right of the center panel to reveal per-message Langfuse trace links and observation IDs.

---

## Architecture

See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) for the full set of Architectural Decision Records (ADRs) covering:

- TypeScript migration rationale
- State management strategy (Zustand + TanStack Query)
- LangGraph SDK streaming integration
- Three-panel layout system
- TDD approach and testing strategy

---

## Development

```bash
# Run tests in watch mode
npm run test

# Run tests once (CI)
npm run test:run

# Coverage report
npm run test:coverage

# Build for production
npm run build
```

See [docs/CONTRIBUTING.md](docs/CONTRIBUTING.md) for the full contributor guide, branch strategy, commit conventions, and code standards.

---

## Testing

The project follows a TDD discipline. Every component, hook, and store slice ships with a co-located `.test.tsx` / `.test.ts` file. The stack is:

| Tool                                                                         | Role                                       |
| ---------------------------------------------------------------------------- | ------------------------------------------ |
| [Vitest](https://vitest.dev)                                                 | Test runner (Vite-native, Jest-compatible) |
| [React Testing Library](https://testing-library.com/react)                   | Component rendering and assertions         |
| [MSW](https://mswjs.io)                                                      | LangGraph SDK HTTP mocking                 |
| [@testing-library/user-event](https://github.com/testing-library/user-event) | Realistic user interactions                |

Coverage thresholds (enforced in CI): **branches 80 %, functions 80 %, lines 80 %**.

---

## Contributing

Contributions are welcome. Please read [docs/CONTRIBUTING.md](docs/CONTRIBUTING.md) before opening a PR — it covers the branch model, commit format, test requirements, and review checklist.

---

## License

MIT © Joseph Searle
