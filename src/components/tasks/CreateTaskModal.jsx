// CreateTaskModal.jsx
// A modern, accessible modal for creating new tasks in TaskFlow with full dark mode support.

import { useState, useEffect } from 'react'
import { X, Calendar, Flag, FolderKanban, Plus } from 'lucide-react'

function CreateTaskModal({
  isOpen,
  onClose,
  onAddTask,
  projects,
  defaultStatus = 'todo',
}) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [projectId, setProjectId] = useState(projects[0]?.id || '')
  const [priority, setPriority] = useState('medium')
  const [status, setStatus] = useState(defaultStatus)
  const [dueDate, setDueDate] = useState(() =>
    new Date().toISOString().split('T')[0]
  )
  const [error, setError] = useState('')

  // Escape key to close
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  if (!isOpen) return null

  function handleSubmit(e) {
    e.preventDefault()

    if (!title.trim()) {
      setError('Task title is required')
      return
    }

    const newTask = {
      id: `task-${Date.now()}`,
      title: title.trim(),
      description: description.trim(),
      status,
      priority,
      projectId: projectId || projects[0]?.id,
      dueDate: dueDate || new Date().toISOString().split('T')[0],
      createdAt: new Date().toISOString().split('T')[0],
    }

    onAddTask(newTask)

    setTitle('')
    setDescription('')
    setError('')
    setPriority('medium')
    setStatus('todo')
    onClose()
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-xs animate-fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      {/* Modal Box */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl w-full max-w-lg shadow-2xl border border-gray-100 dark:border-gray-800 overflow-hidden transform transition-all">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/50 flex items-center justify-center">
              <Plus size={18} className="text-indigo-600 dark:text-indigo-400" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-gray-900 dark:text-white">Create New Task</h3>
              <p className="text-xs text-gray-400 dark:text-gray-500">Fill in details to track your work</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          {/* Title Input */}
          <div>
            <label htmlFor="task-title" className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1.5">
              Task Title <span className="text-rose-500">*</span>
            </label>
            <input
              id="task-title"
              type="text"
              placeholder="e.g. Build user authentication"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value)
                if (error) setError('')
              }}
              autoFocus
              className={`w-full px-3.5 py-2.5 rounded-xl border text-sm text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 transition-all ${
                error
                  ? 'border-rose-300 dark:border-rose-800 focus:ring-rose-200 dark:focus:ring-rose-900'
                  : 'border-gray-200 dark:border-gray-700 focus:border-indigo-500 focus:ring-indigo-100 dark:focus:ring-indigo-900'
              }`}
            />
            {error && <p className="text-xs text-rose-500 mt-1">{error}</p>}
          </div>

          {/* Description Input */}
          <div>
            <label htmlFor="task-desc" className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1.5">
              Description (Optional)
            </label>
            <textarea
              id="task-desc"
              rows={2}
              placeholder="Add key notes, acceptance criteria, or context..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 text-sm text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 bg-white dark:bg-gray-800 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-900 transition-all resize-none"
            />
          </div>

          {/* Grid row: Project & Priority */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Project Select */}
            <div>
              <label htmlFor="task-project" className="flex items-center gap-1.5 text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1.5">
                <FolderKanban size={13} className="text-gray-400 dark:text-gray-500" />
                Project
              </label>
              <select
                id="task-project"
                value={projectId}
                onChange={(e) => setProjectId(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 text-sm text-gray-800 dark:text-gray-100 bg-white dark:bg-gray-800 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-900 transition-all"
              >
                {projects.map((proj) => (
                  <option key={proj.id} value={proj.id}>
                    {proj.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Priority Select */}
            <div>
              <label htmlFor="task-priority" className="flex items-center gap-1.5 text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1.5">
                <Flag size={13} className="text-gray-400 dark:text-gray-500" />
                Priority
              </label>
              <select
                id="task-priority"
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 text-sm text-gray-800 dark:text-gray-100 bg-white dark:bg-gray-800 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-900 transition-all"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>
          </div>

          {/* Grid row: Status & Due Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Status Select */}
            <div>
              <label htmlFor="task-status" className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1.5">
                Initial Status
              </label>
              <select
                id="task-status"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 text-sm text-gray-800 dark:text-gray-100 bg-white dark:bg-gray-800 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-900 transition-all"
              >
                <option value="todo">Todo</option>
                <option value="in-progress">In Progress</option>
                <option value="in-review">In Review</option>
                <option value="completed">Completed</option>
              </select>
            </div>

            {/* Due Date Input */}
            <div>
              <label htmlFor="task-due-date" className="flex items-center gap-1.5 text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1.5">
                <Calendar size={13} className="text-gray-400 dark:text-gray-500" />
                Due Date
              </label>
              <input
                id="task-due-date"
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 text-sm text-gray-800 dark:text-gray-100 bg-white dark:bg-gray-800 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-900 transition-all"
              />
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-gray-100 dark:border-gray-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 shadow-xs hover:shadow-md transition-all cursor-pointer"
            >
              Create Task
            </button>
          </div>
        </form>

      </div>
    </div>
  )
}

export default CreateTaskModal
