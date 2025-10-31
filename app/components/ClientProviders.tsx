'use client';

import { ReactNode } from 'react';
import { SettingsProvider } from '../context/SettingsContext';

export default function ClientProviders({ children }: { children: ReactNode }) {
  return (
    <SettingsProvider>
      {children}
    </SettingsProvider>
  );
}
