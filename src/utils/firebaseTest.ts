// Simple Firebase test utility
// This tests if Firebase is working correctly
// Written with C-style comments for 1990s programmer understanding

import { db } from '../config/firebase';
import { collection, addDoc, getDocs } from 'firebase/firestore';

// Function to test Firebase connection - like a test function in C
export const testFirebaseConnection = async (): Promise<{ success: boolean; message: string }> => {
  try {
    console.log('🔥 Testing Firebase connection...');
    
    // Test adding a simple document - like writing to a file in C
    const testData = {
      message: 'Hello from Travel App!',
      timestamp: new Date().toISOString(),
      testId: Math.random().toString(36).substr(2, 9)
    };
    
    // Add document to test collection - like inserting into database in C
    const docRef = await addDoc(collection(db, 'test'), testData);
    console.log('✅ Test document created with ID:', docRef.id);
    
    // Test reading documents - like querying database in C
    const querySnapshot = await getDocs(collection(db, 'test'));
    const documents = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    console.log('✅ Test documents read:', documents.length, 'documents found');
    console.log('🎉 Firebase is working correctly!');
    
    return {
      success: true,
      message: 'Firebase connection successful!'
    };
    
  } catch (error: any) {
    console.error('❌ Firebase test failed:', error.message);
    
    // Check for specific error types - like error handling in C
    if (error.code === 'permission-denied') {
      return {
        success: false,
        message: 'Permission denied. Please check Firestore rules.'
      };
    } else if (error.code === 'unavailable') {
      return {
        success: false,
        message: 'Firebase service unavailable. Please check your internet connection.'
      };
    } else {
      return {
        success: false,
        message: `Firebase error: ${error.message}`
      };
    }
  }
};

// Function to test sharing service - like testing a module in C
export const testSharingService = async (): Promise<{ success: boolean; message: string }> => {
  try {
    console.log('🔄 Testing sharing service...');
    
    // Import sharing service functions - like importing modules in C
    const { setCurrentUser, shareTrip } = await import('../services/sharingService');
    
    // Set test user - like setting a variable in C
    await setCurrentUser('test@travelapp.com');
    console.log('✅ Test user set');
    
    // Create test trip - like creating test data in C
    const testTrip = {
      id: 'test-trip-' + Date.now(),
      title: 'Test Trip',
      description: 'This is a test trip for Firebase testing',
      startDate: '2024-01-01',
      endDate: '2024-01-07',
      budget: 1000,
      destinations: [],
      flights: [],
      hotels: [],
      status: 'planned' as const,
      sharedWith: [],
      createdBy: 'test@travelapp.com',
      lastModified: new Date().toISOString(),
      isShared: false,
      sharedWithSpouse: false
    };
    
    // Test sharing trip - like calling a function in C
    const result = await shareTrip(testTrip, 'spouse@travelapp.com');
    console.log('✅ Sharing test result:', result.message);
    
    return {
      success: result.success,
      message: result.message
    };
    
  } catch (error: any) {
    console.error('❌ Sharing service test failed:', error.message);
    return {
      success: false,
      message: `Sharing service error: ${error.message}`
    };
  }
};

