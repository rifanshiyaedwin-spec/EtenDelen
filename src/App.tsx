import React, { useState } from 'react';
import { LanguageProvider } from './context/LanguageContext';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { EmergencyRescueBanner } from './components/common/EmergencyRescueBanner';
import { NotificationDrawer } from './components/common/NotificationDrawer';
import { ReportModal } from './components/common/ReportModal';
import { QrScannerModal } from './components/common/QrScannerModal';
import { CertificateModal } from './components/common/CertificateModal';
import { ChatDrawer } from './components/chat/ChatDrawer';
import { FoodDetailModal } from './components/food/FoodDetailModal';
import { FoodVerificationModal } from './components/food/FoodVerificationModal';
import { RedistributionModal } from './components/food/RedistributionModal';
import { InteractiveFoodMap } from './components/map/InteractiveFoodMap';
import { FoodDonation } from './types';

// Views
import { RoleGatewayView } from './views/RoleGatewayView';
import { LandingView } from './views/LandingView';
import { BrowseFoodView } from './views/BrowseFoodView';
import { CreateDonationView } from './views/CreateDonationView';
import { DonorDashboardView } from './views/DonorDashboardView';
import { NgoDashboardView } from './views/NgoDashboardView';
import { NgoVerificationView } from './views/NgoVerificationView';
import { VolunteerDashboardView } from './views/VolunteerDashboardView';
import { BeneficiaryView } from './views/BeneficiaryView';
import { DonationTrackingView } from './views/DonationTrackingView';
import { ImpactDashboardView } from './views/ImpactDashboardView';
import { LeaderboardView } from './views/LeaderboardView';
import { AdminDashboardView } from './views/AdminDashboardView';
import { HowItWorksView } from './views/HowItWorksView';
import { AiAnalysisView } from './views/AiAnalysisView';
import { ProfileView } from './views/ProfileView';
import { AuthModal } from './views/AuthModal';

const MainContent: React.FC = () => {
  const [currentView, setCurrentView] = useState<string>('gateway');
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  const {
    donations,
    users,
    selectedDonation,
    setSelectedDonation,
    setIsCertificateModalOpen,
    setCertificateDonation,
    setIsChatOpen,
    acceptDonationAsNgo,
    assignVolunteerToDonation,
  } = useApp();

  // Verification & Redistribution modal state
  const [verificationModalDonation, setVerificationModalDonation] = useState<FoodDonation | null>(null);
  const [redistributionModalDonation, setRedistributionModalDonation] = useState<FoodDonation | null>(null);

  const handleOpenCertificate = (donation: FoodDonation) => {
    setCertificateDonation(donation);
    setIsCertificateModalOpen(true);
  };

  const handleOpenVerification = (donation: FoodDonation) => {
    setVerificationModalDonation(donation);
  };

  const handleOpenRedistribution = (donation: FoodDonation) => {
    setRedistributionModalDonation(donation);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-emerald-500 selection:text-white">
      {/* Emergency Rescue Flash Banner if urgent food is expiring */}
      <EmergencyRescueBanner
        onNavigateToEmergency={() => setCurrentView('emergency_rescue')}
      />

      {/* Main App Navigation */}
      <Navbar
        currentView={currentView}
        onNavigate={(view) => {
          setCurrentView(view);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenNotifications={() => setIsNotificationsOpen(true)}
        onOpenChat={() => setIsChatOpen(true)}
      />

      {/* Main Viewport Container */}
      <main className="flex-1">
        {currentView === 'gateway' && (
          <RoleGatewayView
            onSelectRoleDashboard={(role) => {
              const targetView =
                role === 'donor'
                  ? 'donor_dashboard'
                  : role === 'ngo'
                  ? 'ngo_dashboard'
                  : role === 'volunteer'
                  ? 'volunteer_dashboard'
                  : role === 'beneficiary'
                  ? 'beneficiary_dashboard'
                  : 'admin_dashboard';
              setCurrentView(targetView);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onExplorePublic={() => {
              setCurrentView('landing');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {currentView === 'landing' && (
          <LandingView
            onNavigate={(view) => {
              setCurrentView(view);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onSelectDonation={(d) => setSelectedDonation(d)}
          />
        )}

        {currentView === 'browse' && (
          <BrowseFoodView
            onSelectDonation={(d) => setSelectedDonation(d)}
            onAcceptDonation={(d) => acceptDonationAsNgo(d.id)}
            onRequestPickup={(d) => assignVolunteerToDonation(d.id)}
            onNavigate={(view) => setCurrentView(view)}
          />
        )}

        {currentView === 'emergency_rescue' && (
          <BrowseFoodView
            initialFilter="emergency"
            onSelectDonation={(d) => setSelectedDonation(d)}
            onAcceptDonation={(d) => acceptDonationAsNgo(d.id)}
            onRequestPickup={(d) => assignVolunteerToDonation(d.id)}
            onNavigate={(view) => setCurrentView(view)}
          />
        )}

        {currentView === 'create_donation' && (
          <CreateDonationView
            onNavigate={(view) => setCurrentView(view)}
            onDonationCreated={(newDonation) => {
              setSelectedDonation(newDonation);
              setCurrentView('donor_dashboard');
            }}
          />
        )}

        {currentView === 'donor_dashboard' && (
          <DonorDashboardView
            onNavigate={(view) => setCurrentView(view)}
            onSelectDonation={(d) => setSelectedDonation(d)}
            onOpenCertificate={handleOpenCertificate}
          />
        )}

        {currentView === 'ngo_dashboard' && (
          <NgoDashboardView
            onNavigate={(view) => setCurrentView(view)}
            onSelectDonation={(d) => setSelectedDonation(d)}
            onOpenVerificationModal={handleOpenVerification}
            onOpenRedistributionModal={handleOpenRedistribution}
            onOpenCertificate={handleOpenCertificate}
          />
        )}

        {currentView === 'ngo_verification' && (
          <NgoVerificationView onNavigate={(view) => setCurrentView(view)} />
        )}

        {currentView === 'volunteer_dashboard' && (
          <VolunteerDashboardView
            onNavigate={(view) => setCurrentView(view)}
            onSelectDonation={(d) => setSelectedDonation(d)}
            onOpenCertificate={handleOpenCertificate}
          />
        )}

        {currentView === 'beneficiary_dashboard' && (
          <BeneficiaryView onNavigate={(view) => setCurrentView(view)} />
        )}

        {currentView === 'tracking' && (
          <DonationTrackingView
            onOpenCertificate={handleOpenCertificate}
            onOpenVerificationModal={handleOpenVerification}
          />
        )}

        {currentView === 'impact' && <ImpactDashboardView />}

        {currentView === 'leaderboard' && <LeaderboardView />}

        {currentView === 'how_it_works' && (
          <HowItWorksView onNavigate={(view) => setCurrentView(view)} />
        )}

        {currentView === 'ai_analysis' && (
          <AiAnalysisView onNavigate={(view) => setCurrentView(view)} />
        )}

        {currentView === 'profile' && (
          <ProfileView onNavigate={(view) => setCurrentView(view)} />
        )}

        {currentView === 'admin_dashboard' && (
          <AdminDashboardView
            onSelectDonation={(d) => setSelectedDonation(d)}
            onOpenCertificate={handleOpenCertificate}
          />
        )}

        {currentView === 'map_view' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-black text-slate-900">Spatial Rescue Dispatch Map</h1>
                <p className="text-xs text-slate-500">Live geo-tagged donor supplies, verified NGOs & active couriers.</p>
              </div>
              <button
                onClick={() => setCurrentView('browse')}
                className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold shadow-xs hover:bg-emerald-700 cursor-pointer"
              >
                &larr; Back to Grid View
              </button>
            </div>
            <InteractiveFoodMap
              donations={donations}
              users={users}
              onSelectDonation={(d) => setSelectedDonation(d)}
              heightClass="h-[640px]"
            />
          </div>
        )}
      </main>

      {/* Global Modals */}
      <FoodDetailModal
        donation={selectedDonation}
        onClose={() => setSelectedDonation(null)}
        onAccept={(d) => acceptDonationAsNgo(d.id)}
        onRequestPickup={(d) => assignVolunteerToDonation(d.id)}
        onOpenCertificate={handleOpenCertificate}
      />

      <FoodVerificationModal
        donation={verificationModalDonation}
        isOpen={!!verificationModalDonation}
        onClose={() => setVerificationModalDonation(null)}
      />

      <RedistributionModal
        donation={redistributionModalDonation}
        isOpen={!!redistributionModalDonation}
        onClose={() => setRedistributionModalDonation(null)}
        onOpenCertificate={handleOpenCertificate}
      />

      <QrScannerModal />

      <CertificateModal />

      <ReportModal />

      <ChatDrawer />

      <AuthModal
        onSuccessNavigate={(view) => {
          setCurrentView(view);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      <NotificationDrawer
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        onSelectDonation={(dId) => {
          const target = donations.find((d) => d.id === dId);
          if (target) setSelectedDonation(target);
        }}
      />

      {/* Global Footer */}
      <Footer
        onNavigate={(view) => {
          setCurrentView(view);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />
    </div>
  );
};

export default function App() {
  return (
    <LanguageProvider>
      <AppProvider>
        <MainContent />
      </AppProvider>
    </LanguageProvider>
  );
}
