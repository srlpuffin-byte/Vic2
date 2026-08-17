import React, { useState, useEffect } from 'react';
import { 
  Navbar 
} from './components/AestheticNavbar';
import { 
  HeroSection, 
  HighlightsSection, 
  TeamSection, 
  ReviewsSection, 
  LocationAndFAQSection, 
  Footer 
} from './components/AestheticSections';
import { ClinicalEquipmentSection } from './components/ClinicalEquipmentSection';
import { ServiceCatalog } from './components/ServiceCatalog';
import { SmartSkinDiagnosis } from './components/SmartSkinDiagnosis';
import { BeforeAfterGallery } from './components/BeforeAfterGallery';
import { BookingModal } from './components/BookingModal';
import { ServiceDetailModal } from './components/ServiceDetailModal';
import { ComboPlannerModal } from './components/ComboPlannerModal';
import { GiftCardModal } from './components/GiftCardModal';
import { ReviewSubmissionModal } from './components/ReviewSubmissionModal';
import { LuxuryConciergeModal } from './components/LuxuryConciergeModal';
import { ActiveIngredientsModal } from './components/ActiveIngredientsModal';
import { LuxurySensoryAudio } from './components/LuxurySensoryAudio';
import { SystemManagementModal } from './components/SystemManagementModal';
import { MessageCircle, ShieldCheck, Gift } from 'lucide-react';
import { BUSINESS_DATA, TESTIMONIALS_DATA, SERVICES_DATA } from './data/aestheticData';
import { ServiceItem, Testimonial } from './types';
import { useGsapAnimations } from './utils/useGsapAnimations';
import { LuxuryCursorGlow } from './components/LuxuryCursorGlow';
import { LuxuryAuraBackground } from './components/LuxuryAuraBackground';

export function App() {
  // Initialize full-site GSAP animations
  useGsapAnimations();

  // Modal States
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [isGiftCardOpen, setIsGiftCardOpen] = useState(false);
  const [initialGiftCardCode, setInitialGiftCardCode] = useState<string | undefined>(undefined);
  const [isComboPlannerOpen, setIsComboPlannerOpen] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [isConciergeOpen, setIsConciergeOpen] = useState(false);
  const [isIngredientsOpen, setIsIngredientsOpen] = useState(false);
  const [isSystemModalOpen, setIsSystemModalOpen] = useState(false);
  const [systemInitialTab, setSystemInitialTab] = useState<'appointments' | 'giftcards' | 'issue-giftcard' | 'client-portal'>('client-portal');
  const [systemStaffMode, setSystemStaffMode] = useState<boolean>(false);
  const [selectedDetailService, setSelectedDetailService] = useState<ServiceItem | null>(null);

  // Check URL query / hash for gift card links (e.g. #giftcard-VIC-GC-XXXX or ?giftcard=VIC-GC-XXXX)
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash;
      const params = new URLSearchParams(window.location.search);
      const gcParam = params.get('giftcard');

      if (hash.startsWith('#giftcard-')) {
        const code = hash.replace('#giftcard-', '');
        if (code) {
          setInitialGiftCardCode(code);
          setIsGiftCardOpen(true);
        }
      } else if (gcParam) {
        setInitialGiftCardCode(gcParam);
        setIsGiftCardOpen(true);
      }
    };

    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  // Pre-selected parameters for booking modal
  const [preSelectedBookingService, setPreSelectedBookingService] = useState<ServiceItem | null>(null);
  const [preSelectedPaymentMethod, setPreSelectedPaymentMethod] = useState<'cash' | 'transfer' | 'giftcard'>('cash');

  // Dynamic reviews with localStorage
  const [reviews, setReviews] = useState<Testimonial[]>(() => {
    try {
      const saved = localStorage.getItem('vic_reviews_data');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error(e);
    }
    return TESTIMONIALS_DATA;
  });

  const handleAddReview = (newReview: Testimonial) => {
    const updated = [newReview, ...reviews];
    setReviews(updated);
    try {
      localStorage.setItem('vic_reviews_data', JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
  };

  // Handlers
  const handleOpenBooking = (service?: ServiceItem | null) => {
    if (service) {
      setPreSelectedBookingService(service);
    } else {
      setPreSelectedBookingService(null);
    }
    setPreSelectedPaymentMethod('cash');
    setIsBookingOpen(true);
  };

  const handleOpenBookingWithGiftCard = (code: string) => {
    setPreSelectedBookingService(null);
    setPreSelectedPaymentMethod('giftcard');
    setIsBookingOpen(true);
  };

  const handleOpenSystem = (tab: 'appointments' | 'giftcards' | 'issue-giftcard' | 'client-portal' = 'client-portal') => {
    setSystemStaffMode(false);
    setSystemInitialTab(tab);
    setIsSystemModalOpen(true);
  };

  const handleOpenStaffLogin = () => {
    setSystemStaffMode(true);
    setSystemInitialTab('appointments');
    setIsSystemModalOpen(true);
  };

  const handleOpenServiceDetail = (service: ServiceItem) => {
    setSelectedDetailService(service);
  };

  const handleBookCombo = (services: ServiceItem[], paymentMethod: 'cash' | 'transfer') => {
    if (services.length > 0) {
      setPreSelectedBookingService(services[0]);
    }
    setPreSelectedPaymentMethod(paymentMethod);
    setIsBookingOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#fdfbf7] text-[#2c2725] selection:bg-[#c98a92]/20 selection:text-[#2c2725] font-sans antialiased relative">
      
      {/* Luxury Interactive Cursor Glow (Desktop Only) */}
      <LuxuryCursorGlow />

      {/* Luxury Slow Drifting Silk Aura Particles */}
      <LuxuryAuraBackground />

      {/* Top Navbar */}
      <Navbar
        onOpenBooking={() => handleOpenBooking()}
        onOpenGiftCard={() => setIsGiftCardOpen(true)}
        onOpenComboPlanner={() => setIsComboPlannerOpen(true)}
        onOpenConcierge={() => setIsConciergeOpen(true)}
        onOpenIngredients={() => setIsIngredientsOpen(true)}
        onOpenSystem={(tab) => handleOpenSystem(tab)}
      />

      {/* Main Content Flow */}
      <main id="main-content">
        
        {/* 1. Hero Section & Technology Showcase */}
        <HeroSection
          onOpenBooking={() => handleOpenBooking()}
          onOpenGiftCard={() => setIsGiftCardOpen(true)}
          onOpenComboPlanner={() => setIsComboPlannerOpen(true)}
          onOpenConcierge={() => setIsConciergeOpen(true)}
        />

        {/* 2. Key Highlights & Medical Standards */}
        <HighlightsSection />

        {/* 2.1. Real Medical Equipment & Technology In-Cabin Showcase */}
        <ClinicalEquipmentSection
          onOpenBooking={(serviceId) => {
            const foundService = serviceId ? SERVICES_DATA.find(s => s.id === serviceId) : undefined;
            handleOpenBooking(foundService);
          }}
        />

        {/* 3. Interactive Smart Skin Diagnosis */}
        <SmartSkinDiagnosis
          onSelectRecommendedService={(service) => handleOpenBooking(service)}
        />

        {/* 4. Complete Service Catalog with Category Filters */}
        <ServiceCatalog
          onSelectService={(service) => handleOpenBooking(service)}
          onViewDetail={(service) => handleOpenServiceDetail(service)}
        />

        {/* 6. Clinical Before & After Interactive Comparison Sliders */}
        <BeforeAfterGallery />

        {/* 7. Medical & Professional Team (Mavi Tissera, Dra. Gelso, Lic. Boggio) */}
        <TeamSection
          onConsultSpecialist={() => handleOpenBooking()}
        />

        {/* 9. Verified Patient Reviews & Testimonial Submission */}
        <ReviewsSection
          reviews={reviews}
          onOpenReviewModal={() => setIsReviewModalOpen(true)}
        />

        {/* 10. Location, Interactive Map & Clinical FAQ */}
        <LocationAndFAQSection
          onOpenBooking={() => handleOpenBooking()}
        />

      </main>

      {/* Footer */}
      <Footer 
        onOpenStaffLogin={handleOpenStaffLogin}
      />

      {/* Ambient Sensory Audio Relax Button (Bottom Left) */}
      <LuxurySensoryAudio />

      {/* Floating Action Button (Bottom Right) */}
      <div className="fixed bottom-6 right-6 z-40 gsap-floating-actions">
        {/* WhatsApp Direct Chat Button / Pill */}
        <a
          href={BUSINESS_DATA.whatsappLink}
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-2.5 bg-[#25D366] hover:bg-[#20ba5a] text-white px-4 py-3 rounded-full shadow-2xl transition-all cursor-pointer group active:scale-95 whitespace-nowrap"
          title="¿Tenés dudas o querés reservar? Escribinos por WhatsApp"
          aria-label="WhatsApp"
        >
          <span className="text-xs font-semibold tracking-wide whitespace-nowrap hidden sm:inline">
            ¿Tenés dudas? Escribinos
          </span>
          <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center shrink-0">
            <MessageCircle className="w-4 h-4 fill-white text-transparent" />
          </div>
        </a>
      </div>

      {/* --- MODALS --- */}

      {/* 1. Booking Online Modal */}
      <BookingModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        preSelectedService={preSelectedBookingService}
        preSelectedPaymentMethod={preSelectedPaymentMethod}
        onOpenSystem={(tab) => handleOpenSystem(tab)}
      />

      {/* 2. Clinical Protocol & Service Detail Modal */}
      <ServiceDetailModal
        service={selectedDetailService}
        onClose={() => setSelectedDetailService(null)}
        onBook={(srv) => handleOpenBooking(srv)}
      />

      {/* 3. Personalized Combo & Spa Day Planner */}
      <ComboPlannerModal
        isOpen={isComboPlannerOpen}
        onClose={() => setIsComboPlannerOpen(false)}
        onBookCombo={handleBookCombo}
      />

      {/* 4. Gift Card Modal */}
      <GiftCardModal
        isOpen={isGiftCardOpen}
        onClose={() => {
          setIsGiftCardOpen(false);
          setInitialGiftCardCode(undefined);
          if (window.location.hash.startsWith('#giftcard-')) {
            window.history.replaceState(null, '', window.location.pathname);
          }
        }}
        initialCode={initialGiftCardCode}
        onOpenBookingWithGiftCard={handleOpenBookingWithGiftCard}
      />

      {/* 5. Leave a Review Modal */}
      <ReviewSubmissionModal
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        onAddReview={handleAddReview}
      />

      {/* 6. Haute Esthétique VIP Concierge & Memberships */}
      <LuxuryConciergeModal
        isOpen={isConciergeOpen}
        onClose={() => setIsConciergeOpen(false)}
      />

      {/* 7. Active Ingredients & Bioactive Formulation Explorer */}
      <ActiveIngredientsModal
        isOpen={isIngredientsOpen}
        onClose={() => setIsIngredientsOpen(false)}
        onBookServiceWithIngredient={(srv) => handleOpenBooking(srv)}
      />

      {/* 8. VIC System Management & Operations Modal (Turnos, Canje Gift Cards, Portal) */}
      <SystemManagementModal
        isOpen={isSystemModalOpen}
        onClose={() => setIsSystemModalOpen(false)}
        initialTab={systemInitialTab}
        initialStaffMode={systemStaffMode}
        onBookNew={() => handleOpenBooking()}
      />

    </div>
  );
}

export default App;
