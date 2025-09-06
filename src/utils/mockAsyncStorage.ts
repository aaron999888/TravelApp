// Mock AsyncStorage for when the real package isn't available
// This provides the same interface as AsyncStorage but stores data in memory
// Written with C-style comments for 1990s programmer understanding

// In-memory storage - like a global variable in C
const memoryStorage: { [key: string]: string } = {};

// Mock AsyncStorage implementation - like implementing an interface in C
export const mockAsyncStorage = {
  // Get item from storage - like reading from a file in C
  getItem: async (key: string): Promise<string | null> => {
    try {
      return memoryStorage[key] || null;
    } catch (error) {
      console.error('Mock AsyncStorage getItem error:', error);
      return null;
    }
  },

  // Set item in storage - like writing to a file in C
  setItem: async (key: string, value: string): Promise<void> => {
    try {
      memoryStorage[key] = value;
    } catch (error) {
      console.error('Mock AsyncStorage setItem error:', error);
    }
  },

  // Remove item from storage - like deleting a file in C
  removeItem: async (key: string): Promise<void> => {
    try {
      delete memoryStorage[key];
    } catch (error) {
      console.error('Mock AsyncStorage removeItem error:', error);
    }
  },

  // Clear all storage - like clearing all variables in C
  clear: async (): Promise<void> => {
    try {
      Object.keys(memoryStorage).forEach(key => delete memoryStorage[key]);
    } catch (error) {
      console.error('Mock AsyncStorage clear error:', error);
    }
  }
};

// Export as default - like exporting a module in C
export default mockAsyncStorage;

