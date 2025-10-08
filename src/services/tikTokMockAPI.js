// Mock API service for TikTok OAuth token exchange
// In a real application, this would be handled by your backend server

export const mockTikTokTokenExchange = async (code) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Simulate successful token exchange
  return {
    access_token: 'mock_tiktok_access_token_' + Math.random().toString(36).substring(7),
    refresh_token: 'mock_tiktok_refresh_token_' + Math.random().toString(36).substring(7),
    expires_in: 3600,
    token_type: 'Bearer'
  };
};

// Mock TikTok API responses
export const mockTikTokProfile = {
  display_name: "TikTok Creator",
  username: "tiktokcreator",
  profile_picture_url: "https://via.placeholder.com/150",
  bio: "Creating amazing content on TikTok!",
  verified: true,
  private_account: false
};

export const mockTikTokStats = {
  follower_count: 125000,
  following_count: 850,
  heart_count: 2500000,
  video_count: 45,
  like_count: 1800000,
  comment_count: 125000
};

export const mockTikTokVideos = [
  {
    id: "video1",
    title: "Amazing Dance Challenge #1",
    description: "Check out this viral dance!",
    play_count: 1500000,
    heart_count: 125000,
    comment_count: 8500,
    share_count: 12000,
    created_time: "2024-01-15T10:30:00Z"
  },
  {
    id: "video2", 
    title: "Cooking Tutorial - Quick Pasta",
    description: "Learn to make this delicious pasta in 5 minutes!",
    play_count: 850000,
    heart_count: 75000,
    comment_count: 4200,
    share_count: 6800,
    created_time: "2024-01-12T14:20:00Z"
  },
  {
    id: "video3",
    title: "Comedy Skit - Office Life",
    description: "Relatable office moments 😂",
    play_count: 2200000,
    heart_count: 180000,
    comment_count: 12000,
    share_count: 25000,
    created_time: "2024-01-10T09:15:00Z"
  }
]; 