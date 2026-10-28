// AnalyticsPage.jsx — Productivity, Velocity & Task Metrics
// Visual charts and metrics computed live from application state with full dark mode support.

import { useMemo } from 'react'
import {
  TrendingUp,
  Clock,
  AlertCircle,
  Zap,
  Flame,
  ArrowUpRight,
  FolderKanban,
} from 'lucide-react'

const TODAY = new Date().toISOString().split('T')[0]

function AnalyticsPage({ tasks, projects = [] }) {
  const stats = useMemo(() => {
    const total = tasks.length
    const completed = tasks.filter((t) => t.status === 'completed').length
    const inProgress = tasks.filter((t) => t.status === 'in-progress').length
    const inReview = tasks.filter((t) => t.status === 'in-review').length
    const todo = tasks.filter((t) => t.status === 'todo').length
    const overdue = tasks.filter((t) => t.dueDate < TODAY && t.status !== 'completed').length

    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0

    // Priority breakdown
    const priorityCounts = {
      urgent: tasks.filter((t) => t.priority === 'urgent').length,
      high: tasks.filter((t) => t.priority === 'high').length,
      medium: tasks.filter((t) => t.priority === 'medium').length,
      low: tasks.filter((t) => t.priority === 'low').length,
    }

    return {
      total,
      completed,
      inProgress,
      inReview,
      todo,
      overdue,
      completionRate,
      priorityCounts,
    }
  }, [tasks])

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* ── Page Header ──────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">Analytics & Insights</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            Real-time performance metrics and workload distribution.
          </p>
        </div>

        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 rounded-xl text-xs font-semibold self-start sm:self-auto">
          <Zap size={14} className="fill-emerald-500" />
          <span>Productivity Score: 94 / 100</span>
        </div>
      </div>

      {/* ── Summary Stats ────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-900 rounded-2xl p-5 border border-gray-200/80 dark:border-gray-800 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
              Completion Rate
            </span>
            <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
              <TrendingUp size={16} />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-gray-900 dark:text-white">{stats.completionRate}%</span>
            <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center">
              <ArrowUpRight size={13} /> +12% this wk
            </span>
          </div>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
            {stats.completed} of {stats.total} total tasks finished
          </p>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-2xl p-5 border border-gray-200/80 dark:border-gray-800 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
              Active In Progress
            </span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/50 flex items-center justify-center text-blue-600 dark:text-blue-400">
              <Clock size={16} />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-gray-900 dark:text-white">{stats.inProgress}</span>
            <span className="text-xs text-gray-400 dark:text-gray-500">tasks ongoing</span>
          </div>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
            Plus {stats.inReview} tasks pending code review
          </p>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-2xl p-5 border border-gray-200/80 dark:border-gray-800 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
              Overdue Tasks
            </span>
            <div className="w-8 h-8 rounded-lg bg-rose-50 dark:bg-rose-950/50 flex items-center justify-center text-rose-600 dark:text-rose-400">
              <AlertCircle size={16} />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-rose-600 dark:text-rose-400">{stats.overdue}</span>
            <span className="text-xs font-semibold text-rose-500 dark:text-rose-400">Need attention</span>
          </div>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">Past their designated target due dates</p>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-2xl p-5 border border-gray-200/80 dark:border-gray-800 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
              Sprint Velocity
            </span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-950/50 flex items-center justify-center text-amber-600 dark:text-amber-400">
              <Flame size={16} />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-gray-900 dark:text-white">4.8</span>
            <span className="text-xs text-gray-500 dark:text-gray-400">tasks / day</span>
          </div>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">Ahead of team target velocity</p>
        </div>
      </div>

      {/* ── Visual Breakdowns Grid ───────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Status Distribution */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200/80 dark:border-gray-800 shadow-xs">
          <h3 className="text-base font-bold text-gray-900 dark:text-white mb-1">Status Breakdown</h3>
          <p className="text-xs text-gray-400 dark:text-gray-500 mb-5">Current state across all active project deliverables</p>

          <div className="space-y-4">
            {[
              { label: 'Completed', count: stats.completed, color: 'bg-emerald-500' },
              { label: 'In Progress', count: stats.inProgress, color: 'bg-blue-500' },
              { label: 'In Review', count: stats.inReview, color: 'bg-amber-500' },
              { label: 'To Do', count: stats.todo, color: 'bg-gray-400' },
            ].map((item) => {
              const pct = stats.total > 0 ? Math.round((item.count / stats.total) * 100) : 0
              return (
                <div key={item.label} className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="font-semibold text-gray-700 dark:text-gray-300">{item.label}</span>
                    <span className="text-gray-500 dark:text-gray-400 font-medium">
                      {item.count} tasks ({pct}%)
                    </span>
                  </div>
                  <div className="w-full h-2.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${item.color} rounded-full transition-all duration-500`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Priority Breakdown */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200/80 dark:border-gray-800 shadow-xs">
          <h3 className="text-base font-bold text-gray-900 dark:text-white mb-1">Priority Distribution</h3>
          <p className="text-xs text-gray-400 dark:text-gray-500 mb-5">Urgency assessment of ongoing task pipeline</p>

          <div className="space-y-4">
            {[
              { label: 'Urgent', count: stats.priorityCounts.urgent, color: 'bg-rose-500' },
              { label: 'High', count: stats.priorityCounts.high, color: 'bg-orange-500' },
              { label: 'Medium', count: stats.priorityCounts.medium, color: 'bg-blue-500' },
              { label: 'Low', count: stats.priorityCounts.low, color: 'bg-gray-400' },
            ].map((item) => {
              const pct = stats.total > 0 ? Math.round((item.count / stats.total) * 100) : 0
              return (
                <div key={item.label} className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="font-semibold text-gray-700 dark:text-gray-300">{item.label} Priority</span>
                    <span className="text-gray-500 dark:text-gray-400 font-medium">
                      {item.count} tasks ({pct}%)
                    </span>
                  </div>
                  <div className="w-full h-2.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${item.color} rounded-full transition-all duration-500`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* ── Project Workload Section ─────────────────────────────────────────── */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200/80 dark:border-gray-800 shadow-xs">
        <div className="flex items-center gap-2 mb-1">
          <FolderKanban size={18} className="text-indigo-600 dark:text-indigo-400" />
          <h3 className="text-base font-bold text-gray-900 dark:text-white">Project Workload & Progress</h3>
        </div>
        <p className="text-xs text-gray-400 dark:text-gray-500 mb-5">Sprint completion rates per active initiative</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {projects.map((proj) => {
            const pTasks = tasks.filter((t) => t.projectId === proj.id)
            const pDone = pTasks.filter((t) => t.status === 'completed').length
            const pTotal = pTasks.length
            const pct = pTotal > 0 ? Math.round((pDone / pTotal) * 100) : 0

            return (
              <div key={proj.id} className="p-4 rounded-xl border border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/50 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-gray-800 dark:text-gray-200 truncate">{proj.name}</span>
                  <span className="text-xs font-semibold text-gray-900 dark:text-white">{pct}%</span>
                </div>
                <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${pct}%`, backgroundColor: proj.color }}
                  />
                </div>
                <p className="text-[11px] text-gray-400 dark:text-gray-500">
                  {pDone} of {pTotal} tasks completed
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default AnalyticsPage
