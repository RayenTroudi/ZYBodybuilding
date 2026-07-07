import Image from "next/image";
import Hero from './components/Hero';
import About from './components/Aboutus';
import Pricing from './components/Pricing';
import Schedule from './components/Schedule';
import Contact from './components/Contact';
import CTA from './components/CTA';
import OpenStatus from './components/OpenStatus';
export default function Home() {
  return (
    <div>
      <Hero />
      <OpenStatus />
      <Schedule/>
      <About />
      <Pricing/>
      <CTA/>
      <Contact />
    </div>
  );
}
