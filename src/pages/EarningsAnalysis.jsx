import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { useNavigate, useLocation } from 'react-router-dom';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const EarningsAnalysis = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [timeRange, setTimeRange] = useState('week');
  const [selectedPlatform, setSelectedPlatform] = useState('all');
  const [earningsData, setEarningsData] = useState({
    totalRevenue: 0,
    platformBreakdown: {},
    revenueHistory: []
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isPremium, setIsPremium] = useState(false);
  const [isCreatorDashboard, setIsCreatorDashboard] = useState(false);
  const [rpm, setRpm] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);

  useEffect(() => {
    const userPlan = localStorage.getItem('userPlan');
    const currentPath = location.pathname;
    setIsPremium(userPlan === 'premium');
    setIsCreatorDashboard(currentPath === '/creator-dashboard');
  }, [location.pathname]);

  const platforms = [
    { id: 'all', name: 'All Platforms', icon: '📊', color: '#8B5CF6' },
    { id: 'youtube', name: 'YouTube', icon: '🎥', color: '#FF0000' },
    { id: 'tiktok', name: 'TikTok', icon: '🎵', color: '#000000' },
    { id: 'facebook', name: 'Facebook', icon: '👥', color: '#1877F2' },
    { id: 'snapchat', name: 'Snapchat', icon: '👻', color: '#FFFC00' }
  ];

  const timeRanges = [
    { id: 'week', name: 'Last 7 Days' },
    { id: 'month', name: 'Last 30 Days' },
    { id: 'year', name: 'Last 12 Months' }
  ];

  const handleUpgradeClick = () => {
    navigate('/paywall', { 
      state: { 
        from: 'earnings-analysis',
        selectedPlan: 'premium'
      } 
    });
  };

  useEffect(() => {
    const fetchEarningsData = async () => {
      setIsLoading(true);
      try {
        const rpmSettings = JSON.parse(localStorage.getItem('rpmSettings')) || {
          youtube: { revenue: 5, views: 1000 },
          tiktok: { revenue: 3, views: 1000 },
          facebook: { revenue: 4, views: 1000 },
          snapchat: { revenue: 2, views: 1000 }
        };

        const calculateRevenue = (views, platform) => {
          const settings = rpmSettings[platform] || rpmSettings.youtube;
          return (views * settings.revenue) / settings.views;
        };

        const viewsData = {
          youtube: 150000,
          tiktok: 100000,
          facebook: 80000,
          snapchat: 50000
        };

        const platformBreakdown = {
          youtube: {
            revenue: calculateRevenue(viewsData.youtube, 'youtube'),
            percentage: 60
          },
          tiktok: {
            revenue: calculateRevenue(viewsData.tiktok, 'tiktok'),
            percentage: 20
          },
          facebook: {
            revenue: calculateRevenue(viewsData.facebook, 'facebook'),
            percentage: 12
          },
          snapchat: {
            revenue: calculateRevenue(viewsData.snapchat, 'snapchat'),
            percentage: 8
          }
        };

        // Calculate revenue based on selected platform
        const totalRevenue = selectedPlatform === 'all' 
          ? Object.values(platformBreakdown).reduce((sum, platform) => sum + platform.revenue, 0)
          : platformBreakdown[selectedPlatform]?.revenue || 0;

        // Generate dates in chronological order
        const today = new Date();
        const revenueHistory = [];
        const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
        
        let numberOfPoints;
        if (timeRange === 'week') {
          numberOfPoints = 7;
        } else if (timeRange === 'month') {
          numberOfPoints = 15;
        } else {
          numberOfPoints = 12;
        }

        for (let i = numberOfPoints - 1; i >= 0; i--) {
          const date = new Date(today);
          
          if (timeRange === 'week') {
            date.setDate(date.getDate() - i);
          } else if (timeRange === 'month') {
            date.setDate(date.getDate() - (i * 2));
          } else {
            date.setMonth(date.getMonth() - i);
          }
          
          let formattedDate;
          if (timeRange === 'week') {
            formattedDate = days[date.getDay() === 0 ? 6 : date.getDay() - 1];
          } else if (timeRange === 'month') {
            formattedDate = date.toLocaleDateString('en-GB', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric'
            });
          } else {
            formattedDate = date.toLocaleDateString('en-GB', {
              month: 'short',
              year: 'numeric'
            });
          }

          const baseRevenue = totalRevenue * (0.8 + (i * 0.03));
          const randomVariation = baseRevenue * 0.1 * (Math.random() - 0.5);
          const revenue = baseRevenue + randomVariation;

          revenueHistory.push({
            date: formattedDate,
            revenue: revenue
          });
        }

        setEarningsData({
          totalRevenue,
          platformBreakdown,
          revenueHistory
        });

        // Calculate RPM based on the selected platform's RPM settings
        const selectedPlatformRpm = selectedPlatform === 'all' 
          ? Object.values(rpmSettings).reduce((sum, settings) => sum + settings.revenue, 0) / Object.keys(rpmSettings).length
          : rpmSettings[selectedPlatform]?.revenue || 0;
        
        setRpm(selectedPlatformRpm);
        setTotalRevenue(revenueHistory.reduce((sum, data) => sum + data.revenue, 0));

        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching earnings data:', error);
        setIsLoading(false);
      }
    };

    fetchEarningsData();
  }, [timeRange, selectedPlatform]);

  const getSelectedPlatformColor = () => {
    return platforms.find(p => p.id === selectedPlatform)?.color || '#8B5CF6';
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: 'white',
        bodyColor: 'white',
        padding: 12,
        cornerRadius: 8,
        displayColors: false,
        callbacks: {
          label: function(context) {
            return `$${context.parsed.y.toLocaleString()}`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
        ticks: {
          color: '#6B7280',
        },
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: '#6B7280',
        },
      },
    },
  };

  const chartData = {
    labels: earningsData.revenueHistory.map(item => item.date),
    datasets: [
      {
        data: earningsData.revenueHistory.map(item => item.revenue),
        borderColor: getSelectedPlatformColor(),
        backgroundColor: `${getSelectedPlatformColor()}1A`,
        borderWidth: 2,
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const shouldBlurData = () => {
    return !isCreatorDashboard && selectedPlatform !== 'all';
  };

  // Back navigation logic
  const handleBack = () => {
    const userPlan = localStorage.getItem('userPlan');
    if (userPlan === 'basic') {
      navigate('/basic-dashboard');
    } else if (userPlan === 'premium') {
      navigate('/creator-dashboard');
    } else {
      navigate('/');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Top Navigation Bar */}
        <div className="bg-white border-b border-gray-200 mb-8">
          <div className="flex items-center h-16">
            <button 
              onClick={handleBack} 
              className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
              aria-label="Go back"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </button>
            <h1 className="ml-4 text-xl font-semibold text-gray-900">Earnings Analysis</h1>
          </div>
        </div>
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Earnings Analysis</h1>
          <p className="mt-2 text-gray-600">Track your revenue and performance across platforms</p>
        </div>

        {/* Time Range Selector */}
        <div className="mb-6">
          <div className="flex space-x-4">
            {timeRanges.map((range) => (
              <button
                key={range.id}
                onClick={() => setTimeRange(range.id)}
                className={`px-4 py-2 rounded-lg ${
                  timeRange === range.id
                    ? 'bg-purple-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                {range.name}
              </button>
            ))}
          </div>
        </div>

        {/* Platform Selector */}
        <div className="mb-6">
          <div className="flex flex-wrap gap-4">
            {platforms.map((platform) => (
              <button
                key={platform.id}
                onClick={() => setSelectedPlatform(platform.id)}
                className={`px-4 py-2 rounded-lg flex items-center space-x-2 ${
                  selectedPlatform === platform.id
                    ? 'bg-purple-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
                style={{
                  borderColor: platform.color,
                  borderWidth: selectedPlatform === platform.id ? '2px' : '1px'
                }}
              >
                <span>{platform.icon}</span>
                <span>{platform.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-medium text-gray-900">Total Revenue</h3>
            <p className="mt-2 text-3xl font-bold text-purple-600">
              ${earningsData.totalRevenue.toLocaleString()}
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-medium text-gray-900">RPM</h3>
            <p className="mt-2 text-3xl font-bold text-purple-600">
              ${rpm.toFixed(2)}
            </p>
          </div>
        </div>

        {/* Chart */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="h-96">
            <Line
              data={{
                labels: earningsData.revenueHistory.map(item => item.date),
                datasets: [
                  {
                    label: 'Revenue',
                    data: earningsData.revenueHistory.map(item => item.revenue),
                    borderColor: getSelectedPlatformColor(),
                    backgroundColor: 'rgba(139, 92, 246, 0.1)',
                    tension: 0.4,
                    fill: true
                  }
                ]
              }}
              options={chartOptions}
            />
          </div>
        </div>

        {/* Platform Breakdown */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Platform Breakdown</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Object.entries(earningsData.platformBreakdown).map(([platform, data]) => (
              <div key={platform} className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium text-gray-900 capitalize">{platform}</h3>
                  <span className="text-sm text-gray-500">{data.percentage}%</span>
                </div>
                <p className="mt-2 text-2xl font-bold text-purple-600">
                  ${data.revenue.toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EarningsAnalysis; 