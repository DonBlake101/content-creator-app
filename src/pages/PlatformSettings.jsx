import React, { useState } from 'react';
import { useCreator } from '../context/CreatorContext';

const PlatformSettings = () => {
  const { 
    platformSettings, 
    updatePlatformSettings
  } = useCreator();

  const platforms = [
    { id: 'youtube', name: 'YouTube', icon: '🎥' },
    { id: 'tiktok', name: 'TikTok', icon: '📱' },
    { id: 'facebook', name: 'Facebook', icon: '👥' },
    { id: 'snapchat', name: 'Snapchat', icon: '👻' }
  ];

  const [usernameInputs, setUsernameInputs] = useState({});

  const handleUsernameChange = (platform, value) => {
    setUsernameInputs(prev => ({ ...prev, [platform]: value }));
  };

  const handleConnect = (platform) => {
    if (!usernameInputs[platform] || usernameInputs[platform].trim() === '') return;
    updatePlatformSettings(platform, {
      connected: true,
      username: usernameInputs[platform]
    });
  };

  const handleDisconnect = (platform) => {
    updatePlatformSettings(platform, {
      connected: false,
      username: ''
    });
    setUsernameInputs(prev => ({ ...prev, [platform]: '' }));
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h2 className="text-3xl font-extrabold mb-8 text-center text-purple-600">Manage Platforms</h2>
      <div className="space-y-6">
        {platforms.map(platform => {
          const settings = platformSettings[platform.id];
          const username = settings.username || '';
          const connected = settings.connected;
          return (
            <div key={platform.id} className="bg-white p-6 rounded-2xl shadow flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex items-center gap-4">
                <span className="text-3xl">{platform.icon}</span>
                <h3 className="text-xl font-semibold text-gray-900">{platform.name}</h3>
              </div>
              {connected && username ? (
                <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
                  <span className="text-green-600 font-semibold bg-green-50 px-3 py-1 rounded-full border border-green-200">{username}</span>
                    <button
                    onClick={() => handleDisconnect(platform.id)}
                    className="px-4 py-2 rounded-full bg-red-500 text-white hover:bg-red-600 font-medium shadow"
                    >
                    Disconnect
                    </button>
                  </div>
              ) : (
                <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
                      <input
                    type="text"
                    placeholder={`Enter ${platform.name} username`}
                    value={usernameInputs[platform.id] || ''}
                    onChange={e => handleUsernameChange(platform.id, e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900 shadow"
                  />
                  <button
                    onClick={() => handleConnect(platform.id)}
                    className="px-4 py-2 rounded-full bg-purple-600 text-white hover:bg-purple-700 font-medium shadow"
                  >
                    Connect
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PlatformSettings; 