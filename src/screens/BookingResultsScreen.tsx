import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Image,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

import { RootStackParamList, Flight, Hotel } from '../types';
import { searchFlights, searchHotels, getLoyaltyBenefits, handleBookingError } from '../services/bookingService';
import { calendarService } from '../services/calendarService';

type BookingResultsScreenNavigationProp = StackNavigationProp<RootStackParamList, 'BookingResults'>;
type BookingResultsScreenRouteProp = RouteProp<RootStackParamList, 'BookingResults'>;

interface Props {
  navigation: BookingResultsScreenNavigationProp;
  route: BookingResultsScreenRouteProp;
}

const BookingResultsScreen: React.FC<Props> = ({ navigation, route }) => {
  const { destination, startDate, endDate, budget } = route.params;
  
  // State variables - like local variables in a C function
  const [flights, setFlights] = useState<Flight[]>([]);
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFlights, setSelectedFlights] = useState<Flight[]>([]);
  const [selectedHotels, setSelectedHotels] = useState<Hotel[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Mock current user - in a real app, this would come from authentication
  const currentUser = {
    id: '1',
    name: 'John Doe',
    email: 'john.doe@example.com',
    loyaltyPrograms: {
      deltaDiamond: true,
      hiltonHonors: true
    }
  };

  // Load booking data when component mounts - like initialization in C
  useEffect(() => {
    loadBookingData();
  }, []);

  // Function to load booking data - like a C function that fetches data
  const loadBookingData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Search for flights and hotels in parallel - like calling multiple functions in C
      const [flightResults, hotelResults] = await Promise.all([
        searchFlights('JFK', destination, startDate, budget),
        searchHotels(destination, startDate, endDate, budget)
      ]);

      setFlights(flightResults);
      setHotels(hotelResults);

      // Check if no results found - like error checking in C
      if (flightResults.length === 0 && hotelResults.length === 0) {
        setError('No flights or hotels found within your budget. Try increasing your budget.');
      }
    } catch (err) {
      // Error handling - like error handling in C
      const errorMessage = handleBookingError(err);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Function to toggle flight selection - like a C function that modifies state
  const toggleFlightSelection = (flight: Flight) => {
    setSelectedFlights(prev => {
      const isSelected = prev.some(f => f.id === flight.id);
      if (isSelected) {
        return prev.filter(f => f.id !== flight.id);
      } else {
        return [...prev, flight];
      }
    });
  };

  // Function to toggle hotel selection - like a C function that modifies state
  const toggleHotelSelection = (hotel: Hotel) => {
    setSelectedHotels(prev => {
      const isSelected = prev.some(h => h.id === hotel.id);
      if (isSelected) {
        return prev.filter(h => h.id !== hotel.id);
      } else {
        return [...prev, hotel];
      }
    });
  };

  // Function to sync to Google Calendar - like a C function that calls external API
  const syncToCalendar = async () => {
    try {
      // Check if user is authenticated - like checking a flag in C
      if (!calendarService.isLoggedIn()) {
        const authenticated = await calendarService.authenticate();
        if (!authenticated) {
          Alert.alert('Authentication Failed', 'Could not connect to Google Calendar');
          return;
        }
      }

      // Create trip events - like calling a function with parameters in C
      await calendarService.createTripEvents(
        `Trip to ${destination}`,
        startDate,
        endDate,
        destination,
        selectedFlights,
        selectedHotels
      );

      Alert.alert(
        'Success!',
        'Your trip has been added to Google Calendar',
        [{ text: 'OK' }]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to sync to Google Calendar');
    }
  };

  // Function to calculate total cost - like a C function that performs calculations
  const calculateTotalCost = (): number => {
    const flightCost = selectedFlights.reduce((sum, flight) => sum + flight.price, 0);
    const hotelCost = selectedHotels.reduce((sum, hotel) => sum + hotel.price, 0);
    return flightCost + hotelCost;
  };

  // Function to render flight card - like a C function that formats data
  const renderFlightCard = (flight: Flight) => {
    const isSelected = selectedFlights.some(f => f.id === flight.id);
    const loyaltyBenefits = getLoyaltyBenefits(currentUser);

    return (
      <TouchableOpacity
        key={flight.id}
        style={[styles.card, isSelected && styles.selectedCard]}
        onPress={() => toggleFlightSelection(flight)}
      >
        <View style={styles.cardHeader}>
          <View style={styles.flightInfo}>
            <Text style={styles.airline}>{flight.airline}</Text>
            <Text style={styles.flightNumber}>{flight.flightNumber}</Text>
          </View>
          <View style={styles.priceContainer}>
            <Text style={styles.price}>${flight.price}</Text>
            <Text style={styles.class}>{flight.class}</Text>
          </View>
        </View>

        <View style={styles.flightDetails}>
          <View style={styles.timeInfo}>
            <Text style={styles.time}>{flight.departure.time}</Text>
            <Text style={styles.airport}>{flight.departure.airport}</Text>
          </View>
          <View style={styles.duration}>
            <Text style={styles.durationText}>{flight.duration}</Text>
          </View>
          <View style={styles.timeInfo}>
            <Text style={styles.time}>{flight.arrival.time}</Text>
            <Text style={styles.airport}>{flight.arrival.airport}</Text>
          </View>
        </View>

        {/* Delta Diamond perks display */}
        {loyaltyBenefits.deltaDiamond.hasMembership && flight.airline === 'Delta Airlines' && (
          <View style={styles.perksContainer}>
            <Text style={styles.perksTitle}>Delta Diamond Perks:</Text>
            {flight.perks.freeUpgrade && (
              <View style={styles.perkItem}>
                <Ionicons name="star" size={16} color="#FFD700" />
                <Text style={styles.perkText}>Free upgrade available</Text>
              </View>
            )}
            {flight.perks.priorityBoarding && (
              <View style={styles.perkItem}>
                <Ionicons name="checkmark-circle" size={16} color="#34C759" />
                <Text style={styles.perkText}>Priority boarding</Text>
              </View>
            )}
            {flight.perks.loungeAccess && (
              <View style={styles.perkItem}>
                <Ionicons name="wine" size={16} color="#8E8E93" />
                <Text style={styles.perkText}>Sky Club access</Text>
              </View>
            )}
            <Text style={styles.bonusText}>+{flight.perks.bonusMiles} bonus miles</Text>
          </View>
        )}

        {isSelected && (
          <View style={styles.selectedIndicator}>
            <Ionicons name="checkmark-circle" size={24} color="#007AFF" />
          </View>
        )}
      </TouchableOpacity>
    );
  };

  // Function to render hotel card - like a C function that formats data
  const renderHotelCard = (hotel: Hotel) => {
    const isSelected = selectedHotels.some(h => h.id === hotel.id);
    const loyaltyBenefits = getLoyaltyBenefits(currentUser);

    return (
      <TouchableOpacity
        key={hotel.id}
        style={[styles.card, isSelected && styles.selectedCard]}
        onPress={() => toggleHotelSelection(hotel)}
      >
        <Image source={{ uri: hotel.image }} style={styles.hotelImage} />
        
        <View style={styles.hotelInfo}>
          <View style={styles.hotelHeader}>
            <Text style={styles.hotelName}>{hotel.name}</Text>
            <Text style={styles.hotelPrice}>${hotel.price}/night</Text>
          </View>
          
          <Text style={styles.hotelLocation}>{hotel.location}</Text>
          
          <View style={styles.ratingContainer}>
            <Ionicons name="star" size={16} color="#FFD700" />
            <Text style={styles.rating}>{hotel.rating}</Text>
          </View>

          {/* Hilton Honors perks display */}
          {loyaltyBenefits.hiltonHonors.hasMembership && hotel.name.includes('Hilton') && (
            <View style={styles.perksContainer}>
              <Text style={styles.perksTitle}>Hilton Honors Perks:</Text>
              {hotel.perks.freeUpgrade && (
                <View style={styles.perkItem}>
                  <Ionicons name="star" size={16} color="#FFD700" />
                  <Text style={styles.perkText}>Free room upgrade</Text>
                </View>
              )}
              {hotel.perks.lateCheckout && (
                <View style={styles.perkItem}>
                  <Ionicons name="time" size={16} color="#34C759" />
                  <Text style={styles.perkText}>Late checkout (4 PM)</Text>
                </View>
              )}
              {hotel.perks.freeBreakfast && (
                <View style={styles.perkItem}>
                  <Ionicons name="restaurant" size={16} color="#FF9500" />
                  <Text style={styles.perkText}>Free breakfast</Text>
                </View>
              )}
              {hotel.perks.ownerPricing && (
                <View style={styles.perkItem}>
                  <Ionicons name="pricetag" size={16} color="#FF3B30" />
                  <Text style={styles.perkText}>Owner pricing applied</Text>
                </View>
              )}
              <Text style={styles.bonusText}>+{hotel.perks.bonusPoints} bonus points</Text>
            </View>
          )}
        </View>

        {isSelected && (
          <View style={styles.selectedIndicator}>
            <Ionicons name="checkmark-circle" size={24} color="#007AFF" />
          </View>
        )}
      </TouchableOpacity>
    );
  };

  // Main render function - like the main function in C
  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>Searching for flights and hotels...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle" size={48} color="#FF3B30" />
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={loadBookingData}>
            <Text style={styles.retryButtonText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Booking Results</Text>
        </View>

        {/* Trip Summary */}
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Trip to {destination}</Text>
          <Text style={styles.summaryDates}>{startDate} - {endDate}</Text>
          <Text style={styles.summaryBudget}>Budget: ${budget}</Text>
        </View>

        {/* Flights Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Flights ({flights.length} found)</Text>
          {flights.map(renderFlightCard)}
        </View>

        {/* Hotels Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Hotels ({hotels.length} found)</Text>
          {hotels.map(renderHotelCard)}
        </View>

        {/* Total Cost and Actions */}
        <View style={styles.actionsContainer}>
          <View style={styles.totalContainer}>
            <Text style={styles.totalLabel}>Total Cost:</Text>
            <Text style={styles.totalAmount}>${calculateTotalCost()}</Text>
          </View>

          <TouchableOpacity
            style={[styles.syncButton, (selectedFlights.length === 0 || selectedHotels.length === 0) && styles.disabledButton]}
            onPress={syncToCalendar}
            disabled={selectedFlights.length === 0 || selectedHotels.length === 0}
          >
            <Ionicons name="calendar" size={20} color="#fff" />
            <Text style={styles.syncButtonText}>Sync to Google Calendar</Text>
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginVertical: 16,
  },
  retryButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  backButton: {
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  summaryCard: {
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
  summaryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  summaryDates: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  summaryBudget: {
    fontSize: 14,
    color: '#007AFF',
    marginTop: 4,
    fontWeight: '600',
  },
  section: {
    marginHorizontal: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    position: 'relative',
  },
  selectedCard: {
    borderWidth: 2,
    borderColor: '#007AFF',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  flightInfo: {
    flex: 1,
  },
  airline: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  flightNumber: {
    fontSize: 14,
    color: '#666',
  },
  priceContainer: {
    alignItems: 'flex-end',
  },
  price: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  class: {
    fontSize: 12,
    color: '#666',
  },
  flightDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  timeInfo: {
    alignItems: 'center',
  },
  time: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  airport: {
    fontSize: 12,
    color: '#666',
  },
  duration: {
    flex: 1,
    alignItems: 'center',
  },
  durationText: {
    fontSize: 12,
    color: '#666',
  },
  hotelImage: {
    width: '100%',
    height: 120,
    borderRadius: 8,
    marginBottom: 12,
  },
  hotelInfo: {
    flex: 1,
  },
  hotelHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  hotelName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  hotelPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  hotelLocation: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  rating: {
    marginLeft: 4,
    fontSize: 14,
    color: '#666',
  },
  perksContainer: {
    backgroundColor: '#f0f8ff',
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
  },
  perksTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 8,
  },
  perkItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  perkText: {
    marginLeft: 8,
    fontSize: 12,
    color: '#333',
  },
  bonusText: {
    fontSize: 12,
    color: '#007AFF',
    fontWeight: '600',
    marginTop: 4,
  },
  selectedIndicator: {
    position: 'absolute',
    top: 12,
    right: 12,
  },
  actionsContainer: {
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
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  totalAmount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  syncButton: {
    backgroundColor: '#007AFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  syncButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});

export default BookingResultsScreen;
