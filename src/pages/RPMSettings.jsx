import React, { useRef, useState } from 'react';
import { FaYoutube, FaTiktok, FaFacebook, FaSnapchat } from 'react-icons/fa';
import { useCreator } from '../context/CreatorContext';

const Slider = ({ value, min, max, step, onChange, disabled }) => {
  const [dragging, setDragging] = useState(false);
  const sliderRef = useRef(null);

  // Calculate bubble position as a percentage
  const percent = ((value - min) / (max - min)) * 100;

  return (
    <div className="relative w-full md:w-64 flex flex-col items-center">
      {/* Value bubble */}
      <div
        className={`absolute -top-8 left-0 z-10 transition-all duration-200 pointer-events-none select-none ${dragging ? 'scale-110' : ''}`}
        style={{ left: `calc(${percent}% - 24px)` }}
      >
        <div className={`px-3 py-1 rounded-full shadow text-white font-bold text-sm bg-purple-600 border-2 border-white`}>${value.toFixed(2)}</div>
      </div>
      {/* Slider track and thumb */}
      <input
        ref={sliderRef}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={onChange}
        onMouseDown={() => setDragging(true)}
        onMouseUp={() => setDragging(false)}
        onTouchStart={() => setDragging(true)}
        onTouchEnd={() => setDragging(false)}
        disabled={disabled}
        className={`w-full h-3 rounded-full appearance-none transition-all duration-200 ${disabled ? 'bg-gray-200' : 'bg-purple-200'} focus:outline-none focus:ring-2 focus:ring-purple-500`}
        style={{ accentColor: disabled ? '#d1d5db' : '#a78bfa' }}
      />
      {/* Custom thumb */}
      <style>{`
        input[type='range']::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 28px;
          height: 28px;
          border-radius: 50%;
          background: ${disabled ? '#d1d5db' : '#a78bfa'};
          border: 3px solid white;
          box-shadow: 0 2px 8px rgba(80,0,200,0.10);
          cursor: pointer;
          transition: background 0.2s;
        }
        input[type='range']:focus::-webkit-slider-thumb {
          background: #7c3aed;
        }
        input[type='range']::-moz-range-thumb {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          background: ${disabled ? '#d1d5db' : '#a78bfa'};
          border: 3px solid white;
          box-shadow: 0 2px 8px rgba(80,0,200,0.10);
          cursor: pointer;
          transition: background 0.2s;
        }
        input[type='range']:focus::-moz-range-thumb {
          background: #7c3aed;
        }
        input[type='range']::-ms-thumb {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          background: ${disabled ? '#d1d5db' : '#a78bfa'};
          border: 3px solid white;
          box-shadow: 0 2px 8px rgba(80,0,200,0.10);
          cursor: pointer;
          transition: background 0.2s;
        }
        input[type='range']::-webkit-slider-runnable-track {
          height: 8px;
          border-radius: 8px;
          background: linear-gradient(90deg, #a78bfa 0%, #7c3aed 100%);
        }
        input[type='range']:disabled::-webkit-slider-thumb {
          background: #d1d5db;
        }
        input[type='range']:disabled::-webkit-slider-runnable-track {
          background: #e5e7eb;
        }
        input[type='range']::-ms-fill-lower {
          background: #a78bfa;
        }
        input[type='range']::-ms-fill-upper {
          background: #e5e7eb;
        }
      `}</style>
    </div>
  );
};

const RPMSettings = () => {
  const { platformSettings, updatePlatformSettings } = useCreator();

  const platforms = [
    {
      id: 'youtube',
      name: 'YouTube',
      icon: <FaYoutube className="text-2xl text-red-600" />,
    },
    {
      id: 'tiktok',
      name: 'TikTok',
      icon: <FaTiktok className="text-2xl" />,
    },
    {
      id: 'facebook',
      name: 'Facebook',
      icon: <FaFacebook className="text-2xl text-blue-600" />,
    },
    {
      id: 'snapchat',
      name: 'Snapchat',
      icon: <FaSnapchat className="text-2xl text-yellow-400" />,
    },
  ];

  const handleSliderChange = (platformId, value) => {
    updatePlatformSettings(platformId, { rpm: parseFloat(value) });
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-center text-purple-600">RPM Settings</h1>
      <p className="text-center text-gray-700 mb-8 font-medium">Set your estimated earnings per 1000 views</p>
      <div className="space-y-8">
        {platforms.map(platform => {
          const settings = platformSettings[platform.id] || {};
          const connected = settings.connected && settings.username;
          return (
            <div key={platform.id} className="bg-white rounded-2xl shadow p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-6 opacity-100">
              <div className="flex items-center gap-4">
                {platform.icon}
                <span className="font-semibold text-lg text-gray-900">{platform.name}</span>
              </div>
              <div className="flex-1 flex flex-col items-center md:items-end gap-2">
                <Slider
                  value={settings.rpm || 1.5}
                  min={0.5}
                  max={10}
                  step={0.01}
                  onChange={e => handleSliderChange(platform.id, e.target.value)}
                  disabled={!connected}
                />
                <span className={`text-purple-700 font-bold text-lg ${!connected ? 'text-gray-400' : ''}`}>${(settings.rpm || 1.5).toFixed(2)} <span className='text-gray-500 font-normal text-base'>per 1000 views</span></span>
                {!connected && (
                  <span className="text-sm text-gray-400 mt-1">Connect your account to adjust RPM</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RPMSettings; 