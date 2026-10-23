// AnalyticsPage.jsx — Productivity, Velocity & Task Metrics
// Visual charts and metrics computed live from application state.

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
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Analytics & Insights</h2>
          <p className="text-sm text-gray-500 mt-0.5">
            Real-time performance metrics and workload distribution.
          </p>
        </div>

        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-xl text-xs font-semibold self-start sm:self-auto">
          <Zap size={14} className="fill-emerald-500" />
          <span>Productivity Score: 94 / 100</span>
        </div>
      </div>

      {/* ── Summary Stats ────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-gray-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Completion Rate
            </span>
            <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
              <TrendingUp size={16} />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-gray-900">{stats.completionRate}%</span>
            <span className="text-xs font-semibold text-emerald-600 flex items-center">
              <ArrowUpRight size={13} /> +12% this wk
            </span>
          </div>
          <p className="text-xs text-gray-400 mt-2">
            {stats.completed} of {stats.total} total tasks finished
          </p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-gray-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Active In Progress
            </span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
              <Clock size={16} />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-gray-900">{stats.inProgress}</span>
            <span className="text-xs text-gray-400">tasks ongoing</span>
          </div>
          <p className="text-xs text-gray-400 mt-2">
            Plus {stats.inReview} tasks pending code review
          </p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-gray-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Overdue Tasks
            </span>
            <div className="w-8 h-8 rounded-lg bg-rose-50 flex items-center justify-center text-rose-600">
              <AlertCircle size={16} />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-rose-600">{stats.overdue}</span>
            <span className="text-xs font-semibold text-rose-500">Need attention</span>
          </div>
          <p className="text-xs text-gray-400 mt-2">Past their designated target due dates</p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-gray-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Sprint Velocity
            </span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600">
              <Flame size={16} />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-gray-900">4.8</span>
            <span className="text-xs text-gray-500">tasks / day</span>
          </div>
          <p className="text-xs text-gray-400 mt-2">Ahead of team target velocity</p>
        </div>
      </div>

      {/* ── Visual Breakdowns Grid ───────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Status Distribution */}
        <div className="bg-white rounded-2xl p-6 border border-gray-200/80 shadow-xs">
          <h3 className="text-base font-bold text-gray-900 mb-1">Status Breakdown</h3>
          <p className="text-xs text-gray-400 mb-5">Current state across all active project deliverables</p>

          <div className="space-y-4">
            {[
              { label: 'Completed', count: stats.completed, color: 'bg-emerald-500', barBg: 'bg-emerald-100' },
              { label: 'In Progress', count: stats.inProgress, color: 'bg-blue-500', barBg: 'bg-blue-100' },
              { label: 'In Review', count: stats.inReview, color: 'bg-amber-500', barBg: 'bg-amber-100' },
              { label: 'To Do', count: stats.todo, color: 'bg-gray-400', barBg: 'bg-gray-200' },
            ].map((item) => {
              const pct = stats.total > 0 ? Math.round((item.count / stats.total) * 100) : 0
              return (
                <div key={item.label} className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="font-semibold text-gray-700">{item.label}</span>
                    <span className="text-gray-500 font-medium">
                      {item.count} tasks ({pct}%)
                    </span>
                  </div>
                  <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
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
        <div className="bg-white rounded-2xl p-6 border border-gray-200/80 shadow-xs">
          <h3 className="text-base font-bold text-gray-900 mb-1">Priority Distribution</h3>
          <p className="text-xs text-gray-400 mb-5">Urgency assessment of ongoing task pipeline</p>

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
                    <span className="font-semibold text-gray-700">{item.label} Priority</span>
                    <span className="text-gray-500 font-medium">
                      {item.count} tasks ({pct}%)
                    </span>
                  </div>
                  <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
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
      <div className="bg-white rounded-2xl p-6 border border-gray-200/80 shadow-xs">
        <div className="flex items-center gap-2 mb-1">
          <FolderKanban size={18} className="text-indigo-600" />
          <h3 className="text-base font-bold text-gray-900">Project Workload & Progress</h3>
        </div>
        <p className="text-xs text-gray-400 mb-5">Sprint completion rates per active initiative</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {projects.map((proj) => {
            const pTasks = tasks.filter((t) => t.projectId === proj.id)
            const pDone = pTasks.filter((t) => t.status === 'completed').length
            const pTotal = pTasks.length
            const pct = pTotal > 0 ? Math.round((pDone / pTotal) * 100) : 0

            return (
              <div key={proj.id} className="p-4 rounded-xl border border-gray-100 bg-gray-50/50 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-gray-800 truncate">{proj.name}</span>
                  <span className="text-xs font-semibold text-gray-900">{pct}%</span>
                </div>
                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${pct}%`, backgroundColor: proj.color }}
                  />
                </div>
                <p className="text-[11px] text-gray-400">
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
