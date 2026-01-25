'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useUser } from '@clerk/nextjs';

// Types
export interface CardType {
  id: string;
  cardName: string;
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  cardType: string;
  createdAt: string;
  userId: string;
}

export interface PasswordType {
  id: string;
  website: string;
  username: string;
  password: string;
  lastUpdated: string;
  userId: string;
}

export interface FileType {
  id: string;
  fileName: string;
  fileType: string;
  fileSize: string;
  description: string;
  uploadDate: string;
  fileData?: string; // Base64 encoded file data
  userId: string;
}

interface VaultContextType {
  cards: CardType[];
  passwords: PasswordType[];
  files: FileType[];
  addCard: (card: Omit<CardType, 'id' | 'createdAt' | 'userId'>) => Promise<void>;
  updateCard: (id: string, card: Omit<CardType, 'id' | 'createdAt' | 'userId'>) => Promise<void>;
  deleteCard: (id: string) => Promise<void>;
  addPassword: (password: Omit<PasswordType, 'id' | 'lastUpdated' | 'userId'>) => Promise<void>;
  updatePassword: (id: string, password: Omit<PasswordType, 'id' | 'lastUpdated' | 'userId'>) => Promise<void>;
  deletePassword: (id: string) => Promise<void>;
  addFile: (file: Omit<FileType, 'id' | 'uploadDate' | 'userId'>) => Promise<void>;
  deleteFile: (id: string) => Promise<void>;
  isLoading: boolean;
}

const VaultContext = createContext<VaultContextType | undefined>(undefined);

export function VaultProvider({ children }: { children: ReactNode }) {
  const { user, isLoaded } = useUser();
  const [cards, setCards] = useState<CardType[]>([]);
  const [passwords, setPasswords] = useState<PasswordType[]>([]);
  const [files, setFiles] = useState<FileType[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const userId = user?.id || 'anonymous';

  // Load data from localStorage when user changes
  useEffect(() => {
    if (isLoaded) {
      loadAllData();
    }
  }, [userId, isLoaded]);

  const loadAllData = () => {
    setIsLoading(true);
    try {
      // Load cards
      const cardsKey = `vault_cards_${userId}`;
      const cardsData = localStorage.getItem(cardsKey);
      if (cardsData) {
        setCards(JSON.parse(cardsData));
      } else {
        setCards([]);
      }

      // Load passwords
      const passwordsKey = `vault_passwords_${userId}`;
      const passwordsData = localStorage.getItem(passwordsKey);
      if (passwordsData) {
        setPasswords(JSON.parse(passwordsData));
      } else {
        setPasswords([]);
      }

      // Load files
      const filesKey = `vault_files_${userId}`;
      const filesData = localStorage.getItem(filesKey);
      if (filesData) {
        setFiles(JSON.parse(filesData));
      } else {
        setFiles([]);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Card operations
  const addCard = async (cardData: Omit<CardType, 'id' | 'createdAt' | 'userId'>) => {
    const newCard: CardType = {
      ...cardData,
      id: `card_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
      userId,
    };

    const updatedCards = [...cards, newCard];
    setCards(updatedCards);
    
    try {
      localStorage.setItem(`vault_cards_${userId}`, JSON.stringify(updatedCards));
    } catch (error) {
      console.error('Error saving card:', error);
    }
  };

  const updateCard = async (id: string, cardData: Omit<CardType, 'id' | 'createdAt' | 'userId'>) => {
    const updatedCards = cards.map(card =>
      card.id === id ? { ...card, ...cardData } : card
    );
    setCards(updatedCards);
    
    try {
      localStorage.setItem(`vault_cards_${userId}`, JSON.stringify(updatedCards));
    } catch (error) {
      console.error('Error updating card:', error);
    }
  };

  const deleteCard = async (id: string) => {
    const updatedCards = cards.filter(card => card.id !== id);
    setCards(updatedCards);
    
    try {
      localStorage.setItem(`vault_cards_${userId}`, JSON.stringify(updatedCards));
    } catch (error) {
      console.error('Error deleting card:', error);
    }
  };

  // Password operations
  const addPassword = async (passwordData: Omit<PasswordType, 'id' | 'lastUpdated' | 'userId'>) => {
    const newPassword: PasswordType = {
      ...passwordData,
      id: `pwd_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      lastUpdated: new Date().toISOString(),
      userId,
    };

    const updatedPasswords = [...passwords, newPassword];
    setPasswords(updatedPasswords);
    
    try {
      localStorage.setItem(`vault_passwords_${userId}`, JSON.stringify(updatedPasswords));
    } catch (error) {
      console.error('Error saving password:', error);
    }
  };

  const updatePassword = async (id: string, passwordData: Omit<PasswordType, 'id' | 'lastUpdated' | 'userId'>) => {
    const updatedPasswords = passwords.map(pwd =>
      pwd.id === id ? { ...pwd, ...passwordData, lastUpdated: new Date().toISOString() } : pwd
    );
    setPasswords(updatedPasswords);
    
    try {
      localStorage.setItem(`vault_passwords_${userId}`, JSON.stringify(updatedPasswords));
    } catch (error) {
      console.error('Error updating password:', error);
    }
  };

  const deletePassword = async (id: string) => {
    const updatedPasswords = passwords.filter(pwd => pwd.id !== id);
    setPasswords(updatedPasswords);
    
    try {
      localStorage.setItem(`vault_passwords_${userId}`, JSON.stringify(updatedPasswords));
    } catch (error) {
      console.error('Error deleting password:', error);
    }
  };

  // File operations
  const addFile = async (fileData: Omit<FileType, 'id' | 'uploadDate' | 'userId'>) => {
    const newFile: FileType = {
      ...fileData,
      id: `file_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      uploadDate: new Date().toISOString(),
      userId,
    };

    const updatedFiles = [...files, newFile];
    setFiles(updatedFiles);
    
    try {
      localStorage.setItem(`vault_files_${userId}`, JSON.stringify(updatedFiles));
    } catch (error) {
      console.error('Error saving file:', error);
    }
  };

  const deleteFile = async (id: string) => {
    const updatedFiles = files.filter(file => file.id !== id);
    setFiles(updatedFiles);
    
    try {
      localStorage.setItem(`vault_files_${userId}`, JSON.stringify(updatedFiles));
    } catch (error) {
      console.error('Error deleting file:', error);
    }
  };

  return (
    <VaultContext.Provider
      value={{
        cards,
        passwords,
        files,
        addCard,
        updateCard,
        deleteCard,
        addPassword,
        updatePassword,
        deletePassword,
        addFile,
        deleteFile,
        isLoading,
      }}
    >
      {children}
    </VaultContext.Provider>
  );
}

export function useVault() {
  const context = useContext(VaultContext);
  if (context === undefined) {
    throw new Error('useVault must be used within a VaultProvider');
  }
  return context;
}