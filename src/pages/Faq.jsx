import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FAQSection } from './Settings';
import { FaBook } from 'react-icons/fa';

const Faq = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-gray-50 py-8 flex flex-col items-center">
      <button onClick={() => navigate(-1)} className="mb-4 px-5 py-2 rounded bg-black text-white hover:bg-gray-900 transition-colors self-start ml-0 md:ml-8">← Back</button>
      <div className="w-full max-w-3xl px-4 md:px-8">
        <div className="flex items-center gap-2 mb-8">
          <FaBook className="text-blue-900 text-3xl" />
          <h2 className="text-3xl font-bold text-blue-900">CreatorFlow — Frequently Asked Questions (FAQ)</h2>
        </div>
        <FAQSection hideHeader />
      </div>
    </div>
  );
};

export default Faq; 