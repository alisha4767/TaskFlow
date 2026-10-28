// Dashboard.jsx — The main Dashboard page of TaskFlow.
//
// ENHANCEMENTS:
//   1. Interactive task completion toggle (onToggleTaskStatus)
//   2. Task detail drawer integration on task row click (onSelectTask)
//   3. Responsive filtering & sorting
//   4. Full dark mode support

import { useState } from 'react'
import { tasks as defaultTasks, projects } from '../data/mockData'
import {
  CheckSquare2,
  Clock,
  AlertCircle,
  TrendingUp,
  CalendarDays,
  Circle,
  CheckCircle2,
  Trash2,
  Plus,
} from 'lucide-react'

// Helper: today's date in 'YYYY-MM-DD'
const TODAY = new Date().toISOString().split('T')[0]

// Helper: check if a task is overdue (past due date AND not completed)
function isOverdue(task) {
  return task.dueDate < TODAY && task.status !== 'completed'
}

// Visual configuration dictionaries
const statusConfig = {
  'todo':        { label: 'Todo',        classes: 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300'   },
  'in-progress': { label: 'In Progress', classes: 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300'    },
  'in-review':   { label: 'In Review',   classes: 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300'  },
  'completed':   { label: 'Completed',   classes: 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300' },
}

const priorityConfig = {
  'low':    { label: 'Low',    classes: 'bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400',     dot: 'bg-gray-400' },
  'medium': { label: 'Medium', classes: 'bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400',     dot: 'bg-blue-400' },
  'high':   { label: 'High',   classes: 'bg-orange-50 dark:bg-orange-950/50 text-orange-600 dark:text-orange-400', dot: 'bg-orange-400' },
  'urgent': { label: 'Urgent', classes: 'bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400',     dot: 'bg-rose-500' },
}

// Small pill badge for status
function StatusBadge({ status }) {
  const config = statusConfig[status] || { label: status, classes: 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300' }
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold ${config.classes}`}>
      {config.label}
    </span>
  )
}

// Small pill badge for priority
function PriorityBadge({ priority }) {
  const config = priorityConfig[priority] || { label: priority, classes: 'bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400', dot: 'bg-gray-400' }
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold ${config.classes}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
      {config.label}
    </span>
  )
}

// Stat summary card
function StatCard({ label, value, icon: Icon, color, bg, sub }) {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl p-5 border border-gray-100 dark:border-gray-800 shadow-xs hover:shadow-md transition-all">
      <div className="flex items-start justify-between mb-4">
        <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center`}>
          <Icon size={20} className={color} />
        </div>
        <span className="text-2xl font-bold text-gray-900 dark:text-white">{value}</span>
      </div>
      <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</p>
      {sub && <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{sub}</p>}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// COMPONENT: TaskRow
// Interactive task row with completion toggle, details open, and delete button
// ─────────────────────────────────────────────────────────────────────────────
function TaskRow({ task, onToggleStatus, onDelete, onSelectTask }) {
  const isDone = task.status === 'completed'
  const overdue = isOverdue(task)
  const project = projects.find((p) => p.id === task.projectId)
  const formattedDate = new Date(task.dueDate).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  })

  return (
    <div className="flex items-center gap-3 py-3 border-b border-gray-50 dark:border-gray-800/60 last:border-0 group hover:bg-gray-50/70 dark:hover:bg-gray-800/40 -mx-4 px-4 rounded-xl transition-colors">
      {/* Interactive Toggle Checkbox */}
      <button
        type="button"
        onClick={() => onToggleStatus && onToggleStatus(task.id)}
        className="shrink-0 transition-transform active:scale-90 p-0.5 text-gray-400 dark:text-gray-500 hover:text-indigo-600 dark:hover:text-indigo-400 cursor-pointer"
        title={isDone ? 'Mark as incomplete' : 'Mark as completed'}
      >
        {isDone ? (
          <CheckCircle2 size={18} className="text-emerald-500 fill-emerald-50 dark:fill-emerald-950" />
        ) : (
          <div className="w-[18px] h-[18px] rounded-full border-2 border-gray-300 dark:border-gray-600 hover:border-indigo-500 dark:hover:border-indigo-400 hover:bg-indigo-50/50 transition-colors" />
        )}
      </button>

      {/* Task title & project — clickable to edit details */}
      <div
        onClick={() => onSelectTask && onSelectTask(task)}
        className="flex-1 min-w-0 cursor-pointer"
        title="Click to view & edit details"
      >
        <p className={`text-sm font-medium truncate transition-all hover:text-indigo-600 dark:hover:text-indigo-400 ${
          isDone ? 'text-gray-400 dark:text-gray-500 line-through' : 'text-gray-800 dark:text-gray-200'
        }`}>
          {task.title}
        </p>
        {project && (
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5 truncate">{project.name}</p>
        )}
      </div>

      {/* Right side: badges, due date & actions */}
      <div className="flex items-center gap-2 shrink-0">
        <PriorityBadge priority={task.priority} />
        <StatusBadge status={task.status} />

        {/* Due date with overdue highlight */}
        <div className={`flex items-center gap-1 text-[11px] font-medium ${
          overdue ? 'text-rose-500 dark:text-rose-400 font-semibold' : 'text-gray-400 dark:text-gray-500'
        }`}>
          <CalendarDays size={11} />
          <span>{formattedDate}</span>
          {overdue && <span className="text-rose-500 dark:text-rose-400 font-semibold">· Overdue</span>}
        </div>

        {/* Delete action button — revealed on hover */}
        {onDelete && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              onDelete(task.id)
            }}
            className="opacity-0 group-hover:opacity-100 p-1 text-gray-300 dark:text-gray-600 hover:text-rose-500 dark:hover:text-rose-400 rounded-md hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-all ml-1 cursor-pointer"
            title="Delete task"
          >
            <Trash2 size={13} />
          </button>
        )}
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// COMPONENT: ProjectProgressRow
// Dynamically calculates completion from the live tasks array!
// ─────────────────────────────────────────────────────────────────────────────
function ProjectProgressRow({ project, allTasks }) {
  const projectTasks = allTasks.filter((t) => t.projectId === project.id)
  const totalCount = projectTasks.length
  const completedCount = projectTasks.filter((t) => t.status === 'completed').length
  const percentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0

  return (
    <div className="py-3 border-b border-gray-50 dark:border-gray-800/60 last:border-0">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span
            className="w-2.5 h-2.5 rounded-full shrink-0"
            style={{ backgroundColor: project.color }}
          />
          <span className="text-sm font-medium text-gray-800 dark:text-gray-200">{project.name}</span>
        </div>
        <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">{percentage}%</span>
      </div>

      {/* Progress bar */}
      <div className="h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{
            width: `${percentage}%`,
            backgroundColor: project.color,
          }}
        />
      </div>

      {/* Task count summary */}
      <p className="text-xs text-gray-400 dark:text-gray-500 mt-1.5">
        {completedCount} of {totalCount} tasks completed
      </p>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN COMPONENT: Dashboard
// ─────────────────────────────────────────────────────────────────────────────
function Dashboard({
  tasks = defaultTasks,
  onToggleTaskStatus,
  onDeleteTask,
  onOpenNewTask,
  onSelectTask,
}) {
  const [activeFilter, setActiveFilter] = useState('all')

  const totalTasks = tasks.length
  const completedTasks = tasks.filter((t) => t.status === 'completed').length
  const activeTasks = tasks.filter((t) => t.status === 'in-progress').length
  const todoTasks = tasks.filter((t) => t.status === 'todo').length
  const overdueTasks = tasks.filter((t) => isOverdue(t)).length
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0

  const dueTodayTasks = tasks.filter(
    (t) => t.dueDate === TODAY && t.status !== 'completed'
  )

  const sortedTasks = tasks
    .slice()
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))

  const filteredTasks = sortedTasks.filter((task) => {
    if (activeFilter === 'all') return true
    if (activeFilter === 'overdue') return isOverdue(task)
    return task.status === activeFilter
  })

  const displayTasks = filteredTasks.slice(0, 6)

  const filterTabs = [
    { id: 'all', label: 'All', count: totalTasks },
    { id: 'todo', label: 'Todo', count: todoTasks },
    { id: 'in-progress', label: 'In Progress', count: activeTasks },
    { id: 'completed', label: 'Completed', count: completedTasks },
    { id: 'overdue', label: 'Overdue', count: overdueTasks },
  ]

  return (
    <div className="max-w-6xl mx-auto">

      {/* ── Welcome Banner ─────────────────────────────────────────── */}
      <div className="mb-6 bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-600 rounded-2xl p-6 text-white shadow-lg overflow-hidden relative">
        <div className="absolute -right-8 -top-8 w-40 h-40 rounded-full bg-white/10 blur-2xl pointer-events-none" />
        <div className="absolute right-20 -bottom-6 w-24 h-24 rounded-full bg-violet-400/30 blur-xl pointer-events-none" />

        <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold mb-1">
              {completionRate === 100
                ? 'All caught up! Outstanding job! 🎉'
                : "You're making great progress! 🚀"}
            </h2>
            <p className="text-indigo-200 text-sm">
              {completionRate}% of tasks complete •{' '}
              {overdueTasks > 0 && (
                <span className="text-rose-300 font-semibold">
                  {overdueTasks} task{overdueTasks !== 1 ? 's' : ''} overdue •{' '}
                </span>
              )}
              {dueTodayTasks.length > 0
                ? `${dueTodayTasks.length} due today`
                : 'Nothing due today'}
            </p>
          </div>

          {/* Quick '+ Add Task' button */}
          {onOpenNewTask && (
            <button
              type="button"
              onClick={onOpenNewTask}
              className="self-start sm:self-auto flex items-center gap-2 px-4 py-2 bg-white text-indigo-600 hover:bg-indigo-50 rounded-xl text-sm font-semibold shadow-md hover:shadow transition-all shrink-0 cursor-pointer"
            >
              <Plus size={16} />
              <span>Add Task</span>
            </button>
          )}
        </div>
      </div>

      {/* ── Stats Grid ─────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          label="Total Tasks"
          value={totalTasks}
          icon={CheckSquare2}
          color="text-indigo-600 dark:text-indigo-400"
          bg="bg-indigo-50 dark:bg-indigo-950/50"
          sub={`Across ${projects.length} projects`}
        />
        <StatCard
          label="Completed"
          value={completedTasks}
          icon={TrendingUp}
          color="text-emerald-600 dark:text-emerald-400"
          bg="bg-emerald-50 dark:bg-emerald-950/50"
          sub={`${completionRate}% completion rate`}
        />
        <StatCard
          label="In Progress"
          value={activeTasks}
          icon={Circle}
          color="text-blue-600 dark:text-blue-400"
          bg="bg-blue-50 dark:bg-blue-950/50"
          sub="Actively being worked on"
        />
        <StatCard
          label="Overdue"
          value={overdueTasks}
          icon={AlertCircle}
          color="text-rose-600 dark:text-rose-400"
          bg="bg-rose-50 dark:bg-rose-950/50"
          sub={overdueTasks > 0 ? 'Needs attention' : 'All on track!'}
        />
      </div>

      {/* ── Two-Column Section ─────────────────────────────────────── */}
      <div className="grid lg:grid-cols-3 gap-4">

        {/* ── Tasks Section (2 of 3 columns) ── */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-xs p-5 flex flex-col justify-between">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <div>
                <h2 className="text-sm font-semibold text-gray-900 dark:text-white">Recent Tasks</h2>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">Click task title to edit details</p>
              </div>

              {/* Filter Tabs */}
              <div className="flex items-center gap-1 bg-gray-50 dark:bg-gray-800/80 p-1 rounded-xl overflow-x-auto">
                {filterTabs.map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveFilter(tab.id)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all whitespace-nowrap cursor-pointer ${
                      activeFilter === tab.id
                        ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-xs'
                        : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                    }`}
                  >
                    {tab.label}
                    <span className="ml-1 text-[10px] text-gray-400 dark:text-gray-400">({tab.count})</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Tasks List */}
            {displayTasks.length > 0 ? (
              <div>
                {displayTasks.map((task) => (
                  <TaskRow
                    key={task.id}
                    task={task}
                    onToggleStatus={onToggleTaskStatus}
                    onDelete={onDeleteTask}
                    onSelectTask={onSelectTask}
                  />
                ))}
              </div>
            ) : (
              // Empty state
              <div className="text-center py-12">
                <CheckSquare2 size={32} className="text-gray-200 dark:text-gray-700 mx-auto mb-2" />
                <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">No tasks found</p>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                  {activeFilter === 'all'
                    ? 'Get started by creating a task.'
                    : `No tasks matching the "${activeFilter}" filter.`}
                </p>
                {onOpenNewTask && (
                  <button
                    type="button"
                    onClick={onOpenNewTask}
                    className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                  >
                    <Plus size={13} />
                    <span>Create a Task</span>
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* ── Right Column: Projects + Alerts ── */}
        <div className="flex flex-col gap-4">

          {/* Project Progress */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-xs p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-sm font-semibold text-gray-900 dark:text-white">Projects</h2>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{projects.length} active projects</p>
              </div>
            </div>

            <div>
              {projects.map((project) => (
                <ProjectProgressRow
                  key={project.id}
                  project={project}
                  allTasks={tasks}
                />
              ))}
            </div>
          </div>

          {/* Overdue alert */}
          {overdueTasks > 0 && (
            <div className="bg-rose-50 dark:bg-rose-950/30 rounded-2xl border border-rose-100 dark:border-rose-900/50 p-5">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-rose-100 dark:bg-rose-900/60 flex items-center justify-center shrink-0 mt-0.5">
                  <AlertCircle size={16} className="text-rose-600 dark:text-rose-400" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-rose-800 dark:text-rose-200">
                    {overdueTasks} Overdue {overdueTasks === 1 ? 'Task' : 'Tasks'}
                  </p>
                  <p className="text-xs text-rose-600 dark:text-rose-400 mt-0.5">
                    Past their deadlines. Click the circle to resolve or edit.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Due today alert */}
          {dueTodayTasks.length > 0 && (
            <div className="bg-amber-50 dark:bg-amber-950/30 rounded-2xl border border-amber-100 dark:border-amber-900/50 p-5">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-900/60 flex items-center justify-center shrink-0 mt-0.5">
                  <Clock size={16} className="text-amber-600 dark:text-amber-400" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-amber-800 dark:text-amber-200">Due Today</p>
                  <p className="text-xs text-amber-600 dark:text-amber-400 mt-0.5">
                    {dueTodayTasks.map((t) => t.title).join(', ')}
                  </p>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}

export default Dashboard
