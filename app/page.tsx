import Header from './components/Header';
import Hero from './components/Hero';
import WelcomeSection from './components/WelcomeSection';
import JoinForm from './components/JoinForm';
import Actions from './components/Actions';
import Events from './components/Events';
import ValuesPreview from './components/ValuesPreview';
import NewsletterSignup from './components/NewsletterSignup';
import Footer from './components/Footer';

export default function Home() {
  return (
    <div>
      <Header />
      <Hero />
      <WelcomeSection />
      <Actions />
      <Events />
      <ValuesPreview />
      <NewsletterSignup />
      <JoinForm />
      <Footer />
    </div>
  );
}
