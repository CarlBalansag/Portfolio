import CreativeCanvas from '@/components/CreativeCanvas';
import MinimalNavigation from '@/components/MinimalNavigation';
import Hero from '@/components/sections/Hero';
import Work from '@/components/sections/Work';
import AboutMinimal from '@/components/sections/AboutMinimal';
import ContactMinimal from '@/components/sections/ContactMinimal';

export default function Home() {
  return (
    <main className="relative min-h-screen bg-[#0a0a0a]">
      <CreativeCanvas />
      <MinimalNavigation />
      <Hero />
      <Work />
      <AboutMinimal />
      <ContactMinimal />
    </main>
  );
}
