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
}

// Main component function - like a C function that returns a UI
const RestaurantScreen: React.FC<RestaurantScreenProps> = ({ navigation }) => {
  // State variables - like C variables but they can change and trigger UI updates
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

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
});

export default RestaurantScreen;