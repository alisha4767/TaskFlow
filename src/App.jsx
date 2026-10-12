// App.jsx — The ROOT component of our entire React application.
//
// WHAT CHANGED FROM MILESTONE 1:
//   Before: App.jsx contained the entire UI (logo, tagline, badges...)
//   Now:    App.jsx is CLEAN and SIMPLE — it just composes other components.
//
// This is a core React principle: COMPONENT COMPOSITION.
// As your app grows, App.jsx becomes a high-level director that says
// "render this layout with this content" — nothing more.

import AppLayout from './components/layout/AppLayout'
import DashboardPlaceholder from './components/layout/DashboardPlaceholder'

// Notice how clean and readable this is!
// App.jsx doesn't know HOW AppLayout or DashboardPlaceholder work.
// It just declares WHAT should be on screen.
function App() {
  return (
    // AppLayout wraps everything — it provides the Sidebar and Topbar.
    // pageTitle="Dashboard" is passed as a PROP to AppLayout,
    // which then passes it further down to Topbar.
    //
    // DashboardPlaceholder is passed as the 'children' prop automatically —
    // it appears wherever AppLayout puts {children} in its JSX.
    <AppLayout pageTitle="Dashboard">
      <DashboardPlaceholder />
    </AppLayout>
  )
}

export default App
