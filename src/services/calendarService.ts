// Google Calendar integration service
// This service handles real Google Calendar API calls with OAuth authentication
// Written for 1990s C programmer - uses procedural approach with clear function calls

import { CalendarEvent, Trip, Destination } from '../types';
import { googleAuthService } from './googleAuthService';
import { GOOGLE_OAUTH_CONFIG } from '../config/googleOAuth';

// Google Calendar API configuration - like #define constants in C
const GOOGLE_CALENDAR_API_BASE = GOOGLE_OAUTH_CONFIG.calendarApiBase;
const CALENDAR_ID = GOOGLE_OAUTH_CONFIG.calendarId;

// Main calendar service class - like a C module with functions
export class CalendarService {
  private static instance: CalendarService;
  private isAuthenticated: boolean = false;

  // Singleton pattern - like a global instance in C
  public static getInstance(): CalendarService {
    if (!CalendarService.instance) {
      CalendarService.instance = new CalendarService();
    }
    return CalendarService.instance;
  }

  // Initialize calendar service - like initializing a C library
  public async initialize(): Promise<boolean> {
    try {
      // Initialize authentication service - like calling init function in C
      await googleAuthService.initialize();
      
      // Check if we're authenticated - like checking a global flag in C
      this.isAuthenticated = googleAuthService.isAuthenticated();
      
      if (this.isAuthenticated) {
        console.log('Google Calendar: Service initialized and authenticated');
      } else {
        console.log('Google Calendar: Service initialized but not authenticated');
      }
      
      return true;
    } catch (error) {
      console.error('Calendar service initialization failed:', error);
      return false;
    }
  }

  // Authenticate with Google Calendar - like opening a connection in C
  public async authenticate(): Promise<boolean> {
    try {
      // Check if already authenticated - like checking a flag in C
      if (this.isAuthenticated) {
        return true;
      }

      // Start authentication process - like calling auth function in C
      const authResult = await googleAuthService.authenticate();
      
      if (authResult.success) {
        this.isAuthenticated = true;
        console.log('Google Calendar: Authentication successful');
        return true;
      } else {
        console.error('Google Calendar: Authentication failed:', authResult.error);
        return false;
      }
    } catch (error) {
      console.error('Calendar authentication failed:', error);
      return false;
    }
  }

  // Create calendar event - like a C function that creates a record
  public async createEvent(event: CalendarEvent): Promise<boolean> {
    try {
      // Get valid access token - like getting a valid connection in C
      const accessToken = await googleAuthService.getValidAccessToken();
      if (!accessToken) {
        throw new Error('No valid access token available');
      }

      // Prepare event data for Google Calendar API - like preparing data structure in C
      const eventData = {
        summary: event.title,
        description: event.description,
        start: {
          dateTime: event.start,
          timeZone: 'UTC',
        },
        end: {
          dateTime: event.end,
          timeZone: 'UTC',
        },
        location: event.location,
      };

      // Make API call to Google Calendar - like making HTTP call in C
      const response = await fetch(
        `${GOOGLE_CALENDAR_API_BASE}/calendars/${CALENDAR_ID}/events`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(eventData),
        }
      );

      // Check response - like checking HTTP status in C
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Google Calendar API error: ${errorData.error?.message || 'Unknown error'}`);
      }

      // Parse response - like parsing JSON in C
      const createdEvent = await response.json();
      console.log('Google Calendar: Event created successfully:', createdEvent.id);
      
      return true;
    } catch (error) {
      console.error('Failed to create calendar event:', error);
      throw error;
    }
  }

  // Create multiple events for a trip - like a C function that processes an array
  public async createTripEvents(
    tripTitle: string,
    startDate: string,
    endDate: string,
    destination: string,
    flights: any[],
    hotels: any[]
  ): Promise<boolean> {
    try {
      const events: CalendarEvent[] = [];

      // Create flight events - like iterating through an array in C
      flights.forEach((flight, index) => {
        events.push({
          id: `flight-${flight.id}`,
          title: `✈️ Flight: ${flight.airline} ${flight.flightNumber}`,
          start: `${flight.departure.date}T${flight.departure.time}:00`,
          end: `${flight.arrival.date}T${flight.arrival.time}:00`,
          description: `Departure: ${flight.departure.airport} at ${flight.departure.time}\nArrival: ${flight.arrival.airport} at ${flight.arrival.time}\nDuration: ${flight.duration}`,
          location: `${flight.departure.airport} → ${flight.arrival.airport}`
        });
      });

      // Create hotel events - like iterating through an array in C
      hotels.forEach((hotel, index) => {
        events.push({
          id: `hotel-${hotel.id}`,
          title: `🏨 Hotel: ${hotel.name}`,
          start: `${startDate}T15:00:00`,
          end: `${endDate}T11:00:00`,
          description: `Check-in: ${startDate}\nCheck-out: ${endDate}\nLocation: ${hotel.location}\nRating: ${hotel.rating}/5`,
          location: hotel.location
        });
      });

      // Create trip summary event
      events.push({
        id: 'trip-summary',
        title: `🌍 Trip: ${tripTitle}`,
        start: `${startDate}T00:00:00`,
        end: `${endDate}T23:59:59`,
        description: `Trip to ${destination}\nBudget: $${hotels.reduce((sum, hotel) => sum + hotel.price, 0) + flights.reduce((sum, flight) => sum + flight.price, 0)}\nFlights: ${flights.length}\nHotels: ${hotels.length}`,
        location: destination
      });

      // Create all events - like calling a function multiple times in C
      for (const event of events) {
        await this.createEvent(event);
      }

      return true;
    } catch (error) {
      console.error('Failed to create trip events:', error);
      throw error;
    }
  }

  // Create events from Trip object - like a C function that processes a struct
  public async createEventsFromTrip(trip: Trip): Promise<boolean> {
    try {
      // Check if authenticated - like checking a flag in C
      if (!this.isAuthenticated) {
        throw new Error('Not authenticated with Google Calendar');
      }

      const events: CalendarEvent[] = [];

      // Create flight events - like iterating through an array in C
      trip.flights.forEach((flight, index) => {
        events.push({
          id: `flight-${flight.id}`,
          title: `✈️ Flight: ${flight.airline} ${flight.flightNumber}`,
          start: `${flight.departure.date}T${flight.departure.time}:00`,
          end: `${flight.arrival.date}T${flight.arrival.time}:00`,
          description: `Departure: ${flight.departure.airport} at ${flight.departure.time}\nArrival: ${flight.arrival.airport} at ${flight.arrival.time}\nDuration: ${flight.duration}\nClass: ${flight.class}`,
          location: `${flight.departure.airport} → ${flight.arrival.airport}`
        });
      });

      // Create hotel events - like iterating through an array in C
      trip.hotels.forEach((hotel, index) => {
        events.push({
          id: `hotel-${hotel.id}`,
          title: `🏨 Hotel: ${hotel.name}`,
          start: `${trip.startDate}T15:00:00`,
          end: `${trip.endDate}T11:00:00`,
          description: `Check-in: ${trip.startDate}\nCheck-out: ${trip.endDate}\nLocation: ${hotel.location}\nRating: ${hotel.rating}/5\nPrice: $${hotel.price}`,
          location: hotel.location
        });
      });

      // Create destination events - like iterating through an array in C
      trip.destinations.forEach((destination, index) => {
        events.push({
          id: `destination-${destination.id}`,
          title: `📍 Visit: ${destination.name}`,
          start: `${trip.startDate}T09:00:00`,
          end: `${trip.endDate}T18:00:00`,
          description: `${destination.description}\nRating: ${destination.rating}/5\nCategory: ${destination.category}`,
          location: `${destination.location.latitude}, ${destination.location.longitude}`
        });
      });

      // Create trip summary event
      events.push({
        id: `trip-${trip.id}`,
        title: `🌍 Trip: ${trip.title}`,
        start: `${trip.startDate}T00:00:00`,
        end: `${trip.endDate}T23:59:59`,
        description: `${trip.description}\nBudget: $${trip.budget}\nDestinations: ${trip.destinations.length}\nFlights: ${trip.flights.length}\nHotels: ${trip.hotels.length}`,
        location: trip.destinations.map(d => d.name).join(', ')
      });

      // Create all events - like calling a function multiple times in C
      for (const event of events) {
        await this.createEvent(event);
      }

      console.log(`Google Calendar: Created ${events.length} events for trip: ${trip.title}`);
      return true;
    } catch (error) {
      console.error('Failed to create events from trip:', error);
      throw error;
    }
  }

  // Create restaurant event - like a C function that creates a single record
  public async createRestaurantEvent(
    restaurantName: string,
    date: string,
    time: string,
    address: string,
    tripTitle?: string
  ): Promise<boolean> {
    try {
      const event: CalendarEvent = {
        id: `restaurant-${Date.now()}`,
        title: `🍽️ Restaurant: ${restaurantName}`,
        start: `${date}T${time}:00`,
        end: `${date}T${this.addHours(time, 2)}:00`,
        description: `Dinner at ${restaurantName}\nAddress: ${address}${tripTitle ? `\nPart of trip: ${tripTitle}` : ''}`,
        location: address
      };

      await this.createEvent(event);
      console.log(`Google Calendar: Created restaurant event: ${restaurantName}`);
      return true;
    } catch (error) {
      console.error('Failed to create restaurant event:', error);
      throw error;
    }
  }

  // Helper function to add hours to time - like a utility function in C
  private addHours(time: string, hours: number): string {
    const [hour, minute] = time.split(':').map(Number);
    const newHour = (hour + hours) % 24;
    return `${newHour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
  }

  // Check authentication status - like checking a global variable in C
  public isLoggedIn(): boolean {
    return this.isAuthenticated;
  }

  // Logout - like cleaning up resources in C
  public async logout(): Promise<void> {
    this.isAuthenticated = false;
    await googleAuthService.logout();
    console.log('Google Calendar: Service logged out');
  }

  // Sync trip to calendar - like a C function that processes a struct
  public async syncTripToCalendar(trip: Trip): Promise<boolean> {
    try {
      // Check if authenticated - like checking a flag in C
      if (!this.isAuthenticated) {
        const authSuccess = await this.authenticate();
        if (!authSuccess) {
          throw new Error('Failed to authenticate with Google Calendar');
        }
      }

      // Create events from trip - like calling a function in C
      await this.createEventsFromTrip(trip);
      
      console.log(`Google Calendar: Successfully synced trip "${trip.title}" to calendar`);
      return true;
    } catch (error) {
      console.error('Failed to sync trip to calendar:', error);
      throw error;
    }
  }

  // Sync restaurant to calendar - like a C function that processes data
  public async syncRestaurantToCalendar(
    restaurantName: string,
    date: string,
    time: string,
    address: string,
    tripTitle?: string
  ): Promise<boolean> {
    try {
      // Check if authenticated - like checking a flag in C
      if (!this.isAuthenticated) {
        const authSuccess = await this.authenticate();
        if (!authSuccess) {
          throw new Error('Failed to authenticate with Google Calendar');
        }
      }

      // Create restaurant event - like calling a function in C
      await this.createRestaurantEvent(restaurantName, date, time, address, tripTitle);
      
      console.log(`Google Calendar: Successfully synced restaurant "${restaurantName}" to calendar`);
      return true;
    } catch (error) {
      console.error('Failed to sync restaurant to calendar:', error);
      throw error;
    }
  }
}

// Export singleton instance - like a global variable in C
export const calendarService = CalendarService.getInstance();

