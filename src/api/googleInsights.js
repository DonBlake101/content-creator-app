// Mock function for getting trending content ideas from Google
export async function getTrendingContentIdeas(platform, contentType) {
  const keyword = `${platform} ${contentType}`;
  const url = `https://google-keyword-insight1.p.rapidapi.com/globalkey?keyword=${encodeURIComponent(keyword)}&lang=en`;

  const options = {
    method: 'GET',
    headers: {
      'x-rapidapi-host': 'google-keyword-insight1.p.rapidapi.com',
      'x-rapidapi-key': '9936051130msh6beda071b696039p12c451jsneb0a6a6faff'
    }
  };

  try {
    const response = await fetch(url, options);
    const data = await response.json();

    // ✅ Direct array — slice top 10
    return Array.isArray(data) ? data.slice(0, 10) : [];
  } catch (error) {
    console.error('Error fetching Google Keyword Ideas:', error);
    return [];
  }
} 