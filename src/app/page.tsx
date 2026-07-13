import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import FeatureStrip from '@/components/FeatureStrip';
import WhyRideSync from '@/components/WhyRideSync';
import AppPreview from '@/components/AppPreview';
import Features from '@/components/Features';
import CTABanner from '@/components/CTABanner';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <div className="min-h-screen bg-[#F7F8FA]">
      <Navbar />
      <main>
        <HeroSection />
        <FeatureStrip />
        <WhyRideSync />
        <AppPreview />
        <Features />
        <CTABanner />
      </main>
      <Footer />
    </div>
  );
}
