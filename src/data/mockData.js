// mockData.js — The single source of truth for all mock data in TaskFlow.
//
// WHY A SEPARATE FILE?
// Mixing data and UI code in the same file makes components hard to read.
// Keeping data separate means:
//   1. Components stay focused on HOW to display things
//   2. Data can be easily swapped for real API data later (Milestone 10)
//   3. Multiple components can import the same data without duplication
//
// DATA STRUCTURES USED:
//   - Arrays  [ ]  → ordered lists of items
//   - Objects { }  → single items with named properties
//   - Arrays of objects → the most common pattern in React apps
//
// STATUSES (what stage a task is in):
//   'todo'        → not started yet
//   'in-progress' → actively being worked on
//   'in-review'   → done, waiting for review/approval
//   'completed'   → fully done
//
// PRIORITIES (how urgent a task is):
//   'low'    → nice to have
//   'medium' → normal importance
//   'high'   → important, do soon
//   'urgent' → drop everything, do now

// ─────────────────────────────────────────────────────────────────────────────
// PROJECTS — each task belongs to a project
// ─────────────────────────────────────────────────────────────────────────────
export const projects = [
  {
    id: 'proj-1',
    name: 'Website Redesign',
    description: 'Complete overhaul of the marketing website with new design system',
    color: '#6366f1',     // indigo — used for the project color indicator
    totalTasks: 5,
    completedTasks: 2,
  },
  {
    id: 'proj-2',
    name: 'DevOps Setup',
    description: 'Set up CI/CD pipeline, monitoring, and deployment infrastructure',
    color: '#8b5cf6',     // violet
    totalTasks: 3,
    completedTasks: 1,
  },
  {
    id: 'proj-3',
    name: 'API Development',
    description: 'Build and document the REST API for the mobile application',
    color: '#10b981',     // emerald
    totalTasks: 3,
    completedTasks: 2,
  },
]

// ─────────────────────────────────────────────────────────────────────────────
// TASKS — the main data of the application
//
// Date note: today is October 12, 2026.
//   - Dates before '2026-10-12' → OVERDUE (if not completed)
//   - '2026-10-12' → due TODAY
//   - Dates after → future deadlines
// ─────────────────────────────────────────────────────────────────────────────
export const tasks = [
  {
    id: 'task-1',
    title: 'Design landing page wireframes',
    description: 'Create low and high-fidelity wireframes for the new homepage layout',
    status: 'in-progress',
    priority: 'high',
    projectId: 'proj-1',
    dueDate: '2026-10-15',
    createdAt: '2026-10-01',
  },
  {
    id: 'task-2',
    title: 'Set up CI/CD pipeline',
    description: 'Configure GitHub Actions for automated testing and deployment',
    status: 'todo',
    priority: 'urgent',
    projectId: 'proj-2',
    dueDate: '2026-10-12',   // Due TODAY
    createdAt: '2026-10-02',
  },
  {
    id: 'task-3',
    title: 'Write API documentation',
    description: 'Document all REST endpoints using OpenAPI/Swagger specification',
    status: 'in-review',
    priority: 'medium',
    projectId: 'proj-3',
    dueDate: '2026-10-18',
    createdAt: '2026-10-03',
  },
  {
    id: 'task-4',
    title: 'Fix login page redirect bug',
    description: 'Users are not redirected to dashboard after successful login',
    status: 'completed',
    priority: 'high',
    projectId: 'proj-1',
    dueDate: '2026-10-08',   // Past date — but completed, so not overdue
    createdAt: '2026-10-04',
  },
  {
    id: 'task-5',
    title: 'Create user onboarding flow',
    description: 'Design and implement step-by-step onboarding for new users',
    status: 'todo',
    priority: 'high',
    projectId: 'proj-1',
    dueDate: '2026-10-10',   // Past date AND not completed → OVERDUE
    createdAt: '2026-10-04',
  },
  {
    id: 'task-6',
    title: 'Database schema migration',
    description: 'Migrate legacy users table to new schema with roles support',
    status: 'in-progress',
    priority: 'urgent',
    projectId: 'proj-2',
    dueDate: '2026-10-09',   // Past date AND not completed → OVERDUE
    createdAt: '2026-10-05',
  },
  {
    id: 'task-7',
    title: 'Build design system components',
    description: 'Create Button, Input, Modal, Badge, and Card components',
    status: 'completed',
    priority: 'medium',
    projectId: 'proj-1',
    dueDate: '2026-10-05',
    createdAt: '2026-10-01',
  },
  {
    id: 'task-8',
    title: 'Performance optimization audit',
    description: 'Identify and fix page load performance bottlenecks',
    status: 'todo',
    priority: 'low',
    projectId: 'proj-3',
    dueDate: '2026-10-25',
    createdAt: '2026-10-06',
  },
  {
    id: 'task-9',
    title: 'Write unit tests for auth module',
    description: 'Achieve 80% code coverage for the authentication module',
    status: 'in-review',
    priority: 'medium',
    projectId: 'proj-3',
    dueDate: '2026-10-20',
    createdAt: '2026-10-06',
  },
  {
    id: 'task-10',
    title: 'Deploy staging environment',
    description: 'Set up and configure the staging server on AWS',
    status: 'completed',
    priority: 'high',
    projectId: 'proj-2',
    dueDate: '2026-10-07',
    createdAt: '2026-10-02',
  },
]
