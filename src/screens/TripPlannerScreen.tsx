import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
  Alert,
  FlatList,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';

import { RootStackParamList, Trip, Destination } from '../types';
import { getSharedTrips, setCurrentUser } from '../services/sharingService';
import SharingComponent from '../components/SharingComponent';
import { testFirebaseConnection, testSharingService } from '../utils/firebaseTest';
import { calendarService } from '../services/calendarService';

type TripPlannerScreenNavigationProp = StackNavigationProp<RootStackParamList, 'TripPlanner'>;

interface Props {
  navigation: TripPlannerScreenNavigationProp;
}

const mockDestinations: Destination[] = [
  {
    id: '1',
    name: 'Santorini, Greece',
    description: 'Beautiful Greek island with stunning sunsets',
    image: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=400',
    location: { latitude: 36.3932, longitude: 25.4615 },
    rating: 4.8,
    category: 'beach',
  },
  {
    id: '2',
    name: 'Tokyo, Japan',
    description: 'Vibrant metropolis blending tradition and modernity',
    image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=400',
    location: { latitude: 35.6762, longitude: 139.6503 },
    rating: 4.7,
    category: 'city',
  },
  {
    id: '3',
    name: 'Swiss Alps',
    description: 'Majestic mountain ranges perfect for adventure',
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400',
    location: { latitude: 46.5197, longitude: 6.6323 },
    rating: 4.9,
    category: 'mountain',
  },
  {
    id: '4',
    name: 'Amsterdam, Netherlands',
    description: 'Charming canals, historic architecture, and vibrant culture',
    image: 'https://images.unsplash.com/photo-1534351590666-13e3e96b5017?w=400',
    location: { latitude: 52.3676, longitude: 4.9041 },
    rating: 4.6,
    category: 'city',
  },
  {
    id: '5',
    name: 'Paris, France',
    description: 'City of lights with iconic landmarks and romantic atmosphere',
    image: 'https://images.unsplash.com/photo-1502602898536-47ad22581b52?w=400',
    location: { latitude: 48.8566, longitude: 2.3522 },
    rating: 4.5,
    category: 'city',
  },
  {
    id: '6',
    name: 'London, England',
    description: 'Historic capital with royal palaces and modern attractions',
    image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=400',
    location: { latitude: 51.5074, longitude: -0.1278 },
    rating: 4.4,
    category: 'city',
  },
];

const TripPlannerScreen: React.FC<Props> = ({ navigation }) => {
  // Form state variables - like C variables for form data
  const [tripTitle, setTripTitle] = useState('');
  const [tripDescription, setTripDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [budget, setBudget] = useState('');
  const [selectedDestinations, setSelectedDestinations] = useState<Destination[]>([]);
  
  // Sharing state variables - like C variables for sharing functionality
  const [sharedTrips, setSharedTrips] = useState<Trip[]>([]);
  const [showSharedTrips, setShowSharedTrips] = useState<boolean>(false);
  const [currentUser, setCurrentUserState] = useState<string>('');

  // Google Calendar state variables - like C variables for calendar functionality
  const [isCalendarAuthenticated, setIsCalendarAuthenticated] = useState<boolean>(false);
  const [isCalendarLoading, setIsCalendarLoading] = useState<boolean>(false);

  // Function to initialize user and load shared trips - like initialization in C
  useEffect(() => {
    initializeUserAndLoadSharedTrips();
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
          console.log('Google Calendar: Already authenticated');
        } else {
          console.log('Google Calendar: Not authenticated, ready for login');
        }
      } else {
        console.error('Google Calendar: Failed to initialize');
      }
    } catch (error) {
      console.error('Google Calendar initialization error:', error);
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
          'Successfully connected to Google Calendar. Your trips will now be synced to your calendar.',
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

  // Function to sync trip to Google Calendar - like sync function in C
  const syncTripToCalendar = async (trip: Trip) => {
    try {
      setIsCalendarLoading(true);
      
      // Check if authenticated - like checking a flag in C
      if (!isCalendarAuthenticated) {
        Alert.alert(
          'Not Connected',
          'Please connect to Google Calendar first to sync your trips.',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Connect', onPress: authenticateWithGoogleCalendar }
          ]
        );
        return;
      }

      // Sync trip to calendar - like calling sync function in C
      const success = await calendarService.syncTripToCalendar(trip);
      
      if (success) {
        Alert.alert(
          'Success!',
          `Trip "${trip.title}" has been synced to your Google Calendar.`,
          [{ text: 'OK' }]
        );
      } else {
        Alert.alert(
          'Sync Failed',
          'Failed to sync trip to Google Calendar. Please try again.',
          [{ text: 'OK' }]
        );
      }
    } catch (error) {
      console.error('Calendar sync error:', error);
      Alert.alert(
        'Error',
        'An error occurred while syncing to Google Calendar. Please try again.',
        [{ text: 'OK' }]
      );
    } finally {
      setIsCalendarLoading(false);
    }
  };

  // Function to initialize user and load shared trips - like setup function in C
  const initializeUserAndLoadSharedTrips = async () => {
    // Set a default user for demo purposes - like setting a default value in C
    const demoUser = 'demo@travelapp.com';
    await setCurrentUser(demoUser);
    setCurrentUserState(demoUser);
    
    // Load shared trips - like loading data from database in C
    loadSharedTrips();
  };

  // Function to load shared trips - like querying database in C
  const loadSharedTrips = async () => {
    try {
      const trips = await getSharedTrips();
      setSharedTrips(trips);
    } catch (error) {
      console.error('Error loading shared trips:', error);
    }
  };

  // Function to toggle shared trips display - like toggling a flag in C
  const toggleSharedTrips = () => {
    setShowSharedTrips(!showSharedTrips);
  };

  // Function to handle sharing status change - like callback function in C
  const handleSharingStatusChange = (isShared: boolean) => {
    // Reload shared trips when sharing status changes - like refreshing data in C
    loadSharedTrips();
  };

  // Function to test Firebase connection - like a test function in C
  const handleFirebaseTest = async () => {
    Alert.alert('Testing Firebase', 'Running Firebase tests...');
    
    try {
      // Test basic Firebase connection - like testing a library in C
      const connectionResult = await testFirebaseConnection();
      
      if (connectionResult.success) {
        // Test sharing service - like testing a module in C
        const sharingResult = await testSharingService();
        
        Alert.alert(
          'Firebase Test Results',
          `Connection: ${connectionResult.success ? '✅ Success' : '❌ Failed'}\n` +
          `Sharing: ${sharingResult.success ? '✅ Success' : '❌ Failed'}\n\n` +
          `Connection: ${connectionResult.message}\n` +
          `Sharing: ${sharingResult.message}`,
          [{ text: 'OK' }]
        );
      } else {
        Alert.alert('Firebase Test Failed', connectionResult.message);
      }
    } catch (error) {
      console.error('Firebase test error:', error);
      Alert.alert('Test Error', 'Failed to run Firebase tests');
    }
  };

  const toggleDestination = (destination: Destination) => {
    setSelectedDestinations(prev => {
      const isSelected = prev.some(d => d.id === destination.id);
      if (isSelected) {
        return prev.filter(d => d.id !== destination.id);
      } else {
        return [...prev, destination];
      }
    });
  };

  // Function to search for flights and hotels - like a C function that processes data
  const searchBookings = () => {
    // Input validation - like checking parameters in C
    if (!tripTitle || !startDate || !endDate || !budget || selectedDestinations.length === 0) {
      Alert.alert('Missing Information', 'Please fill in all required fields and select at least one destination.');
      return;
    }

    // Validate budget is a number - like type checking in C
    const budgetNumber = parseFloat(budget);
    if (isNaN(budgetNumber) || budgetNumber <= 0) {
      Alert.alert('Invalid Budget', 'Please enter a valid budget amount.');
      return;
    }

    // Navigate to booking results - like calling a function with parameters in C
    const primaryDestination = selectedDestinations[0].name;
    navigation.navigate('BookingResults', {
      destination: primaryDestination,
      startDate,
      endDate,
      budget: budgetNumber
    });
  };

  // Function to create trip (legacy function for backward compatibility)
  const createTrip = async () => {
    if (!tripTitle || !startDate || !endDate || selectedDestinations.length === 0) {
      Alert.alert('Missing Information', 'Please fill in all required fields and select at least one destination.');
      return;
    }

    const newTrip: Trip = {
      id: Date.now().toString(),
      title: tripTitle,
      description: tripDescription,
      startDate,
      endDate,
      budget: parseFloat(budget) || 0,
      destinations: selectedDestinations,
      flights: [],
      hotels: [],
      status: 'planned',
      sharedWith: [],
      createdBy: currentUser || 'current-user',
      lastModified: new Date().toISOString(),
      isShared: false,
      sharedWithSpouse: false,
    };

    // Show trip created alert with calendar sync option - like showing options in C
    Alert.alert(
      'Trip Created!',
      `Your trip "${tripTitle}" has been created successfully.`,
      [
        {
          text: 'View Trip',
          onPress: () => navigation.navigate('TripDetail', { trip: newTrip }),
        },
        {
          text: 'Sync to Calendar',
          onPress: () => {
            // Sync trip to calendar - like calling sync function in C
            syncTripToCalendar(newTrip);
            // Reset form after sync - like clearing variables in C
            resetForm();
          },
        },
        {
          text: 'OK',
          onPress: () => {
            // Reset form - like clearing variables in C
            resetForm();
          },
        },
      ]
    );
  };

  // Function to reset form - like clearing variables in C
  const resetForm = () => {
    setTripTitle('');
    setTripDescription('');
    setStartDate('');
    setEndDate('');
    setBudget('');
    setSelectedDestinations([]);
  };

  // Function to render shared trip item - like a display function in C
  const renderSharedTripItem = ({ item }: { item: Trip }) => (
    <View style={styles.sharedTripItem}>
      <View style={styles.sharedTripInfo}>
        <Text style={styles.sharedTripTitle}>{item.title}</Text>
        <Text style={styles.sharedTripDescription}>
          {item.description || 'No description provided'}
        </Text>
        <View style={styles.sharedTripDetails}>
          <Text style={styles.sharedTripDate}>
            {item.startDate} - {item.endDate}
          </Text>
          <Text style={styles.sharedTripBudget}>
            Budget: ${item.budget}
          </Text>
        </View>
        <View style={styles.sharedTripDestinations}>
          <Text style={styles.destinationsLabel}>Destinations:</Text>
          {item.destinations.map((dest, index) => (
            <Text key={index} style={styles.destinationNameSmall}>
              • {dest.name}
            </Text>
          ))}
        </View>
      </View>
      <View style={styles.sharedTripActions}>
        <TouchableOpacity
          style={styles.viewTripButton}
          onPress={() => navigation.navigate('TripDetail', { trip: item })}
        >
          <Ionicons name="eye" size={20} color="#007AFF" />
          <Text style={styles.viewTripButtonText}>View</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.restaurantButton}
          onPress={() => navigation.navigate('Restaurants', { sharedTrip: item })}
        >
          <Ionicons name="restaurant" size={20} color="#FF6B35" />
          <Text style={styles.restaurantButtonText}>Restaurants</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Google Calendar Integration Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Google Calendar</Text>
            <Ionicons name="calendar" size={24} color="#007AFF" />
          </View>
          
          <View style={styles.calendarSection}>
            {isCalendarAuthenticated ? (
              <View style={styles.calendarConnected}>
                <Ionicons name="checkmark-circle" size={24} color="#4CAF50" />
                <Text style={styles.calendarStatusText}>Connected to Google Calendar</Text>
                <Text style={styles.calendarSubText}>Your trips will be automatically synced</Text>
              </View>
            ) : (
              <View style={styles.calendarDisconnected}>
                <Ionicons name="calendar-outline" size={24} color="#FF9800" />
                <Text style={styles.calendarStatusText}>Not connected to Google Calendar</Text>
                <Text style={styles.calendarSubText}>Connect to sync your trips to your calendar</Text>
                <TouchableOpacity
                  style={styles.calendarConnectButton}
                  onPress={authenticateWithGoogleCalendar}
                  disabled={isCalendarLoading}
                >
                  {isCalendarLoading ? (
                    <Text style={styles.calendarButtonText}>Connecting...</Text>
                  ) : (
                    <Text style={styles.calendarButtonText}>Connect to Google Calendar</Text>
                  )}
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>

        {/* Shared Trips Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Shared Itineraries</Text>
            <TouchableOpacity
              style={styles.toggleButton}
              onPress={toggleSharedTrips}
            >
              <Ionicons
                name={showSharedTrips ? 'chevron-up' : 'chevron-down'}
                size={20}
                color="#007AFF"
              />
              <Text style={styles.toggleButtonText}>
                {showSharedTrips ? 'Hide' : 'Show'} ({sharedTrips.length})
              </Text>
            </TouchableOpacity>
          </View>
          
          {showSharedTrips && (
            <View style={styles.sharedTripsContainer}>
              {sharedTrips.length === 0 ? (
                <View style={styles.noSharedTrips}>
                  <Ionicons name="people-outline" size={48} color="#ccc" />
                  <Text style={styles.noSharedTripsText}>
                    No shared itineraries yet
                  </Text>
                  <Text style={styles.noSharedTripsSubtext}>
                    Create a trip and share it with your spouse to see it here
                  </Text>
                </View>
              ) : (
                <FlatList
                  data={sharedTrips}
                  renderItem={renderSharedTripItem}
                  keyExtractor={(item) => item.id}
                  scrollEnabled={false}
                />
              )}
            </View>
          )}
        </View>

        {/* Trip Details Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Trip Details</Text>
          
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Trip Title *</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter trip title"
              value={tripTitle}
              onChangeText={setTripTitle}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Description</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Describe your trip"
              value={tripDescription}
              onChangeText={setTripDescription}
              multiline
              numberOfLines={3}
            />
          </View>

          <View style={styles.dateContainer}>
            <View style={styles.dateInputContainer}>
              <Text style={styles.label}>Start Date *</Text>
              <TextInput
                style={styles.input}
                placeholder="YYYY-MM-DD"
                value={startDate}
                onChangeText={setStartDate}
              />
            </View>
            <View style={styles.dateInputContainer}>
              <Text style={styles.label}>End Date *</Text>
              <TextInput
                style={styles.input}
                placeholder="YYYY-MM-DD"
                value={endDate}
                onChangeText={setEndDate}
              />
            </View>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Budget *</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your budget (e.g., 2000)"
              value={budget}
              onChangeText={setBudget}
              keyboardType="numeric"
            />
          </View>
        </View>

        {/* Destinations Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Select Destinations</Text>
          <Text style={styles.sectionSubtitle}>
            Choose the places you want to visit ({selectedDestinations.length} selected)
          </Text>

          {mockDestinations.map((destination) => {
            const isSelected = selectedDestinations.some(d => d.id === destination.id);
            return (
              <TouchableOpacity
                key={destination.id}
                style={[
                  styles.destinationCard,
                  isSelected && styles.selectedDestinationCard
                ]}
                onPress={() => toggleDestination(destination)}
              >
                <View style={styles.destinationInfo}>
                  <Text style={styles.destinationName}>{destination.name}</Text>
                  <Text style={styles.destinationDescription}>
                    {destination.description}
                  </Text>
                  <View style={styles.destinationFooter}>
                    <View style={styles.ratingContainer}>
                      <Ionicons name="star" size={16} color="#FFD700" />
                      <Text style={styles.rating}>{destination.rating}</Text>
                    </View>
                    <View style={styles.categoryContainer}>
                      <Text style={styles.categoryText}>
                        {destination.category.charAt(0).toUpperCase() + destination.category.slice(1)}
                      </Text>
                    </View>
                  </View>
                </View>
                <View style={styles.selectionIndicator}>
                  <Ionicons
                    name={isSelected ? 'checkmark-circle' : 'ellipse-outline'}
                    size={24}
                    color={isSelected ? '#007AFF' : '#ccc'}
                  />
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Action Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.searchButton} onPress={searchBookings}>
            <Ionicons name="search" size={24} color="#fff" />
            <Text style={styles.searchButtonText}>Search Flights & Hotels</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.createButton} onPress={createTrip}>
            <Ionicons name="add-circle" size={24} color="#007AFF" />
            <Text style={styles.createButtonText}>Create Trip Only</Text>
          </TouchableOpacity>

          {/* Sharing Component - for sharing created trips */}
          {tripTitle && selectedDestinations.length > 0 && (
            <View style={styles.sharingSection}>
              <Text style={styles.sharingSectionTitle}>Share with Spouse</Text>
              <SharingComponent
                trip={{
                  id: 'temp-trip-id',
                  title: tripTitle,
                  description: tripDescription,
                  startDate,
                  endDate,
                  budget: parseFloat(budget) || 0,
                  destinations: selectedDestinations,
                  flights: [],
                  hotels: [],
                  status: 'planned' as const,
                  sharedWith: [],
                  createdBy: currentUser || 'current-user',
                  lastModified: new Date().toISOString(),
                  isShared: false,
                  sharedWithSpouse: false,
                }}
                onSharingStatusChange={handleSharingStatusChange}
              />
            </View>
          )}

          <TouchableOpacity 
            style={styles.restaurantButton} 
            onPress={() => navigation.navigate('Restaurants', {})}
          >
            <Ionicons name="restaurant" size={20} color="#FF6B35" />
            <Text style={styles.restaurantButtonText}>Find Restaurants</Text>
          </TouchableOpacity>

          {/* Firebase Test Button - for testing Firebase functionality */}
          <TouchableOpacity 
            style={styles.testButton} 
            onPress={handleFirebaseTest}
          >
            <Ionicons name="flask" size={20} color="#34C759" />
            <Text style={styles.testButtonText}>Test Firebase</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollView: {
    flex: 1,
  },
  section: {
    backgroundColor: '#fff',
    margin: 20,
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 15,
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  dateContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dateInputContainer: {
    flex: 1,
    marginRight: 10,
  },
  destinationCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    marginBottom: 12,
    backgroundColor: '#fff',
  },
  selectedDestinationCard: {
    borderColor: '#007AFF',
    backgroundColor: '#f0f8ff',
  },
  destinationInfo: {
    flex: 1,
  },
  destinationName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  destinationDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  destinationFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    marginLeft: 4,
    fontSize: 14,
    color: '#666',
    fontWeight: '600',
  },
  categoryContainer: {
    backgroundColor: '#e0e0e0',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  categoryText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  selectionIndicator: {
    marginLeft: 12,
  },
  buttonContainer: {
    padding: 20,
  },
  searchButton: {
    backgroundColor: '#007AFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 12,
  },
  searchButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  createButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#007AFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  createButtonText: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  restaurantButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#FF6B35',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginTop: 8,
  },
  restaurantButtonText: {
    color: '#FF6B35',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  // Shared trips styles - like defining new constants in C
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  toggleButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  toggleButtonText: {
    fontSize: 14,
    color: '#007AFF',
    marginLeft: 4,
    fontWeight: '500',
  },
  sharedTripsContainer: {
    marginTop: 10,
  },
  noSharedTrips: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  noSharedTripsText: {
    fontSize: 16,
    color: '#666',
    marginTop: 16,
    fontWeight: '500',
  },
  noSharedTripsSubtext: {
    fontSize: 14,
    color: '#999',
    marginTop: 8,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  sharedTripItem: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#007AFF',
  },
  sharedTripInfo: {
    flex: 1,
  },
  sharedTripTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  sharedTripDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  sharedTripDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  sharedTripDate: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  sharedTripBudget: {
    fontSize: 12,
    color: '#34C759',
    fontWeight: '500',
  },
  sharedTripDestinations: {
    marginBottom: 12,
  },
  destinationsLabel: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
    marginBottom: 4,
  },
  destinationNameSmall: {
    fontSize: 12,
    color: '#666',
    marginLeft: 8,
  },
  sharedTripActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  viewTripButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#007AFF',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    flex: 1,
    marginRight: 8,
    justifyContent: 'center',
  },
  viewTripButtonText: {
    color: '#007AFF',
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 4,
  },
  sharingSection: {
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  sharingSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
  },
  // Test button styles - like defining new constants in C
  testButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#34C759',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginTop: 8,
  },
  testButtonText: {
    color: '#34C759',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  // Google Calendar styles - like style definitions in C
  calendarSection: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginTop: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  calendarConnected: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  calendarDisconnected: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  calendarStatusText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginLeft: 12,
    flex: 1,
  },
  calendarSubText: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
    marginLeft: 12,
    flex: 1,
  },
  calendarConnectButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginTop: 12,
    alignItems: 'center',
  },
  calendarButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default TripPlannerScreen;
