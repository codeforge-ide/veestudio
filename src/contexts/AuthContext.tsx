'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { account } from '@/lib/appwrite';
import { Models } from 'appwrite';

interface AppwriteUser extends Models.User<Models.Preferences> {
  prefs: {
    walletVeChain?: string;
    [key: string]: unknown;
  };
}

interface AuthContextType {
  user: AppwriteUser | null;
  loading: boolean;
  connectWallet: (address: string) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AppwriteUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const userData = await account.get() as AppwriteUser;
      setUser(userData);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const connectWallet = useCallback(async (address: string) => {
    try {
      // For now, we'll use a simple email-based approach
      // In production, you would implement the full Web3 auth flow with Appwrite Functions
      
      // Create an anonymous session if not authenticated
      if (!user) {
        try {
          await account.createAnonymousSession();
          await account.get();
          
          // Update user preferences with wallet address
          await account.updatePrefs({
            walletVeChain: address,
          });
          
          const updatedUser = await account.get() as AppwriteUser;
          setUser(updatedUser);
        } catch (error) {
          console.error('Failed to create session:', error);
          throw error;
        }
      } else {
        // Update existing user's wallet address
        await account.updatePrefs({
          ...user.prefs,
          walletVeChain: address,
        });
        
        const updatedUser = await account.get() as AppwriteUser;
        setUser(updatedUser);
      }
    } catch (error) {
      console.error('Wallet connection error:', error);
      throw error;
    }
  }, [user]);

  const logout = useCallback(async () => {
    try {
      await account.deleteSession('current');
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        connectWallet,
        logout,
        isAuthenticated: !!user
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
