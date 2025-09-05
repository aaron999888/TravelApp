import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
  Alert,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';

import { RootStackParamList, Trip, Destination } from '../types';

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
  const [tripTitle, setTripTitle] = useState('');
  const [tripDescription, setTripDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [budget, setBudget] = useState('');
  const [selectedDestinations, setSelectedDestinations] = useState<Destination[]>([]);

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
  const createTrip = () => {
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
      createdBy: 'current-user',
      lastModified: new Date().toISOString(),
    };

    Alert.alert(
      'Trip Created!',
      `Your trip "${tripTitle}" has been created successfully.`,
      [
        {
          text: 'View Trip',
          onPress: () => navigation.navigate('TripDetail', { trip: newTrip }),
        },
        {
          text: 'OK',
          onPress: () => {
            // Reset form - like clearing variables in C
            setTripTitle('');
            setTripDescription('');
            setStartDate('');
            setEndDate('');
            setBudget('');
            setSelectedDestinations([]);
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
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

          <TouchableOpacity 
            style={styles.restaurantButton} 
            onPress={() => navigation.navigate('Restaurants')}
          >
            <Ionicons name="restaurant" size={20} color="#FF6B35" />
            <Text style={styles.restaurantButtonText}>Find Restaurants</Text>
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
});

export default TripPlannerScreen;
