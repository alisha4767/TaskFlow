// AppLayout.jsx
// The master layout component — assembles Sidebar, Topbar, and the main content.
//
// NEW CONCEPT: The 'children' prop
//
// When you write:
//   <AppLayout>
//     <SomeComponent />
//   </AppLayout>
//
// React automatically passes <SomeComponent /> as 'props.children' to AppLayout.
// This lets AppLayout be a reusable WRAPPER — the same shell works for any page,
// because the page's unique content is passed in via children.

import Sidebar from './Sidebar'
import Topbar from './Topbar'

// ─────────────────────────────────────────────────────────────────────────────
// COMPONENT: AppLayout
//
// Props received:
//   children  → whatever is nested between <AppLayout>...</AppLayout> tags
//   pageTitle → passed down to Topbar to show the current page name
// ─────────────────────────────────────────────────────────────────────────────
function AppLayout({ children, pageTitle }) {
  return (
    // The outer div fills the entire screen.
    // bg-gray-50 → very light gray — the content area background color
    <div className="min-h-screen bg-gray-50">

      {/* Sidebar is fixed — it doesn't move with scrolling */}
      <Sidebar />

      {/* Everything to the RIGHT of the sidebar */}
      {/* ml-64 = margin-left: 256px → pushes content past the fixed sidebar */}
      <div className="ml-64 flex flex-col min-h-screen">

        {/* Topbar is sticky — stays at top as content scrolls */}
        {/* We pass pageTitle DOWN to Topbar via props */}
        <Topbar pageTitle={pageTitle} />

        {/* Main content area — this is where each page's content appears */}
        {/* flex-1 → grows to fill remaining vertical space */}
        {/* overflow-y-auto → allows this area (not the whole page) to scroll */}
        <main className="flex-1 p-6">
          {/* 'children' is rendered here — it's whatever was put between
              <AppLayout> tags in App.jsx */}
          {children}
        </main>

      </div>
    </div>
  )
}

export default AppLayout
