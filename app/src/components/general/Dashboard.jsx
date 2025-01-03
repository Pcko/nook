import React from 'react';
import logo from '../../assets/resources/image.png'

function Dashboard ()  {
  return (
    <div className="flex h-screen bg-website-bg text-white">
      {/* Sidebar */}
      <aside className="w-1/5 bg-ui-bg p-4">
        <div className="flex items-center space-x-4 mb-6">
          <img src={logo} alt="Logo" className="h-16 w-auto" />
          <h2 className="text-2xl font-bold">Nook</h2>
        </div>
        <nav>
          <ul className="space-y-4">
            <li className="cursor-pointer hover:text-primary">Pages</li>
            <li className="cursor-pointer hover:text-primary">Themes</li>
            <li className="cursor-pointer hover:text-primary">Settings</li>
            <li className="cursor-pointer hover:text-primary">Help</li>
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col p-6">
        {/* Toolbar */}
        <div className="flex space-x-4 mb-6">
          <button className="btn">Create Page</button>
          <button className="btn">Save Changes</button>
          <button className="btn">Preview</button>
        </div>

        {/* Content Area */}
        <div className="flex-1 bg-ui-bg rounded-lg p-6">
          <h3 className="text-xl font-semibold mb-4">Welcome to Your Website Builder</h3>
          <p className="text-gray-400">Select a tool from the left to start customizing your site.</p>
        </div>
      </main>

      {/* Preview Pane */}
      <div className="w-1/3 bg-ui-bg p-6">
        <h3 className="text-xl font-semibold mb-4">Live Preview</h3>
        <div className="flex items-center justify-center h-80 bg-gray-800 rounded-lg border border-gray-700">
          <p className="text-gray-500">Your website preview will appear here.</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;