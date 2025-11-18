import ParticleBackground from '@/components/ParticleBackground';
import Navigation from '@/components/Navigation';
import About from '@/components/sections/About';
import Projects from '@/components/sections/Projects';
import Contact from '@/components/sections/Contact';

export default function Home() {
  return (
    <main className="relative min-h-screen">
      <ParticleBackground />
      <Navigation />
      <About />
      <Projects />
      <Contact />
    </main>
  );
}
