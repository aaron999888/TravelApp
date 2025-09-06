// Sharing service for itinerary collaboration between spouses
// This service handles sharing trips using Firebase and local storage
// Written with C-style comments for 1990s programmer understanding

import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  getDocs, 
  query, 
  where, 
  orderBy,
  onSnapshot,
  Timestamp 
} from 'firebase/firestore';
// Import AsyncStorage with fallback - like error handling in C
import mockAsyncStorage from '../utils/mockAsyncStorage';

// Use mock AsyncStorage directly - like using a fallback in C
const AsyncStorage = mockAsyncStorage;

import { db } from '../config/firebase';
import { Trip } from '../types';

// Interface for shared trip data - like a C struct
interface SharedTrip {
  id: string;
  tripData: Trip;
  sharedWith: string[]; // Array of spouse email addresses
  createdBy: string;
  createdAt: Timestamp;
  lastModified: Timestamp;
  isActive: boolean; // Whether the trip is still being shared
}

// Interface for sharing invitation - like a C struct
interface SharingInvitation {
  id: string;
  tripId: string;
  fromUser: string;
  toUser: string;
  status: 'pending' | 'accepted' | 'declined';
  createdAt: Timestamp;
}

// Constants for storage keys - like #define in C
const STORAGE_KEYS = {
  CURRENT_USER: 'current_user',
  SHARED_TRIPS: 'shared_trips',
  PENDING_INVITATIONS: 'pending_invitations'
};

// Function to get current user from local storage - like reading from a file in C
export const getCurrentUser = async (): Promise<string | null> => {
  try {
    const user = await AsyncStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    return user;
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
};

// Function to set current user in local storage - like writing to a file in C
export const setCurrentUser = async (email: string): Promise<void> => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.CURRENT_USER, email);
  } catch (error) {
    console.error('Error setting current user:', error);
  }
};

// Function to share a trip with spouse - like sending data to another process in C
export const shareTrip = async (
  trip: Trip, 
  spouseEmail: string
): Promise<{ success: boolean; message: string }> => {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return { success: false, message: 'User not logged in' };
    }

    // Create shared trip document in Firebase - like creating a record in a database
    const sharedTripData: Omit<SharedTrip, 'id'> = {
      tripData: trip,
      sharedWith: [spouseEmail],
      createdBy: currentUser,
      createdAt: Timestamp.now(),
      lastModified: Timestamp.now(),
      isActive: true
    };

    // Add to Firebase collection - like inserting into a database table
    const docRef = await addDoc(collection(db, 'sharedTrips'), sharedTripData);
    
    // Create sharing invitation - like creating a notification in C
    const invitationData: Omit<SharingInvitation, 'id'> = {
      tripId: docRef.id,
      fromUser: currentUser,
      toUser: spouseEmail,
      status: 'pending',
      createdAt: Timestamp.now()
    };

    await addDoc(collection(db, 'sharingInvitations'), invitationData);

    // Store locally for offline access - like caching data in C
    await storeSharedTripLocally(docRef.id, sharedTripData);

    return { 
      success: true, 
      message: `Trip "${trip.title}" shared with ${spouseEmail}` 
    };
  } catch (error) {
    console.error('Error sharing trip:', error);
    return { 
      success: false, 
      message: 'Failed to share trip. Please try again.' 
    };
  }
};

// Function to get shared trips for current user - like querying a database in C
export const getSharedTrips = async (): Promise<Trip[]> => {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return [];
    }

    // Query Firebase for trips shared with current user - like SQL SELECT
    const q = query(
      collection(db, 'sharedTrips'),
      where('sharedWith', 'array-contains', currentUser),
      where('isActive', '==', true),
      orderBy('lastModified', 'desc')
    );

    const querySnapshot = await getDocs(q);
    const sharedTrips: Trip[] = [];

    // Process each document - like iterating through query results in C
    querySnapshot.forEach((doc) => {
      const data = doc.data() as SharedTrip;
      sharedTrips.push(data.tripData);
    });

    // Also get locally stored trips for offline access
    const localTrips = await getLocalSharedTrips();
    sharedTrips.push(...localTrips);

    return sharedTrips;
  } catch (error) {
    console.error('Error getting shared trips:', error);
    // Fallback to local storage if Firebase fails
    return await getLocalSharedTrips();
  }
};

// Function to update a shared trip - like updating a record in a database
export const updateSharedTrip = async (
  tripId: string, 
  updatedTrip: Trip
): Promise<{ success: boolean; message: string }> => {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return { success: false, message: 'User not logged in' };
    }

    // Update in Firebase - like UPDATE in SQL
    const tripRef = doc(db, 'sharedTrips', tripId);
    await updateDoc(tripRef, {
      tripData: updatedTrip,
      lastModified: Timestamp.now()
    });

    // Update locally - like updating a cache in C
    await updateLocalSharedTrip(tripId, updatedTrip);

    return { 
      success: true, 
      message: 'Trip updated successfully' 
    };
  } catch (error) {
    console.error('Error updating shared trip:', error);
    return { 
      success: false, 
      message: 'Failed to update trip. Please try again.' 
    };
  }
};

// Function to stop sharing a trip - like removing access in C
export const stopSharingTrip = async (
  tripId: string
): Promise<{ success: boolean; message: string }> => {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return { success: false, message: 'User not logged in' };
    }

    // Mark as inactive in Firebase - like soft delete in database
    const tripRef = doc(db, 'sharedTrips', tripId);
    await updateDoc(tripRef, {
      isActive: false,
      lastModified: Timestamp.now()
    });

    // Remove from local storage - like clearing cache in C
    await removeLocalSharedTrip(tripId);

    return { 
      success: true, 
      message: 'Trip sharing stopped' 
    };
  } catch (error) {
    console.error('Error stopping trip sharing:', error);
    return { 
      success: false, 
      message: 'Failed to stop sharing. Please try again.' 
    };
  }
};

// Function to listen for real-time updates - like event handling in C
export const subscribeToSharedTrips = (
  callback: (trips: Trip[]) => void
): (() => void) => {
  const currentUser = getCurrentUser();
  
  if (!currentUser) {
    callback([]);
    return () => {}; // Return empty unsubscribe function
  }

  // Set up real-time listener - like setting up an interrupt handler in C
  const q = query(
    collection(db, 'sharedTrips'),
    where('sharedWith', 'array-contains', currentUser),
    where('isActive', '==', true),
    orderBy('lastModified', 'desc')
  );

  const unsubscribe = onSnapshot(q, (querySnapshot) => {
    const sharedTrips: Trip[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data() as SharedTrip;
      sharedTrips.push(data.tripData);
    });
    callback(sharedTrips);
  });

  return unsubscribe; // Return function to stop listening
};

// Local storage functions - like file I/O operations in C

// Store shared trip locally for offline access
const storeSharedTripLocally = async (
  tripId: string, 
  sharedTrip: Omit<SharedTrip, 'id'>
): Promise<void> => {
  try {
    const existingTrips = await getLocalSharedTrips();
    const updatedTrips = [...existingTrips, sharedTrip.tripData];
    await AsyncStorage.setItem(
      STORAGE_KEYS.SHARED_TRIPS, 
      JSON.stringify(updatedTrips)
    );
  } catch (error) {
    console.error('Error storing shared trip locally:', error);
  }
};

// Get shared trips from local storage
const getLocalSharedTrips = async (): Promise<Trip[]> => {
  try {
    const tripsJson = await AsyncStorage.getItem(STORAGE_KEYS.SHARED_TRIPS);
    return tripsJson ? JSON.parse(tripsJson) : [];
  } catch (error) {
    console.error('Error getting local shared trips:', error);
    return [];
  }
};

// Update shared trip in local storage
const updateLocalSharedTrip = async (
  tripId: string, 
  updatedTrip: Trip
): Promise<void> => {
  try {
    const existingTrips = await getLocalSharedTrips();
    const updatedTrips = existingTrips.map(trip => 
      trip.id === tripId ? updatedTrip : trip
    );
    await AsyncStorage.setItem(
      STORAGE_KEYS.SHARED_TRIPS, 
      JSON.stringify(updatedTrips)
    );
  } catch (error) {
    console.error('Error updating local shared trip:', error);
  }
};

// Remove shared trip from local storage
const removeLocalSharedTrip = async (tripId: string): Promise<void> => {
  try {
    const existingTrips = await getLocalSharedTrips();
    const updatedTrips = existingTrips.filter(trip => trip.id !== tripId);
    await AsyncStorage.setItem(
      STORAGE_KEYS.SHARED_TRIPS, 
      JSON.stringify(updatedTrips)
    );
  } catch (error) {
    console.error('Error removing local shared trip:', error);
  }
};