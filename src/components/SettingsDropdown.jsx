import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaCog, FaSignOutAlt, FaCreditCard, FaCrown } from 'react-icons/fa';

const SettingsDropdown = ({ isOpen, onClose }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('userPlan');
    localStorage.removeItem('token');
    navigate('/');
  };

  if (!isOpen) return null;

  return (
    <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
      <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
        <button
          onClick={() => {
            navigate('/manage-subscription');
            onClose();
          }}
          className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          role="menuitem"
        >
          <FaCrown className="mr-3 h-5 w-5 text-purple-600" />
          Manage Subscription
        </button>
        
        <button
          onClick={() => {
            navigate('/platform-settings');
            onClose();
          }}
          className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          role="menuitem"
        >
          <FaCog className="mr-3 h-5 w-5 text-gray-500" />
          Platform Settings
        </button>

        <button
          onClick={() => {
            navigate('/card-details');
            onClose();
          }}
          className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          role="menuitem"
        >
          <FaCreditCard className="mr-3 h-5 w-5 text-gray-500" />
          Card Details
        </button>

        <button
          onClick={() => {
            handleLogout();
            onClose();
          }}
          className="w-full flex items-center px-4 py-2 text-sm text-red-700 hover:bg-red-50"
          role="menuitem"
        >
          <FaSignOutAlt className="mr-3 h-5 w-5 text-red-500" />
          Logout
        </button>
      </div>
    </div>
  );
};

export default SettingsDropdown; 