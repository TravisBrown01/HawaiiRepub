'use client';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Image from 'next/image';
import Link from 'next/link';

export default function CountiesPage() {
  return (
    <div>
      <Header />
      <main className="counties-page">
        {/* Hero Section */}
        <section className="counties-hero">
          <div className="container">
            <div className="counties-hero-logo">
              <Image
                src="/images/hawaii-gop-logo.png"
                alt="Hawaii Republican Party Logo"
                width={100}
                height={100}
                priority
              />
            </div>
            <h1>County Organizations</h1>
            <p className="subtitle">Connect with Republican organizations across the Hawaiian Islands</p>
          </div>
        </section>

        {/* County GOP Organizations */}
        <section className="page-content">
          <div className="container">
            <div className="page-intro">
              <h2>County GOP Organizations</h2>
              <p>
                Find your local Republican Party organization and get involved in your community. Each county has its own GOP organization working to advance Republican values and support candidates in their area.
              </p>
            </div>
            <div className="values-grid counties-grid">
              {/* Honolulu County GOP */}
              <div className="value-card">
                <div className="value-icon">
                  <i className="fas fa-map-marker-alt"></i>
                </div>
                <h3>Honolulu County Committee</h3>
                <p>Serving the City and County of Honolulu, the most populous county in Hawaii</p>
                <a href="https://oahugop.com" target="_blank" rel="noopener noreferrer" className="show-more">Visit Website</a>
              </div>
              {/* Maui County GOP */}
              <div className="value-card">
                <div className="value-icon">
                  <i className="fas fa-map-marker-alt"></i>
                </div>
                <h3>Maui County GOP</h3>
                <p>Representing the islands of Maui, Molokai, and Lanai</p>
                <a href="https://mauicountygop.com" target="_blank" rel="noopener noreferrer" className="show-more">Visit Website</a>
              </div>
              {/* Kauai County GOP */}
              <div className="value-card">
                <div className="value-icon">
                  <i className="fas fa-map-marker-alt"></i>
                </div>
                <h3>Kauai County GOP</h3>
                <p>Serving the Garden Isle and its Republican community</p>
                <a href="https://kauaigop.com" target="_blank" rel="noopener noreferrer" className="show-more">Visit Website</a>
              </div>
              {/* West Hawaii County GOP */}
              <div className="value-card">
                <div className="value-icon">
                  <i className="fas fa-map-marker-alt"></i>
                </div>
                <h3>West Hawaii County GOP</h3>
                <p>Representing the western side of the Big Island</p>
                <a href="https://westhawaiigop.org" target="_blank" rel="noopener noreferrer" className="show-more">Visit Website</a>
              </div>
              {/* East Hawaii County GOP */}
              <div className="value-card">
                <div className="value-icon">
                  <i className="fas fa-map-marker-alt"></i>
                </div>
                <h3>East Hawaii County GOP</h3>
                <p>Serving the eastern side of Hawaii Island</p>
                <a href="https://easthawaiigop.org" target="_blank" rel="noopener noreferrer" className="show-more">Visit Website</a>
              </div>
            </div>
          </div>
        </section>

        {/* Coalitions & Auxiliaries */}
        <section className="page-content">
          <div className="container">
            <div className="page-intro">
              <h2>Coalitions & Auxiliaries</h2>
              <p>
                Specialized organizations working to advance Republican values across Hawaii through targeted outreach and advocacy.
              </p>
            </div>
            <div className="values-grid coalitions-grid">
              {/* Oahu League of Republican Women */}
              <div className="value-card">
                <div className="value-icon">
                  <i className="fas fa-users"></i>
                </div>
                <h3>Oahu League of Republican Women</h3>
                <p>Empowering Republican women on Oahu through leadership and advocacy</p>
                <a href="https://www.olrw.org" target="_blank" rel="noopener noreferrer" className="show-more">Visit Website</a>
              </div>
              {/* Hawaii Federation of Republican Women */}
              <div className="value-card">
                <div className="value-icon">
                  <i className="fas fa-users"></i>
                </div>
                <h3>Hawaii Federation of Republican Women</h3>
                <p>Statewide organization promoting Republican women's leadership</p>
                <a href="https://www.hfrw.online" target="_blank" rel="noopener noreferrer" className="show-more">Visit Website</a>
              </div>
              {/* Hawaii Young Republicans */}
              <div className="value-card">
                <div className="value-icon">
                  <i className="fas fa-clock"></i>
                </div>
                <h3>Hawaii Young Republicans</h3>
                <p>Engaging young Republicans across the Hawaiian Islands</p>
                <a href="https://www.hawaiiyr.com" target="_blank" rel="noopener noreferrer" className="show-more">Visit Website</a>
              </div>
            </div>
          </div>
        </section>

        {/* County Councils */}
        <section className="page-content">
          <div className="container">
            <div className="page-intro">
              <h2>County Councils</h2>
              <p>
                Local government councils representing Republican values in county governance and policy-making.
              </p>
            </div>
            <div className="values-grid councils-grid">
              {/* Maui County Council */}
              <div className="value-card">
                <div className="value-icon">
                  <i className="fas fa-building"></i>
                </div>
                <h3>Maui County Council</h3>
                <p>Legislative body for Maui, Molokai, and Lanai counties</p>
                <a href="https://www.mauicounty.us/councilmembers/" target="_blank" rel="noopener noreferrer" className="show-more">Visit Council</a>
              </div>
              {/* City & County of Honolulu Council */}
              <div className="value-card">
                <div className="value-icon">
                  <i className="fas fa-building"></i>
                </div>
                <h3>City & County of Honolulu Council</h3>
                <p>Legislative body for the City and County of Honolulu</p>
                <a href="https://www.honolulucitycouncil.org" target="_blank" rel="noopener noreferrer" className="show-more">Visit Council</a>
              </div>
              {/* Kauai County Council */}
              <div className="value-card">
                <div className="value-icon">
                  <i className="fas fa-building"></i>
                </div>
                <h3>Kauai County Council</h3>
                <p>Legislative body for Kauai County</p>
                <a href="https://www.kauai.gov/Government/Council" target="_blank" rel="noopener noreferrer" className="show-more">Visit Council</a>
              </div>
              {/* County of Hawaii Council */}
              <div className="value-card">
                <div className="value-icon">
                  <i className="fas fa-building"></i>
                </div>
                <h3>County of Hawaii Council</h3>
                <p>Legislative body for Hawaii County (Big Island)</p>
                <a href="https://www.hawaiicounty.gov/our-county/legislative/county-council/council-members-and-districts" target="_blank" rel="noopener noreferrer" className="show-more">Visit Council</a>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="counties-cta" style={{ background: '#fff' }}>
          <div className="container">
            <div className="main-content centered">
              <div className="cta-content">
                <h2>Get Involved in Your Community</h2>
                <p>Connect with your local Republican organization and help build a stronger Hawaii</p>
                <div className="cta-buttons">
                  <Link href="/about" className="cta-btn cta-btn--primary">Learn More About Us</Link>
                  <Link href="#" className="cta-btn cta-btn--secondary">Contact Your County GOP</Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
} 