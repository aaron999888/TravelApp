import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Image,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

import { RootStackParamList } from '../types';
import SharingComponent from '../components/SharingComponent';

type TripDetailScreenNavigationProp = StackNavigationProp<RootStackParamList, 'TripDetail'>;
type TripDetailScreenRouteProp = RouteProp<RootStackParamList, 'TripDetail'>;

interface Props {
  navigation: TripDetailScreenNavigationProp;
  route: TripDetailScreenRouteProp;
}

const TripDetailScreen: React.FC<Props> = ({ navigation, route }) => {
  const { trip } = route.params;

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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'planned': return '#FF9800';
      case 'ongoing': return '#4CAF50';
      case 'completed': return '#2196F3';
      default: return '#9E9E9E';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'planned': return 'calendar-outline';
      case 'ongoing': return 'play-circle-outline';
      case 'completed': return 'checkmark-circle-outline';
      default: return 'help-circle-outline';
    }
  };

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
          <TouchableOpacity style={styles.moreButton}>
            <Ionicons name="ellipsis-horizontal" size={24} color="#333" />
          </TouchableOpacity>
        </View>

        {/* Trip Info */}
        <View style={styles.tripInfo}>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>{trip.title}</Text>
            <View style={[styles.statusBadge, { backgroundColor: getStatusColor(trip.status) }]}>
              <Ionicons name={getStatusIcon(trip.status) as any} size={16} color="#fff" />
              <Text style={styles.statusText}>
                {trip.status.charAt(0).toUpperCase() + trip.status.slice(1)}
              </Text>
            </View>
          </View>
          
          {trip.description && (
            <Text style={styles.description}>{trip.description}</Text>
          )}

          <View style={styles.dateContainer}>
            <View style={styles.dateItem}>
              <Ionicons name="calendar-outline" size={20} color="#007AFF" />
              <View style={styles.dateInfo}>
                <Text style={styles.dateLabel}>Start Date</Text>
                <Text style={styles.dateValue}>{trip.startDate}</Text>
              </View>
            </View>
            <View style={styles.dateItem}>
              <Ionicons name="calendar-outline" size={20} color="#007AFF" />
              <View style={styles.dateInfo}>
                <Text style={styles.dateLabel}>End Date</Text>
                <Text style={styles.dateValue}>{trip.endDate}</Text>
              </View>
            </View>
          </View>

          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{trip.destinations.length}</Text>
              <Text style={styles.statLabel}>Destinations</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>
                {Math.ceil((new Date(trip.endDate).getTime() - new Date(trip.startDate).getTime()) / (1000 * 60 * 60 * 24))}
              </Text>
              <Text style={styles.statLabel}>Days</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>
                {trip.destinations.reduce((acc, dest) => acc + dest.rating, 0) / trip.destinations.length}
              </Text>
              <Text style={styles.statLabel}>Avg Rating</Text>
            </View>
          </View>
        </View>

        {/* Sharing Component */}
        <View style={styles.section}>
          <SharingComponent trip={trip} onSharingStatusChange={(isShared) => {
            // Handle sharing status change if needed
            console.log('Sharing status changed:', isShared);
          }} />
        </View>

        {/* Destinations */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Destinations</Text>
          {trip.destinations.map((destination, index) => (
            <TouchableOpacity
              key={destination.id}
              style={styles.destinationCard}
              onPress={() => navigation.navigate('DestinationDetail', { destination })}
            >
              <Image source={{ uri: destination.image }} style={styles.destinationImage} />
              <View style={styles.destinationInfo}>
                <View style={styles.destinationHeader}>
                  <Text style={styles.destinationName}>{destination.name}</Text>
                  <View style={styles.ratingContainer}>
                    <Ionicons name="star" size={16} color="#FFD700" />
                    <Text style={styles.rating}>{destination.rating}</Text>
                  </View>
                </View>
                <Text style={styles.destinationDescription} numberOfLines={2}>
                  {destination.description}
                </Text>
                <View style={styles.destinationFooter}>
                  <View style={styles.categoryContainer}>
                    <Text style={styles.categoryText}>
                      {destination.category.charAt(0).toUpperCase() + destination.category.slice(1)}
                    </Text>
                  </View>
                  <Text style={styles.dayNumber}>Day {index + 1}</Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#C7C7CC" />
            </TouchableOpacity>
          ))}
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          {trip.status === 'planned' && (
            <TouchableOpacity style={styles.primaryButton}>
              <Ionicons name="play" size={20} color="#fff" />
              <Text style={styles.primaryButtonText}>Start Trip</Text>
            </TouchableOpacity>
          )}
          {trip.status === 'ongoing' && (
            <TouchableOpacity style={styles.primaryButton}>
              <Ionicons name="checkmark" size={20} color="#fff" />
              <Text style={styles.primaryButtonText}>Complete Trip</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity style={styles.secondaryButton}>
            <Ionicons name="share-outline" size={20} color="#007AFF" />
            <Text style={styles.secondaryButtonText}>Share Trip</Text>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  backButton: {
    padding: 8,
  },
  moreButton: {
    padding: 8,
  },
  tripInfo: {
    backgroundColor: '#fff',
    padding: 20,
    marginBottom: 20,
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
    marginRight: 12,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  description: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
    marginBottom: 20,
  },
  dateContainer: {
    marginBottom: 20,
  },
  dateItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  dateInfo: {
    marginLeft: 12,
  },
  dateLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  dateValue: {
    fontSize: 16,
    color: '#333',
    fontWeight: '600',
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 16,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
  },
  section: {
    backgroundColor: '#fff',
    padding: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  destinationCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 12,
    marginBottom: 12,
    backgroundColor: '#fff',
  },
  destinationImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 12,
  },
  destinationInfo: {
    flex: 1,
  },
  destinationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  destinationName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
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
  dayNumber: {
    fontSize: 12,
    color: '#007AFF',
    fontWeight: '600',
  },
  actionButtons: {
    flexDirection: 'row',
    padding: 20,
    gap: 12,
  },
  primaryButton: {
    flex: 1,
    backgroundColor: '#007AFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  secondaryButton: {
    flex: 1,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#007AFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
  },
  secondaryButtonText: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});

export default TripDetailScreen;
