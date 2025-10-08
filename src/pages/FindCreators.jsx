import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaTiktok, FaFacebook, FaYoutube, FaSnapchat, FaFilter, FaArrowLeft } from 'react-icons/fa';
import mockCreators from '../data/mockCreators';

const FindCreators = () => {
  const navigate = useNavigate();
  const [creators, setCreators] = useState(mockCreators);
  const [loading, setLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    priceRange: 'all',
    region: 'all',
    platform: 'all'
  });

  const handleStartCampaign = (creatorId) => {
    navigate(`/create-campaign-offer/${creatorId}`);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const filteredCreators = creators.filter(creator => {
    return (
      (filters.priceRange === 'all' || creator.priceRange === filters.priceRange) &&
      (filters.region === 'all' || creator.region === filters.region) &&
      (filters.platform === 'all' || creator.platforms.includes(filters.platform))
    );
  });

  const renderFilters = () => (
    <div className="bg-white p-4 rounded-lg shadow mb-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Price Range</label>
          <select
            name="priceRange"
            value={filters.priceRange}
            onChange={handleFilterChange}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
          >
            <option value="all">All Prices</option>
            <option value="0-500">$0 - $500</option>
            <option value="500-1000">$500 - $1,000</option>
            <option value="1000-5000">$1,000 - $5,000</option>
            <option value="5000+">$5,000+</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Region</label>
          <select
            name="region"
            value={filters.region}
            onChange={handleFilterChange}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
          >
            <option value="all">All Regions</option>
            <option value="North America">North America</option>
            <option value="Europe">Europe</option>
            <option value="Asia">Asia</option>
            <option value="South America">South America</option>
            <option value="Africa">Africa</option>
            <option value="Oceania">Oceania</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Platform</label>
          <select
            name="platform"
            value={filters.platform}
            onChange={handleFilterChange}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
          >
            <option value="all">All Platforms</option>
            <option value="tiktok">TikTok</option>
            <option value="instagram">Instagram</option>
            <option value="youtube">YouTube</option>
          </select>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center justify-center w-10 h-10 rounded-full bg-white shadow-md hover:shadow-lg transition-shadow"
          >
            <FaArrowLeft className="text-gray-600" />
          </button>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center bg-white px-4 py-2 rounded-lg shadow hover:shadow-md transition-shadow"
          >
            <FaFilter className="mr-2" />
            {showFilters ? 'Hide Filters' : 'Show Filters'}
          </button>
        </div>

        {showFilters && renderFilters()}

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCreators.map(creator => (
              <div key={creator.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="relative h-48">
                  <img
                    src={creator.profileImage}
                    alt={creator.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
                    <h3 className="text-white text-xl font-bold">{creator.name}</h3>
                    <p className="text-gray-200 capitalize">{creator.niche}</p>
                  </div>
                </div>
                <div className="p-4">
                  <p className="text-gray-600 mb-4">{creator.bio}</p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {creator.platforms.map(platform => (
                      <div key={platform} className="flex items-center text-gray-700">
                        {platform === 'tiktok' && <FaTiktok className="mr-1" />}
                        {platform === 'instagram' && <FaFacebook className="mr-1" />}
                        {platform === 'youtube' && <FaYoutube className="mr-1" />}
                        {platform === 'snapchat' && <FaSnapchat className="mr-1" />}
                        {creator.followers[platform].toLocaleString()} followers
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between items-center text-sm text-gray-500">
                    <span>Engagement: {creator.engagementRate}%</span>
                    <span>${creator.priceRange}</span>
                  </div>
                  <button
                    onClick={() => handleStartCampaign(creator.id)}
                    className="mt-4 w-full bg-purple-600 text-white py-2 rounded-md hover:bg-purple-700 transition-colors"
                  >
                    Start Campaign
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FindCreators; 