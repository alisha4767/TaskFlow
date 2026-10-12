// Sidebar.jsx
// The fixed left navigation panel of TaskFlow.
// It contains the brand logo, navigation links, and a user section.
//
// NEW CONCEPTS IN THIS FILE:
//   1. Defining an array of data OUTSIDE a component (separating data from UI)
//   2. Rendering a list with .map() and the 'key' prop
//   3. Creating a small internal component (NavItem) that receives props
//   4. Conditional styling — applying different classes based on a condition

// We import specific icons from lucide-react using named imports { }.
// Each icon is a React component — we use them like <LayoutDashboard />.
import {
  LayoutDashboard,
  CheckSquare2,
  FolderKanban,
  BarChart3,
  Settings,
  Zap,
  LogOut,
} from 'lucide-react'

// ─────────────────────────────────────────────────────────────────────────────
// DATA: Navigation items defined OUTSIDE the component.
//
// Why outside? Because this data never changes — it's a constant.
// Putting it outside the component means React doesn't re-create this
// array every time the component renders. It's a small performance habit.
//
// Each object has:
//   id     → a unique identifier (used as the 'key' prop)
//   label  → the text shown in the nav
//   icon   → the Lucide icon COMPONENT (notice: no parentheses — we store
//             the component itself, not its output)
//   href   → the URL path (we'll use this with React Router in Milestone 4)
// ─────────────────────────────────────────────────────────────────────────────
const mainNavItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, href: '/dashboard' },
  { id: 'tasks',     label: 'Tasks',     icon: CheckSquare2,    href: '/tasks'     },
  { id: 'projects',  label: 'Projects',  icon: FolderKanban,    href: '/projects'  },
  { id: 'analytics', label: 'Analytics', icon: BarChart3,       href: '/analytics' },
]

const otherNavItems = [
  { id: 'settings', label: 'Settings', icon: Settings, href: '/settings' },
]

// ─────────────────────────────────────────────────────────────────────────────
// INTERNAL COMPONENT: NavItem
//
// This is a small component defined INSIDE this file but OUTSIDE the Sidebar
// component. It represents a single navigation link row.
//
// It receives PROPS:
//   icon     → the Lucide icon component to render
//   label    → the text label
//   isActive → boolean: is this the currently selected page?
//
// Notice: we use DESTRUCTURING in the parameter — { icon, label, isActive }
// instead of writing (props) and then props.icon, props.label, etc.
// ─────────────────────────────────────────────────────────────────────────────
function NavItem({ icon: Icon, label, isActive }) {
  // 'icon: Icon' — this is RENAMING during destructure.
  // We rename 'icon' to 'Icon' because React requires component names
  // to start with a CAPITAL LETTER. If we wrote <icon />, React would
  // treat it as an HTML tag, not a component. <Icon /> works correctly.

  return (
    <li>
      <a
        href="#"
        // Conditional className — this is one of the most common patterns in React.
        // We use a TEMPLATE LITERAL (backticks) to build the class string.
        // If isActive is true → add the active classes (indigo highlight)
        // If isActive is false → add the default classes (transparent)
        className={`
          flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium
          transition-all duration-150 group
          ${isActive
            ? 'bg-indigo-50 text-indigo-700'           // Active state
            : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900' // Inactive state
          }
        `}
        // Prevent the page from navigating (no real routing yet)
        // We'll replace this with React Router's <NavLink> in Milestone 4
        onClick={(e) => e.preventDefault()}
      >
        {/* Render the icon component — it's stored in the 'Icon' variable.
            We pass 'size' and 'className' as props to the icon. */}
        <Icon
          size={18}
          className={isActive ? 'text-indigo-600' : 'text-gray-400 group-hover:text-gray-600'}
        />

        {/* The text label */}
        <span>{label}</span>

        {/* Show a small dot on the active item */}
        {isActive && (
          <span className="ml-auto w-1.5 h-1.5 rounded-full bg-indigo-500" />
        )}
      </a>
    </li>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN COMPONENT: Sidebar
//
// This is the component exported from this file.
// For now, the active page is HARDCODED to 'dashboard'.
// In Milestone 4, we'll use React Router's useLocation() hook to
// detect the current URL and set the active item dynamically.
// ─────────────────────────────────────────────────────────────────────────────
function Sidebar() {
  // Hardcoded for now — will be dynamic once we add routing
  const activePage = 'dashboard'

  return (
    // The sidebar is FIXED to the left side of the screen.
    // w-64 = 256px wide | h-screen = 100% of the viewport height
    // flex flex-col = stack children vertically
    <aside className="w-64 h-screen bg-white border-r border-gray-100 fixed left-0 top-0 flex flex-col z-20">

      {/* ── Brand Logo ───────────────────────────────────────────── */}
      <div className="flex items-center gap-3 px-5 h-16 border-b border-gray-100 shrink-0">
        {/* The icon container */}
        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-indigo-600 shadow-sm">
          <Zap size={16} className="text-white" />
        </div>
        {/* App name */}
        <span className="text-[15px] font-bold text-gray-900 tracking-tight">
          TaskFlow
        </span>
      </div>

      {/* ── Navigation ───────────────────────────────────────────── */}
      {/* flex-1 makes this section grow to fill all available space */}
      <nav className="flex-1 px-3 py-4 overflow-y-auto">

        {/* MAIN MENU section */}
        <div className="mb-6">
          {/* Section label */}
          <p className="px-3 mb-2 text-[11px] font-semibold text-gray-400 uppercase tracking-widest">
            Main Menu
          </p>

          {/* The nav list — we use <ul> for semantic HTML (unordered list) */}
          <ul className="space-y-0.5">
            {/* .map() iterates over mainNavItems and returns one <NavItem> per item.
                Each item in the array is passed as individual props.
                'key' must be unique — we use item.id which is always unique. */}
            {mainNavItems.map((item) => (
              <NavItem
                key={item.id}               // Required by React for list rendering
                icon={item.icon}            // Passing the icon component as a prop
                label={item.label}          // Passing the text label
                isActive={activePage === item.id} // true only for 'dashboard'
              />
            ))}
          </ul>
        </div>

        {/* OTHER section */}
        <div>
          <p className="px-3 mb-2 text-[11px] font-semibold text-gray-400 uppercase tracking-widest">
            Other
          </p>
          <ul className="space-y-0.5">
            {otherNavItems.map((item) => (
              <NavItem
                key={item.id}
                icon={item.icon}
                label={item.label}
                isActive={activePage === item.id}
              />
            ))}
          </ul>
        </div>
      </nav>

      {/* ── User Section ─────────────────────────────────────────── */}
      {/* shrink-0 prevents this from shrinking if the nav is too tall */}
      <div className="shrink-0 px-3 py-4 border-t border-gray-100">
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer group">

          {/* User avatar — a circle with initials */}
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shrink-0">
            <span className="text-xs font-bold text-white">AS</span>
          </div>

          {/* User name and role */}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-900 truncate">Alisha Shakir</p>
            <p className="text-xs text-gray-400 truncate">Free Plan</p>
          </div>

          {/* Logout icon */}
          <LogOut size={15} className="text-gray-300 group-hover:text-gray-500 transition-colors shrink-0" />
        </div>
      </div>

    </aside>
  )
}

// Export Sidebar as the DEFAULT export from this file.
// This means: import Sidebar from './Sidebar'  (no curly braces)
export default Sidebar
