// Shared access service for spouse collaboration
// This simulates sharing trips between users - like a C system for user permissions

import { Trip, User } from '../types';

// Mock user database - like a C array of user structs
const mockUsers: User[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john.doe@example.com',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
    loyaltyPrograms: {
      deltaDiamond: true,
      hiltonHonors: true
    }
  },
  {
    id: '2',
    name: 'Jane Doe',
    email: 'jane.doe@example.com',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150',
    loyaltyPrograms: {
      deltaDiamond: false,
      hiltonHonors: true
    }
  }
];

// Mock shared trips - like a C array of trip structs with sharing info
const sharedTrips: { tripId: string; sharedWith: string[]; permissions: string[] }[] = [];

// Function to share trip with spouse - like a C function that modifies permissions
export const shareTripWithSpouse = async (
  tripId: string, 
  spouseEmail: string, 
  permissions: string[] = ['view', 'edit']
): Promise<boolean> => {
  try {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // Find existing sharing record - like searching through an array in C
    const existingShare = sharedTrips.find(share => share.tripId === tripId);
    
    if (existingShare) {
      // Update existing sharing - like modifying a struct in C
      if (!existingShare.sharedWith.includes(spouseEmail)) {
        existingShare.sharedWith.push(spouseEmail);
      }
      existingShare.permissions = permissions;
    } else {
      // Create new sharing record - like adding to an array in C
      sharedTrips.push({
        tripId,
        sharedWith: [spouseEmail],
        permissions
      });
    }

    console.log(`Trip ${tripId} shared with ${spouseEmail} with permissions:`, permissions);
    return true;
  } catch (error) {
    console.error('Failed to share trip:', error);
    return false;
  }
};

// Function to get shared trips for a user - like a C function that returns filtered data
export const getSharedTrips = async (userEmail: string): Promise<string[]> => {
  try {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 300));

    // Find trips shared with this user - like filtering an array in C
    const userSharedTrips = sharedTrips
      .filter(share => share.sharedWith.includes(userEmail))
      .map(share => share.tripId);

    return userSharedTrips;
  } catch (error) {
    console.error('Failed to get shared trips:', error);
    return [];
  }
};

// Function to check if user can edit trip - like a C function that checks permissions
export const canUserEditTrip = (tripId: string, userEmail: string): boolean => {
  const share = sharedTrips.find(s => s.tripId === tripId);
  
  if (!share) {
    return false; // Trip not shared
  }

  if (!share.sharedWith.includes(userEmail)) {
    return false; // User not in shared list
  }

  return share.permissions.includes('edit');
};

// Function to get trip collaborators - like a C function that returns user list
export const getTripCollaborators = async (tripId: string): Promise<User[]> => {
  try {
    const share = sharedTrips.find(s => s.tripId === tripId);
    
    if (!share) {
      return [];
    }

    // Find user objects for shared emails - like joining data in C
    const collaborators = mockUsers.filter(user => 
      share.sharedWith.includes(user.email)
    );

    return collaborators;
  } catch (error) {
    console.error('Failed to get collaborators:', error);
    return [];
  }
};

// Function to remove sharing access - like a C function that removes permissions
export const removeSharingAccess = async (
  tripId: string, 
  userEmail: string
): Promise<boolean> => {
  try {
    const share = sharedTrips.find(s => s.tripId === tripId);
    
    if (share) {
      // Remove user from shared list - like removing from an array in C
      share.sharedWith = share.sharedWith.filter(email => email !== userEmail);
      
      // If no more users, remove the sharing record
      if (share.sharedWith.length === 0) {
        const index = sharedTrips.indexOf(share);
        sharedTrips.splice(index, 1);
      }
    }

    return true;
  } catch (error) {
    console.error('Failed to remove sharing access:', error);
    return false;
  }
};

// Function to get user by email - like a C function that searches for a user
export const getUserByEmail = (email: string): User | null => {
  return mockUsers.find(user => user.email === email) || null;
};

// Function to get all users (for sharing dropdown) - like a C function that returns all records
export const getAllUsers = (): User[] => {
  return [...mockUsers]; // Return copy of array - like copying data in C
};

