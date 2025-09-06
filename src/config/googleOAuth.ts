// Google OAuth Configuration
// This file contains Google OAuth credentials and configuration
// Written for 1990s C programmer - uses constants like #define in C

// Google OAuth Client ID - like a #define constant in C
// Replace with your actual Google OAuth Client ID from Google Cloud Console
export const GOOGLE_CLIENT_ID = '955410291725-1p0pibv3tlkobctg695evref58ncv8of.apps.googleusercontent.com';

// Google OAuth Redirect URI - like a #define constant in C
// This should match the redirect URI configured in Google Cloud Console
export const GOOGLE_REDIRECT_URI = 'https://auth.expo.io/@aaron999888/TravelAppMobile';

// Google Calendar API Scopes - like permission flags in C
export const GOOGLE_SCOPES = [
  'https://www.googleapis.com/auth/calendar',
  'https://www.googleapis.com/auth/calendar.events',
];

// Google Calendar API Base URL - like a #define constant in C
export const GOOGLE_CALENDAR_API_BASE = 'https://www.googleapis.com/calendar/v3';

// Calendar ID to use - like a #define constant in C
export const CALENDAR_ID = 'primary';

// OAuth Configuration Object - like a struct in C
export const GOOGLE_OAUTH_CONFIG = {
  clientId: GOOGLE_CLIENT_ID,
  redirectUri: GOOGLE_REDIRECT_URI,
  scopes: GOOGLE_SCOPES,
  calendarApiBase: GOOGLE_CALENDAR_API_BASE,
  calendarId: CALENDAR_ID,
};

// Instructions for setting up Google OAuth - like comments in C
/*
SETUP INSTRUCTIONS FOR GOOGLE OAUTH:

1. Go to Google Cloud Console (https://console.cloud.google.com/)
2. Create a new project or select existing project
3. Enable Google Calendar API
4. Go to Credentials > Create Credentials > OAuth 2.0 Client IDs
5. Set Application type to "Web application"
6. Add authorized redirect URIs:
   - For development: https://auth.expo.io/@your-expo-username/your-app-slug
   - For production: your-app-scheme://oauth
7. Copy the Client ID and replace GOOGLE_CLIENT_ID above
8. Update GOOGLE_REDIRECT_URI with your actual redirect URI

For Expo development:
- Use your Expo username and app slug in the redirect URI
- The redirect URI format is: https://auth.expo.io/@username/slug

For production builds:
- Use your app's custom scheme as redirect URI
- Example: mytravelapp://oauth
*/
