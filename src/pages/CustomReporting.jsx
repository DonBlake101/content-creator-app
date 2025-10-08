import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Line, Bar } from 'react-chartjs-2';
import { useNavigate } from 'react-router-dom';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const CustomReporting = ({ onClose }) => {
  const navigate = useNavigate();
  const [reportName, setReportName] = useState('');
  const [dateRange, setDateRange] = useState('7days');
  const [selectedPlatforms, setSelectedPlatforms] = useState(['youtube', 'tiktok', 'facebook', 'snapchat']);
  const [selectedMetrics, setSelectedMetrics] = useState({
    views: true,
    engagement: true,
    revenue: true,
    followerGrowth: true,
    adRevenue: true,
    ctr: true,
    watchTime: true
  });
  const [reportData, setReportData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [exportFormat, setExportFormat] = useState('pdf');
  const [shareLink, setShareLink] = useState('');

  const platforms = [
    { id: 'youtube', name: 'YouTube', icon: '🎥', color: '#FF0000' },
    { id: 'tiktok', name: 'TikTok', icon: '🎵', color: '#00F2EA' },
    { id: 'facebook', name: 'Facebook', icon: '👥', color: '#1877F2' },
    { id: 'snapchat', name: 'Snapchat', icon: '👻', color: '#FFFC00' }
  ];

  const metrics = [
    { id: 'views', name: 'Views', description: 'Total video views across platforms' },
    { id: 'engagement', name: 'Engagement Rate', description: 'Likes, comments, and shares' },
    { id: 'revenue', name: 'Revenue', description: 'Total earnings from all sources' },
    { id: 'followerGrowth', name: 'Follower Growth', description: 'New followers gained' },
    { id: 'adRevenue', name: 'Ad Revenue Breakdown', description: 'Detailed ad revenue by platform' },
    { id: 'ctr', name: 'Click-Through Rate', description: 'Percentage of viewers who click' },
    { id: 'watchTime', name: 'Watch Time', description: 'Total time spent watching content' }
  ];

  useEffect(() => {
    fetchReportData();
  }, [dateRange, selectedPlatforms, selectedMetrics]);

  const fetchReportData = async () => {
    setIsLoading(true);
    try {
      // Mock API call - Replace with real API endpoint
      const mockData = {
        platforms: selectedPlatforms.reduce((acc, platform) => {
          acc[platform] = {
            views: Math.floor(Math.random() * 100000) + 50000,
            engagement: (Math.random() * 10).toFixed(2),
            revenue: Math.floor(Math.random() * 5000) + 1000,
            followerGrowth: Math.floor(Math.random() * 1000) + 500,
            adRevenue: Math.floor(Math.random() * 3000) + 500,
            ctr: (Math.random() * 5).toFixed(2),
            watchTime: Math.floor(Math.random() * 50000) + 25000
          };
          return acc;
        }, {}),
        history: Array.from({ length: 7 }, (_, i) => {
          const date = new Date();
          date.setDate(date.getDate() - i);
          return {
            date: date.toLocaleDateString(),
            data: selectedPlatforms.reduce((acc, platform) => {
              acc[platform] = {
                views: Math.floor(Math.random() * 10000) + 5000,
                engagement: (Math.random() * 10).toFixed(2),
                revenue: Math.floor(Math.random() * 500) + 100,
                followerGrowth: Math.floor(Math.random() * 100) + 50,
                adRevenue: Math.floor(Math.random() * 300) + 50,
                ctr: (Math.random() * 5).toFixed(2),
                watchTime: Math.floor(Math.random() * 5000) + 2500
              };
              return acc;
            }, {})
          };
        }).reverse()
      };
      
      setReportData(mockData);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching report data:', error);
      setIsLoading(false);
    }
  };

  const handleExport = async (format) => {
    setExportFormat(format);
    // Mock API call - Replace with real API endpoint
    await new Promise(resolve => setTimeout(resolve, 1000));
    const link = `https://example.com/reports/${reportName || 'custom-report'}.${format}`;
    setShareLink(link);
  };

  const handleShare = async () => {
    // Mock API call - Replace with real API endpoint
    await new Promise(resolve => setTimeout(resolve, 1000));
    const link = `https://example.com/share/${reportName || 'custom-report'}`;
    setShareLink(link);
  };

  const handleBack = () => {
    if (onClose) {
      onClose();
    } else {
      navigate(-1);
    }
  };

  const renderChart = (metric) => {
    if (!reportData) return null;

    const data = {
      labels: reportData.history.map(item => item.date),
      datasets: selectedPlatforms.map(platform => ({
        label: platforms.find(p => p.id === platform)?.name || platform,
        data: reportData.history.map(item => item.data[platform][metric]),
        borderColor: platforms.find(p => p.id === platform)?.color || '#8B5CF6',
        backgroundColor: `${platforms.find(p => p.id === platform)?.color}20` || 'rgba(139, 92, 246, 0.1)',
        tension: 0.4,
        fill: true
      }))
    };

    const options = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'top',
        },
        tooltip: {
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          titleColor: 'white',
          bodyColor: 'white',
          padding: 12,
          cornerRadius: 8,
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

    return <Line data={data} options={options} />;
  };

  // Helper to download the report preview as PDF
  const handleDownloadPDF = async () => {
    const reportElement = document.getElementById('report-preview-section');
    if (!reportElement) return;
    const canvas = await html2canvas(reportElement, { scale: 2 });
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({ orientation: 'portrait', unit: 'pt', format: 'a4' });
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    // Calculate image dimensions to fit A4
    const imgWidth = pageWidth - 40;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    pdf.addImage(imgData, 'PNG', 20, 20, imgWidth, imgHeight, undefined, 'FAST');
    pdf.save(`${reportName || 'custom-report'}.pdf`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Top Navigation Bar */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center">
                <button 
                  onClick={handleBack} 
                  className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
                  aria-label="Go back"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                </button>
                <h1 className="ml-4 text-xl font-semibold text-gray-900">Custom Reporting Dashboard</h1>
              </div>
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <button
                    onClick={handleDownloadPDF}
                    className="px-4 py-2 bg-white text-gray-700 rounded-lg hover:bg-gray-50 flex items-center"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Download PDF
                  </button>
                </div>
                <div className="relative">
                  <button
                    onClick={() => {
                      window.print();
                    }}
                    className="px-4 py-2 bg-white text-gray-700 rounded-lg hover:bg-gray-50 flex items-center"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 9v12h12V9M6 9V7a2 2 0 012-2h4a2 2 0 012 2v2m-8 0h8" />
                    </svg>
                    Print
                  </button>
                </div>
                <div className="relative">
                  <button
                    onClick={async () => {
                      await handleShare();
                      if (navigator.share) {
                        navigator.share({
                          title: 'Custom Report',
                          text: 'Check out my custom report!',
                          url: shareLink
                        });
                      }
                    }}
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                    </svg>
                    Share Report
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="mt-8">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Create Custom Report</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Report Settings */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Report Name</label>
                  <input
                    type="text"
                    value={reportName}
                    onChange={(e) => setReportName(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                    placeholder="Enter report name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date Range</label>
                  <select
                    value={dateRange}
                    onChange={(e) => setDateRange(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                  >
                    <option value="7days">Last 7 days</option>
                    <option value="30days">Last 30 days</option>
                    <option value="90days">Last 90 days</option>
                    <option value="custom">Custom range</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Platforms</label>
                  <div className="grid grid-cols-2 gap-2">
                    {platforms.map(platform => (
                      <label key={platform.id} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={selectedPlatforms.includes(platform.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedPlatforms([...selectedPlatforms, platform.id]);
                            } else {
                              setSelectedPlatforms(selectedPlatforms.filter(p => p !== platform.id));
                            }
                          }}
                          className="rounded text-purple-600 focus:ring-purple-600"
                        />
                        <span className="text-sm text-gray-700">{platform.name}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Metrics</label>
                  <div className="space-y-2">
                    {metrics.map(metric => (
                      <label key={metric.id} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={selectedMetrics[metric.id]}
                          onChange={(e) => {
                            setSelectedMetrics({
                              ...selectedMetrics,
                              [metric.id]: e.target.checked
                            });
                          }}
                          className="rounded text-purple-600 focus:ring-purple-600"
                        />
                        <div className="ml-2">
                          <span className="text-sm text-gray-700">{metric.name}</span>
                          <p className="text-xs text-gray-500">{metric.description}</p>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {/* Report Preview */}
              <div id="report-preview-section" className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Report Preview</h3>
                <div className="space-y-4">
                  {isLoading ? (
                    <div className="h-48 bg-white rounded-lg shadow-sm flex items-center justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
                    </div>
                  ) : reportData ? (
                    <div className="space-y-6">
                      {Object.entries(selectedMetrics).map(([metric, isSelected]) => {
                        if (!isSelected) return null;
                        const metricInfo = metrics.find(m => m.id === metric);
                        return (
                          <div key={metric} className="bg-white rounded-lg shadow-sm p-4">
                            <h4 className="text-sm font-medium text-gray-900 mb-2">{metricInfo.name}</h4>
                            <div className="h-48">
                              {renderChart(metric)}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="h-48 bg-white rounded-lg shadow-sm flex items-center justify-center">
                      <span className="text-gray-500">Select metrics to generate report</span>
                    </div>
                  )}
                  {shareLink && (
                    <div className="mt-4 p-4 bg-green-50 rounded-lg">
                      <p className="text-sm text-green-800">
                        PDF report generated successfully!
                      </p>
                      <div className="mt-2 flex items-center space-x-2">
                        <input
                          type="text"
                          value={shareLink}
                          readOnly
                          className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg bg-white"
                        />
                        <button
                          onClick={() => navigator.clipboard.writeText(shareLink)}
                          className="px-3 py-2 text-sm text-purple-600 hover:text-purple-700"
                        >
                          Copy
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomReporting; 