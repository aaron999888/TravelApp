import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { calendarService } from '../services/calendarService';

// Simple restaurant data structure - like a C struct
interface Restaurant {
  id: string;
  name: string;
  rating: number;
  distance: number;
  address: string;
  priceLevel?: number;
  isOpen?: boolean;
}

// Navigation props - like function parameters in C
interface RestaurantScreenProps {
  navigation: any;
  route?: {
    params?: {
      sharedTrip?: {
        id: string;
        title: string;
        description: string;
        startDate: string;
        endDate: string;
        budget: number;
        destinations: Array<{
          id: string;
          name: string;
          description: string;
          location: {
            latitude: number;
            longitude: number;
          };
          rating: number;
          category: string;
        }>;
      };
    };
  };
}

// Main component function - like a C function that returns a UI
const RestaurantScreen: React.FC<RestaurantScreenProps> = ({ navigation, route }) => {
  // State variables - like C variables but they can change and trigger UI updates
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  
  // Google Calendar state variables - like C variables for calendar functionality
  const [isCalendarAuthenticated, setIsCalendarAuthenticated] = useState<boolean>(false);
  const [isCalendarLoading, setIsCalendarLoading] = useState<boolean>(false);
  
  // Get shared trip data from navigation params - like getting parameters in C
  const sharedTrip = route?.params?.sharedTrip;

  // Initialize calendar service when component loads - like initialization in C
  useEffect(() => {
    initializeCalendarService();
  }, []);

  // Function to initialize Google Calendar service - like setup function in C
  const initializeCalendarService = async () => {
    try {
      // Initialize calendar service - like calling init function in C
      const initialized = await calendarService.initialize();
      
      if (initialized) {
        // Check if already authenticated - like checking a flag in C
        const authenticated = calendarService.isLoggedIn();
        setIsCalendarAuthenticated(authenticated);
        
        if (authenticated) {
          console.log('Google Calendar: Already authenticated in RestaurantScreen');
        } else {
          console.log('Google Calendar: Not authenticated in RestaurantScreen');
        }
      } else {
        console.error('Google Calendar: Failed to initialize in RestaurantScreen');
      }
    } catch (error) {
      console.error('Google Calendar initialization error in RestaurantScreen:', error);
    }
  };

  // Function to sync restaurant to Google Calendar - like sync function in C
  const syncRestaurantToCalendar = async (restaurant: Restaurant) => {
    try {
      setIsCalendarLoading(true);
      
      // Check if authenticated - like checking a flag in C
      if (!isCalendarAuthenticated) {
        Alert.alert(
          'Not Connected',
          'Please connect to Google Calendar first to sync restaurant reservations.',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Connect', onPress: authenticateWithGoogleCalendar }
          ]
        );
        return;
      }

      // Get current date and time - like getting system time in C
      const now = new Date();
      const today = now.toISOString().split('T')[0];
      const time = now.toTimeString().split(' ')[0].substring(0, 5);

      // Sync restaurant to calendar - like calling sync function in C
      const success = await calendarService.syncRestaurantToCalendar(
        restaurant.name,
        today,
        time,
        restaurant.address,
        sharedTrip?.title
      );
      
      if (success) {
        Alert.alert(
          'Success!',
          `Restaurant "${restaurant.name}" has been added to your Google Calendar.`,
          [{ text: 'OK' }]
        );
      } else {
        Alert.alert(
          'Sync Failed',
          'Failed to add restaurant to Google Calendar. Please try again.',
          [{ text: 'OK' }]
        );
      }
    } catch (error) {
      console.error('Restaurant calendar sync error:', error);
      Alert.alert(
        'Error',
        'An error occurred while syncing to Google Calendar. Please try again.',
        [{ text: 'OK' }]
      );
    } finally {
      setIsCalendarLoading(false);
    }
  };

  // Function to authenticate with Google Calendar - like auth function in C
  const authenticateWithGoogleCalendar = async () => {
    try {
      setIsCalendarLoading(true);
      
      // Authenticate with Google Calendar - like calling auth function in C
      const success = await calendarService.authenticate();
      
      if (success) {
        setIsCalendarAuthenticated(true);
        Alert.alert(
          'Success!',
          'Successfully connected to Google Calendar. You can now sync restaurant reservations.',
          [{ text: 'OK' }]
        );
      } else {
        Alert.alert(
          'Authentication Failed',
          'Failed to connect to Google Calendar. Please try again.',
          [{ text: 'OK' }]
        );
      }
    } catch (error) {
      console.error('Google Calendar authentication error:', error);
      Alert.alert(
        'Error',
        'An error occurred while connecting to Google Calendar. Please try again.',
        [{ text: 'OK' }]
      );
    } finally {
      setIsCalendarLoading(false);
    }
  };

  // Mock restaurant data - like test data in C
  const mockRestaurants: Restaurant[] = [
    {
      id: '1',
      name: 'The Golden Spoon',
      rating: 4.5,
      distance: 0.8,
      address: '123 Main Street',
      priceLevel: 2,
      isOpen: true,
    },
    {
      id: '2',
      name: 'Bella Vista Restaurant',
      rating: 4.2,
      distance: 1.2,
      address: '456 Oak Avenue',
      priceLevel: 3,
      isOpen: true,
    },
    {
      id: '3',
      name: 'Café Del Mar',
      rating: 4.7,
      distance: 2.1,
      address: '789 Pine Street',
      priceLevel: 2,
      isOpen: false,
    },
    {
      id: '4',
      name: 'Mama Mia Italian',
      rating: 4.3,
      distance: 1.5,
      address: '321 Elm Street',
      priceLevel: 2,
      isOpen: true,
    },
    {
      id: '5',
      name: 'Sushi Zen',
      rating: 4.6,
      distance: 0.9,
      address: '654 Maple Drive',
      priceLevel: 3,
      isOpen: true,
    },
  ];

  // Function to handle back navigation - like returning from a function
  const handleBackPress = () => {
    navigation.goBack();
  };

  // Function to load restaurants - like initialization in C
  const loadRestaurants = () => {
    setLoading(true);
    // Simulate loading delay - like a delay in C
    setTimeout(() => {
      setRestaurants(mockRestaurants);
      setLoading(false);
    }, 1000);
  };

  // useEffect hook - runs when component loads, like initialization code in C
  useEffect(() => {
    loadRestaurants();
  }, []);

  // Function to render each restaurant item - like a display function
  const renderRestaurantItem = ({ item }: { item: Restaurant }) => (
    <View style={styles.restaurantItem}>
      <View style={styles.restaurantInfo}>
        <Text style={styles.restaurantName}>{item.name}</Text>
        <View style={styles.ratingContainer}>
          <Ionicons name="star" size={16} color="#FFD700" />
          <Text style={styles.ratingText}>{item.rating.toFixed(1)}</Text>
        </View>
        <Text style={styles.distanceText}>{item.distance} km away</Text>
        <Text style={styles.addressText}>{item.address}</Text>
        {item.priceLevel && (
          <Text style={styles.priceText}>
            {'$'.repeat(item.priceLevel)} • {item.isOpen ? 'Open' : 'Closed'}
          </Text>
        )}
      </View>
      
      {/* Google Calendar sync button - like an action button in C */}
      <View style={styles.restaurantActions}>
        <TouchableOpacity
          style={styles.calendarSyncButton}
          onPress={() => syncRestaurantToCalendar(item)}
          disabled={isCalendarLoading}
        >
          <Ionicons 
            name={isCalendarAuthenticated ? "calendar" : "calendar-outline"} 
            size={20} 
            color={isCalendarAuthenticated ? "#007AFF" : "#999"} 
          />
          <Text style={[
            styles.calendarSyncButtonText,
            { color: isCalendarAuthenticated ? "#007AFF" : "#999" }
          ]}>
            {isCalendarLoading ? "Syncing..." : "Add to Calendar"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  // Main render function - like the main display function in C
  return (
    <SafeAreaView style={styles.container}>
      {/* Header with back button - like a header in a C program */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
          <Ionicons name="arrow-back" size={24} color="#007AFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Nearby Restaurants</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Shared Trip Information - like displaying context in C */}
      {sharedTrip && (
        <View style={styles.sharedTripInfo}>
          <View style={styles.sharedTripHeader}>
            <Ionicons name="people" size={20} color="#007AFF" />
            <Text style={styles.sharedTripTitle}>Shared Itinerary</Text>
          </View>
          <Text style={styles.tripTitle}>{sharedTrip.title}</Text>
          <Text style={styles.tripDescription}>
            {sharedTrip.description || 'No description provided'}
          </Text>
          <View style={styles.tripDetails}>
            <Text style={styles.tripDate}>
              {sharedTrip.startDate} - {sharedTrip.endDate}
            </Text>
            <Text style={styles.tripBudget}>
              Budget: ${sharedTrip.budget}
            </Text>
          </View>
          <View style={styles.destinationsSection}>
            <Text style={styles.destinationsLabel}>Destinations:</Text>
            {sharedTrip.destinations.map((dest, index) => (
              <Text key={index} style={styles.destinationName}>
                • {dest.name}
              </Text>
            ))}
          </View>
        </View>
      )}

      {/* Content area - like the main content area */}
      <View style={styles.content}>
        {loading ? (
          // Loading indicator - like showing "Please wait" in C
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#007AFF" />
            <Text style={styles.loadingText}>Finding great restaurants...</Text>
          </View>
        ) : (
          // Restaurant list - like displaying data in C
          <FlatList
            data={restaurants}
            renderItem={renderRestaurantItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContainer}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

// Styles - like defining constants and formatting in C
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#8E8E93',
  },
  listContainer: {
    padding: 16,
  },
  restaurantItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  restaurantInfo: {
    flex: 1,
  },
  restaurantName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  ratingText: {
    marginLeft: 4,
    fontSize: 16,
    fontWeight: '500',
    color: '#000000',
  },
  distanceText: {
    fontSize: 14,
    color: '#8E8E93',
    marginBottom: 4,
  },
  addressText: {
    fontSize: 14,
    color: '#8E8E93',
    marginBottom: 8,
  },
  priceText: {
    fontSize: 14,
    color: '#34C759',
    fontWeight: '500',
  },
  // Shared trip styles - like defining new constants in C
  sharedTripInfo: {
    backgroundColor: '#E3F2FD',
    margin: 16,
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#007AFF',
  },
  sharedTripHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  sharedTripTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#007AFF',
    marginLeft: 8,
  },
  tripTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 8,
  },
  tripDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  tripDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  tripDate: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  tripBudget: {
    fontSize: 12,
    color: '#34C759',
    fontWeight: '500',
  },
  destinationsSection: {
    marginTop: 8,
  },
  destinationsLabel: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
    marginBottom: 4,
  },
  destinationName: {
    fontSize: 12,
    color: '#666',
    marginLeft: 8,
  },
  // Google Calendar sync styles - like style definitions in C
  restaurantActions: {
    marginTop: 12,
    alignItems: 'center',
  },
  calendarSyncButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  calendarSyncButtonText: {
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 8,
  },
});

export default RestaurantScreen;