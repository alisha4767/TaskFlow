// App.jsx — The ROOT component of our entire React application.
// Every other component we build will eventually live inside this one.
// Think of this as the "trunk" of a tree — everything branches from here.

// We import the Zap icon from lucide-react — a free, beautiful icon library.
// Icons are imported as React components, so we use them like: <Zap />
import { Zap } from 'lucide-react'

// A functional component is simply a JavaScript function that returns JSX.
// JSX looks like HTML but it's actually JavaScript — Vite transforms it for us.
function App() {
  return (
    // This outer <div> is our app's full-screen container.
    // Tailwind classes explained:
    //   min-h-screen  → minimum height of 100% of the viewport
    //   bg-gray-50    → very light gray background
    //   flex          → use flexbox layout
    //   items-center  → center children vertically
    //   justify-center → center children horizontally
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">

      {/* The card container — a white box centered on screen */}
      <div className="text-center max-w-md mx-auto px-6">

        {/* ── Brand Logo Area ─────────────────────────────────── */}
        {/* The logo: a colored circle with the Zap icon inside */}
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-indigo-600 mb-6 shadow-lg">
          {/* Zap is a Lucide icon. We give it size and color as props. */}
          <Zap size={32} className="text-white" />
        </div>

        {/* ── App Name ─────────────────────────────────────────── */}
        {/* text-4xl → large text, font-bold → bold, text-gray-900 → dark */}
        <h1 className="text-4xl font-bold text-gray-900 mb-2 tracking-tight">
          TaskFlow
        </h1>

        {/* ── Tagline ──────────────────────────────────────────── */}
        <p className="text-gray-500 text-base mb-8">
          A modern project management dashboard.
          <br />
          Built step by step with React.
        </p>

        {/* ── Status Badge ─────────────────────────────────────── */}
        {/* This small pill badge shows the current milestone status */}
        <div className="inline-flex items-center gap-2 bg-indigo-50 text-indigo-700 text-sm font-medium px-4 py-2 rounded-full">
          {/* A small animated green dot to indicate "live" */}
          <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
          Milestone 1 — Project Setup Complete
        </div>

        {/* ── Stack Info ───────────────────────────────────────── */}
        <div className="mt-8 pt-8 border-t border-gray-200">
          <p className="text-xs text-gray-400 uppercase tracking-widest font-medium mb-4">
            Built with
          </p>
          {/* A row of technology badges */}
          <div className="flex items-center justify-center flex-wrap gap-2">
            {/* Each span is a small "chip" badge */}
            {['React 19', 'Vite 8', 'Tailwind CSS', 'Lucide Icons'].map((tech) => (
              <span
                key={tech}
                className="text-xs bg-gray-100 text-gray-600 px-3 py-1 rounded-full font-medium"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}

// We MUST export the component so other files can import and use it.
// Without this export, main.jsx couldn't find App.
export default App
