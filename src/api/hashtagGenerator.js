// Mock function for getting hashtags
export async function getHashtags(platform, contentType) {
  const keyword = `${platform} ${contentType}`;
  const url = `https://hashtagy-generate-hashtags.p.rapidapi.com/v1/related_hashtags?keyword=${encodeURIComponent(keyword)}`;

  const options = {
    method: 'GET',
    headers: {
      'x-rapidapi-host': 'hashtagy-generate-hashtags.p.rapidapi.com',
      'x-rapidapi-key': '9936051130msh6beda071b696039p12c451jsneb0a6a6faff'
    }
  };

  try {
    const response = await fetch(url, options);
    const data = await response.json();
    return data.hashtags || [];
  } catch (error) {
    console.error('Hashtag Generator API error:', error);
    return [];
  }
} 