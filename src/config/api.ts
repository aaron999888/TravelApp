// API Configuration file - like defining constants in C
// This file contains all the API keys and configuration settings

// Google Places API Configuration
// You need to get this from Google Cloud Console:
// 1. Go to https://console.cloud.google.com/
// 2. Create a new project or select existing one
// 3. Enable the Places API
// 4. Create credentials (API Key)
// 5. Restrict the key to your app for security

export const GOOGLE_PLACES_API_KEY = 'AIzaSyB1CjKI-gI5vTc69YyhWkG7AN8SDKaoDC0';

// API Configuration object - like a configuration struct in C
export const API_CONFIG = {
  googlePlaces: {
    apiKey: GOOGLE_PLACES_API_KEY,
    baseUrl: 'https://maps.googleapis.com/maps/api/place',
    // Search radius in meters (5000m = 5km)
    defaultRadius: 5000,
    // Minimum rating for restaurants (4.0 = 4 stars and above)
    minRating: 4.0,
  },
  // Add other API configurations here as needed
  // For example: weather API, flight API, etc.
};

// Function to validate API key - like a validation function in C
export const validateApiKey = (): boolean => {
  return GOOGLE_PLACES_API_KEY.length > 0 && 
         !GOOGLE_PLACES_API_KEY.includes('YOUR_GOOGLE_PLACES_API_KEY');
};

// Function to get API key with validation - like a getter function in C
export const getGooglePlacesApiKey = (): string => {
  if (!validateApiKey()) {
    console.warn('Google Places API key not configured. Please update src/config/api.ts');
    return '';
  }
  return GOOGLE_PLACES_API_KEY;
};
