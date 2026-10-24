# TaskFlow — Project Context & Implementation Changelog

> **About this file**: This living document tracks all architecture, features, components, state workflows, bug fixes, and development progress for the TaskFlow project. It is updated whenever changes or new features are introduced.

---

## 1. Project Overview & Tech Stack
- **Framework**: React 19 + Vite
- **Routing**: `react-router-dom` v7
- **Styling**: Tailwind CSS v4 (`@tailwindcss/vite`) + Vanilla CSS custom properties
- **Icons**: Lucide React (`lucide-react`)
- **Linter**: Oxlint (`oxlint`)
- **Fonts**: Google Fonts Inter

---

## 2. Directory Structure & Key Files

```text
TaskFlow/
├── index.html                   # HTML entry point with viewport & Google Fonts
├── vite.config.js               # Vite config with React and Tailwind plugins
├── PROJECT_CONTEXT.md           # This continuous context & changelog file
├── package.json                 # Dependencies & project scripts
└── src/
    ├── main.jsx                 # App entry point wrapped with <BrowserRouter>
    ├── App.jsx                  # Root component: manages tasks/projects state & <Routes>
    ├── index.css                # Global CSS tokens & Tailwind import
    ├── data/
    │   └── mockData.js          # Shared mock data for projects & tasks
    ├── components/
    │   ├── layout/
    │   │   ├── AppLayout.jsx    # Shell wrapper with dynamic title & collapsible layout
    │   │   ├── Sidebar.jsx      # Collapsible side navigation with NavLink & tooltips
    │   │   └── Topbar.jsx       # Header with greeting, title, collapse toggle & quick actions
    │   └── tasks/
    │       └── CreateTaskModal.jsx # Modal with validation to add tasks
    └── pages/
        ├── Dashboard.jsx        # Summary cards, banner, recent tasks list & project progress
        ├── TasksPage.jsx        # Multi-criteria filtering, search, sorting & task actions
        ├── ProjectsPage.jsx     # Live project completion progress & task breakdown
        ├── AnalyticsPage.jsx    # Productivity metrics, status & priority distribution charts
        └── SettingsPage.jsx     # Profile settings, appearance themes, notifications & data export
```

---

## 3. Implemented Features & Milestones

### Milestone 1 & 2: Project Shell & UI Foundation
- Clean layout structure with Sidebar and Topbar.
- Modern color scheme using customized indigo, slate, and semantic tokens.

### Milestone 3: Interactive Dashboard
- Welcome banner displaying greeting, completion percentage, and overdue alert.
- Quick Stat Cards: Total Tasks, Completed, In Progress, Overdue.
- Two-column view: Recent Tasks with status filter tabs & Projects progress overview.

### Milestone 4: State & Interactivity
- **Lifting State Up**: Core `tasks` state managed in `App.jsx` using immutable update patterns.
- Status toggle: `onToggleTaskStatus(taskId)` toggles between `todo` and `completed`.
- Task deletion: `onDeleteTask(taskId)` filters task by id.
- Create Task Modal: `CreateTaskModal.jsx` with input validation, project selector, and keyboard Escape listener.

### Milestone 5: React Router Navigation
- Full multi-page navigation across 5 distinct routes:
  1. `/` (and `/dashboard` redirect): [Dashboard.jsx](file:///c:/Users/Alisha%20Shakir/Desktop/TaskFlow/src/pages/Dashboard.jsx)
  2. `/tasks`: [TasksPage.jsx](file:///c:/Users/Alisha%20Shakir/Desktop/TaskFlow/src/pages/TasksPage.jsx) (Search, filter by status/priority/project, sort by due date/priority/name)
  3. `/projects`: [ProjectsPage.jsx](file:///c:/Users/Alisha%20Shakir/Desktop/TaskFlow/src/pages/ProjectsPage.jsx) (Dynamically calculates progress from shared task list)
  4. `/analytics`: [AnalyticsPage.jsx](file:///c:/Users/Alisha%20Shakir/Desktop/TaskFlow/src/pages/AnalyticsPage.jsx) (Productivity score, completion velocity, distribution bars)
  5. `/settings`: [SettingsPage.jsx](file:///c:/Users/Alisha%20Shakir/Desktop/TaskFlow/src/pages/SettingsPage.jsx) (Profile form, theme selector, notification switches, JSON data export & mock data reset)
- Sidebar uses `<NavLink>` with active route highlighting.
- Topbar title dynamically tracks the active route via `useLocation()`.

### Layout & Usability Enhancements
- **CSS Cascade Layer Fix**: Resolved an unlayered `*, *::before, *::after { margin: 0; padding: 0; }` bug in `index.css` that was stripping Tailwind utility classes (`ml-64`, `p-5`, `mx-auto`).
- **Collapsible Sidebar**:
  - Smooth animation between expanded (`w-64`, `256px`) and collapsed (`w-20`, `80px`).
  - Toggle button in both the Sidebar header and Topbar header.
  - Hover tooltips for navigation icons in collapsed mode.
  - Dynamic `ml-64` / `ml-20` transition for the main content area.

### LocalStorage Persistence
- **Tasks & Projects**: Stored in `localStorage` keys `taskflow_tasks` and `taskflow_projects`. All task additions, deletions, and status toggles automatically sync in real-time.
- **Sidebar State**: Remembered in `localStorage` under `taskflow_sidebar_collapsed` so user preference persists across page reloads.
- **Reset Support**: Resetting data in Settings automatically rewrites `localStorage` with fresh defaults.

---

## 4. Changelog & Git History

| Date | Commit / Action | Details |
|------|-----------------|---------|
| 2026-10-23 | `feat: state & interactivity` | Added shared task state, status toggle, task deletion, and CreateTaskModal |
| 2026-10-23 | `feat: multi-page routing` | Installed `react-router-dom`, created Tasks, Projects, Analytics, and Settings pages |
| 2026-10-23 | `fix: css layout` | Removed destructive unlayered reset from `index.css` to restore Tailwind utility layers |
| 2026-10-23 | `feat: collapsible sidebar` | Implemented expanded/collapsed states with dual toggle buttons and smooth transitions |
| 2026-10-23 | `docs: context file` | Initialized `PROJECT_CONTEXT.md` for ongoing feature tracking and change recording |
| 2026-10-23 | `feat: local storage persistence` | Added real-time localStorage sync for tasks, projects, and sidebar collapsed preference |

