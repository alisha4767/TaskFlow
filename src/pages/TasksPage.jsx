// TasksPage.jsx — Dedicated Task Management View
// Features: List & Kanban Board views, Drag-and-Drop, search, filters, task detail drawer integration, and dark mode.

import { useState, useMemo, useEffect } from 'react'
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
  LayoutList,
  Kanban,
  ChevronRight,
  Clock,
  Edit3,
} from 'lucide-react'

// Helper: today's date in 'YYYY-MM-DD'
const TODAY = new Date().toISOString().split('T')[0]

function isOverdue(task) {
  return task.dueDate < TODAY && task.status !== 'completed'
}

const statusConfig = {
  'todo':        { label: 'Todo',        classes: 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700', dot: 'bg-gray-400' },
  'in-progress': { label: 'In Progress', classes: 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800', dot: 'bg-blue-500' },
  'in-review':   { label: 'In Review',   classes: 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800', dot: 'bg-amber-500' },
  'completed':   { label: 'Completed',   classes: 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800', dot: 'bg-emerald-500' },
}

const priorityConfig = {
  'low':    { label: 'Low',    classes: 'bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-300',     dot: 'bg-gray-400' },
  'medium': { label: 'Medium', classes: 'bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400',     dot: 'bg-blue-400' },
  'high':   { label: 'High',   classes: 'bg-orange-50 dark:bg-orange-950/50 text-orange-600 dark:text-orange-400', dot: 'bg-orange-400' },
  'urgent': { label: 'Urgent', classes: 'bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400',     dot: 'bg-rose-500' },
}

const kanbanColumns = [
  { id: 'todo', label: 'To Do', color: 'border-t-gray-400 dark:border-t-gray-500', badgeBg: 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300' },
  { id: 'in-progress', label: 'In Progress', color: 'border-t-blue-500', badgeBg: 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300' },
  { id: 'in-review', label: 'In Review', color: 'border-t-amber-500', badgeBg: 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300' },
  { id: 'completed', label: 'Completed', color: 'border-t-emerald-500', badgeBg: 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300' },
]

function TasksPage({
  tasks,
  projects,
  onToggleTaskStatus,
  onUpdateTaskStatus,
  onDeleteTask,
  onOpenNewTask,
  onSelectTask,
}) {
  const [viewMode, setViewMode] = useState(() => {
    try {
      return localStorage.getItem('taskflow_tasks_view') || 'list'
    } catch {
      return 'list'
    }
  })

  const [searchQuery, setSearchQuery] = useState('')
  const [activeFilter, setActiveFilter] = useState('all')
  const [selectedPriority, setSelectedPriority] = useState('all')
  const [selectedProject, setSelectedProject] = useState('all')
  const [sortBy, setSortBy] = useState('dueDate')

  // Drag and drop state
  const [draggedTaskId, setDraggedTaskId] = useState(null)
  const [dragOverColumn, setDragOverColumn] = useState(null)

  // Persist viewMode
  useEffect(() => {
    try {
      localStorage.setItem('taskflow_tasks_view', viewMode)
    } catch {
      // ignore
    }
  }, [viewMode])

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
        const matchesSearch =
          task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          task.description.toLowerCase().includes(searchQuery.toLowerCase())

        if (!matchesSearch) return false

        // In list view, apply the activeFilter tab
        if (viewMode === 'list') {
          if (activeFilter === 'overdue') {
            if (!isOverdue(task)) return false
          } else if (activeFilter !== 'all') {
            if (task.status !== activeFilter) return false
          }
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
  }, [tasks, searchQuery, activeFilter, selectedPriority, selectedProject, sortBy, viewMode])

  const filterTabs = [
    { id: 'all', label: 'All Tasks', count: counts.all },
    { id: 'todo', label: 'To Do', count: counts.todo },
    { id: 'in-progress', label: 'In Progress', count: counts['in-progress'] },
    { id: 'in-review', label: 'In Review', count: counts['in-review'] },
    { id: 'completed', label: 'Completed', count: counts.completed },
    { id: 'overdue', label: 'Overdue', count: counts.overdue, isDestructive: true },
  ]

  // Drag handlers
  function handleDragStart(e, taskId) {
    e.dataTransfer.setData('text/plain', taskId)
    e.dataTransfer.effectAllowed = 'move'
    setDraggedTaskId(taskId)
  }

  function handleDragEnd() {
    setDraggedTaskId(null)
    setDragOverColumn(null)
  }

  function handleDragOver(e, columnId) {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
    if (dragOverColumn !== columnId) {
      setDragOverColumn(columnId)
    }
  }

  function handleDragLeave(e, columnId) {
    if (dragOverColumn === columnId) {
      setDragOverColumn(null)
    }
  }

  function handleDrop(e, targetStatus) {
    e.preventDefault()
    const taskId = e.dataTransfer.getData('text/plain')
    if (taskId && onUpdateTaskStatus) {
      onUpdateTaskStatus(taskId, targetStatus)
    }
    setDraggedTaskId(null)
    setDragOverColumn(null)
  }

  // Next status shortcut
  const nextStatusMap = {
    'todo': 'in-progress',
    'in-progress': 'in-review',
    'in-review': 'completed',
    'completed': 'todo',
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* ── Page Header & View Toggle ────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">Tasks Management</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            Track, filter, and organize deliverables across list and Kanban board views. Click any task to edit details.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* View Mode Toggle */}
          <div className="flex items-center bg-gray-200/80 dark:bg-gray-800 p-1 rounded-xl">
            <button
              type="button"
              onClick={() => setViewMode('list')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                viewMode === 'list'
                  ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-xs'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <LayoutList size={14} />
              <span>List</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('board')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                viewMode === 'board'
                  ? 'bg-white dark:bg-gray-700 text-indigo-600 dark:text-indigo-400 shadow-xs'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <Kanban size={14} />
              <span>Board</span>
            </button>
          </div>

          <button
            type="button"
            onClick={() => onOpenNewTask('todo')}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-semibold shadow-xs hover:shadow-md transition-all cursor-pointer"
          >
            <Plus size={16} />
            <span>Create Task</span>
          </button>
        </div>
      </div>

      {/* ── Filter Tabs (List View Only) ─────────────────────────────────────── */}
      {viewMode === 'list' && (
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
                      ? 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800 shadow-xs'
                      : 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 border border-gray-200/80 dark:border-gray-800'
                  }
                `}
              >
                <span>{tab.label}</span>
                <span
                  className={`
                    px-1.5 py-0.5 rounded-full text-[10px] font-bold
                    ${isActive
                      ? tab.isDestructive
                        ? 'bg-rose-200/80 dark:bg-rose-900/60 text-rose-800 dark:text-rose-200'
                        : 'bg-indigo-700/80 text-white'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                    }
                  `}
                >
                  {tab.count}
                </span>
              </button>
            )
          })}
        </div>
      )}

      {/* ── Search & Filter Controls Card ────────────────────────────────────── */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl p-4 border border-gray-200/80 dark:border-gray-800 shadow-xs flex flex-col md:flex-row items-stretch md:items-center gap-3">
        {/* Search Bar */}
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" />
          <input
            type="text"
            placeholder="Search tasks by title or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:bg-white dark:focus:bg-gray-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-900 transition-all"
          />
        </div>

        {/* Priority Filter */}
        <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
          <Filter size={15} className="text-gray-400 dark:text-gray-500 shrink-0 hidden sm:block" />
          <select
            value={selectedPriority}
            onChange={(e) => setSelectedPriority(e.target.value)}
            className="px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-xs font-medium text-gray-700 dark:text-gray-200 focus:outline-none focus:bg-white dark:focus:bg-gray-900 focus:border-indigo-500"
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
            className="px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-xs font-medium text-gray-700 dark:text-gray-200 focus:outline-none focus:bg-white dark:focus:bg-gray-900 focus:border-indigo-500"
          >
            <option value="all">All Projects</option>
            {projects.map((proj) => (
              <option key={proj.id} value={proj.id}>
                {proj.name}
              </option>
            ))}
          </select>

          {/* Sort By */}
          <div className="flex items-center gap-1.5 pl-1 border-l border-gray-200 dark:border-gray-700">
            <ArrowUpDown size={14} className="text-gray-400 dark:text-gray-500 hidden sm:block" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-xs font-medium text-gray-700 dark:text-gray-200 focus:outline-none focus:bg-white dark:focus:bg-gray-900 focus:border-indigo-500"
            >
              <option value="dueDate">Due Date</option>
              <option value="priority">Priority</option>
              <option value="title">Title (A-Z)</option>
              <option value="createdAt">Date Created</option>
            </select>
          </div>
        </div>
      </div>

      {/* ── View 1: List View ────────────────────────────────────────────────── */}
      {viewMode === 'list' && (
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200/80 dark:border-gray-800 shadow-xs overflow-hidden">
          {filteredTasks.length === 0 ? (
            <div className="p-12 text-center">
              <div className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-2xl flex items-center justify-center mx-auto mb-3 text-gray-400 dark:text-gray-500">
                <CheckSquare2 size={24} />
              </div>
              <h3 className="text-base font-semibold text-gray-800 dark:text-gray-200">No tasks found</h3>
              <p className="text-sm text-gray-400 dark:text-gray-500 max-w-sm mx-auto mt-1">
                {searchQuery || activeFilter !== 'all' || selectedPriority !== 'all' || selectedProject !== 'all'
                  ? 'Try adjusting your search or active filters to see matching tasks.'
                  : 'All caught up! You have no tasks in this view.'}
              </p>
              <button
                type="button"
                onClick={() => onOpenNewTask('todo')}
                className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-400 hover:bg-indigo-100 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
              >
                <Plus size={14} />
                Add a new task
              </button>
            </div>
          ) : (
            <div className="divide-y divide-gray-100 dark:divide-gray-800">
              {filteredTasks.map((task) => {
                const isDone = task.status === 'completed'
                const overdue = isOverdue(task)
                const project = projects.find((p) => p.id === task.projectId)
                const status = statusConfig[task.status] || { label: task.status, classes: 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300' }
                const priority = priorityConfig[task.priority] || { label: task.priority, classes: 'bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400', dot: 'bg-gray-400' }

                return (
                  <div
                    key={task.id}
                    className={`flex flex-col sm:flex-row sm:items-center justify-between p-4 hover:bg-gray-50/70 dark:hover:bg-gray-800/40 transition-colors gap-3 ${
                      isDone ? 'opacity-70 bg-gray-50/40 dark:bg-gray-950/20' : ''
                    }`}
                  >
                    {/* Left: Checkbox & Task Information */}
                    <div className="flex items-start gap-3.5 min-w-0 flex-1">
                      <button
                        type="button"
                        onClick={() => onToggleTaskStatus(task.id)}
                        className="mt-0.5 text-gray-300 dark:text-gray-600 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors shrink-0 cursor-pointer"
                        title={isDone ? 'Mark as incomplete' : 'Mark as complete'}
                      >
                        {isDone ? (
                          <CheckCircle2 size={20} className="text-emerald-500 fill-emerald-50 dark:fill-emerald-950" />
                        ) : (
                          <Circle size={20} />
                        )}
                      </button>

                      {/* Clickable task title area to edit details */}
                      <div
                        onClick={() => onSelectTask && onSelectTask(task)}
                        className="min-w-0 flex-1 cursor-pointer group/title"
                        title="Click to edit task details"
                      >
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4
                            className={`text-sm font-semibold text-gray-900 dark:text-white group-hover/title:text-indigo-600 dark:group-hover/title:text-indigo-400 transition-colors ${
                              isDone ? 'line-through text-gray-400 dark:text-gray-500 font-normal' : ''
                            }`}
                          >
                            {task.title}
                          </h4>

                          {/* Project badge */}
                          {project && (
                            <span
                              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
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
                            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[10px] font-bold bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900/60">
                              <AlertCircle size={10} />
                              Overdue
                            </span>
                          )}
                        </div>

                        {task.description && (
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-1">
                            {task.description}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Right: Badges, Date, and Actions */}
                    <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold border ${status.classes}`}
                      >
                        {status.label}
                      </span>

                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold ${priority.classes}`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${priority.dot}`} />
                        {priority.label}
                      </span>

                      <div
                        className={`flex items-center gap-1 text-xs font-medium ${
                          overdue ? 'text-rose-600 dark:text-rose-400 font-semibold' : 'text-gray-400 dark:text-gray-500'
                        }`}
                      >
                        <Calendar size={13} />
                        <span>{task.dueDate}</span>
                      </div>

                      {/* Edit Button */}
                      <button
                        type="button"
                        onClick={() => onSelectTask && onSelectTask(task)}
                        className="p-1.5 text-gray-300 dark:text-gray-600 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 rounded-lg transition-all cursor-pointer"
                        title="Edit task details"
                      >
                        <Edit3 size={15} />
                      </button>

                      {/* Delete Button */}
                      <button
                        type="button"
                        onClick={() => onDeleteTask(task.id)}
                        className="p-1.5 text-gray-300 dark:text-gray-600 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-all cursor-pointer"
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
      )}

      {/* ── View 2: Kanban Board View ────────────────────────────────────────── */}
      {viewMode === 'board' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-start">
          {kanbanColumns.map((col) => {
            const colTasks = filteredTasks.filter((t) => t.status === col.id)
            const isTargetColumn = dragOverColumn === col.id

            return (
              <div
                key={col.id}
                onDragOver={(e) => handleDragOver(e, col.id)}
                onDragLeave={(e) => handleDragLeave(e, col.id)}
                onDrop={(e) => handleDrop(e, col.id)}
                className={`bg-gray-100/70 dark:bg-gray-900/60 rounded-2xl p-3 border-t-4 ${col.color} border border-gray-200/80 dark:border-gray-800 transition-all min-h-[500px] flex flex-col ${
                  isTargetColumn ? 'ring-2 ring-indigo-400 bg-indigo-50/30 dark:bg-indigo-950/30' : ''
                }`}
              >
                {/* Column Header */}
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-gray-200/60 dark:border-gray-800">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-gray-900 dark:text-white">{col.label}</span>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${col.badgeBg}`}>
                      {colTasks.length}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => onOpenNewTask(col.id)}
                    className="p-1 text-gray-400 dark:text-gray-500 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-white dark:hover:bg-gray-800 rounded-lg transition-all cursor-pointer"
                    title={`Add task to ${col.label}`}
                  >
                    <Plus size={16} />
                  </button>
                </div>

                {/* Column Cards */}
                <div className="space-y-3 flex-1">
                  {colTasks.length === 0 ? (
                    <div className="p-6 border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-xl text-center">
                      <p className="text-xs text-gray-400 dark:text-gray-500">Drag tasks here</p>
                    </div>
                  ) : (
                    colTasks.map((task) => {
                      const overdue = isOverdue(task)
                      const isDone = task.status === 'completed'
                      const project = projects.find((p) => p.id === task.projectId)
                      const priority = priorityConfig[task.priority] || { label: task.priority, classes: 'bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400', dot: 'bg-gray-400' }
                      const isBeingDragged = draggedTaskId === task.id
                      const nextStatus = nextStatusMap[task.status]

                      return (
                        <div
                          key={task.id}
                          draggable="true"
                          onDragStart={(e) => handleDragStart(e, task.id)}
                          onDragEnd={handleDragEnd}
                          onClick={() => onSelectTask && onSelectTask(task)}
                          className={`bg-white dark:bg-gray-800/90 rounded-xl p-3.5 border border-gray-200/90 dark:border-gray-700/80 shadow-xs hover:shadow-md transition-all cursor-pointer group relative ${
                            isBeingDragged ? 'opacity-40 scale-95' : ''
                          }`}
                        >
                          {/* Card Header: Project & Priority */}
                          <div className="flex items-center justify-between gap-2 mb-2">
                            {project ? (
                              <span className="inline-flex items-center gap-1 text-[11px] font-medium text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-900 px-2 py-0.5 rounded-md border border-gray-100 dark:border-gray-800">
                                <span
                                  className="w-1.5 h-1.5 rounded-full"
                                  style={{ backgroundColor: project.color }}
                                />
                                <span className="truncate max-w-[120px]">{project.name}</span>
                              </span>
                            ) : <span />}

                            <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-1.5 py-0.5 rounded-md ${priority.classes}`}>
                              <span className={`w-1 h-1 rounded-full ${priority.dot}`} />
                              {priority.label}
                            </span>
                          </div>

                          {/* Task Title */}
                          <div className="flex items-start gap-2 mb-1.5">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation()
                                onToggleTaskStatus(task.id)
                              }}
                              className="mt-0.5 text-gray-300 dark:text-gray-600 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors shrink-0 cursor-pointer"
                              title={isDone ? 'Mark as incomplete' : 'Mark as completed'}
                            >
                              {isDone ? (
                                <CheckCircle2 size={16} className="text-emerald-500 fill-emerald-50 dark:fill-emerald-950" />
                              ) : (
                                <Circle size={16} />
                              )}
                            </button>

                            <h4 className={`text-xs font-semibold text-gray-900 dark:text-white leading-snug flex-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors ${
                              isDone ? 'line-through text-gray-400 dark:text-gray-500' : ''
                            }`}>
                              {task.title}
                            </h4>
                          </div>

                          {/* Task Description */}
                          {task.description && (
                            <p className="text-[11px] text-gray-500 dark:text-gray-400 line-clamp-2 leading-relaxed mb-3 pl-6">
                              {task.description}
                            </p>
                          )}

                          {/* Card Footer: Due Date, Move Button, Delete */}
                          <div className="flex items-center justify-between pt-2.5 border-t border-gray-100 dark:border-gray-700/60 text-xs">
                            <div className={`flex items-center gap-1 text-[11px] ${
                              overdue ? 'text-rose-600 dark:text-rose-400 font-bold' : 'text-gray-400 dark:text-gray-500 font-medium'
                            }`}>
                              <Clock size={12} />
                              <span>{task.dueDate}</span>
                              {overdue && <span>· Overdue</span>}
                            </div>

                            <div className="flex items-center gap-1">
                              {/* Advance to next status shortcut button */}
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  onUpdateTaskStatus(task.id, nextStatus)
                                }}
                                className="flex items-center gap-0.5 px-2 py-0.5 text-[11px] font-semibold text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-300 bg-gray-50 dark:bg-gray-900 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 rounded-md border border-gray-100 dark:border-gray-700 transition-all cursor-pointer"
                                title={`Advance status to ${nextStatus}`}
                              >
                                <span>Move</span>
                                <ChevronRight size={12} />
                              </button>

                              {/* Delete button */}
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  onDeleteTask(task.id)
                                }}
                                className="p-1 text-gray-300 dark:text-gray-600 hover:text-rose-600 dark:hover:text-rose-400 rounded-md hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-all cursor-pointer"
                                title="Delete task"
                              >
                                <Trash2 size={13} />
                              </button>
                            </div>
                          </div>
                        </div>
                      )
                    })
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default TasksPage
