import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

import { RootStackParamList } from '../types';

type DestinationDetailScreenNavigationProp = StackNavigationProp<RootStackParamList, 'DestinationDetail'>;
type DestinationDetailScreenRouteProp = RouteProp<RootStackParamList, 'DestinationDetail'>;

interface Props {
  navigation: DestinationDetailScreenNavigationProp;
  route: DestinationDetailScreenRouteProp;
}

const { width } = Dimensions.get('window');

const DestinationDetailScreen: React.FC<Props> = ({ navigation, route }) => {
  const { destination } = route.params;

  const features = [
    { icon: 'camera-outline', title: 'Photo Spots', description: 'Perfect for photography' },
    { icon: 'restaurant-outline', title: 'Local Cuisine', description: 'Authentic food experiences' },
    { icon: 'bed-outline', title: 'Accommodation', description: 'Various lodging options' },
    { icon: 'car-outline', title: 'Transportation', description: 'Easy to get around' },
  ];

  const activities = [
    'Sightseeing Tours',
    'Cultural Experiences',
    'Adventure Activities',
    'Local Markets',
    'Historical Sites',
    'Nature Walks',
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Hero Image */}
        <View style={styles.heroContainer}>
          <Image source={{ uri: destination.image }} style={styles.heroImage} />
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.favoriteButton}>
            <Ionicons name="heart-outline" size={24} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Content */}
        <View style={styles.content}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.titleContainer}>
              <Text style={styles.title}>{destination.name}</Text>
              <View style={styles.ratingContainer}>
                <Ionicons name="star" size={20} color="#FFD700" />
                <Text style={styles.rating}>{destination.rating}</Text>
                <Text style={styles.ratingCount}>(128 reviews)</Text>
              </View>
            </View>
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryText}>
                {destination.category.charAt(0).toUpperCase() + destination.category.slice(1)}
              </Text>
            </View>
          </View>

          {/* Description */}
          <Text style={styles.description}>{destination.description}</Text>

          {/* Location */}
          <View style={styles.locationContainer}>
            <Ionicons name="location" size={20} color="#007AFF" />
            <Text style={styles.locationText}>
              {destination.location.latitude.toFixed(4)}, {destination.location.longitude.toFixed(4)}
            </Text>
          </View>

          {/* Features */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>What to Expect</Text>
            <View style={styles.featuresGrid}>
              {features.map((feature, index) => (
                <View key={index} style={styles.featureItem}>
                  <View style={styles.featureIcon}>
                    <Ionicons name={feature.icon as any} size={24} color="#007AFF" />
                  </View>
                  <Text style={styles.featureTitle}>{feature.title}</Text>
                  <Text style={styles.featureDescription}>{feature.description}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Activities */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Popular Activities</Text>
            <View style={styles.activitiesContainer}>
              {activities.map((activity, index) => (
                <View key={index} style={styles.activityItem}>
                  <Ionicons name="checkmark-circle" size={16} color="#34C759" />
                  <Text style={styles.activityText}>{activity}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            <TouchableOpacity style={styles.primaryButton}>
              <Ionicons name="add-circle" size={20} color="#fff" />
              <Text style={styles.primaryButtonText}>Add to Trip</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.secondaryButton}>
              <Ionicons name="map" size={20} color="#007AFF" />
              <Text style={styles.secondaryButtonText}>View on Map</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollView: {
    flex: 1,
  },
  heroContainer: {
    position: 'relative',
    height: 300,
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 20,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  favoriteButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 20,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    marginLeft: 4,
    fontSize: 16,
    color: '#333',
    fontWeight: '600',
  },
  ratingCount: {
    marginLeft: 8,
    fontSize: 14,
    color: '#666',
  },
  categoryBadge: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  categoryText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  description: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
    marginBottom: 20,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
  },
  locationText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#666',
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  featureItem: {
    width: (width - 60) / 2,
    backgroundColor: '#f8f9fa',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    alignItems: 'center',
  },
  featureIcon: {
    marginBottom: 8,
  },
  featureTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
    textAlign: 'center',
  },
  featureDescription: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  activitiesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '50%',
    marginBottom: 12,
  },
  activityText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#333',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  primaryButton: {
    flex: 1,
    backgroundColor: '#007AFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    marginRight: 10,
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
    marginLeft: 10,
  },
  secondaryButtonText: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});

export default DestinationDetailScreen;

