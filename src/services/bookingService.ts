// Mock booking service - simulates API calls for flights and hotels
// This is similar to a C library with functions that return data structures

import { Flight, Hotel } from '../types';

// Mock flight data - like a C array of structs
const mockFlights: Flight[] = [
  {
    id: '1',
    airline: 'Delta Airlines',
    flightNumber: 'DL1234',
    departure: {
      airport: 'JFK',
      time: '08:30',
      date: '2024-06-01'
    },
    arrival: {
      airport: 'LAX',
      time: '11:45',
      date: '2024-06-01'
    },
    duration: '5h 15m',
    price: 450,
    class: 'economy',
    perks: {
      freeUpgrade: true,        // Delta Diamond perk
      priorityBoarding: true,   // Delta Diamond perk
      loungeAccess: true,       // Delta Diamond perk
      bonusMiles: 5000         // Delta Diamond bonus
    }
  },
  {
    id: '2',
    airline: 'Delta Airlines',
    flightNumber: 'DL5678',
    departure: {
      airport: 'JFK',
      time: '14:20',
      date: '2024-06-01'
    },
    arrival: {
      airport: 'LAX',
      time: '17:35',
      date: '2024-06-01'
    },
    duration: '5h 15m',
    price: 380,
    class: 'premium',
    perks: {
      freeUpgrade: false,
      priorityBoarding: true,
      loungeAccess: true,
      bonusMiles: 3000
    }
  },
  {
    id: '3',
    airline: 'American Airlines',
    flightNumber: 'AA9876',
    departure: {
      airport: 'JFK',
      time: '10:15',
      date: '2024-06-01'
    },
    arrival: {
      airport: 'LAX',
      time: '13:30',
      date: '2024-06-01'
    },
    duration: '5h 15m',
    price: 420,
    class: 'economy',
    perks: {
      freeUpgrade: false,
      priorityBoarding: false,
      loungeAccess: false,
      bonusMiles: 0
    }
  }
];

// Mock hotel data - like a C array of structs
const mockHotels: Hotel[] = [
  {
    id: '1',
    name: 'Hilton Los Angeles Airport',
    location: 'Los Angeles, CA',
    rating: 4.2,
    price: 180,
    amenities: ['Free WiFi', 'Pool', 'Gym', 'Restaurant'],
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400',
    perks: {
      freeUpgrade: true,        // Hilton Honors perk
      lateCheckout: true,       // Hilton Honors perk
      freeBreakfast: true,      // Hilton Honors perk
      bonusPoints: 2000,       // Hilton Honors bonus
      ownerPricing: true       // Hilton Honors owner pricing
    }
  },
  {
    id: '2',
    name: 'Marriott Los Angeles',
    location: 'Los Angeles, CA',
    rating: 4.0,
    price: 160,
    amenities: ['Free WiFi', 'Pool', 'Gym', 'Spa'],
    image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400',
    perks: {
      freeUpgrade: false,
      lateCheckout: false,
      freeBreakfast: false,
      bonusPoints: 0,
      ownerPricing: false
    }
  },
  {
    id: '3',
    name: 'Hilton Garden Inn LAX',
    location: 'Los Angeles, CA',
    rating: 4.1,
    price: 140,
    amenities: ['Free WiFi', 'Pool', 'Business Center'],
    image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=400',
    perks: {
      freeUpgrade: true,        // Hilton Honors perk
      lateCheckout: true,       // Hilton Honors perk
      freeBreakfast: false,
      bonusPoints: 1500,       // Hilton Honors bonus
      ownerPricing: true       // Hilton Honors owner pricing
    }
  }
];

// Function to search flights - similar to a C function that takes parameters and returns data
export const searchFlights = async (
  origin: string, 
  destination: string, 
  departureDate: string,
  budget: number
): Promise<Flight[]> => {
  // Simulate API delay - like a network call in C
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Filter flights based on budget - like filtering an array in C
  const filteredFlights = mockFlights.filter(flight => flight.price <= budget);
  
  // Return filtered results - like returning a pointer to an array in C
  return filteredFlights;
};

// Function to search hotels - similar to a C function
export const searchHotels = async (
  location: string,
  checkIn: string,
  checkOut: string,
  budget: number
): Promise<Hotel[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Filter hotels based on budget
  const filteredHotels = mockHotels.filter(hotel => hotel.price <= budget);
  
  return filteredHotels;
};

// Function to get loyalty program benefits - like a C function that checks membership status
export const getLoyaltyBenefits = (user: any) => {
  const benefits = {
    deltaDiamond: {
      hasMembership: user?.loyaltyPrograms?.deltaDiamond || false,
      benefits: [
        'Free upgrades to premium economy',
        'Priority boarding',
        'Sky Club lounge access',
        'Bonus miles on all flights'
      ]
    },
    hiltonHonors: {
      hasMembership: user?.loyaltyPrograms?.hiltonHonors || false,
      benefits: [
        'Free room upgrades',
        'Late checkout (4 PM)',
        'Free breakfast',
        'Bonus points on stays',
        'Owner pricing discounts'
      ]
    }
  };
  
  return benefits;
};

// Error handling function - similar to error handling in C
export const handleBookingError = (error: any): string => {
  // Check error type and return appropriate message
  if (error.message?.includes('network')) {
    return 'Network error: Please check your internet connection';
  } else if (error.message?.includes('timeout')) {
    return 'Request timeout: Please try again';
  } else if (error.message?.includes('budget')) {
    return 'No results found within your budget. Try increasing your budget.';
  } else {
    return 'An unexpected error occurred. Please try again.';
  }
};

