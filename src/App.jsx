import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import AboutUsPage from './pages/AboutUsPage';
import MenuPage from './pages/MenuPage';
import GalleryPage from './pages/GalleryPage';
import ContactPage from './pages/ContactPage';

import CustomerTableOrderingPage from './pages/CustomerTableOrderingPage';
import StaffDashboardPage from './pages/StaffDashboardPage';

import ReservationModal from './components/ReservationModal';
import DishDetailModal from './components/DishDetailModal';
import LightboxModal from './components/LightboxModal';
import SpaceTourModal from './components/SpaceTourModal';
import ToastNotification from './components/ToastNotification';
import useAmbientAudio from './components/AmbientAudioPlayer';
import { GALLERY_ITEMS } from './data/galleryData';

export default function App() {
  const parseRoute = () => {
    const path = window.location.pathname;
    const hash = window.location.hash.replace('#', '');

    // 1. Table QR Scan Route: /table/:tableNumberOrQr or #table/:tableNumberOrQr (FLOW B: Walk-in QR)
    const tableMatch = path.match(/^\/table\/([^\/]+)/i) || hash.match(/^table\/([^\/]+)/i);
    if (tableMatch) {
      return { page: 'table-order', tableIdentifier: tableMatch[1], isWalkInQr: true };
    }

    // 2. Direct Table Order Route: /order or /table-order or #order or #table-order (FLOW A: Enter Reservation Code first)
    if (path === '/order' || path === '/table-order' || hash === 'order' || hash === 'table-order') {
      return { page: 'table-order', tableIdentifier: null, isWalkInQr: false };
    }

    // 3. Staff Portal & Login: /staff or /staff/login or /admin
    if (path === '/staff' || path === '/staff/login' || path === '/admin' || hash === 'staff' || hash === 'staff/login' || hash === 'admin') {
      return { page: 'staff', isLoginRoute: path === '/staff/login' || hash === 'staff/login' };
    }

    // 4. Standard Pages
    const cleanPath = path.replace(/^\//, '').toLowerCase();
    if (['about', 'menu', 'gallery', 'contact'].includes(cleanPath)) {
      return { page: cleanPath };
    }
    if (['home', 'about', 'menu', 'gallery', 'contact'].includes(hash)) {
      return { page: hash };
    }

    return { page: 'home' };
  };

  const [routeState, setRouteState] = useState(parseRoute);
  const [isReservationOpen, setIsReservationOpen] = useState(false);
  const [selectedDish, setSelectedDish] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isSpaceTourOpen, setIsSpaceTourOpen] = useState(false);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [audioVolume, setAudioVolume] = useState(0.65);
  const [toast, setToast] = useState(null);

  // Initialize Web Audio Ambient Sound Player
  useAmbientAudio(isAudioPlaying, audioVolume);

  const toggleAudio = () => {
    setIsAudioPlaying((prev) => {
      const nextState = !prev;
      if (nextState) {
        showToast(`🎵 Ambient café soundscape playing (${Math.round(audioVolume * 100)}% volume).`, 'success');
      } else {
        showToast('🔇 Ambient café soundscape paused.', 'info');
      }
      return nextState;
    });
  };

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  // Sync browser back/forward and direct URL path routing
  useEffect(() => {
    const handleLocationChange = () => {
      setRouteState(parseRoute());
    };

    window.addEventListener('popstate', handleLocationChange);
    window.addEventListener('hashchange', handleLocationChange);
    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      window.removeEventListener('hashchange', handleLocationChange);
    };
  }, []);

  const navigateTo = (page, path = null) => {
    let targetPath = path || (page === 'home' ? '/' : page === 'table-order' ? '/order' : `/${page}`);
    try {
      window.history.pushState({ page }, '', targetPath);
    } catch (e) {
      window.location.hash = targetPath.replace(/^\//, '');
    }
    setRouteState(parseRoute());
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigateToTable = (tableNumberOrQr) => {
    navigateTo('table-order', `/table/${tableNumberOrQr}`);
  };

  // Lightbox handlers
  const handleOpenLightbox = (item) => {
    setSelectedImage(item);
  };

  const handleNextImage = () => {
    if (!selectedImage) return;
    const currentIndex = GALLERY_ITEMS.findIndex((img) => img.id === selectedImage.id);
    const nextIndex = (currentIndex + 1) % GALLERY_ITEMS.length;
    setSelectedImage(GALLERY_ITEMS[nextIndex]);
  };

  const handlePrevImage = () => {
    if (!selectedImage) return;
    const currentIndex = GALLERY_ITEMS.findIndex((img) => img.id === selectedImage.id);
    const prevIndex = (currentIndex - 1 + GALLERY_ITEMS.length) % GALLERY_ITEMS.length;
    setSelectedImage(GALLERY_ITEMS[prevIndex]);
  };

  const isTableOrderPage = routeState.page === 'table-order';

  return (
    <div className="min-h-screen flex flex-col bg-[#FFF9EF] text-[#4A321E] relative selection:bg-[#1E2D12] selection:text-[#F4E9D5]">
      
      {/* Global Sticky Luxury Navbar (Hidden when on dedicated full-screen table ordering page) */}
      {!isTableOrderPage && (
        <Navbar
          activePage={routeState.page}
          setActivePage={(p) => navigateTo(p)}
          onOpenReservation={() => setIsReservationOpen(true)}
          onOpenTableOrder={() => navigateTo('table-order', '/order')}
          isAudioPlaying={isAudioPlaying}
          toggleAudio={toggleAudio}
          audioVolume={audioVolume}
          setAudioVolume={setAudioVolume}
        />
      )}

      {/* Main Content Pages */}
      <main className="flex-grow">
        {routeState.page === 'home' && (
          <div key="home" className="animate-page-enter">
            <HomePage
              setActivePage={(p) => navigateTo(p)}
              onOpenReservation={() => setIsReservationOpen(true)}
              onOpenTableOrder={() => navigateTo('table-order', '/order')}
              onSelectDish={(dish) => setSelectedDish(dish)}
              onOpenSpaceTour={() => setIsSpaceTourOpen(true)}
            />
          </div>
        )}

        {routeState.page === 'about' && (
          <div key="about" className="animate-page-enter">
            <AboutUsPage
              setActivePage={(p) => navigateTo(p)}
              onOpenReservation={() => setIsReservationOpen(true)}
              onOpenSpaceTour={() => setIsSpaceTourOpen(true)}
            />
          </div>
        )}

        {routeState.page === 'menu' && (
          <div key="menu" className="animate-page-enter">
            <MenuPage
              onSelectDish={(dish) => setSelectedDish(dish)}
              onOpenReservation={() => setIsReservationOpen(true)}
              onOpenTableOrder={() => navigateTo('table-order', '/order')}
              onShowToast={showToast}
            />
          </div>
        )}

        {routeState.page === 'gallery' && (
          <div key="gallery" className="animate-page-enter">
            <GalleryPage
              onSelectImage={handleOpenLightbox}
              onOpenReservation={() => setIsReservationOpen(true)}
            />
          </div>
        )}

        {routeState.page === 'contact' && (
          <div key="contact" className="animate-page-enter">
            <ContactPage
              onOpenReservation={() => setIsReservationOpen(true)}
              onShowToast={showToast}
            />
          </div>
        )}

        {/* CUSTOMER TABLE ORDERING INTERFACE (FLOW A: CODE GATE | FLOW B: QR TABLE) */}
        {routeState.page === 'table-order' && (
          <CustomerTableOrderingPage
            initialTable={routeState.tableIdentifier}
            isWalkInQr={routeState.isWalkInQr}
            onShowToast={showToast}
            onBackToHome={() => navigateTo('home')}
            onOpenReservation={() => setIsReservationOpen(true)}
          />
        )}

        {/* STAFF & TABLE MANAGEMENT DASHBOARD (/staff) */}
        {routeState.page === 'staff' && (
          <StaffDashboardPage
            isLoginRoute={routeState.isLoginRoute}
            onNavigateToTableLanding={handleNavigateToTable}
            onShowToast={showToast}
            onBackToHome={() => navigateTo('home')}
          />
        )}
      </main>


      {/* Global Luxury Footer (Hidden on dedicated full-screen table ordering page) */}
      {!isTableOrderPage && (
        <Footer
          setActivePage={(p) => navigateTo(p)}
          onOpenReservation={() => setIsReservationOpen(true)}
          onShowToast={showToast}
        />
      )}

      {/* Modals & Dialogs (z-50) */}
      <ReservationModal
        isOpen={isReservationOpen}
        onClose={() => setIsReservationOpen(false)}
        onShowToast={showToast}
      />

      <DishDetailModal
        dish={selectedDish}
        isOpen={!!selectedDish}
        onClose={() => setSelectedDish(null)}
        onOpenReservation={() => {
          setSelectedDish(null);
          setIsReservationOpen(true);
        }}
        onOpenTableOrder={() => {
          setSelectedDish(null);
          navigateTo('table-order', '/order');
        }}
      />

      <LightboxModal
        isOpen={!!selectedImage}
        activeImage={selectedImage}
        images={GALLERY_ITEMS}
        onClose={() => setSelectedImage(null)}
        onNext={handleNextImage}
        onPrev={handlePrevImage}
      />

      <SpaceTourModal
        isOpen={isSpaceTourOpen}
        onClose={() => setIsSpaceTourOpen(false)}
        onOpenReservation={() => {
          setIsSpaceTourOpen(false);
          setIsReservationOpen(true);
        }}
      />

      {/* Feedback Toast Notification (z-60) */}
      <ToastNotification
        toast={toast}
        onDismiss={() => setToast(null)}
      />

    </div>
  );
}
