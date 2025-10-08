import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const CreateCampaignOffer = () => {
  const { creatorId } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: '',
    description: '',
    payment: '',
    deadline: ''
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Save campaign to localStorage (or send to backend)
    const campaigns = JSON.parse(localStorage.getItem('campaigns')) || [];
    const newCampaign = {
      ...form,
      id: Date.now(),
      creatorId,
      status: 'offer',
      createdAt: new Date().toISOString()
    };
    localStorage.setItem('campaigns', JSON.stringify([...campaigns, newCampaign]));
    // Optionally, add an offer message to the creator's inbox here
    navigate('/brand-dashboard');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow p-8">
        {/* Back Button */}
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="mb-6 p-3 rounded-full bg-white border border-gray-200 shadow hover:bg-gray-100 transition-colors flex items-center justify-center"
          aria-label="Go back"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </button>
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Create Campaign Offer</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Campaign Title</label>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
              rows={3}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Payment (USD)</label>
            <input
              type="text"
              name="payment"
              value={form.payment}
              onChange={e => {
                // Only allow numbers
                const val = e.target.value.replace(/[^0-9.]/g, '');
                setForm({ ...form, payment: val });
              }}
              inputMode="decimal"
              pattern="^[0-9]*[.,]?[0-9]*$"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 appearance-none"
              required
              autoComplete="off"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Deadline</label>
            <input
              type="date"
              name="deadline"
              value={form.deadline}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
              required
              min={new Date().toISOString().split('T')[0]}
            />
          </div>
          <div className="flex justify-end gap-3">
            <button type="button" onClick={() => navigate(-1)} className="px-4 py-2 text-gray-600 hover:text-gray-800">Cancel</button>
            <button type="submit" className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">Send Offer</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateCampaignOffer; 