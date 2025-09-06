import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  SafeAreaView,
  TextInput,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';

import { RootStackParamList, Destination } from '../types';

type DestinationsScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Destinations'>;

interface Props {
  navigation: DestinationsScreenNavigationProp;
}

const mockDestinations: Destination[] = [
  {
    id: '1',
    name: 'Santorini, Greece',
    description: 'Beautiful Greek island with stunning sunsets and white-washed buildings',
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
    description: 'Majestic mountain ranges perfect for adventure and relaxation',
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400',
    location: { latitude: 46.5197, longitude: 6.6323 },
    rating: 4.9,
    category: 'mountain',
  },
  {
    id: '4',
    name: 'Bali, Indonesia',
    description: 'Tropical paradise with rich culture and beautiful beaches',
    image: 'https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?w=400',
    location: { latitude: -8.3405, longitude: 115.0920 },
    rating: 4.6,
    category: 'beach',
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
    name: 'Yellowstone National Park',
    description: 'America\'s first national park with geysers and wildlife',
    image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400',
    location: { latitude: 44.4280, longitude: -110.5885 },
    rating: 4.8,
    category: 'nature',
  },
  {
    id: '7',
    name: 'Amsterdam, Netherlands',
    description: 'Charming canals, historic architecture, and vibrant culture',
    image: 'https://images.unsplash.com/photo-1534351590666-13e3e96b5017?w=400',
    location: { latitude: 52.3676, longitude: 4.9041 },
    rating: 4.6,
    category: 'city',
  },
  {
    id: '8',
    name: 'London, England',
    description: 'Historic capital with royal palaces and modern attractions',
    image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=400',
    location: { latitude: 51.5074, longitude: -0.1278 },
    rating: 4.4,
    category: 'city',
  },
  {
    id: '9',
    name: 'Rome, Italy',
    description: 'Eternal city with ancient ruins and world-class cuisine',
    image: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=400',
    location: { latitude: 41.9028, longitude: 12.4964 },
    rating: 4.7,
    category: 'historical',
  },
  {
    id: '10',
    name: 'New York City, USA',
    description: 'The city that never sleeps with iconic landmarks',
    image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=400',
    location: { latitude: 40.7128, longitude: -74.0060 },
    rating: 4.3,
    category: 'city',
  },
  {
    id: '11',
    name: 'Barcelona, Spain',
    description: 'Artistic city with Gaudí architecture and Mediterranean charm',
    image: 'https://images.unsplash.com/photo-1539037116277-4db20889f2d4?w=400',
    location: { latitude: 41.3851, longitude: 2.1734 },
    rating: 4.5,
    category: 'city',
  },
  {
    id: '12',
    name: 'Sydney, Australia',
    description: 'Harbor city with iconic Opera House and beautiful beaches',
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400',
    location: { latitude: -33.8688, longitude: 151.2093 },
    rating: 4.6,
    category: 'city',
  },
  {
    id: '13',
    name: 'Dubai, UAE',
    description: 'Modern metropolis with luxury shopping and futuristic architecture',
    image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=400',
    location: { latitude: 25.2048, longitude: 55.2708 },
    rating: 4.4,
    category: 'city',
  },
  {
    id: '14',
    name: 'Machu Picchu, Peru',
    description: 'Ancient Incan citadel high in the Andes mountains',
    image: 'https://images.unsplash.com/photo-1526392060635-9d6019884377?w=400',
    location: { latitude: -13.1631, longitude: -72.5450 },
    rating: 4.9,
    category: 'historical',
  },
  {
    id: '15',
    name: 'Iceland',
    description: 'Land of fire and ice with glaciers, geysers, and Northern Lights',
    image: 'https://images.unsplash.com/photo-1539650116574-75c0c6d73c6e?w=400',
    location: { latitude: 64.9631, longitude: -19.0208 },
    rating: 4.8,
    category: 'nature',
  },
];

const categories = ['All', 'Beach', 'Mountain', 'City', 'Nature', 'Historical'];

const DestinationsScreen: React.FC<Props> = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredDestinations = mockDestinations.filter(destination => {
    const matchesSearch = destination.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         destination.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || 
                           destination.category === selectedCategory.toLowerCase();
    return matchesSearch && matchesCategory;
  });

  const renderDestination = ({ item }: { item: Destination }) => (
    <TouchableOpacity
      style={styles.destinationCard}
      onPress={() => navigation.navigate('DestinationDetail', { destination: item })}
    >
      <Image source={{ uri: item.image }} style={styles.destinationImage} />
      <View style={styles.destinationInfo}>
        <View style={styles.destinationHeader}>
          <Text style={styles.destinationName}>{item.name}</Text>
          <View style={styles.ratingContainer}>
            <Ionicons name="star" size={16} color="#FFD700" />
            <Text style={styles.rating}>{item.rating}</Text>
          </View>
        </View>
        <Text style={styles.destinationDescription} numberOfLines={2}>
          {item.description}
        </Text>
        <View style={styles.categoryContainer}>
          <View style={[styles.categoryBadge, { backgroundColor: getCategoryColor(item.category) }]}>
            <Text style={styles.categoryText}>
              {item.category.charAt(0).toUpperCase() + item.category.slice(1)}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  const getCategoryColor = (category: string) => {
    const colors = {
      beach: '#4FC3F7',
      mountain: '#81C784',
      city: '#FFB74D',
      nature: '#A5D6A7',
      historical: '#CE93D8',
    };
    return colors[category as keyof typeof colors] || '#E0E0E0';
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color="#666" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search destinations..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      {/* Category Filter */}
      <View style={styles.categoryContainer}>
        <FlatList
          data={categories}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.categoryButton,
                selectedCategory === item && styles.selectedCategoryButton
              ]}
              onPress={() => setSelectedCategory(item)}
            >
              <Text style={[
                styles.categoryButtonText,
                selectedCategory === item && styles.selectedCategoryButtonText
              ]}>
                {item}
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>

      {/* Destinations List */}
      <FlatList
        data={filteredDestinations}
        renderItem={renderDestination}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  searchContainer: {
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
    color: '#333',
  },
  categoryContainer: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    marginRight: 10,
  },
  selectedCategoryButton: {
    backgroundColor: '#007AFF',
  },
  categoryButtonText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  selectedCategoryButtonText: {
    color: '#fff',
  },
  listContainer: {
    padding: 20,
  },
  destinationCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
  },
  destinationImage: {
    width: '100%',
    height: 200,
  },
  destinationInfo: {
    padding: 16,
  },
  destinationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  destinationName: {
    fontSize: 18,
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
    lineHeight: 20,
    marginBottom: 12,
  },
  categoryBadgeContainer: {
    flexDirection: 'row',
  },
  categoryBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  categoryText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
});

export default DestinationsScreen;
