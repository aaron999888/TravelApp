import * as Location from 'expo-location';

// Restaurant data structure - like a C struct
export interface Restaurant {
  id: string;
  name: string;
  rating: number;
  distance: number; // in kilometers
  address: string;
  priceLevel?: number; // 1-4 scale
  isOpen?: boolean;
  photoReference?: string;
}

// Service class for mock restaurant data - like a C module with functions
export class PlacesService {
  // Constructor - like initializing a struct in C
  constructor() {
    // No API key needed for mock data
  }

  // Function to calculate distance between two points - like a math utility function
  private calculateDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number {
    // Haversine formula - calculates distance between two points on Earth
    // This is like a mathematical function you'd write in C
    const R = 6371; // Earth's radius in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c; // Distance in kilometers
  }

  // Function to search for restaurants near a location - like an API call function
  async searchRestaurants(
    location: Location.LocationObject,
    radius: number = 5000, // Default 5km radius
    minRating: number = 4.0
  ): Promise<Restaurant[]> {
    try {
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

      // Filter by minimum rating and sort by distance
      const filteredRestaurants = mockRestaurants
        .filter(restaurant => restaurant.rating >= minRating)
        .sort((a, b) => a.distance - b.distance);

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      return filteredRestaurants;
    } catch (error) {
      console.error('Error searching restaurants:', error);
      throw new Error('Failed to fetch restaurants. Please try again.');
    }
  }

  // Function to get restaurant details by place ID - like getting more info about a specific item
  async getRestaurantDetails(placeId: string): Promise<any> {
    // Mock restaurant details - like returning test data in C
    return {
      name: 'Restaurant Details',
      rating: 4.5,
      formatted_address: '123 Main Street',
      opening_hours: { open_now: true },
      price_level: 2,
    };
  }

  // Function to search restaurants by text query - like searching by name
  async searchRestaurantsByText(
    query: string,
    location: Location.LocationObject,
    radius: number = 5000
  ): Promise<Restaurant[]> {
    // For now, return the same mock data
    return this.searchRestaurants(location, radius, 4.0);
  }
}

// Create a singleton instance - like a global variable in C
export const placesService = new PlacesService();
