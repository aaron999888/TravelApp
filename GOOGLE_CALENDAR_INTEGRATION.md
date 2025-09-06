# Google Calendar Integration for Travel App

## Overview
This document describes the Google Calendar integration implemented in the Travel App Mobile. The integration allows users to sync their travel itineraries and restaurant reservations directly to their Google Calendar.

## Features Implemented

### 1. Google OAuth Authentication
- **File**: `src/services/googleAuthService.ts`
- **Purpose**: Handles OAuth 2.0 authentication with Google Calendar API
- **Features**:
  - Secure token storage using AsyncStorage
  - Automatic token refresh
  - Persistent authentication across app sessions
  - Error handling and user feedback

### 2. Calendar Service
- **File**: `src/services/calendarService.ts`
- **Purpose**: Manages Google Calendar API interactions
- **Features**:
  - Create calendar events for trips
  - Create restaurant reservation events
  - Sync complete trip itineraries
  - Error handling and retry logic

### 3. Trip Planner Integration
- **File**: `src/screens/TripPlannerScreen.tsx`
- **Purpose**: Integrates calendar sync into trip planning
- **Features**:
  - Google Calendar connection status display
  - One-click trip sync to calendar
  - Authentication prompts
  - Visual feedback for sync status

### 4. Restaurant Screen Integration
- **File**: `src/screens/RestaurantScreen.tsx`
- **Purpose**: Allows syncing restaurant reservations to calendar
- **Features**:
  - Add restaurant to calendar button
  - Automatic date/time assignment
  - Trip context linking

## Technical Implementation

### Authentication Flow
1. User taps "Connect to Google Calendar"
2. OAuth flow opens in browser
3. User grants permissions
4. Authorization code exchanged for access/refresh tokens
5. Tokens stored securely for future use

### Calendar Event Creation
1. Trip data is formatted into Google Calendar event structure
2. Events created for:
   - Flight details (departure/arrival times)
   - Hotel reservations (check-in/check-out)
   - Destination visits
   - Trip summary
3. Events include emojis and detailed descriptions

### Error Handling
- Network connectivity checks
- Authentication status validation
- API error response parsing
- User-friendly error messages
- Retry mechanisms for failed requests

## Configuration

### Google OAuth Setup
1. **Google Cloud Console**:
   - Create/select project
   - Enable Google Calendar API
   - Create OAuth 2.0 credentials
   - Configure redirect URIs

2. **App Configuration**:
   - Update `src/config/googleOAuth.ts`
   - Replace placeholder Client ID
   - Set correct redirect URI

### Required Permissions
- `https://www.googleapis.com/auth/calendar`
- `https://www.googleapis.com/auth/calendar.events`

## Usage

### For Users
1. **Connect Calendar**:
   - Go to Trip Planner screen
   - Tap "Connect to Google Calendar"
   - Complete OAuth flow

2. **Sync Trip**:
   - Create a new trip
   - Tap "Sync to Calendar" when prompted
   - Trip events appear in Google Calendar

3. **Sync Restaurant**:
   - Browse restaurants
   - Tap "Add to Calendar" on any restaurant
   - Reservation event added to calendar

### For Developers
1. **Initialize Service**:
   ```typescript
   await calendarService.initialize();
   ```

2. **Check Authentication**:
   ```typescript
   const isAuthenticated = calendarService.isLoggedIn();
   ```

3. **Sync Trip**:
   ```typescript
   await calendarService.syncTripToCalendar(trip);
   ```

4. **Sync Restaurant**:
   ```typescript
   await calendarService.syncRestaurantToCalendar(
     restaurantName, date, time, address, tripTitle
   );
   ```

## Code Style
- Written for 1990s C programmer familiarity
- Procedural approach with clear function calls
- Extensive comments explaining each step
- Error handling at every level
- Consistent naming conventions

## Dependencies
- `expo-auth-session`: OAuth authentication
- `expo-crypto`: Cryptographic functions
- `expo-web-browser`: Browser integration
- `@react-native-async-storage/async-storage`: Token storage

## Security Considerations
- Tokens stored securely using AsyncStorage
- No sensitive data logged
- HTTPS required for all API calls
- Token refresh handled automatically
- User can revoke access anytime

## Testing
- Test authentication flow
- Verify event creation in Google Calendar
- Test error handling scenarios
- Validate token refresh mechanism
- Check offline behavior

## Troubleshooting

### Common Issues
1. **Authentication Fails**:
   - Check Google OAuth configuration
   - Verify redirect URI matches
   - Ensure Google Calendar API is enabled

2. **Events Not Created**:
   - Check internet connectivity
   - Verify authentication status
   - Check API quotas

3. **Token Refresh Issues**:
   - Clear stored tokens
   - Re-authenticate user
   - Check token expiry

### Debug Information
- Enable console logging for detailed error messages
- Check network requests in developer tools
- Verify token validity in Google OAuth playground

## Future Enhancements
- Batch event creation for better performance
- Event modification and deletion
- Calendar selection (multiple calendars)
- Recurring event support
- Time zone handling improvements
- Offline sync capabilities

## Support
For technical support or questions about the Google Calendar integration, refer to:
- Google Calendar API documentation
- Expo AuthSession documentation
- React Native AsyncStorage documentation
