// Mock function for getting AI-generated keyword suggestions
export const getAIKeywordSuggestions = async (platform, contentType) => {
  // Mock data for demonstration
  return [
    {
      keyword: `AI-powered ${platform} ${contentType}`,
      relevance: 95,
      difficulty: 'Medium'
    },
    {
      keyword: `${platform} ${contentType} automation`,
      relevance: 90,
      difficulty: 'Hard'
    },
    {
      keyword: `smart ${platform} ${contentType} tools`,
      relevance: 85,
      difficulty: 'Easy'
    }
  ];
}; 