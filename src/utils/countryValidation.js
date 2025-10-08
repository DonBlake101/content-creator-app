const eligibleCountries = {
  tiktok: [
    'United States', 'United Kingdom', 'Germany', 'France', 'Brazil', 'Japan', 'South Korea'
  ],
  snapchat: [
    'Algeria', 'Argentina', 'Australia', 'Austria', 'Bahrain', 'Belgium', 'Brazil',
    'Canada', 'Colombia', 'Denmark', 'Egypt', 'Finland', 'France', 'Germany',
    'India', 'Indonesia', 'Ireland', 'Italy', 'Japan', 'Jordan', 'South Korea',
    'Kuwait', 'Libya', 'Malaysia', 'Mexico', 'Morocco', 'Netherlands', 'New Zealand',
    'Nigeria', 'Norway', 'Oman', 'Pakistan', 'Palestine', 'Philippines', 'Poland',
    'Qatar', 'Saudi Arabia', 'Singapore', 'Spain', 'Sweden', 'United Arab Emirates',
    'United Kingdom', 'United States'
  ],
  youtube: [
    'Algeria', 'Argentina', 'Australia', 'Austria', 'Bahrain', 'Belgium', 'Brazil',
    'Canada', 'Colombia', 'Denmark', 'Egypt', 'Finland', 'France', 'Germany',
    'India', 'Indonesia', 'Ireland', 'Italy', 'Japan', 'Jordan', 'South Korea',
    'Kuwait', 'Libya', 'Malaysia', 'Mexico', 'Morocco', 'Netherlands', 'New Zealand',
    'Nigeria', 'Norway', 'Oman', 'Pakistan', 'Palestine', 'Philippines', 'Poland',
    'Qatar', 'Saudi Arabia', 'Singapore', 'Spain', 'Sweden', 'United Arab Emirates',
    'United Kingdom', 'United States'
  ],
  instagram: [
    'Albania', 'Argentina', 'Australia', 'Austria', 'Bahrain', 'Bangladesh', 'Belgium',
    'Brazil', 'Canada', 'Chile', 'Colombia', 'Costa Rica', 'Cyprus', 'Denmark',
    'Dominican Republic', 'Egypt', 'El Salvador', 'Finland', 'France', 'Germany',
    'Greece', 'Guatemala', 'Honduras', 'India', 'Indonesia', 'Ireland', 'Israel',
    'Italy', 'Jamaica', 'Japan', 'Kenya', 'Latvia', 'Lebanon', 'Luxembourg',
    'Malaysia', 'Mexico', 'Morocco', 'New Zealand', 'Nicaragua', 'Norway', 'Panama',
    'Peru', 'Philippines', 'Poland', 'Portugal', 'Puerto Rico', 'Qatar', 'Romania',
    'Saudi Arabia', 'Singapore', 'South Africa', 'Spain', 'Sweden', 'Switzerland',
    'Thailand', 'United Arab Emirates', 'United Kingdom', 'United States'
  ]
};

export const isCountryEligible = (country, platform) => {
  if (!country) return false;
  return eligibleCountries[platform]?.includes(country) || false;
}; 