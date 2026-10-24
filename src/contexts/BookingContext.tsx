import React, { createContext, useContext, useState } from 'react';
import type { WizardData, Artist } from '../types';

interface BookingContextType {
  wizardData: WizardData;
  updateWizard: (data: Partial<WizardData>) => void;
  resetWizard: () => void;
  setSelectedArtist: (artist: Artist) => void;
}

const BookingContext = createContext<BookingContextType | null>(null);

export function useBooking() {
  const context = useContext(BookingContext);
  if (!context) throw new Error('useBooking must be used within BookingProvider');
  return context;
}

const DEFAULT_WIZARD: WizardData = {};

export function BookingProvider({ children }: { children: React.ReactNode }) {
  const [wizardData, setWizardData] = useState<WizardData>(DEFAULT_WIZARD);

  function updateWizard(data: Partial<WizardData>) {
    setWizardData(prev => ({ ...prev, ...data }));
  }

  function resetWizard() {
    setWizardData(DEFAULT_WIZARD);
  }

  function setSelectedArtist(artist: Artist) {
    setWizardData(prev => ({ ...prev, selectedArtist: artist }));
  }

  return (
    <BookingContext.Provider value={{ wizardData, updateWizard, resetWizard, setSelectedArtist }}>
      {children}
    </BookingContext.Provider>
  );
}
