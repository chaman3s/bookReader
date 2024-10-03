// src/components/TabBar.js
import React, { useState } from 'react';

const TabBar = () => {
  const [tabs, setTabs] = useState(['Books', 'Notes', 'Research/Projects']);
  const [newTab, setNewTab] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);

  const addNewTab = () => {
    if (newTab.trim()) {
      setTabs([...tabs, newTab]);
      setNewTab('');
    }
  };

  const removeTab = (indexToRemove) => {
    const newTabs = tabs.filter((_, index) => index !== indexToRemove);
    setTabs(newTabs);
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  return (
    <div className="bg-gray-100 p-4 flex space-x-4">
      {tabs.map((tab, index) => (
        <div
          key={index}
          className="bg-white px-4 py-2 rounded-md shadow cursor-pointer flex items-center space-x-2"
        >
          <span>{tab}</span>
          <button
            className="text-red-500"
            onClick={() => removeTab(index)}
          >
            x
          </button>
        </div>
      ))}
      <div className="flex space-x-2">
        <input
          type="text"
          value={newTab}
          onChange={(e) => setNewTab(e.target.value)}
          placeholder="New Tab"
          className="px-4 py-2 border border-gray-300 rounded-md"
        />
        <button
          onClick={addNewTab}
          className="bg-blue-500 text-white px-4 py-2 rounded-md"
        >
          +
        </button>
      </div>
      {selectedFile && (
        <p className="ml-4 text-sm text-green-500">
          Uploaded: {selectedFile.name}
        </p>
      )}
    </div>
  );
};

export default TabBar;
