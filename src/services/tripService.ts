// Trip management service - like a C library for managing trip data
// This simulates a database for storing and retrieving trips

import { Trip } from '../types';

// Mock trip storage - like a C array of trip structs
let mockTrips: Trip[] = [
  {
    id: '1',
    title: 'European Adventure',
    description: 'Exploring the best of Europe',
    startDate: '2024-06-01',
    endDate: '2024-06-15',
    budget: 5000,
    destinations: [],
    flights: [],
    hotels: [],
    status: 'planned',
    sharedWith: [],
    createdBy: 'current-user',
    lastModified: '2024-01-01T00:00:00Z',
  },
  {
    id: '2',
    title: 'Asian Discovery',
    description: 'Cultural journey through Asia',
    startDate: '2024-07-01',
    endDate: '2024-07-20',
    budget: 3000,
    destinations: [],
    flights: [],
    hotels: [],
    status: 'ongoing',
    sharedWith: [],
    createdBy: 'current-user',
    lastModified: '2024-01-01T00:00:00Z',
  },
];

// Function to get all trips - like a C function that returns all records
export const getAllTrips = async (): Promise<Trip[]> => {
  // Simulate API delay - like a network call in C
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // Return copy of trips array - like copying data in C
  return [...mockTrips];
};

// Function to create a new trip - like a C function that adds to an array
export const createTrip = async (tripData: Omit<Trip, 'id' | 'lastModified'>): Promise<Trip> => {
  try {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // Create new trip with unique ID - like generating a unique identifier in C
    const newTrip: Trip = {
      ...tripData,
      id: Date.now().toString(), // Simple ID generation
      lastModified: new Date().toISOString(),
    };

    // Add to mock storage - like adding to an array in C
    mockTrips.push(newTrip);

    console.log('Trip created:', newTrip.title);
    return newTrip;
  } catch (error) {
    console.error('Failed to create trip:', error);
    throw error;
  }
};

// Function to update an existing trip - like a C function that modifies a struct
export const updateTrip = async (tripId: string, updates: Partial<Trip>): Promise<Trip> => {
  try {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 400));

    // Find trip by ID - like searching through an array in C
    const tripIndex = mockTrips.findIndex(trip => trip.id === tripId);
    
    if (tripIndex === -1) {
      throw new Error('Trip not found');
    }

    // Update trip - like modifying a struct in C
    const updatedTrip: Trip = {
      ...mockTrips[tripIndex],
      ...updates,
      lastModified: new Date().toISOString(),
    };

    // Replace in array - like updating an array element in C
    mockTrips[tripIndex] = updatedTrip;

    console.log('Trip updated:', updatedTrip.title);
    return updatedTrip;
  } catch (error) {
    console.error('Failed to update trip:', error);
    throw error;
  }
};

// Function to delete a trip - like a C function that removes from an array
export const deleteTrip = async (tripId: string): Promise<boolean> => {
  try {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));

    // Find and remove trip - like removing from an array in C
    const initialLength = mockTrips.length;
    mockTrips = mockTrips.filter(trip => trip.id !== tripId);

    const wasDeleted = mockTrips.length < initialLength;
    
    if (wasDeleted) {
      console.log('Trip deleted:', tripId);
    } else {
      console.log('Trip not found:', tripId);
    }

    return wasDeleted;
  } catch (error) {
    console.error('Failed to delete trip:', error);
    return false;
  }
};

// Function to get trip by ID - like a C function that searches for a specific record
export const getTripById = async (tripId: string): Promise<Trip | null> => {
  try {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 200));

    // Find trip by ID - like searching through an array in C
    const trip = mockTrips.find(trip => trip.id === tripId);
    
    return trip || null;
  } catch (error) {
    console.error('Failed to get trip:', error);
    return null;
  }
};

// Function to get trips by status - like a C function that filters data
export const getTripsByStatus = async (status: Trip['status']): Promise<Trip[]> => {
  try {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 250));

    // Filter trips by status - like filtering an array in C
    const filteredTrips = mockTrips.filter(trip => trip.status === status);
    
    return filteredTrips;
  } catch (error) {
    console.error('Failed to get trips by status:', error);
    return [];
  }
};

