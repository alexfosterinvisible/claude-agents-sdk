// (Claude) Main application component with three-column layout

function App() {
  return (
    <div className="app-container">
      <div className="grid grid-cols-12 h-screen">
        {/* Left Panel: Requirements (20%) */}
        <div className="col-span-2 bg-gray-100 p-4 overflow-y-auto">
          <h2 className="text-lg font-bold mb-4">Requirements</h2>
          <p className="text-sm text-gray-600">Requirements panel coming soon...</p>
        </div>

        {/* Center Panel: FlowCanvas + Timeline (60%) */}
        <div className="col-span-8 bg-white flex flex-col">
          <div className="flex-1 relative">
            <p className="absolute inset-0 flex items-center justify-center text-gray-400">
              Flowchart canvas coming soon...
            </p>
          </div>
          <div className="h-24 bg-gray-50 border-t border-gray-200">
            <p className="h-full flex items-center justify-center text-gray-400 text-sm">
              Timeline coming soon...
            </p>
          </div>
        </div>

        {/* Right Panel: Thread Reader (20%) */}
        <div className="col-span-2 bg-gray-100 p-4 overflow-y-auto">
          <h2 className="text-lg font-bold mb-4">Threads</h2>
          <p className="text-sm text-gray-600">Thread reader coming soon...</p>
        </div>
      </div>
    </div>
  )
}

export default App
