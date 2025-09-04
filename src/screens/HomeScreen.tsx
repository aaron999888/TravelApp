import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  SafeAreaView,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';

import { RootStackParamList, Destination, Trip } from '../types';
import { getAllTrips } from '../services/tripService';

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

interface Props {
  navigation: HomeScreenNavigationProp;
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
];

const mockTrips: Trip[] = [
  {
    id: '1',
    title: 'European Adventure',
    description: 'Exploring the best of Europe',
    startDate: '2024-06-01',
    endDate: '2024-06-15',
    destinations: mockDestinations.slice(0, 2),
    status: 'planned',
  },
  {
    id: '2',
    title: 'Asian Discovery',
    description: 'Cultural journey through Asia',
    startDate: '2024-07-01',
    endDate: '2024-07-20',
    destinations: [mockDestinations[1]],
    status: 'ongoing',
  },
];

const HomeScreen: React.FC<Props> = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.greeting}>Welcome back!</Text>
          <Text style={styles.subtitle}>Ready for your next adventure?</Text>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => navigation.navigate('TripPlanner')}
          >
            <Ionicons name="add-circle" size={24} color="#007AFF" />
            <Text style={styles.actionText}>Plan Trip</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => navigation.navigate('Destinations')}
          >
            <Ionicons name="location" size={24} color="#007AFF" />
            <Text style={styles.actionText}>Explore</Text>
          </TouchableOpacity>
        </View>

        {/* Recent Trips */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your Trips</Text>
          {mockTrips.map((trip) => (
            <TouchableOpacity
              key={trip.id}
              style={styles.tripCard}
              onPress={() => navigation.navigate('TripDetail', { trip })}
            >
              <View style={styles.tripInfo}>
                <Text style={styles.tripTitle}>{trip.title}</Text>
                <Text style={styles.tripDescription}>{trip.description}</Text>
                <Text style={styles.tripDates}>
                  {trip.startDate} - {trip.endDate}
                </Text>
                <View style={styles.statusContainer}>
                  <View style={[
                    styles.statusBadge,
                    { backgroundColor: trip.status === 'ongoing' ? '#4CAF50' : '#FF9800' }
                  ]}>
                    <Text style={styles.statusText}>
                      {trip.status.charAt(0).toUpperCase() + trip.status.slice(1)}
                    </Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Popular Destinations */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Popular Destinations</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {mockDestinations.map((destination) => (
              <TouchableOpacity
                key={destination.id}
                style={styles.destinationCard}
                onPress={() => navigation.navigate('DestinationDetail', { destination })}
              >
                <Image source={{ uri: destination.image }} style={styles.destinationImage} />
                <View style={styles.destinationInfo}>
                  <Text style={styles.destinationName}>{destination.name}</Text>
                  <View style={styles.ratingContainer}>
                    <Ionicons name="star" size={16} color="#FFD700" />
                    <Text style={styles.rating}>{destination.rating}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
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
  header: {
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  greeting: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginTop: 4,
  },
  quickActions: {
    flexDirection: 'row',
    padding: 20,
    justifyContent: 'space-around',
  },
  actionButton: {
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    minWidth: 120,
  },
  actionText: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: '600',
    color: '#007AFF',
  },
  section: {
    marginTop: 20,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  tripCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  tripInfo: {
    flex: 1,
  },
  tripTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  tripDescription: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  tripDates: {
    fontSize: 12,
    color: '#999',
    marginTop: 8,
  },
  statusContainer: {
    marginTop: 12,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  destinationCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginRight: 12,
    width: 200,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  destinationImage: {
    width: '100%',
    height: 120,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  destinationInfo: {
    padding: 12,
  },
  destinationName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  rating: {
    marginLeft: 4,
    fontSize: 14,
    color: '#666',
  },
});

export default HomeScreen;
