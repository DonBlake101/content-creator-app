import React, { createContext, useState, useContext, useEffect } from 'react';

const CreatorContext = createContext();

export const useCreator = () => {
  const context = useContext(CreatorContext);
  if (!context) {
    throw new Error('useCreator must be used within a CreatorProvider');
  }
  return context;
};

export const CreatorProvider = ({ children }) => {
  // Initialize platform settings from localStorage or default values
  const [platformSettings, setPlatformSettings] = useState(() => {
    const savedSettings = localStorage.getItem('platformSettings');
    return savedSettings ? JSON.parse(savedSettings) : {
      youtube: {
        connected: false,
        monetized: true,
        rpm: 0,
      },
      tiktok: {
        connected: false,
        monetized: true,
        rpm: 0,
      },
      instagram: {
        connected: false,
        monetized: true,
        rpm: 0,
      },
      facebook: {
        connected: false,
        monetized: true,
        rpm: 0,
      },
      snapchat: {
        connected: false,
        monetized: true,
        rpm: 0,
      }
    };
  });

  // Save settings to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('platformSettings', JSON.stringify(platformSettings));
  }, [platformSettings]);

  const updatePlatformSettings = (platform, updates) => {
    setPlatformSettings(prev => ({
      ...prev,
      [platform]: {
        ...prev[platform],
        ...updates
      }
    }));
  };

  const togglePlatformConnection = (platform) => {
    updatePlatformSettings(platform, {
      connected: !platformSettings[platform].connected
    });
  };

  const togglePlatformMonetization = (platform) => {
    updatePlatformSettings(platform, {
      monetized: !platformSettings[platform].monetized
    });
  };

  const updatePlatformRPM = (platform, rpm) => {
    updatePlatformSettings(platform, { rpm });
  };

  const isPlatformConnected = (platform) => {
    return platformSettings[platform]?.connected || false;
  };

  const getPlatformData = (platform) => {
    if (!isPlatformConnected(platform)) {
      return {
        hasData: false,
        message: 'No data available - Platform not connected'
      };
    }
    return {
      hasData: true,
      data: platformSettings[platform]
    };
  };

  return (
    <CreatorContext.Provider value={{
      platformSettings,
      updatePlatformSettings,
      togglePlatformConnection,
      togglePlatformMonetization,
      updatePlatformRPM,
      isPlatformConnected,
      getPlatformData
    }}>
      {children}
    </CreatorContext.Provider>
  );
}; 