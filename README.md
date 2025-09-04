# Travel App - React Native

A beautiful and modern mobile travel application built with React Native and Expo, featuring destination discovery, trip planning, and user profiles.

## Features

### 🏠 Home Screen
- Welcome dashboard with personalized greeting
- Quick action buttons for trip planning and exploration
- Recent trips overview with status indicators
- Popular destinations carousel

### 🗺️ Destinations
- Browse and search destinations by category
- Filter by type (Beach, Mountain, City, Nature, Historical)
- Detailed destination information with ratings
- Beautiful image galleries

### 📅 Enhanced Trip Planner
- **Budget Planning**: Set and track trip budgets
- **Flight & Hotel Search**: Real-time search with mock data
- **Loyalty Program Integration**: 
  - Delta Diamond perks (free upgrades, priority boarding, lounge access)
  - Hilton Honors benefits (room upgrades, late checkout, owner pricing)
- **Google Calendar Sync**: Automatically add trip events to calendar
- **Shared Access**: Collaborate with spouse on trip planning
- **Error Handling**: Comprehensive error management with user-friendly messages

### 🛫 Booking Results
- **Flight Search Results**: Display flights with loyalty perks
- **Hotel Search Results**: Show hotels with member benefits
- **Price Comparison**: Compare options within budget
- **Selection Interface**: Choose flights and hotels
- **Calendar Integration**: Sync selected bookings to Google Calendar

### 👥 Sharing & Collaboration
- **Spouse Access**: Share trips with family members
- **Permission Management**: Control view/edit access
- **Real-time Collaboration**: Multiple users can edit same itinerary
- **User Management**: Add/remove collaborators

### 👤 Profile
- User profile management
- Travel statistics and achievements
- Loyalty program memberships display
- Settings and preferences
- Help and support options

### 📱 Navigation
- Bottom tab navigation for main sections
- Stack navigation for detailed views
- Smooth transitions and animations
- Intuitive user experience

## Tech Stack

- **React Native** - Cross-platform mobile development
- **Expo** - Development platform and tools
- **TypeScript** - Type-safe JavaScript
- **React Navigation** - Navigation library
- **Expo Vector Icons** - Icon library
- **React Native Screens** - Native screen optimization

## Project Structure

```
src/
├── components/          # Reusable UI components
│   └── SharingComponent.tsx  # Trip sharing functionality
├── navigation/          # Navigation configuration
│   └── AppNavigator.tsx # Main navigation setup
├── screens/            # Screen components
│   ├── HomeScreen.tsx
│   ├── DestinationsScreen.tsx
│   ├── TripPlannerScreen.tsx
│   ├── BookingResultsScreen.tsx  # Flight & hotel results
│   ├── ProfileScreen.tsx
│   ├── DestinationDetailScreen.tsx
│   └── TripDetailScreen.tsx
├── services/           # Business logic and API services
│   ├── bookingService.ts      # Flight & hotel search
│   ├── calendarService.ts     # Google Calendar integration
│   └── sharingService.ts      # Trip sharing functionality
└── types/              # TypeScript type definitions
    └── index.ts
```

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Expo CLI
- iOS Simulator (for iOS development)
- Android Studio (for Android development)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd TravelAppMobile
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npx expo start
```

4. Run on your preferred platform:
   - Press `i` for iOS simulator
   - Press `a` for Android emulator
   - Scan QR code with Expo Go app on your device

## Available Scripts

- `npm start` - Start the Expo development server
- `npm run android` - Run on Android device/emulator
- `npm run ios` - Run on iOS device/simulator
- `npm run web` - Run in web browser

## Features Overview

### Destination Discovery
- Browse destinations by category
- Search functionality
- Detailed destination pages with photos and information
- Rating and review system

### Enhanced Trip Planning
- Create custom trips with budget planning
- Add multiple destinations
- Set trip dates and descriptions
- Track trip status
- **NEW**: Search flights and hotels with real-time results
- **NEW**: Loyalty program integration (Delta Diamond, Hilton Honors)
- **NEW**: Google Calendar synchronization
- **NEW**: Shared access for spouse collaboration

### Booking & Reservations
- **Flight Search**: Find flights with loyalty perks
- **Hotel Search**: Discover hotels with member benefits
- **Price Comparison**: Compare options within budget
- **Selection Interface**: Choose and book flights/hotels
- **Calendar Integration**: Auto-sync bookings to Google Calendar

### Collaboration Features
- **Trip Sharing**: Share trips with family members
- **Permission Management**: Control access levels
- **Real-time Updates**: Multiple users can edit same itinerary
- **User Management**: Add/remove collaborators

### User Experience
- Modern, clean UI design
- Smooth animations and transitions
- Responsive layout
- Intuitive navigation
- **NEW**: Comprehensive error handling
- **NEW**: Clear comments for easy understanding

## Future Enhancements

- [ ] Map integration with real-time location
- [ ] Photo sharing and gallery
- [ ] Social features and trip sharing
- [ ] Offline mode support
- [ ] Push notifications
- [ ] User authentication
- [ ] Backend integration
- [ ] Payment integration for bookings

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions, please open an issue in the repository or contact the development team.
