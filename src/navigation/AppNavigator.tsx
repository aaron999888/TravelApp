import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';

import HomeScreen from '../screens/HomeScreen';
import DestinationsScreen from '../screens/DestinationsScreen';
import TripPlannerScreen from '../screens/TripPlannerScreen';
import ProfileScreen from '../screens/ProfileScreen';
import DestinationDetailScreen from '../screens/DestinationDetailScreen';
import TripDetailScreen from '../screens/TripDetailScreen';
import BookingResultsScreen from '../screens/BookingResultsScreen';
import RestaurantScreen from '../screens/RestaurantScreen';

import { RootStackParamList } from '../types';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator<RootStackParamList>();

const HomeStack = () => (
  <Stack.Navigator>
    <Stack.Screen 
      name="Home" 
      component={HomeScreen} 
      options={{ title: 'Travel App' }}
    />
    <Stack.Screen 
      name="DestinationDetail" 
      component={DestinationDetailScreen}
      options={{ title: 'Destination Details' }}
    />
    <Stack.Screen 
      name="TripDetail" 
      component={TripDetailScreen}
      options={{ title: 'Trip Details' }}
    />
  </Stack.Navigator>
);

const DestinationsStack = () => (
  <Stack.Navigator>
    <Stack.Screen 
      name="Destinations" 
      component={DestinationsScreen}
      options={{ title: 'Destinations' }}
    />
    <Stack.Screen 
      name="DestinationDetail" 
      component={DestinationDetailScreen}
      options={{ title: 'Destination Details' }}
    />
  </Stack.Navigator>
);

const TripPlannerStack = () => (
  <Stack.Navigator>
    <Stack.Screen 
      name="TripPlanner" 
      component={TripPlannerScreen}
      options={{ title: 'Trip Planner' }}
    />
    <Stack.Screen 
      name="BookingResults" 
      component={BookingResultsScreen}
      options={{ title: 'Booking Results' }}
    />
    <Stack.Screen 
      name="Restaurants" 
      component={RestaurantScreen}
      options={{ title: 'Nearby Restaurants' }}
    />
    <Stack.Screen 
      name="TripDetail" 
      component={TripDetailScreen}
      options={{ title: 'Trip Details' }}
    />
  </Stack.Navigator>
);

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName: keyof typeof Ionicons.glyphMap;

            if (route.name === 'Home') {
              iconName = focused ? 'home' : 'home-outline';
            } else if (route.name === 'Destinations') {
              iconName = focused ? 'location' : 'location-outline';
            } else if (route.name === 'TripPlanner') {
              iconName = focused ? 'map' : 'map-outline';
            } else if (route.name === 'Profile') {
              iconName = focused ? 'person' : 'person-outline';
            } else {
              iconName = 'help-outline';
            }

            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: '#007AFF',
          tabBarInactiveTintColor: 'gray',
          headerShown: false,
        })}
      >
        <Tab.Screen name="Home" component={HomeStack} />
        <Tab.Screen name="Destinations" component={DestinationsStack} />
        <Tab.Screen name="TripPlanner" component={TripPlannerStack} />
        <Tab.Screen name="Profile" component={ProfileScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
