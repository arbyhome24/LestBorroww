/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { HomeFeed } from './components/HomeFeed';
import { ExploreView } from './components/ExploreView';
import { PostListingModal } from './components/PostListingModal';
import { NotificationsView } from './components/NotificationsView';
import { ProfileView } from './components/ProfileView';

// Modals
import { ItemDetailModal } from './components/ItemDetailModal';
import { RentalBookingModal } from './components/RentalBookingModal';
import { RentalStatusTrackerModal } from './components/RentalStatusTrackerModal';
import { ChatModal } from './components/ChatModal';
import { WantedBoardModal } from './components/WantedBoardModal';
import { AdminDashboardModal } from './components/AdminDashboardModal';
import { AdvertiserModal } from './components/AdvertiserModal';
import { AuthModal } from './components/AuthModal';
import { LocationPickerModal } from './components/LocationPickerModal';
import { LanguageCurrencyModal } from './components/LanguageCurrencyModal';

const AppContent: React.FC = () => {
  const { activeTab } = useApp();

  return (
    <div className="min-h-screen bg-[#FFFFFF] dark:bg-[#150E10] text-[#111111] dark:text-[#F5ECDF] flex flex-col transition-colors selection:bg-[#5A1624]/20 selection:text-[#5A1624]">
      {/* Top Header */}
      <Header />

      {/* Main View Area */}
      <main className="flex-1 w-full max-w-5xl mx-auto overflow-x-hidden">
        {activeTab === 'home' && <HomeFeed />}
        {activeTab === 'explore' && <ExploreView />}
        {activeTab === 'post' && <PostListingModal />}
        {activeTab === 'notifications' && <NotificationsView />}
        {activeTab === 'profile' && <ProfileView />}
      </main>

      {/* Fixed Bottom Navigation */}
      <BottomNav />

      {/* Interactive Global Modals */}
      <ItemDetailModal />
      <RentalBookingModal />
      <RentalStatusTrackerModal />
      <ChatModal />
      <WantedBoardModal />
      <AdminDashboardModal />
      <AdvertiserModal />
      <AuthModal />
      <LocationPickerModal />
      <LanguageCurrencyModal />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
