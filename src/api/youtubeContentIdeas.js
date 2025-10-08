// Mock function for getting YouTube content ideas
export async function getYoutubeContentIdeas(contentType) {
  const theme = encodeURIComponent(contentType);
  const url = `https://youtube-video-idea-generator-smart-relevant-viral.p.rapidapi.com/generate_video_ideas?language=English&theme=${theme}`;

  const options = {
    method: 'GET',
    headers: {
      'x-rapidapi-host': 'youtube-video-idea-generator-smart-relevant-viral.p.rapidapi.com',
      'x-rapidapi-key': '9936051130msh6beda071b696039p12c451jsneb0a6a6faff'
    }
  };

  try {
    const response = await fetch(url, options);
    const data = await response.json();
    return data.ideas || [];
  } catch (error) {
    console.error('YouTube Content Idea API error:', error);
    return [];
  }
} 