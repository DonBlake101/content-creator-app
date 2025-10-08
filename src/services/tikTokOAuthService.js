import { mockTikTokTokenExchange, mockTikTokProfile, mockTikTokStats, mockTikTokVideos } from './tikTokMockAPI';

// TikTok OAuth Configuration
const TIKTOK_CONFIG = {
  clientKey: 'aw422o4b2fjj3cri',
  redirectUri: 'https://donblake101.github.io/creatorflow-homepage/oauth/callback/',
  scopes: ['user.info.profile', 'user.info.stats', 'video.list'],
  authUrl: 'https://open.tiktok.com/platform/oauth/connect',
  tokenUrl: 'https://open.tiktokapis.com/v2/oauth/token/',
  apiBaseUrl: 'https://open.tiktokapis.com/v2'
};

// Generate TikTok OAuth URL
export const generateTikTokAuthUrl = () => {
  const authUrl =
    `${TIKTOK_CONFIG.authUrl}` +
    `?client_key=${TIKTOK_CONFIG.clientKey}` +
    `&redirect_uri=${encodeURIComponent(TIKTOK_CONFIG.redirectUri)}` +
    `&response_type=code` +
    `&scope=${TIKTOK_CONFIG.scopes.join(',')}`;
  return authUrl;
};

// Exchange authorization code for access token
export const exchangeCodeForToken = async (code) => {
  try {
    // For development, use mock API
    if (process.env.NODE_ENV === 'development') {
      const mockResponse = await mockTikTokTokenExchange(code);
      return mockResponse.access_token;
    }

    // For production, use real API
    const response = await fetch('/api/tiktok/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        code,
        redirect_uri: TIKTOK_CONFIG.redirectUri,
        client_key: TIKTOK_CONFIG.clientKey
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to exchange code for token');
    }

    const data = await response.json();
    return data.access_token;
  } catch (error) {
    console.error('Error exchanging code for token:', error);
    throw error;
  }
};

// Fetch TikTok user profile
export const fetchTikTokProfile = async (accessToken) => {
  try {
    // For development, return mock data
    if (process.env.NODE_ENV === 'development') {
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API delay
      return mockTikTokProfile;
    }

    // For production, use real API
    const response = await fetch(`${TIKTOK_CONFIG.apiBaseUrl}/user/info/`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch TikTok profile');
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error fetching TikTok profile:', error);
    throw error;
  }
};

// Fetch TikTok user stats
export const fetchTikTokStats = async (accessToken) => {
  try {
    // For development, return mock data
    if (process.env.NODE_ENV === 'development') {
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API delay
      return mockTikTokStats;
    }

    // For production, use real API
    const response = await fetch(`${TIKTOK_CONFIG.apiBaseUrl}/user/stats/`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch TikTok stats');
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error fetching TikTok stats:', error);
    throw error;
  }
};

// Fetch TikTok videos
export const fetchTikTokVideos = async (accessToken, maxCount = 20) => {
  try {
    // For development, return mock data
    if (process.env.NODE_ENV === 'development') {
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API delay
      return mockTikTokVideos;
    }

    // For production, use real API
    const response = await fetch(`${TIKTOK_CONFIG.apiBaseUrl}/video/list/?max_count=${maxCount}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch TikTok videos');
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error fetching TikTok videos:', error);
    throw error;
  }
};

// Fetch all TikTok data (profile, stats, videos)
export const fetchAllTikTokData = async (accessToken) => {
  try {
    const [profile, stats, videos] = await Promise.all([
      fetchTikTokProfile(accessToken),
      fetchTikTokStats(accessToken),
      fetchTikTokVideos(accessToken)
    ]);

    return {
      profile,
      stats,
      videos
    };
  } catch (error) {
    console.error('Error fetching all TikTok data:', error);
    throw error;
  }
}; 