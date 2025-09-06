# Firebase Setup Guide for Travel App Sharing

This guide will help you set up Firebase for the itinerary sharing feature in your Expo travel app.

## Prerequisites

- A Google account
- Node.js installed on your system
- Expo CLI installed (`npm install -g @expo/cli`)

## Step 1: Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project" or "Add project"
3. Enter project name: "TravelAppMobile" (or your preferred name)
4. Enable Google Analytics (optional)
5. Click "Create project"

## Step 2: Add Firebase to Your App

1. In the Firebase Console, click "Add app" and select the web icon (</>)
2. Register your app with nickname: "TravelAppMobile"
3. Copy the Firebase configuration object

## Step 3: Configure Firebase in Your App

1. Open `src/config/firebase.ts`
2. Replace the placeholder values with your actual Firebase config:

```typescript
const firebaseConfig = {
  apiKey: "your-actual-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-actual-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "your-actual-sender-id",
  appId: "your-actual-app-id"
};
```

## Step 4: Set Up Firestore Database

1. In Firebase Console, go to "Firestore Database"
2. Click "Create database"
3. Choose "Start in test mode" (for development)
4. Select a location for your database
5. Click "Done"

## Step 5: Set Up Authentication (Optional)

1. In Firebase Console, go to "Authentication"
2. Click "Get started"
3. Go to "Sign-in method" tab
4. Enable "Email/Password" provider
5. Add your test users if needed

## Step 6: Install Dependencies

Run the following command in your project directory:

```bash
npm install firebase @react-native-async-storage/async-storage
```

## Step 7: Test the Setup

1. Start your Expo development server:
   ```bash
   npm start
   ```

2. Open the app in Expo Go
3. Navigate to Trip Planner
4. Create a trip and try sharing it with a test email

## Security Rules (Production)

For production, update your Firestore security rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow users to read/write their own shared trips
    match /sharedTrips/{tripId} {
      allow read, write: if request.auth != null && 
        (resource.data.createdBy == request.auth.uid || 
         request.auth.uid in resource.data.sharedWith);
    }
    
    // Allow users to read/write their own sharing invitations
    match /sharingInvitations/{invitationId} {
      allow read, write: if request.auth != null && 
        (resource.data.fromUser == request.auth.uid || 
         resource.data.toUser == request.auth.uid);
    }
  }
}
```

## Troubleshooting

### Common Issues:

1. **Firebase not initialized**: Check that your config values are correct
2. **Permission denied**: Ensure Firestore rules allow your operations
3. **Network errors**: Check your internet connection and Firebase project status

### Testing Offline:

The app uses AsyncStorage for offline functionality, so shared trips will be cached locally and available even without internet connection.

## Features Included

- ✅ Share trips with spouse via email
- ✅ Real-time updates when trips are shared
- ✅ Offline support with local storage
- ✅ Display shared itineraries in both Trip Planner and Restaurant screens
- ✅ Expo Go compatible
- ✅ C-style comments for 1990s programmer understanding

## Next Steps

1. Customize the sharing UI to match your app's design
2. Add more sharing options (SMS, social media)
3. Implement push notifications for sharing invitations
4. Add trip collaboration features (comments, edits)

