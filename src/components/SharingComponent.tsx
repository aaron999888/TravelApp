import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  FlatList,
  Image,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { User } from '../types';
import { 
  shareTripWithSpouse, 
  getTripCollaborators, 
  removeSharingAccess, 
  getAllUsers 
} from '../services/sharingService';

interface Props {
  tripId: string;
  currentUser: User;
}

// Component for managing trip sharing - like a C module for user management
const SharingComponent: React.FC<Props> = ({ tripId, currentUser }) => {
  // State variables - like local variables in a C function
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [collaborators, setCollaborators] = useState<User[]>([]);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);

  // Load collaborators when component mounts - like initialization in C
  useEffect(() => {
    loadCollaborators();
  }, [tripId]);

  // Function to load collaborators - like a C function that fetches data
  const loadCollaborators = async () => {
    try {
      setLoading(true);
      const collaboratorList = await getTripCollaborators(tripId);
      setCollaborators(collaboratorList);
    } catch (error) {
      console.error('Failed to load collaborators:', error);
    } finally {
      setLoading(false);
    }
  };

  // Function to load all users for sharing - like a C function that gets user list
  const loadAllUsers = async () => {
    try {
      const users = getAllUsers();
      // Filter out current user - like removing an element from an array in C
      const otherUsers = users.filter(user => user.id !== currentUser.id);
      setAllUsers(otherUsers);
    } catch (error) {
      console.error('Failed to load users:', error);
    }
  };

  // Function to share trip with user - like a C function that modifies permissions
  const handleShareTrip = async (user: User) => {
    try {
      setLoading(true);
      
      // Share trip with spouse - like calling a function with parameters in C
      const success = await shareTripWithSpouse(tripId, user.email, ['view', 'edit']);
      
      if (success) {
        Alert.alert('Success', `Trip shared with ${user.name}`);
        loadCollaborators(); // Refresh collaborators list
      } else {
        Alert.alert('Error', 'Failed to share trip');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to share trip');
    } finally {
      setLoading(false);
    }
  };

  // Function to remove sharing access - like a C function that removes permissions
  const handleRemoveAccess = async (user: User) => {
    try {
      setLoading(true);
      
      const success = await removeSharingAccess(tripId, user.email);
      
      if (success) {
        Alert.alert('Success', `Access removed for ${user.name}`);
        loadCollaborators(); // Refresh collaborators list
      } else {
        Alert.alert('Error', 'Failed to remove access');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to remove access');
    } finally {
      setLoading(false);
    }
  };

  // Function to open sharing modal - like a C function that shows UI
  const openSharingModal = () => {
    loadAllUsers();
    setIsModalVisible(true);
  };

  // Function to render user item for sharing - like a C function that formats data
  const renderUserItem = ({ item }: { item: User }) => (
    <TouchableOpacity
      style={styles.userItem}
      onPress={() => handleShareTrip(item)}
    >
      <Image source={{ uri: item.avatar }} style={styles.userAvatar} />
      <View style={styles.userInfo}>
        <Text style={styles.userName}>{item.name}</Text>
        <Text style={styles.userEmail}>{item.email}</Text>
      </View>
      <Ionicons name="add-circle" size={24} color="#007AFF" />
    </TouchableOpacity>
  );

  // Function to render collaborator item - like a C function that formats data
  const renderCollaboratorItem = ({ item }: { item: User }) => (
    <View style={styles.collaboratorItem}>
      <Image source={{ uri: item.avatar }} style={styles.collaboratorAvatar} />
      <View style={styles.collaboratorInfo}>
        <Text style={styles.collaboratorName}>{item.name}</Text>
        <Text style={styles.collaboratorEmail}>{item.email}</Text>
        <Text style={styles.collaboratorRole}>Can view and edit</Text>
      </View>
      <TouchableOpacity
        style={styles.removeButton}
        onPress={() => handleRemoveAccess(item)}
      >
        <Ionicons name="close-circle" size={24} color="#FF3B30" />
      </TouchableOpacity>
    </View>
  );

  // Main render function - like the main function in C
  return (
    <View style={styles.container}>
      {/* Sharing Button */}
      <TouchableOpacity style={styles.shareButton} onPress={openSharingModal}>
        <Ionicons name="people" size={20} color="#007AFF" />
        <Text style={styles.shareButtonText}>Share with Spouse</Text>
      </TouchableOpacity>

      {/* Collaborators List */}
      {collaborators.length > 0 && (
        <View style={styles.collaboratorsSection}>
          <Text style={styles.collaboratorsTitle}>Shared With:</Text>
          <FlatList
            data={collaborators}
            renderItem={renderCollaboratorItem}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
          />
        </View>
      )}

      {/* Sharing Modal */}
      <Modal
        visible={isModalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Share Trip</Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setIsModalVisible(false)}
            >
              <Ionicons name="close" size={24} color="#333" />
            </TouchableOpacity>
          </View>

          <FlatList
            data={allUsers}
            renderItem={renderUserItem}
            keyExtractor={(item) => item.id}
            style={styles.usersList}
          />
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
  },
  shareButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f8ff',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#007AFF',
  },
  shareButtonText: {
    marginLeft: 8,
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '600',
  },
  collaboratorsSection: {
    marginTop: 16,
  },
  collaboratorsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  collaboratorItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  collaboratorAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  collaboratorInfo: {
    flex: 1,
  },
  collaboratorName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  collaboratorEmail: {
    fontSize: 14,
    color: '#666',
  },
  collaboratorRole: {
    fontSize: 12,
    color: '#007AFF',
  },
  removeButton: {
    padding: 4,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  closeButton: {
    padding: 4,
  },
  usersList: {
    flex: 1,
    padding: 20,
  },
  userItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  userAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 16,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  userEmail: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
});

export default SharingComponent;
