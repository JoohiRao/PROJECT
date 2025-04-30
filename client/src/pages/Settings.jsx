import React, { useState } from 'react';

function Settings() {
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [language, setLanguage] = useState('English');

  return (
    <div className="max-w-xl mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-4">⚙️ Settings</h2>

      {/* Dark Mode Toggle */}
      <div className="flex items-center justify-between mb-4">
        <span>Dark Mode</span>
        <input
          type="checkbox"
          checked={darkMode}
          onChange={() => setDarkMode(!darkMode)}
        />
      </div>

      {/* Notification Toggle */}
      <div className="flex items-center justify-between mb-4">
        <span>Enable Notifications</span>
        <input
          type="checkbox"
          checked={notifications}
          onChange={() => setNotifications(!notifications)}
        />
      </div>

      {/* Language Dropdown */}
      <div className="mb-4">
        <label className="block mb-1">Language</label>
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="border rounded px-3 py-2 w-full"
        >
          <option>English</option>
          <option>Hindi</option>
          <option>Spanish</option>
          <option>French</option>
        </select>
      </div>

      {/* Save Button (Dummy) */}
      <button
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        onClick={() => alert('Settings saved (locally)!')}
      >
        Save Settings
      </button>
    </div>
  );
}

export default Settings;
