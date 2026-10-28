// ProjectsPage.jsx — Projects Overview & Team Initiatives
// Calculates live progress and task statistics for each project with full dark mode support.

import {
  FolderKanban,
  CheckCircle2,
  Clock,
  Plus,
} from 'lucide-react'

function ProjectsPage({ projects, tasks, onOpenNewTask }) {

  // Compute stats for each project dynamically from current tasks
  const projectStats = projects.map((project) => {
    const projectTasks = tasks.filter((t) => t.projectId === project.id)
    const completedTasks = projectTasks.filter((t) => t.status === 'completed').length
    const inProgressTasks = projectTasks.filter((t) => t.status === 'in-progress').length
    const total = projectTasks.length
    const progressPercent = total > 0 ? Math.round((completedTasks / total) * 100) : 0

    return {
      ...project,
      tasks: projectTasks,
      totalTasks: total,
      completedTasks,
      inProgressTasks,
      progressPercent,
    }
  })

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* ── Page Header ──────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">Active Projects</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            Monitor project health, milestones, and deliverables in real time.
          </p>
        </div>

        <button
          type="button"
          onClick={onOpenNewTask}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-semibold shadow-xs hover:shadow-md transition-all self-start sm:self-auto cursor-pointer"
        >
          <Plus size={16} />
          Add Task to Project
        </button>
      </div>

      {/* ── Project Cards Grid ────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {projectStats.map((project) => (
          <div
            key={project.id}
            className="bg-white dark:bg-gray-900 rounded-2xl p-5 border border-gray-200/80 dark:border-gray-800 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              {/* Header with Project Icon & Status */}
              <div className="flex items-start justify-between gap-3 mb-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold shadow-xs"
                  style={{ backgroundColor: project.color }}
                >
                  <FolderKanban size={20} />
                </div>
                <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
                  {project.progressPercent === 100 ? 'Completed' : 'In Progress'}
                </span>
              </div>

              {/* Title & Description */}
              <h3 className="text-base font-bold text-gray-900 dark:text-white mb-1">{project.name}</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 leading-relaxed mb-4">
                {project.description}
              </p>

              {/* Progress Bar Section */}
              <div className="space-y-1.5 mb-5">
                <div className="flex justify-between text-xs">
                  <span className="font-semibold text-gray-600 dark:text-gray-400">Progress</span>
                  <span className="font-bold text-gray-900 dark:text-white">{project.progressPercent}%</span>
                </div>
                <div className="w-full h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${project.progressPercent}%`,
                      backgroundColor: project.color,
                    }}
                  />
                </div>
              </div>

              {/* Metrics pill counters */}
              <div className="grid grid-cols-2 gap-2 p-2.5 bg-gray-50 dark:bg-gray-800/80 rounded-xl mb-4 text-center">
                <div>
                  <p className="text-xs text-gray-400 dark:text-gray-500">Total Tasks</p>
                  <p className="text-sm font-bold text-gray-900 dark:text-white">{project.totalTasks}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 dark:text-gray-500">Completed</p>
                  <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400">{project.completedTasks}</p>
                </div>
              </div>

              {/* Recent Tasks in this project */}
              <div>
                <p className="text-[11px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2">
                  Tasks ({project.tasks.length})
                </p>
                <div className="space-y-1.5">
                  {project.tasks.slice(0, 3).map((t) => (
                    <div
                      key={t.id}
                      className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-300 py-1 border-b border-gray-50 dark:border-gray-800/60 last:border-0"
                    >
                      {t.status === 'completed' ? (
                        <CheckCircle2 size={13} className="text-emerald-500 shrink-0" />
                      ) : (
                        <Clock size={13} className="text-gray-400 shrink-0" />
                      )}
                      <span className={`truncate ${t.status === 'completed' ? 'line-through text-gray-400 dark:text-gray-500' : ''}`}>
                        {t.title}
                      </span>
                    </div>
                  ))}
                  {project.tasks.length > 3 && (
                    <p className="text-[11px] text-gray-400 dark:text-gray-500 font-medium pt-1">
                      +{project.tasks.length - 3} more tasks
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Footer with Team & Action */}
            <div className="pt-4 mt-5 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between">
              <div className="flex items-center -space-x-1.5">
                <div className="w-6 h-6 rounded-full bg-indigo-500 text-white text-[10px] font-bold flex items-center justify-center ring-2 ring-white dark:ring-gray-900">
                  AS
                </div>
                <div className="w-6 h-6 rounded-full bg-purple-500 text-white text-[10px] font-bold flex items-center justify-center ring-2 ring-white dark:ring-gray-900">
                  JD
                </div>
                <div className="w-6 h-6 rounded-full bg-emerald-500 text-white text-[10px] font-bold flex items-center justify-center ring-2 ring-white dark:ring-gray-900">
                  MK
                </div>
              </div>

              <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 flex items-center gap-1">
                Active Sprint
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ProjectsPage
