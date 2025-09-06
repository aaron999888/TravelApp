export interface Destination {
  id: string;
  name: string;
  description: string;
  image: string;
  location: {
    latitude: number;
    longitude: number;
  };
  rating: number;
  category: 'beach' | 'mountain' | 'city' | 'nature' | 'historical';
}

// Flight information structure - similar to a C struct
export interface Flight {
  id: string;
  airline: string;
  flightNumber: string;
  departure: {
    airport: string;
    time: string;
    date: string;
  };
  arrival: {
    airport: string;
    time: string;
    date: string;
  };
  duration: string;
  price: number;
  class: 'economy' | 'premium' | 'business' | 'first';
  // Delta Diamond perks
  perks: {
    freeUpgrade: boolean;
    priorityBoarding: boolean;
    loungeAccess: boolean;
    bonusMiles: number;
  };
}

// Hotel information structure - similar to a C struct
export interface Hotel {
  id: string;
  name: string;
  location: string;
  rating: number;
  price: number;
  amenities: string[];
  image: string;
  // Hilton Honors perks
  perks: {
    freeUpgrade: boolean;
    lateCheckout: boolean;
    freeBreakfast: boolean;
    bonusPoints: number;
    ownerPricing: boolean;
  };
}

export interface Trip {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  budget: number;
  destinations: Destination[];
  flights: Flight[];
  hotels: Hotel[];
  status: 'planned' | 'ongoing' | 'completed';
  // Shared access for spouse collaboration
  sharedWith: string[];
  createdBy: string;
  lastModified: string;
  // Sharing status for UI display
  isShared?: boolean;
  sharedWithSpouse?: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  // Loyalty program memberships
  loyaltyPrograms: {
    deltaDiamond: boolean;
    hiltonHonors: boolean;
  };
}

// Google Calendar event structure
export interface CalendarEvent {
  id: string;
  title: string;
  start: string;
  end: string;
  description: string;
  location?: string;
}

export type RootStackParamList = {
  Home: undefined;
  Destinations: undefined;
  TripPlanner: undefined;
  Profile: undefined;
  DestinationDetail: { destination: Destination };
  TripDetail: { trip: Trip };
  BookingResults: { 
    destination: string; 
    startDate: string; 
    endDate: string; 
    budget: number;
  };
  Restaurants: { sharedTrip?: Trip };
};

// Interface for sharing invitation - like a C struct
export interface SharingInvitation {
  id: string;
  tripId: string;
  fromUser: string;
  toUser: string;
  status: 'pending' | 'accepted' | 'declined';
  createdAt: string;
}

// Interface for shared trip data - like a C struct
export interface SharedTrip {
  id: string;
  tripData: Trip;
  sharedWith: string[];
  createdBy: string;
  createdAt: string;
  lastModified: string;
  isActive: boolean;
}
