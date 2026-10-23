// TasksPage.jsx — Dedicated Task Management View
// Features: Search, multi-criteria filtering (status, priority, project), sorting, and batch counters.

import { useState, useMemo } from 'react'
import {
  CheckSquare2,
  Search,
  Filter,
  Plus,
  Circle,
  CheckCircle2,
  Trash2,
  AlertCircle,
  Calendar,
  ArrowUpDown,
} from 'lucide-react'

// Helper: today's date in 'YYYY-MM-DD'
const TODAY = new Date().toISOString().split('T')[0]

function isOverdue(task) {
  return task.dueDate < TODAY && task.status !== 'completed'
}

const statusConfig = {
  'todo':        { label: 'Todo',        classes: 'bg-gray-100 text-gray-700 border-gray-200' },
  'in-progress': { label: 'In Progress', classes: 'bg-blue-50 text-blue-700 border-blue-200' },
  'in-review':   { label: 'In Review',   classes: 'bg-amber-50 text-amber-700 border-amber-200' },
  'completed':   { label: 'Completed',   classes: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
}

const priorityConfig = {
  'low':    { label: 'Low',    classes: 'bg-gray-50 text-gray-600',     dot: 'bg-gray-400' },
  'medium': { label: 'Medium', classes: 'bg-blue-50 text-blue-600',     dot: 'bg-blue-400' },
  'high':   { label: 'High',   classes: 'bg-orange-50 text-orange-600', dot: 'bg-orange-400' },
  'urgent': { label: 'Urgent', classes: 'bg-rose-50 text-rose-600',     dot: 'bg-rose-500' },
}

function TasksPage({
  tasks,
  projects,
  onToggleTaskStatus,
  onDeleteTask,
  onOpenNewTask,
}) {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeFilter, setActiveFilter] = useState('all')
  const [selectedPriority, setSelectedPriority] = useState('all')
  const [selectedProject, setSelectedProject] = useState('all')
  const [sortBy, setSortBy] = useState('dueDate') // 'dueDate' | 'priority' | 'title' | 'createdAt'

  // Pre-calculate filter counts
  const counts = useMemo(() => {
    return {
      all: tasks.length,
      todo: tasks.filter((t) => t.status === 'todo').length,
      'in-progress': tasks.filter((t) => t.status === 'in-progress').length,
      'in-review': tasks.filter((t) => t.status === 'in-review').length,
      completed: tasks.filter((t) => t.status === 'completed').length,
      overdue: tasks.filter(isOverdue).length,
    }
  }, [tasks])

  // Filtered & Sorted tasks
  const filteredTasks = useMemo(() => {
    return tasks
      .filter((task) => {
        // Search query filter
        const matchesSearch =
          task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          task.description.toLowerCase().includes(searchQuery.toLowerCase())

        if (!matchesSearch) return false

        // Status tab filter
        if (activeFilter === 'overdue') {
          if (!isOverdue(task)) return false
        } else if (activeFilter !== 'all') {
          if (task.status !== activeFilter) return false
        }

        // Priority filter
        if (selectedPriority !== 'all' && task.priority !== selectedPriority) {
          return false
        }

        // Project filter
        if (selectedProject !== 'all' && task.projectId !== selectedProject) {
          return false
        }

        return true
      })
      .sort((a, b) => {
        if (sortBy === 'dueDate') {
          return a.dueDate.localeCompare(b.dueDate)
        }
        if (sortBy === 'priority') {
          const priorityWeights = { urgent: 4, high: 3, medium: 2, low: 1 }
          return (priorityWeights[b.priority] || 0) - (priorityWeights[a.priority] || 0)
        }
        if (sortBy === 'title') {
          return a.title.localeCompare(b.title)
        }
        if (sortBy === 'createdAt') {
          return (b.createdAt || '').localeCompare(a.createdAt || '')
        }
        return 0
      })
  }, [tasks, searchQuery, activeFilter, selectedPriority, selectedProject, sortBy])

  const filterTabs = [
    { id: 'all', label: 'All Tasks', count: counts.all },
    { id: 'todo', label: 'To Do', count: counts.todo },
    { id: 'in-progress', label: 'In Progress', count: counts['in-progress'] },
    { id: 'in-review', label: 'In Review', count: counts['in-review'] },
    { id: 'completed', label: 'Completed', count: counts.completed },
    { id: 'overdue', label: 'Overdue', count: counts.overdue, isDestructive: true },
  ]

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* ── Page Header & Quick Stats ────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Tasks Management</h2>
          <p className="text-sm text-gray-500 mt-0.5">
            Track, filter, and prioritize your team's deliverables.
          </p>
        </div>

        <button
          type="button"
          onClick={onOpenNewTask}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-semibold shadow-sm hover:shadow-md transition-all self-start sm:self-auto cursor-pointer"
        >
          <Plus size={16} />
          Create Task
        </button>
      </div>

      {/* ── Filter Tabs ──────────────────────────────────────────────────────── */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {filterTabs.map((tab) => {
          const isActive = activeFilter === tab.id
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveFilter(tab.id)}
              className={`
                flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer
                ${isActive
                  ? tab.isDestructive
                    ? 'bg-rose-50 text-rose-700 border border-rose-200 shadow-xs'
                    : 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200/80'
                }
              `}
            >
              <span>{tab.label}</span>
              <span
                className={`
                  px-1.5 py-0.5 rounded-full text-[10px] font-bold
                  ${isActive
                    ? tab.isDestructive
                      ? 'bg-rose-200/80 text-rose-800'
                      : 'bg-indigo-700/80 text-white'
                    : 'bg-gray-100 text-gray-600'
                  }
                `}
              >
                {tab.count}
              </span>
            </button>
          )
        })}
      </div>

      {/* ── Search & Filter Controls Card ────────────────────────────────────── */}
      <div className="bg-white rounded-2xl p-4 border border-gray-200/80 shadow-xs flex flex-col md:flex-row items-stretch md:items-center gap-3">
        {/* Search Bar */}
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search tasks by title or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all"
          />
        </div>

        {/* Priority Filter */}
        <div className="flex items-center gap-2">
          <Filter size={15} className="text-gray-400 shrink-0 hidden sm:block" />
          <select
            value={selectedPriority}
            onChange={(e) => setSelectedPriority(e.target.value)}
            className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium text-gray-700 focus:outline-none focus:bg-white focus:border-indigo-500"
          >
            <option value="all">All Priorities</option>
            <option value="urgent">Urgent</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>

          {/* Project Filter */}
          <select
            value={selectedProject}
            onChange={(e) => setSelectedProject(e.target.value)}
            className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium text-gray-700 focus:outline-none focus:bg-white focus:border-indigo-500"
          >
            <option value="all">All Projects</option>
            {projects.map((proj) => (
              <option key={proj.id} value={proj.id}>
                {proj.name}
              </option>
            ))}
          </select>

          {/* Sort By */}
          <div className="flex items-center gap-1.5 pl-1 border-l border-gray-200">
            <ArrowUpDown size={14} className="text-gray-400 hidden sm:block" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium text-gray-700 focus:outline-none focus:bg-white focus:border-indigo-500"
            >
              <option value="dueDate">Due Date</option>
              <option value="priority">Priority</option>
              <option value="title">Title (A-Z)</option>
              <option value="createdAt">Date Created</option>
            </select>
          </div>
        </div>
      </div>

      {/* ── Task List ────────────────────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-gray-200/80 shadow-xs overflow-hidden">
        {filteredTasks.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-12 h-12 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-3 text-gray-400">
              <CheckSquare2 size={24} />
            </div>
            <h3 className="text-base font-semibold text-gray-800">No tasks found</h3>
            <p className="text-sm text-gray-400 max-w-sm mx-auto mt-1">
              {searchQuery || activeFilter !== 'all' || selectedPriority !== 'all' || selectedProject !== 'all'
                ? 'Try adjusting your search or active filters to see matching tasks.'
                : 'All caught up! You have no tasks in this view.'}
            </p>
            <button
              type="button"
              onClick={onOpenNewTask}
              className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 rounded-xl text-xs font-semibold transition-colors"
            >
              <Plus size={14} />
              Add a new task
            </button>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {filteredTasks.map((task) => {
              const isDone = task.status === 'completed'
              const overdue = isOverdue(task)
              const project = projects.find((p) => p.id === task.projectId)
              const status = statusConfig[task.status] || { label: task.status, classes: 'bg-gray-100 text-gray-600' }
              const priority = priorityConfig[task.priority] || { label: task.priority, classes: 'bg-gray-50 text-gray-500', dot: 'bg-gray-400' }

              return (
                <div
                  key={task.id}
                  className={`flex flex-col sm:flex-row sm:items-center justify-between p-4 hover:bg-gray-50/70 transition-colors gap-3 ${
                    isDone ? 'opacity-70 bg-gray-50/40' : ''
                  }`}
                >
                  {/* Left: Checkbox & Task Information */}
                  <div className="flex items-start gap-3.5 min-w-0 flex-1">
                    <button
                      type="button"
                      onClick={() => onToggleTaskStatus(task.id)}
                      className="mt-0.5 text-gray-300 hover:text-indigo-600 transition-colors shrink-0 cursor-pointer"
                      title={isDone ? 'Mark as incomplete' : 'Mark as complete'}
                    >
                      {isDone ? (
                        <CheckCircle2 size={20} className="text-emerald-500 fill-emerald-50" />
                      ) : (
                        <Circle size={20} />
                      )}
                    </button>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4
                          className={`text-sm font-semibold text-gray-900 ${
                            isDone ? 'line-through text-gray-400 font-normal' : ''
                          }`}
                        >
                          {task.title}
                        </h4>

                        {/* Project badge */}
                        {project && (
                          <span
                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium bg-gray-100 text-gray-700"
                          >
                            <span
                              className="w-1.5 h-1.5 rounded-full"
                              style={{ backgroundColor: project.color }}
                            />
                            {project.name}
                          </span>
                        )}

                        {/* Overdue tag */}
                        {overdue && (
                          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[10px] font-bold bg-rose-50 text-rose-600 border border-rose-200">
                            <AlertCircle size={10} />
                            Overdue
                          </span>
                        )}
                      </div>

                      {task.description && (
                        <p className="text-xs text-gray-500 mt-1 line-clamp-1">
                          {task.description}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Right: Badges, Date, and Delete Button */}
                  <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                    {/* Status badge */}
                    <span
                      className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold border ${status.classes}`}
                    >
                      {status.label}
                    </span>

                    {/* Priority badge */}
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold ${priority.classes}`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${priority.dot}`} />
                      {priority.label}
                    </span>

                    {/* Due Date */}
                    <div
                      className={`flex items-center gap-1 text-xs font-medium ${
                        overdue ? 'text-rose-600 font-semibold' : 'text-gray-400'
                      }`}
                    >
                      <Calendar size={13} />
                      <span>{task.dueDate}</span>
                    </div>

                    {/* Delete Action */}
                    <button
                      type="button"
                      onClick={() => onDeleteTask(task.id)}
                      className="p-1.5 text-gray-300 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all cursor-pointer"
                      title="Delete task"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

export default TasksPage
