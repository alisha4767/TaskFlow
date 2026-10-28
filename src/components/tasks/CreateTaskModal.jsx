// CreateTaskModal.jsx
// A modern, accessible modal for creating new tasks in TaskFlow.
//
// NEW CONCEPTS IN THIS FILE:
//   1. Controlled Components — React inputs where value is controlled by state
//   2. Form Submission — handling onSubmit and e.preventDefault()
//   3. Multiple useState calls in a single component
//   4. Conditional rendering for modal visibility
//   5. Keyboard accessibility (Escape key to close) and click-outside handling

import { useState, useEffect } from 'react'
import { X, Calendar, Flag, FolderKanban, Plus } from 'lucide-react'

// ─────────────────────────────────────────────────────────────────────────────
// COMPONENT: CreateTaskModal
//
// Props:
//   isOpen     → boolean: whether the modal is visible
//   onClose    → function: callback when the user closes the modal
//   onAddTask  → function: callback to append the new task into parent state
//   projects   → array: list of projects for the dropdown selector
// ─────────────────────────────────────────────────────────────────────────────
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
    new Date().toISOString().split('T')[0] // default to today
  )
  const [error, setError] = useState('')

  // ── Keyboard Shortcut: Close modal on 'Escape' ─────────────────────────────
  // useEffect lets us run side effects like adding event listeners to window.
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    // Cleanup: remove the event listener when component unmounts or modal closes
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  // If the modal isn't open, return null so nothing is rendered in the DOM
  if (!isOpen) return null

  // ── Form Submission Handler ────────────────────────────────────────────────
  function handleSubmit(e) {
    // PREVENT DEFAULT: By default, HTML forms reload the whole page on submit.
    // e.preventDefault() stops the browser from reloading so React state stays intact.
    e.preventDefault()

    // Basic validation
    if (!title.trim()) {
      setError('Task title is required')
      return
    }

    // Build the new task object
    const newTask = {
      id: `task-${Date.now()}`, // Unique ID using current timestamp
      title: title.trim(),
      description: description.trim(),
      status,
      priority,
      projectId: projectId || projects[0]?.id,
      dueDate: dueDate || new Date().toISOString().split('T')[0],
      createdAt: new Date().toISOString().split('T')[0],
    }

    // Pass the new task UP to the parent component
    onAddTask(newTask)

    // Reset form fields
    setTitle('')
    setDescription('')
    setError('')
    setPriority('medium')
    setStatus('todo')

    // Close the modal
    onClose()
  }

  return (
    // Backdrop / Overlay: covers the whole screen with a semi-transparent dark tint
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm animate-fadeIn"
      onClick={(e) => {
        // If the user clicks the dark background (outside the modal box), close the modal
        if (e.target === e.currentTarget) onClose()
      }}
    >
      {/* Modal Box */}
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl border border-gray-100 overflow-hidden transform transition-all">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center">
              <Plus size={18} className="text-indigo-600" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-gray-900">Create New Task</h3>
              <p className="text-xs text-gray-400">Fill in details to track your work</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 flex items-center justify-center transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          {/* Title Input */}
          <div>
            <label htmlFor="task-title" className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
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
              className={`w-full px-3.5 py-2.5 rounded-xl border text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 transition-all ${
                error
                  ? 'border-rose-300 focus:ring-rose-200'
                  : 'border-gray-200 focus:border-indigo-500 focus:ring-indigo-100'
              }`}
            />
            {error && <p className="text-xs text-rose-500 mt-1">{error}</p>}
          </div>

          {/* Description Input */}
          <div>
            <label htmlFor="task-desc" className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
              Description (Optional)
            </label>
            <textarea
              id="task-desc"
              rows={2}
              placeholder="Add key notes, acceptance criteria, or context..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all resize-none"
            />
          </div>

          {/* Grid row: Project & Priority */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Project Select */}
            <div>
              <label htmlFor="task-project" className="flex items-center gap-1.5 text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                <FolderKanban size={13} className="text-gray-400" />
                Project
              </label>
              <select
                id="task-project"
                value={projectId}
                onChange={(e) => setProjectId(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm text-gray-800 bg-white focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all"
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
              <label htmlFor="task-priority" className="flex items-center gap-1.5 text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                <Flag size={13} className="text-gray-400" />
                Priority
              </label>
              <select
                id="task-priority"
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm text-gray-800 bg-white focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all"
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
              <label htmlFor="task-status" className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                Initial Status
              </label>
              <select
                id="task-status"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm text-gray-800 bg-white focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all"
              >
                <option value="todo">Todo</option>
                <option value="in-progress">In Progress</option>
                <option value="in-review">In Review</option>
                <option value="completed">Completed</option>
              </select>
            </div>

            {/* Due Date Input */}
            <div>
              <label htmlFor="task-due-date" className="flex items-center gap-1.5 text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                <Calendar size={13} className="text-gray-400" />
                Due Date
              </label>
              <input
                id="task-due-date"
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm text-gray-800 bg-white focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all"
              />
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm hover:shadow transition-all"
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
