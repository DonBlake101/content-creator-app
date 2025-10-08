import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { FaPaypal, FaCreditCard, FaPlusCircle, FaTrash } from 'react-icons/fa';
import axios from 'axios';

// Mock PayPal API
const mockPayPalAPI = {
  connectAccount: async () => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    return {
      success: true,
      accountId: 'PP' + Math.random().toString(36).substr(2, 9),
      email: 'user@example.com'
    };
  },
  disconnectAccount: async () => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return { success: true };
  }
};

const faqData = [
  {
    category: '💳 Pricing & Billing',
    questions: [
      {
        q: 'What are the available plans and prices?',
        a: 'We offer two plans:\n\nBasic – $14/month: Includes core analytics, growth tracking, earnings breakdowns, and content planning.\n\nPremium – $29/month: Includes everything in Basic plus Brand Matching and Custom Reporting.'
      },
      {
        q: 'Can I cancel anytime?',
        a: "Yes. You can cancel anytime from your dashboard. You'll still have full access to your membership features until the end of your billing cycle."
      },
      {
        q: 'Will I be charged automatically each month?',
        a: 'Yes, subscriptions renew automatically. You can cancel at any time to avoid future charges.'
      }
    ]
  },
  {
    category: '🔐 Data & Privacy',
    questions: [
      {
        q: 'Is my information secure?',
        a: 'Yes — all data is handled securely, and we do not store private messages, passwords, or login credentials. All payments are securely processed by Stripe.'
      },
      {
        q: 'What data does the app collect from my accounts?',
        a: 'We collect only public data like:\n\nTikTok: username, video stats\nYouTube: channel name, subscriber count, views\nFacebook: Page insights (likes, reach, engagement)\nSnapchat (if integrated): story views and public info'
      },
      {
        q: 'Is the data in my dashboard real-time?',
        a: 'Yes. We use official APIs to show real-time stats from your connected social accounts.'
      },
      {
        q: 'Can I disconnect my social media accounts?',
        a: 'Yes, you can revoke access anytime through the platform settings or directly via TikTok, YouTube, or Facebook.'
      },
      {
        q: 'What happens to my data after I disconnect?',
        a: 'Your session tokens are automatically invalidated and your analytics are no longer accessible. We do not permanently store your data.'
      },
      {
        q: 'How can I request data deletion or support?',
        a: "Email us at hi@creatorflowai.app and we'll handle any data or account-related requests."
      }
    ]
  },
  {
    category: '📊 Features & Usage',
    questions: [
      {
        q: "What's included in the Basic Plan?",
        a: 'Content Calendar\nPersonalized Content Strategy\nGrowth & Analytics\nEarnings Analysis'
      },
      {
        q: 'What extra features does Premium include?',
        a: 'Everything in Basic, plus:\n\nBrand Matching: Connect with brands and get paid\nCustom Reporting: Tailored insights for long-term growth'
      },
      {
        q: 'How does Brand Matching work?',
        a: 'We match creators with verified brands based on content type, audience, and engagement. Brands can offer paid collaborations directly through the platform.'
      }
    ]
  },
  {
    category: '🏢 For Brands',
    questions: [
      {
        q: "I'm a brand — how do I join CreatorFlow?",
        a: 'Submit your brand onboarding form via the app. Our team will review your application within 1–2 business days and notify you by email.'
      },
      {
        q: 'What happens after I submit my brand account application?',
        a: 'We will verify your submission and send you an approval or rejection email within 48 hours. Only approved brands can access creator tools and match with talent.'
      }
    ]
  },
  {
    category: '📩 Support',
    questions: [
      {
        q: 'How can I get help or contact support?',
        a: 'For anything at all — billing, account issues, or feedback — email us directly at hi@creatorflowai.app.'
      }
    ]
  }
];

function FAQSection({ hideHeader }) {
  const [open, setOpen] = useState({});
  return (
    <div className="max-w-2xl mx-auto my-12">
      {!hideHeader && (
        <h2 className="text-3xl font-bold mb-8 flex items-center gap-2 text-blue-900"><span role="img" aria-label="book">📘</span> CreatorFlow — Frequently Asked Questions (FAQ)</h2>
      )}
      {faqData.map((cat, i) => (
        <div key={cat.category} className="mb-6">
          <h3 className="text-xl font-semibold mb-2">{cat.category}</h3>
          <div className="space-y-2">
            {cat.questions.map((q, j) => (
              <div key={j} className="border rounded-lg bg-white/80">
                <button
                  className="w-full text-left px-4 py-3 font-medium flex justify-between items-center focus:outline-none"
                  onClick={() => setOpen(o => ({ ...o, [cat.category + j]: !o[cat.category + j] }))}
                >
                  <span>{q.q}</span>
                  <span className="ml-2">{open[cat.category + j] ? '▲' : '▼'}</span>
                </button>
                {open[cat.category + j] && (
                  <div className="px-4 pb-4 text-gray-700 whitespace-pre-line text-base border-t">
                    {q.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

const Settings = () => {
  const [userPlan, setUserPlan] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [showAddCard, setShowAddCard] = useState(false);
  const [newCard, setNewCard] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    holderName: ''
  });
  const [isProcessing, setIsProcessing] = useState(false);
  // Stripe Connect state
  const [stripeAccountId, setStripeAccountId] = useState(localStorage.getItem('stripeAccountId') || null);
  const [stripeLoading, setStripeLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const savedPlan = localStorage.getItem('userPlan');
    setUserPlan(savedPlan);
    // Load saved payment methods from localStorage
    const savedMethods = JSON.parse(localStorage.getItem('paymentMethods') || '[]');
    setPaymentMethods(savedMethods);
    setIsLoading(false);
  }, []);

  // Remove all PayPal logic

  // Stripe Connect onboarding
  const handleStripeOnboard = async () => {
    setStripeLoading(true);
    try {
      const res = await axios.post('http://localhost:5000/api/stripe/create-account-link');
      if (res.data && res.data.url && res.data.stripeAccountId) {
        localStorage.setItem('stripeAccountId', res.data.stripeAccountId);
        setStripeAccountId(res.data.stripeAccountId);
        window.location.href = res.data.url; // Redirect to Stripe onboarding
      }
    } catch (err) {
      console.error('Stripe onboarding error:', err);
      alert('Failed to start Stripe onboarding. Please try again.');
    }
    setStripeLoading(false);
  };

  const handleCardInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'expiryDate') {
      // Auto-format expiry date
      const cleaned = value.replace(/\D/g, '');
      if (cleaned.length <= 2) {
        setNewCard(prev => ({ ...prev, [name]: cleaned }));
      } else {
        const month = cleaned.slice(0, 2);
        const year = cleaned.slice(2, 4);
        setNewCard(prev => ({ ...prev, [name]: `${month}/${year}` }));
      }
    } else {
      setNewCard(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleAddCard = (e) => {
    e.preventDefault();
    const card = {
      ...newCard,
      id: Date.now().toString(),
      last4: newCard.cardNumber.slice(-4)
    };
    const updatedMethods = [...paymentMethods, card];
    setPaymentMethods(updatedMethods);
    localStorage.setItem('paymentMethods', JSON.stringify(updatedMethods));
    setNewCard({ cardNumber: '', expiryDate: '', cvv: '', holderName: '' });
    setShowAddCard(false);
  };

  const handleRemoveCard = (cardId) => {
    const updatedMethods = paymentMethods.filter(method => method.id !== cardId);
    setPaymentMethods(updatedMethods);
    localStorage.setItem('paymentMethods', JSON.stringify(updatedMethods));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          <p className="mt-2 text-gray-600">Manage your account settings and preferences</p>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {/* Payment Methods Section - Only visible for Premium users */}
          {userPlan === 'premium' && (
            <div className="bg-white shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg font-medium text-gray-900">Payment Methods</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Add and manage your payment methods to receive payments from brands
                </p>
                {/* Stripe Connect Section */}
                <div className="mt-6 border-b pb-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <span className="font-medium">Stripe Account</span>
                    </div>
                    <button
                      onClick={() => navigate('/checkout/brand')}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-black hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
                    >
                      Check Details
                    </button>
                  </div>
                </div>
                {/* Card Management */}
                <div className="mt-6">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-medium text-gray-900">Cards</h4>
                    <button
                      onClick={() => setShowAddCard(true)}
                      className="inline-flex items-center text-sm text-purple-600 hover:text-purple-800"
                    >
                      <FaPlusCircle className="mr-1" />
                      Add New Card
                    </button>
                  </div>

                  {/* Existing Cards */}
                  <div className="space-y-3">
                    {paymentMethods.map(card => (
                      <div key={card.id} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                        <div className="flex items-center">
                          <FaCreditCard className="text-gray-400" />
                          <span className="ml-2">•••• {card.last4}</span>
                          <span className="ml-2 text-sm text-gray-500">Expires {card.expiryDate}</span>
                        </div>
                        <button
                          onClick={() => handleRemoveCard(card.id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Add New Card Form */}
                  {showAddCard && (
                    <div className="mt-4 border-t pt-4">
                      <form onSubmit={handleAddCard} className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Cardholder Name
                          </label>
                          <input
                            type="text"
                            name="holderName"
                            value={newCard.holderName}
                            onChange={handleCardInputChange}
                            required
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Card Number
                          </label>
                          <input
                            type="text"
                            name="cardNumber"
                            value={newCard.cardNumber}
                            onChange={handleCardInputChange}
                            required
                            pattern="[0-9]{16}"
                            maxLength="16"
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700">
                              Expiry Date
                            </label>
                            <input
                              type="text"
                              name="expiryDate"
                              value={newCard.expiryDate}
                              onChange={handleCardInputChange}
                              required
                              placeholder="MM/YY"
                              maxLength="5"
                              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700">
                              CVV
                            </label>
                            <input
                              type="text"
                              name="cvv"
                              value={newCard.cvv}
                              onChange={handleCardInputChange}
                              required
                              pattern="[0-9]{3,4}"
                              maxLength="4"
                              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                            />
                          </div>
                        </div>
                        <div className="flex justify-end space-x-3">
                          <button
                            type="button"
                            onClick={() => setShowAddCard(false)}
                            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                          >
                            Add Card
                          </button>
                        </div>
                      </form>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Platform Management Section */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg font-medium text-gray-900">Platform Management</h3>
              <p className="mt-1 text-sm text-gray-500">
                Connect and manage your social media platforms
              </p>
              <div className="mt-5">
                <Link
                  to="/platform-settings"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Manage Platforms
                </Link>
              </div>
            </div>
          </div>

          {/* Account Settings Section */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg font-medium text-gray-900">Account Settings</h3>
              <p className="mt-1 text-sm text-gray-500">
                Manage your account information and preferences
              </p>
              <div className="mt-5 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email Notifications</label>
                  <div className="mt-2">
                    <label className="inline-flex items-center">
                      <input type="checkbox" className="form-checkbox h-4 w-4 text-blue-600" />
                      <span className="ml-2 text-sm text-gray-700">Receive email updates</span>
                    </label>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Two-Factor Authentication</label>
                  <div className="mt-2">
                    <label className="inline-flex items-center">
                      <input type="checkbox" className="form-checkbox h-4 w-4 text-blue-600" />
                      <span className="ml-2 text-sm text-gray-700">Enable 2FA</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Subscription Section */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg font-medium text-gray-900">Subscription</h3>
              <p className="mt-1 text-sm text-gray-500">
                Current plan: <span className="font-medium capitalize">{userPlan || 'Free'}</span>
              </p>
              <div className="mt-5">
                <Link
                  to="/paywall"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                >
                  Upgrade Plan
                </Link>
              </div>
            </div>
          </div>

          {/* Privacy Settings Section */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg font-medium text-gray-900">Privacy Settings</h3>
              <p className="mt-1 text-sm text-gray-500">
                Control your privacy and data sharing preferences
              </p>
              <div className="mt-5 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Profile Visibility</label>
                  <div className="mt-2">
                    <select className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md">
                      <option>Public</option>
                      <option>Private</option>
                      <option>Friends Only</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Data Collection</label>
                  <div className="mt-2">
                    <label className="inline-flex items-center">
                      <input type="checkbox" className="form-checkbox h-4 w-4 text-blue-600" />
                      <span className="ml-2 text-sm text-gray-700">Allow analytics data collection</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
export { faqData, FAQSection }; 