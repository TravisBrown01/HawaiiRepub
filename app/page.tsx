import Header from './components/Header';
import Hero from './components/Hero';
import WelcomeSection from './components/WelcomeSection';
import Actions from './components/Actions';
import Events from './components/Events';
import ValuesPreview from './components/ValuesPreview';
import Footer from './components/Footer';
import DonationSection from './components/DonationSection';
import { JoinUsCardFullWidth } from './components/JoinUsCard';

export default function Home() {
  return (
    <div>
      <Header />
      <Hero />
      <DonationSection />
      <WelcomeSection />
      <Actions />
      <Events />
      <ValuesPreview />
      <JoinUsCardFullWidth />
      <Footer />
    </div>
  );
}
