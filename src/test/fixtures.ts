import type { AgentNode, Graph, Task, Decision, Message } from '@/types'

export const FIXTURE_NODES: AgentNode[] = [
  { id: 'planner', name: 'Planner', icon: 'P', status: 'complete', desc: 'scoped requirements' },
  { id: 'architect', name: 'Architect', icon: 'A', status: 'waiting', desc: 'schema review' },
  { id: 'coder', name: 'Coder', icon: 'C', status: 'running', desc: 'writing handlers' },
  { id: 'reviewer', name: 'Reviewer', icon: 'R', status: 'idle', desc: '' },
  { id: 'tester', name: 'Tester', icon: 'T', status: 'idle', desc: '' },
  { id: 'deployer', name: 'Deployer', icon: 'D', status: 'idle', desc: '' },
]

export const FIXTURE_GRAPHS: Graph[] = [
  {
    id: 'sdlc',
    name: 'Development Team',
    version: 'v1.2.0',
    desc: 'Plans, builds, reviews and ships software through a coordinated team of specialised members.',
    nodes: 6,
    runs: 47,
    current: true,
  },
  {
    id: 'research',
    name: 'Research Team',
    version: 'v0.9.4',
    desc: 'Multi-step web research with citation tracking and synthesis. Good for market scans and lit reviews.',
    nodes: 4,
    runs: 128,
  },
  {
    id: 'rag',
    name: 'Customer Support Team',
    version: 'v2.1.0',
    desc: 'Retrieval-augmented support team over a knowledge base, with escalation routing.',
    nodes: 5,
    runs: 1804,
  },
  {
    id: 'tax',
    name: 'Tax Filing Team',
    version: 'v1.0.0',
    desc: 'Walks a user through filing, requesting docs and verifying entries before submission.',
    nodes: 7,
    runs: 12,
  },
  {
    id: 'react',
    name: 'ReAct Team',
    version: 'v0.3.1',
    desc: 'Reference single-member ReAct loop with tool-use. Useful as a baseline.',
    nodes: 2,
    runs: 9211,
  },
]

export const FIXTURE_TASKS: Task[] = [
  {
    id: 't1',
    title: 'Gather requirements & success criteria',
    phase: 'Planning',
    agent: 'Planner',
    priority: 'hi',
    status: 'done',
  },
  {
    id: 't2',
    title: 'Define MVP scope and out-of-scope list',
    phase: 'Planning',
    agent: 'Planner',
    priority: 'med',
    status: 'done',
  },
  {
    id: 't3',
    title: 'Design auth schema (users, sessions, tokens)',
    phase: 'Architecture',
    agent: 'Architect',
    priority: 'hi',
    status: 'done',
  },
  {
    id: 't4',
    title: 'Choose session storage strategy',
    phase: 'Architecture',
    agent: 'Architect',
    priority: 'med',
    status: 'active',
    note: 'awaiting human review',
  },
  {
    id: 't5',
    title: 'Spec /auth/login and /auth/refresh endpoints',
    phase: 'Architecture',
    agent: 'Architect',
    priority: 'med',
    status: 'blocked',
    warn: 'needs schema sign-off',
  },
  {
    id: 't6',
    title: 'Implement password hashing util',
    phase: 'Implementation',
    agent: 'Coder',
    priority: 'hi',
    status: 'active',
  },
  {
    id: 't7',
    title: 'Implement /auth/login handler',
    phase: 'Implementation',
    agent: 'Coder',
    priority: 'hi',
    status: 'todo',
  },
  {
    id: 't8',
    title: 'Implement refresh-token rotation',
    phase: 'Implementation',
    agent: 'Coder',
    priority: 'med',
    status: 'todo',
  },
  {
    id: 't9',
    title: 'Wire rate-limit middleware on auth routes',
    phase: 'Implementation',
    agent: 'Coder',
    priority: 'lo',
    status: 'todo',
  },
  {
    id: 't10',
    title: 'Static analysis pass on auth module',
    phase: 'Review',
    agent: 'Reviewer',
    priority: 'med',
    status: 'todo',
  },
  {
    id: 't11',
    title: 'Generate unit tests for hashing + JWT',
    phase: 'Testing',
    agent: 'Tester',
    priority: 'med',
    status: 'todo',
  },
  {
    id: 't12',
    title: 'Add integration tests for login flow',
    phase: 'Testing',
    agent: 'Tester',
    priority: 'lo',
    status: 'todo',
  },
  {
    id: 't13',
    title: 'Provision staging env on Fly.io',
    phase: 'Deployment',
    agent: 'Deployer',
    priority: 'lo',
    status: 'todo',
  },
]

export const FIXTURE_DECISIONS: Decision[] = [
  { t: '10:21', agent: 'Planner', text: 'Scoped MVP to email+password auth; deferred SSO to v2.' },
  { t: '10:24', agent: 'Planner', text: 'Acceptance: <200ms p95 on login, 99.9% availability.' },
  { t: '10:31', agent: 'Architect', text: 'Selected argon2id over bcrypt for password hashing.' },
  {
    t: '10:34',
    agent: 'Architect',
    text: 'JWT access tokens (15min) + opaque refresh tokens (30d).',
  },
  { t: '10:38', agent: 'Architect', text: 'Sessions stored in Redis; users in Postgres.' },
  {
    t: '10:42',
    agent: 'Coder',
    text: 'Adopted node-argon2 over rust-argon2 for build simplicity.',
  },
  { t: '10:44', agent: 'Coder', text: 'Pinned argon2id memory cost to 19MiB, 2 iterations.' },
]

export const FIXTURE_MESSAGES: Message[] = [
  {
    kind: 'user',
    from: 'You',
    time: '10:18',
    text: 'Build out the auth module for our app — email + password, JWT access tokens, refresh-token rotation.',
  },
  {
    kind: 'system',
    text: 'Graph started',
    from: 'supervisor',
    to: 'planner_agent',
    time: '10:18',
  },
  {
    kind: 'agent',
    agentId: 'planner',
    from: 'Planner',
    time: '10:21',
    text: 'Scoped the auth module to **email + password** as MVP. Handing off to the architect.',
  },
]

export const FIXTURE_GRAPH_SCHEMA = {
  graph_id: 'sdlc',
  nodes: [
    { id: '__start__', type: 'schema', data: {} },
    { id: 'planner_agent', type: 'runnable', data: {} },
    { id: 'architect_agent', type: 'runnable', data: {} },
    { id: 'coder_agent', type: 'runnable', data: {} },
    { id: '__end__', type: 'schema', data: {} },
  ],
  edges: [
    { source: '__start__', target: 'planner_agent' },
    { source: 'planner_agent', target: 'architect_agent' },
    { source: 'architect_agent', target: 'coder_agent' },
    { source: 'coder_agent', target: '__end__' },
  ],
}

export const FIXTURE_ASSISTANTS = FIXTURE_GRAPHS.map((g) => ({
  assistant_id: g.id,
  graph_id: g.id,
  name: g.name,
  metadata: { version: g.version, desc: g.desc },
  created_at: '2024-01-01T00:00:00.000Z',
  updated_at: '2024-01-01T00:00:00.000Z',
}))
