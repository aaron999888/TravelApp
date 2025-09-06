// Sharing component for itinerary collaboration
// This component handles sharing trips with spouse
// Written with C-style comments for 1990s programmer understanding

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  Modal,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Trip } from '../types';
import { shareTrip, stopSharingTrip } from '../services/sharingService';

// Props interface - like function parameters in C
interface SharingComponentProps {
  trip: Trip;
  onSharingStatusChange: (isShared: boolean) => void;
}

// Main sharing component function - like a C function that returns UI
const SharingComponent: React.FC<SharingComponentProps> = ({ 
  trip, 
  onSharingStatusChange 
}) => {
  // State variables - like C variables that can change
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [spouseEmail, setSpouseEmail] = useState<string>('');
  const [isSharing, setIsSharing] = useState<boolean>(false);
  const [isShared, setIsShared] = useState<boolean>(trip.isShared || false);

  // Function to open sharing modal - like opening a dialog in C
  const openSharingModal = () => {
    setIsModalVisible(true);
  };

  // Function to close sharing modal - like closing a dialog in C
  const closeSharingModal = () => {
    setIsModalVisible(false);
    setSpouseEmail('');
  };

  // Function to handle sharing trip - like processing data in C
  const handleShareTrip = async () => {
    // Input validation - like checking parameters in C
    if (!spouseEmail.trim()) {
      Alert.alert('Error', 'Please enter spouse email address');
      return;
    }

    // Email validation - like regex checking in C
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(spouseEmail)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    setIsSharing(true);

    try {
      // Call sharing service - like calling a function in C
      const result = await shareTrip(trip, spouseEmail.trim());
      
      if (result.success) {
        // Update UI state - like updating variables in C
        setIsShared(true);
        onSharingStatusChange(true);
        Alert.alert('Success', result.message);
        closeSharingModal();
      } else {
        Alert.alert('Error', result.message);
      }
    } catch (error) {
      console.error('Error sharing trip:', error);
      Alert.alert('Error', 'Failed to share trip. Please try again.');
    } finally {
      setIsSharing(false);
    }
  };

  // Function to stop sharing trip - like removing access in C
  const handleStopSharing = async () => {
    Alert.alert(
      'Stop Sharing',
      'Are you sure you want to stop sharing this trip?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Stop Sharing',
          style: 'destructive',
          onPress: async () => {
            setIsSharing(true);
            
            try {
              const result = await stopSharingTrip(trip.id);
              
              if (result.success) {
                setIsShared(false);
                onSharingStatusChange(false);
                Alert.alert('Success', result.message);
              } else {
                Alert.alert('Error', result.message);
              }
            } catch (error) {
              console.error('Error stopping sharing:', error);
              Alert.alert('Error', 'Failed to stop sharing. Please try again.');
            } finally {
              setIsSharing(false);
            }
          },
        },
      ]
    );
  };

  // Main render function - like the main display function in C
  return (
    <View style={styles.container}>
      {/* Sharing button - like a button in a C GUI */}
      <TouchableOpacity
        style={[
          styles.shareButton,
          isShared && styles.sharedButton
        ]}
        onPress={isShared ? handleStopSharing : openSharingModal}
        disabled={isSharing}
      >
        {isSharing ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <Ionicons
            name={isShared ? 'people' : 'person-add'}
            size={20}
            color="#fff"
          />
        )}
        <Text style={styles.shareButtonText}>
          {isShared ? 'Shared with Spouse' : 'Share with Spouse'}
        </Text>
      </TouchableOpacity>

      {/* Sharing modal - like a dialog box in C */}
      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={closeSharingModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {/* Modal header - like a header in C GUI */}
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Share Trip with Spouse</Text>
              <TouchableOpacity onPress={closeSharingModal}>
                <Ionicons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>

            {/* Modal body - like content area in C GUI */}
            <View style={styles.modalBody}>
              <Text style={styles.tripTitle}>{trip.title}</Text>
              <Text style={styles.tripDescription}>
                {trip.description || 'No description provided'}
              </Text>
              
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Spouse Email Address</Text>
                <TextInput
                  style={styles.emailInput}
                  placeholder="Enter spouse email"
                  value={spouseEmail}
                  onChangeText={setSpouseEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>

              <Text style={styles.helpText}>
                Your spouse will receive an invitation to view and collaborate on this trip.
              </Text>
            </View>

            {/* Modal footer - like button area in C GUI */}
            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={closeSharingModal}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[
                  styles.shareConfirmButton,
                  isSharing && styles.disabledButton
                ]}
                onPress={handleShareTrip}
                disabled={isSharing}
              >
                {isSharing ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text style={styles.shareConfirmButtonText}>Share Trip</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

// Styles - like defining constants and formatting in C
const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
  },
  shareButton: {
    backgroundColor: '#007AFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginVertical: 8,
  },
  sharedButton: {
    backgroundColor: '#34C759',
  },
  shareButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    width: '90%',
    maxWidth: 400,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
  },
  modalBody: {
    padding: 20,
  },
  tripTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 8,
  },
  tripDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#000',
    marginBottom: 8,
  },
  emailInput: {
    borderWidth: 1,
    borderColor: '#E5E5EA',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  helpText: {
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic',
  },
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#E5E5EA',
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 20,
    marginRight: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E5EA',
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
  shareConfirmButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 20,
    marginLeft: 10,
    borderRadius: 8,
    backgroundColor: '#007AFF',
    alignItems: 'center',
  },
  shareConfirmButtonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
});

export default SharingComponent;