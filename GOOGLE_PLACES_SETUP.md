# Google Places API Setup Guide

This guide will help you set up the Google Places API for the Restaurant Screen feature.

## Prerequisites
- A Google account
- Access to Google Cloud Console

## Step-by-Step Setup

### 1. Create a Google Cloud Project
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click "Select a project" at the top
3. Click "New Project"
4. Enter project name: "Travel App Mobile"
5. Click "Create"

### 2. Enable the Places API
1. In the Google Cloud Console, go to "APIs & Services" > "Library"
2. Search for "Places API"
3. Click on "Places API"
4. Click "Enable"

### 3. Create API Credentials
1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "API Key"
3. Copy the generated API key

### 4. Configure the API Key in Your App
1. Open `src/config/api.ts`
2. Replace `YOUR_GOOGLE_PLACES_API_KEY` with your actual API key:

```typescript
export const GOOGLE_PLACES_API_KEY = 'your-actual-api-key-here';
```

### 5. Secure Your API Key (Recommended)
1. In Google Cloud Console, go to "APIs & Services" > "Credentials"
2. Click on your API key
3. Under "Application restrictions", select "Android apps" or "iOS apps"
4. Add your app's package name and SHA-1 fingerprint
5. Under "API restrictions", select "Restrict key" and choose "Places API"

### 6. Test the Integration
1. Run your app: `npx expo start`
2. Navigate to Trip Planner
3. Tap "Find Nearby Restaurants"
4. Grant location permission when prompted
5. You should see nearby restaurants with ratings ≥ 4.0

## Troubleshooting

### Common Issues

**"API key not configured" warning**
- Make sure you've updated the API key in `src/config/api.ts`
- Restart your development server after making changes

**"Failed to fetch restaurants" error**
- Check your internet connection
- Verify the API key is correct
- Ensure the Places API is enabled in Google Cloud Console

**No restaurants found**
- Check if location permission is granted
- Try moving to a different location
- Verify you're in an area with restaurants

**Location permission denied**
- Go to your device settings
- Find the Travel App
- Enable location permissions

## API Usage and Billing

- The Places API has a free tier with limited requests
- Monitor your usage in Google Cloud Console
- Set up billing alerts to avoid unexpected charges
- Consider implementing caching to reduce API calls

## Security Best Practices

1. **Never commit API keys to version control**
2. **Use environment variables in production**
3. **Restrict API keys to specific apps/IPs**
4. **Regularly rotate API keys**
5. **Monitor API usage for unusual activity**

## Support

If you encounter issues:
1. Check the [Google Places API documentation](https://developers.google.com/maps/documentation/places/web-service)
2. Review the [Expo Location documentation](https://docs.expo.dev/versions/latest/sdk/location/)
3. Check the app logs for detailed error messages

