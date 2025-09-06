// Google Calendar Authentication Service
// This service handles OAuth authentication with Google Calendar API
// Written for 1990s C programmer - uses procedural approach with clear function calls

import * as AuthSession from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GOOGLE_OAUTH_CONFIG } from '../config/googleOAuth';

// Complete the auth session - like closing a file handle in C
WebBrowser.maybeCompleteAuthSession();

// Google OAuth configuration - like #define constants in C
const GOOGLE_CLIENT_ID = GOOGLE_OAUTH_CONFIG.clientId;
const GOOGLE_REDIRECT_URI = AuthSession.makeRedirectUri({
  useProxy: true,
});

// Google Calendar API scopes - like permission flags in C
const GOOGLE_SCOPES = GOOGLE_OAUTH_CONFIG.scopes;

// Token storage keys - like #define for storage keys in C
const ACCESS_TOKEN_KEY = 'google_calendar_access_token';
const REFRESH_TOKEN_KEY = 'google_calendar_refresh_token';
const TOKEN_EXPIRY_KEY = 'google_calendar_token_expiry';

// Authentication result interface - like a C struct
interface AuthResult {
  success: boolean;
  accessToken?: string;
  refreshToken?: string;
  error?: string;
}

// Main authentication service class - like a C module with functions
export class GoogleAuthService {
  private static instance: GoogleAuthService;
  private accessToken: string | null = null;
  private refreshToken: string | null = null;
  private tokenExpiry: number | null = null;

  // Singleton pattern - like a global instance in C
  public static getInstance(): GoogleAuthService {
    if (!GoogleAuthService.instance) {
      GoogleAuthService.instance = new GoogleAuthService();
    }
    return GoogleAuthService.instance;
  }

  // Initialize authentication - like initializing a C library
  public async initialize(): Promise<void> {
    try {
      // Load stored tokens - like reading from a config file in C
      await this.loadStoredTokens();
      
      // Check if token is still valid - like checking a timestamp in C
      if (this.accessToken && this.isTokenValid()) {
        console.log('Google Calendar: Using stored valid token');
        return;
      }

      // Try to refresh token if we have refresh token - like retrying a connection in C
      if (this.refreshToken) {
        const refreshed = await this.refreshAccessToken();
        if (refreshed) {
          console.log('Google Calendar: Token refreshed successfully');
          return;
        }
      }

      // Clear invalid tokens - like cleaning up memory in C
      this.clearTokens();
    } catch (error) {
      console.error('Google Calendar auth initialization failed:', error);
      this.clearTokens();
    }
  }

  // Authenticate with Google - like opening a connection in C
  public async authenticate(): Promise<AuthResult> {
    try {
      // Create auth request - like setting up parameters for a C function
      const request = new AuthSession.AuthRequest({
        clientId: GOOGLE_CLIENT_ID,
        scopes: GOOGLE_SCOPES,
        redirectUri: GOOGLE_REDIRECT_URI,
        responseType: AuthSession.ResponseType.Code,
        extraParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
      });

      // Start authentication - like calling a C function
      const result = await request.promptAsync({
        authorizationEndpoint: 'https://accounts.google.com/o/oauth2/v2/auth',
      });

      // Check if authentication was successful - like checking return code in C
      if (result.type === 'success' && result.params.code) {
        return await this.exchangeCodeForTokens(result.params.code);
      } else {
        return {
          success: false,
          error: 'Authentication was cancelled or failed'
        };
      }
    } catch (error) {
      console.error('Google Calendar authentication error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown authentication error'
      };
    }
  }

  // Exchange authorization code for tokens - like converting data in C
  private async exchangeCodeForTokens(code: string): Promise<AuthResult> {
    try {
      // Create token exchange request - like setting up HTTP parameters in C
      const tokenRequest = {
        client_id: GOOGLE_CLIENT_ID,
        code: code,
        grant_type: 'authorization_code',
        redirect_uri: GOOGLE_REDIRECT_URI,
      };

      // Make token exchange request - like making an HTTP call in C
      const response = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams(tokenRequest).toString(),
      });

      // Check response - like checking HTTP status in C
      if (!response.ok) {
        throw new Error(`Token exchange failed: ${response.status}`);
      }

      // Parse response - like parsing JSON in C
      const tokenData = await response.json();
      
      // Store tokens - like writing to a file in C
      this.accessToken = tokenData.access_token;
      this.refreshToken = tokenData.refresh_token;
      this.tokenExpiry = Date.now() + (tokenData.expires_in * 1000);

      // Save tokens to storage - like writing to persistent storage in C
      await this.saveTokens();

      return {
        success: true,
        accessToken: this.accessToken,
        refreshToken: this.refreshToken,
      };
    } catch (error) {
      console.error('Token exchange failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Token exchange failed'
      };
    }
  }

  // Refresh access token - like renewing a connection in C
  private async refreshAccessToken(): Promise<boolean> {
    try {
      if (!this.refreshToken) {
        return false;
      }

      // Create refresh request - like setting up parameters in C
      const refreshRequest = {
        client_id: GOOGLE_CLIENT_ID,
        refresh_token: this.refreshToken,
        grant_type: 'refresh_token',
      };

      // Make refresh request - like making an HTTP call in C
      const response = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams(refreshRequest).toString(),
      });

      // Check response - like checking HTTP status in C
      if (!response.ok) {
        return false;
      }

      // Parse response - like parsing JSON in C
      const tokenData = await response.json();
      
      // Update tokens - like updating variables in C
      this.accessToken = tokenData.access_token;
      this.tokenExpiry = Date.now() + (tokenData.expires_in * 1000);

      // Save updated tokens - like writing to persistent storage in C
      await this.saveTokens();

      return true;
    } catch (error) {
      console.error('Token refresh failed:', error);
      return false;
    }
  }

  // Check if token is valid - like checking a timestamp in C
  private isTokenValid(): boolean {
    if (!this.accessToken || !this.tokenExpiry) {
      return false;
    }
    
    // Check if token expires in next 5 minutes - like checking time in C
    return Date.now() < (this.tokenExpiry - 5 * 60 * 1000);
  }

  // Get valid access token - like getting a valid connection in C
  public async getValidAccessToken(): Promise<string | null> {
    try {
      // Check if current token is valid - like checking a flag in C
      if (this.accessToken && this.isTokenValid()) {
        return this.accessToken;
      }

      // Try to refresh token - like retrying a connection in C
      if (this.refreshToken) {
        const refreshed = await this.refreshAccessToken();
        if (refreshed && this.accessToken) {
          return this.accessToken;
        }
      }

      // Return null if no valid token - like returning NULL in C
      return null;
    } catch (error) {
      console.error('Failed to get valid access token:', error);
      return null;
    }
  }

  // Check if user is authenticated - like checking a global flag in C
  public isAuthenticated(): boolean {
    return this.accessToken !== null && this.isTokenValid();
  }

  // Load stored tokens from storage - like reading from a file in C
  private async loadStoredTokens(): Promise<void> {
    try {
      const accessToken = await AsyncStorage.getItem(ACCESS_TOKEN_KEY);
      const refreshToken = await AsyncStorage.getItem(REFRESH_TOKEN_KEY);
      const tokenExpiry = await AsyncStorage.getItem(TOKEN_EXPIRY_KEY);

      // Set tokens if they exist - like setting variables in C
      if (accessToken) this.accessToken = accessToken;
      if (refreshToken) this.refreshToken = refreshToken;
      if (tokenExpiry) this.tokenExpiry = parseInt(tokenExpiry, 10);
    } catch (error) {
      console.error('Failed to load stored tokens:', error);
    }
  }

  // Save tokens to storage - like writing to a file in C
  private async saveTokens(): Promise<void> {
    try {
      // Save tokens to storage - like writing to persistent storage in C
      if (this.accessToken) {
        await AsyncStorage.setItem(ACCESS_TOKEN_KEY, this.accessToken);
      }
      if (this.refreshToken) {
        await AsyncStorage.setItem(REFRESH_TOKEN_KEY, this.refreshToken);
      }
      if (this.tokenExpiry) {
        await AsyncStorage.setItem(TOKEN_EXPIRY_KEY, this.tokenExpiry.toString());
      }
    } catch (error) {
      console.error('Failed to save tokens:', error);
    }
  }

  // Clear all tokens - like cleaning up memory in C
  public async clearTokens(): Promise<void> {
    try {
      // Clear memory variables - like setting pointers to NULL in C
      this.accessToken = null;
      this.refreshToken = null;
      this.tokenExpiry = null;

      // Clear stored tokens - like deleting files in C
      await AsyncStorage.multiRemove([
        ACCESS_TOKEN_KEY,
        REFRESH_TOKEN_KEY,
        TOKEN_EXPIRY_KEY,
      ]);
    } catch (error) {
      console.error('Failed to clear tokens:', error);
    }
  }

  // Logout user - like closing all connections in C
  public async logout(): Promise<void> {
    await this.clearTokens();
    console.log('Google Calendar: User logged out');
  }
}

// Export singleton instance - like a global variable in C
export const googleAuthService = GoogleAuthService.getInstance();
