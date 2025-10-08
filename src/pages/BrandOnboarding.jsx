import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaTiktok, FaFacebook, FaYoutube, FaSnapchat } from 'react-icons/fa';
import axios from 'axios';
import { getFacebookAuthUrl } from './FacebookConnect';

const BrandOnboarding = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [brandProfile, setBrandProfile] = useState({
    name: '',
    industry: '',
    budgetRange: '',
    ageRange: '',
    socialMedia: {
      tiktok: '',
      facebook: '',
      youtube: '',
      snapchat: ''
    }
  });
  const [youtubeVerified, setYoutubeVerified] = useState(false);
  const [youtubeVerifying, setYoutubeVerifying] = useState(false);
  const [thankYou, setThankYou] = useState(false);
  const [facebookVerified, setFacebookVerified] = useState(false);
  const [facebookVerifying, setFacebookVerifying] = useState(false);

  const validateStep1 = () => {
    if (!brandProfile.name.trim()) {
      setError('Please enter your brand name');
      return false;
    }
    if (!brandProfile.industry) {
      setError('Please select your industry');
      return false;
    }
    if (!brandProfile.budgetRange) {
      setError('Please select your budget range');
      return false;
    }
    if (!brandProfile.ageRange) {
      setError('Please select your target age range');
      return false;
    }
    return true;
  };

  const validateStep2 = () => {
    const hasAtLeastOneSocialMedia = Object.values(brandProfile.socialMedia).some(value => value.trim());
    if (!hasAtLeastOneSocialMedia) {
      setError('Please connect at least one social media account');
      return false;
    }
    return true;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBrandProfile(prev => ({
      ...prev,
      [name]: value
    }));
    setError(''); // Clear error when user makes changes
  };

  const handleSocialMediaChange = (platform, value) => {
    setBrandProfile(prev => ({
      ...prev,
      socialMedia: {
        ...prev.socialMedia,
        [platform]: value
      }
    }));
    setError(''); // Clear error when user makes changes
  };

  const verifySocialMediaAccounts = async () => {
    setIsLoading(true);
    setError('');
    
    try {
      // Store brand profile in localStorage
      localStorage.setItem('brandProfile', JSON.stringify(brandProfile));
      
      // Simulate API verification
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Navigate to dashboard after successful verification
      navigate('/brand-dashboard');
    } catch (error) {
      console.error('Error verifying social media accounts:', error);
      setError('Failed to verify social media accounts. Please try again.');
      setIsLoading(false);
    }
  };

  const handleYoutubeVerify = async () => {
    setYoutubeVerifying(true);
    setError('');
    // Simulate OAuth popup and response
    setTimeout(() => {
      // Mock: Assume the OAuth returns the same handle as entered
      const entered = brandProfile.socialMedia.youtube.trim().toLowerCase();
      // For demo, only allow 'verifieduser' as a match
      const oauthHandle = 'verifieduser';
      if (entered && entered === oauthHandle) {
        setYoutubeVerified(true);
        setError('');
      } else {
        setYoutubeVerified(false);
        setError('YouTube verification failed: handle does not match authenticated account.');
      }
      setYoutubeVerifying(false);
    }, 1200);
  };

  const handleFacebookVerify = async () => {
    const facebookHandle = brandProfile.socialMedia.facebook.trim();
    if (!facebookHandle) {
      setError('Please enter your Facebook username or page name first.');
      return;
    }

    setFacebookVerifying(true);
    setError('');

    // Simulate Facebook OAuth flow (replace with actual OAuth redirect if needed)
    // For a real implementation, you would redirect to Facebook here
    // and handle the callback in a different route/component.
    console.log('Initiating Facebook OAuth for:', facebookHandle);
    // Example redirect: window.location.href = getFacebookAuthUrl();

    // Mock verification success after a delay
    setTimeout(() => {
      // In a real scenario, you would check the OAuth response/API call result
      // For demo, simulate success if handle is not empty
      if (facebookHandle) {
         setFacebookVerified(true);
         setError(''); // Clear any previous errors
         console.log('Facebook verification mocked successful!');
      } else {
         // This else block might not be reached with the current check, but good for completeness
         setFacebookVerified(false);
         setError('Facebook verification failed.');
         console.log('Facebook verification mocked failed.');
      }
      setFacebookVerifying(false);
    }, 1500); // Simulate API call delay
  };

  const handleNext = async () => {
    setError('');
    if (step === 1) {
      if (validateStep1()) {
        setStep(2);
      }
    } else if (step === 2) {
      if (validateStep2()) {
        // If YouTube is entered, require verification
        if (brandProfile.socialMedia.youtube.trim() && !youtubeVerified) {
          setError('Please verify your YouTube account.');
          return;
        }
        // If Facebook is entered, require verification
        if (brandProfile.socialMedia.facebook.trim() && !facebookVerified) {
          setError('Please verify your Facebook account.');
          return;
        }
        setStep(3);
      }
    } else {
      // Complete Setup
      setIsLoading(true);
      setTimeout(async () => {
        setIsLoading(false);
        setThankYou(true);
        // Send onboarding data to backend for email
        try {
          await axios.post('/api/onboarding-email', {
            ...brandProfile,
            youtubeVerified
          });
        } catch (e) {
          // Optionally handle error
        }
      }, 1000);
    }
  };

  const handleBack = () => {
    setError('');
    setStep(step - 1);
  };

  if (thankYou) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white">
        <div className="flex flex-col items-center justify-center w-full h-full">
          <h2 className="text-4xl font-extrabold mb-6 text-black text-center">Thank you!</h2>
          <p className="text-2xl text-black text-center max-w-2xl mb-8">Thanks! We'll review your brand account and get back to you within 1–2 business days.</p>
          <button
            className="mt-4 px-8 py-3 rounded-md text-lg font-semibold text-white bg-black hover:bg-gray-900"
            onClick={() => navigate('/brand-dashboard')}
          >
            Next
          </button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-black"></div>
        <p className="mt-4 text-lg font-medium text-gray-900">Setting up your brand profile...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Brand Onboarding</h2>
          <p className="mt-2 text-sm text-gray-600">Step {step} of 3</p>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        <div className="bg-white shadow rounded-lg p-6">
          {step === 1 && (
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-gray-900">Brand Information</h3>
              <div>
                <label className="block text-sm font-medium text-gray-700">Brand Name</label>
                <input
                  type="text"
                  name="name"
                  value={brandProfile.name}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black"
                  placeholder="Enter your brand name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Industry</label>
                <select
                  name="industry"
                  value={brandProfile.industry}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black"
                >
                  <option value="">Select Industry</option>
                  <option value="fashion">Fashion</option>
                  <option value="beauty">Beauty</option>
                  <option value="tech">Technology</option>
                  <option value="food">Food & Beverage</option>
                  <option value="fitness">Fitness</option>
                  <option value="education">Education</option>
                  <option value="entertainment">Entertainment</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Select budget range (per month)</label>
                <select
                  name="budgetRange"
                  value={brandProfile.budgetRange}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black"
                >
                  <option value="">Select Budget Range</option>
                  <option value="0-100">$0 - $100</option>
                  <option value="101-500">$101 - $500</option>
                  <option value="501-1000">$501 - $1,000</option>
                  <option value="1001-5000">$1,001 - $5,000</option>
                  <option value="5001-10000">$5,001 - $10,000</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Target Age Range</label>
                <select
                  name="ageRange"
                  value={brandProfile.ageRange}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black"
                >
                  <option value="">Select Age Range</option>
                  <option value="13-17">13-17</option>
                  <option value="18-24">18-24</option>
                  <option value="25-34">25-34</option>
                  <option value="35-44">35-44</option>
                  <option value="45-54">45-54</option>
                  <option value="55+">55+</option>
                </select>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-gray-900">Connect Social Media</h3>
              <p className="text-sm text-gray-600">Connect at least one social media account</p>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">TikTok Username</label>
                <div className="mt-1 flex rounded-md shadow-sm">
                  <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500">
                    <FaTiktok className="h-5 w-5" />
                  </span>
                  <input
                    type="text"
                    value={brandProfile.socialMedia.tiktok}
                    onChange={(e) => handleSocialMediaChange('tiktok', e.target.value)}
                    className="flex-1 block w-full rounded-none rounded-r-md border-gray-300 focus:border-black focus:ring-black"
                    placeholder="@username"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Facebook Username</label>
                <div className="mt-1 flex rounded-md shadow-sm items-center gap-2">
                  <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500">
                    <FaFacebook className="h-5 w-5" />
                  </span>
                  <input
                    type="text"
                    value={brandProfile.socialMedia.facebook}
                    onChange={(e) => { handleSocialMediaChange('facebook', e.target.value); setFacebookVerified(false); }}
                    className="flex-1 block w-full rounded-none rounded-r-md border-gray-300 focus:border-black focus:ring-black"
                    placeholder="@username or page name"
                  />
                  {/* Facebook Verify Button */}
                  {brandProfile.socialMedia.facebook.trim() && (
                    <button
                      type="button"
                      onClick={handleFacebookVerify}
                      disabled={facebookVerifying || facebookVerified}
                      className={`ml-2 px-4 py-2 rounded-md text-sm font-medium text-white ${facebookVerified ? 'bg-green-500' : facebookVerifying ? 'bg-blue-300' : 'bg-blue-600 hover:bg-blue-700'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
                    >
                      {facebookVerified ? 'Verified' : facebookVerifying ? 'Verifying...' : 'Verify'}
                    </button>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">YouTube Username</label>
                <div className="mt-1 flex rounded-md shadow-sm items-center gap-2">
                  <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500">
                    <FaYoutube className="h-5 w-5" />
                  </span>
                  <input
                    type="text"
                    value={brandProfile.socialMedia.youtube}
                    onChange={(e) => { handleSocialMediaChange('youtube', e.target.value); setYoutubeVerified(false); }}
                    className="flex-1 block w-full rounded-none rounded-r-md border-gray-300 focus:border-black focus:ring-black"
                    placeholder="@username"
                  />
                  {/* YouTube Verify Button */}
                  {brandProfile.socialMedia.youtube.trim() && (
                    <button
                      type="button"
                      onClick={handleYoutubeVerify}
                      disabled={youtubeVerifying || youtubeVerified}
                      className={`ml-2 px-4 py-2 rounded-md text-sm font-medium text-white ${youtubeVerified ? 'bg-green-500' : youtubeVerifying ? 'bg-red-300' : 'bg-red-600 hover:bg-red-700'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500`}
                    >
                      {youtubeVerified ? 'Verified' : youtubeVerifying ? 'Verifying...' : 'Verify'}
                    </button>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Snapchat Username</label>
                <div className="mt-1 flex rounded-md shadow-sm">
                  <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500">
                    <FaSnapchat className="h-5 w-5" />
                  </span>
                  <input
                    type="text"
                    value={brandProfile.socialMedia.snapchat}
                    onChange={(e) => handleSocialMediaChange('snapchat', e.target.value)}
                    className="flex-1 block w-full rounded-none rounded-r-md border-gray-300 focus:border-black focus:ring-black"
                    placeholder="@username"
                  />
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-gray-900">Review Your Information</h3>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-700">Brand Details</h4>
                  <p className="mt-1 text-sm text-gray-600">Name: {brandProfile.name}</p>
                  <p className="text-sm text-gray-600">Industry: {brandProfile.industry}</p>
                  <p className="text-sm text-gray-600">Budget: {brandProfile.budgetRange}</p>
                  <p className="text-sm text-gray-600">Target Age: {brandProfile.ageRange}</p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-700">Connected Accounts</h4>
                  {Object.entries(brandProfile.socialMedia).map(([platform, username]) => (
                    username && (
                      <p key={platform} className="text-sm text-gray-600">
                        {platform.charAt(0).toUpperCase() + platform.slice(1)}: @{username}
                      </p>
                    )
                  ))}
                </div>
              </div>
            </div>
          )}

          <div className="mt-8 flex justify-between">
            {step > 1 && (
              <button
                type="button"
                onClick={handleBack}
                className="p-3 rounded-full bg-white border border-gray-200 shadow hover:bg-gray-100 transition-colors flex items-center justify-center"
                aria-label="Go back"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
              </button>
            )}
            <button
              type="button"
              onClick={handleNext}
              className={`px-4 py-2 rounded-md text-sm font-medium text-white bg-black hover:bg-gray-900 ${step === 1 ? 'ml-auto' : ''}`}
            >
              {step === 3 ? 'Complete Setup' : 'Next'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BrandOnboarding; 