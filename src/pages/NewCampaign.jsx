import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const NewCampaign = () => {
  const navigate = useNavigate();
  const [campaign, setCampaign] = useState({
    title: '',
    description: '',
    budget: '',
    requirements: [],
    deadline: '',
    platform: 'all'
  });
  const [newRequirement, setNewRequirement] = useState('');

  const handleAddRequirement = () => {
    if (newRequirement.trim()) {
      setCampaign({
        ...campaign,
        requirements: [...campaign.requirements, newRequirement.trim()]
      });
      setNewRequirement('');
    }
  };

  const handleRemoveRequirement = (index) => {
    setCampaign({
      ...campaign,
      requirements: campaign.requirements.filter((_, i) => i !== index)
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Save campaign to localStorage or your backend
    const campaigns = JSON.parse(localStorage.getItem('campaigns')) || [];
    const newCampaign = {
      ...campaign,
      id: Date.now(),
      status: 'active',
      acceptedCreators: []
    };
    localStorage.setItem('campaigns', JSON.stringify([...campaigns, newCampaign]));
    navigate('/brand-dashboard');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Create New Campaign</h1>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Campaign Title
              </label>
              <input
                type="text"
                value={campaign.title}
                onChange={(e) => setCampaign({ ...campaign, title: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                value={campaign.description}
                onChange={(e) => setCampaign({ ...campaign, description: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
                rows={4}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Budget (USD)
              </label>
              <input
                type="number"
                value={campaign.budget}
                onChange={(e) => setCampaign({ ...campaign, budget: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Platform
              </label>
              <select
                value={campaign.platform}
                onChange={(e) => setCampaign({ ...campaign, platform: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
              >
                <option value="all">All Platforms</option>
                <option value="tiktok">TikTok</option>
                <option value="instagram">Instagram</option>
                <option value="youtube">YouTube</option>
                <option value="facebook">Facebook</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Deadline
              </label>
              <input
                type="date"
                value={campaign.deadline}
                onChange={(e) => setCampaign({ ...campaign, deadline: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Requirements Checklist
              </label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={newRequirement}
                  onChange={(e) => setNewRequirement(e.target.value)}
                  className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
                  placeholder="Add a requirement"
                />
                <button
                  type="button"
                  onClick={handleAddRequirement}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                >
                  Add
                </button>
              </div>
              <ul className="space-y-2">
                {campaign.requirements.map((req, index) => (
                  <li key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                    <span>{req}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveRequirement(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => navigate('/brand-dashboard')}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
              >
                Create Campaign
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default NewCampaign; 