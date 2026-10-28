// TaskDetailDrawer.jsx — Interactive Task Details & Edit Slide-over Drawer
// Allows viewing, editing, updating status/priority/dates, and deleting any task.

import { useState, useEffect } from 'react'
import {
  X,
  Calendar,
  AlertCircle,
  FolderKanban,
  CheckCircle2,
  Circle,
  Trash2,
  Save,
  Check,
  Tag,
} from 'lucide-react'

const TODAY = new Date().toISOString().split('T')[0]

// Inner content component initialized directly from task prop
function TaskDetailDrawerForm({
  task,
  projects = [],
  onUpdateTask,
  onDeleteTask,
  onToggleStatus,
  onClose,
}) {
  const [title, setTitle] = useState(() => task.title || '')
  const [description, setDescription] = useState(() => task.description || '')
  const [status, setStatus] = useState(() => task.status || 'todo')
  const [priority, setPriority] = useState(() => task.priority || 'medium')
  const [projectId, setProjectId] = useState(() => task.projectId || projects[0]?.id || '')
  const [dueDate, setDueDate] = useState(() => task.dueDate || TODAY)
  const [isSaved, setIsSaved] = useState(false)

  const isDone = status === 'completed'
  const isOverdue = dueDate < TODAY && !isDone
  const currentProject = projects.find((p) => p.id === projectId)

  function handleSubmit(e) {
    e.preventDefault()
    if (!title.trim()) return

    onUpdateTask({
      ...task,
      title: title.trim(),
      description: description.trim(),
      status,
      priority,
      projectId,
      dueDate,
    })

    setIsSaved(true)
    setTimeout(() => {
      setIsSaved(false)
      onClose()
    }, 500)
  }

  function handleDelete() {
    onDeleteTask(task.id)
    onClose()
  }

  function handleToggleCheckbox() {
    const nextStatus = isDone ? 'todo' : 'completed'
    setStatus(nextStatus)
    if (onToggleStatus) {
      onToggleStatus(task.id)
    }
  }

  return (
    <div className="w-full max-w-md bg-white dark:bg-gray-900 h-full shadow-2xl flex flex-col justify-between border-l border-gray-100 dark:border-gray-800 animate-slide-left overflow-y-auto">
      {/* Drawer Header */}
      <div className="p-5 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleToggleCheckbox}
            className="text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer"
            title={isDone ? 'Mark as incomplete' : 'Mark as complete'}
          >
            {isDone ? (
              <CheckCircle2 size={22} className="text-emerald-500 fill-emerald-50 dark:fill-emerald-950" />
            ) : (
              <Circle size={22} />
            )}
          </button>
          <span className="text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500">
            Task Details
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={handleDelete}
            className="p-1.5 text-gray-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors cursor-pointer"
            title="Delete task"
          >
            <Trash2 size={16} />
          </button>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors cursor-pointer"
            title="Close drawer"
          >
            <X size={18} />
          </button>
        </div>
      </div>

      {/* Drawer Body Form */}
      <form onSubmit={handleSubmit} id="task-detail-form" className="p-6 space-y-5 flex-1">
        {/* Title Input */}
        <div>
          <label className="block text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-1.5">
            Task Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Task title..."
            className={`w-full text-base font-bold text-gray-900 dark:text-white bg-transparent border-b border-gray-200 dark:border-gray-700 pb-1.5 focus:outline-none focus:border-indigo-500 transition-colors ${
              isDone ? 'line-through text-gray-400 dark:text-gray-500' : ''
            }`}
            required
          />
        </div>

        {/* Overdue Alert banner if past due date */}
        {isOverdue && (
          <div className="flex items-center gap-2 p-3 bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/50 rounded-xl text-rose-700 dark:text-rose-300 text-xs">
            <AlertCircle size={15} className="shrink-0" />
            <span>This task passed its deadline on {dueDate}.</span>
          </div>
        )}

        {/* Properties Grid */}
        <div className="grid grid-cols-2 gap-3 pt-2">
          {/* Status */}
          <div>
            <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1.5">
              <Tag size={13} />
              Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-xs font-semibold text-gray-800 dark:text-gray-200 focus:outline-none focus:border-indigo-500"
            >
              <option value="todo">To Do</option>
              <option value="in-progress">In Progress</option>
              <option value="in-review">In Review</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          {/* Priority */}
          <div>
            <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1.5">
              <AlertCircle size={13} />
              Priority
            </label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-xs font-semibold text-gray-800 dark:text-gray-200 focus:outline-none focus:border-indigo-500"
            >
              <option value="urgent">Urgent</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>

          {/* Project */}
          <div>
            <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1.5">
              <FolderKanban size={13} />
              Project
            </label>
            <select
              value={projectId}
              onChange={(e) => setProjectId(e.target.value)}
              className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-xs font-semibold text-gray-800 dark:text-gray-200 focus:outline-none focus:border-indigo-500"
            >
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          {/* Due Date */}
          <div>
            <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1.5">
              <Calendar size={13} />
              Due Date
            </label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-xs font-semibold text-gray-800 dark:text-gray-200 focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        {/* Description Textarea */}
        <div className="pt-2">
          <label className="block text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-1.5">
            Description
          </label>
          <textarea
            rows={5}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Add extra context, specifications, or notes about this task..."
            className="w-full p-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-xs text-gray-800 dark:text-gray-200 leading-relaxed placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-indigo-500 focus:bg-white dark:focus:bg-gray-900 transition-all resize-none"
          />
        </div>

        {/* Metadata pill */}
        <div className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-100 dark:border-gray-800 flex items-center justify-between text-[11px] text-gray-400 dark:text-gray-500">
          <span>Project: <strong className="text-gray-700 dark:text-gray-300">{currentProject?.name || 'None'}</strong></span>
          <span>Created: <strong className="text-gray-700 dark:text-gray-300">{task.createdAt || 'Recent'}</strong></span>
        </div>
      </form>

      {/* Drawer Footer Actions */}
      <div className="p-5 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between shrink-0 bg-gray-50/50 dark:bg-gray-900/50">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 text-xs font-semibold text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white rounded-xl transition-colors cursor-pointer"
        >
          Cancel
        </button>

        <button
          type="submit"
          form="task-detail-form"
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl shadow-xs hover:shadow-md transition-all cursor-pointer"
        >
          {isSaved ? <Check size={14} /> : <Save size={14} />}
          <span>{isSaved ? 'Saved!' : 'Save Changes'}</span>
        </button>
      </div>
    </div>
  )
}

function TaskDetailDrawer({
  task,
  isOpen,
  onClose,
  projects = [],
  onUpdateTask,
  onDeleteTask,
  onToggleStatus,
}) {
  // Escape key to close
  useEffect(() => {
    if (!isOpen) return
    function handleKeyDown(e) {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  if (!isOpen || !task) return null

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-gray-900/40 backdrop-blur-xs transition-opacity"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <TaskDetailDrawerForm
        key={task.id}
        task={task}
        projects={projects}
        onUpdateTask={onUpdateTask}
        onDeleteTask={onDeleteTask}
        onToggleStatus={onToggleStatus}
        onClose={onClose}
      />
    </div>
  )
}

export default TaskDetailDrawer
