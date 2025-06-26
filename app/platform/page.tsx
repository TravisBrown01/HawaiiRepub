'use client';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Image from 'next/image';

export default function ResourcesPage() {
  return (
    <div>
      <Header />
      <main className="platform-page">
        {/* Hero Section */}
        <section className="election-hero">
          <div className="container">
            <div className="election-hero-logo">
              <Image
                src="/images/hawaii-gop-logo.png"
                alt="Hawaii Republican Party Logo"
                width={100}
                height={100}
                priority
              />
            </div>
            <h1>Party Platform</h1>
            <p className="subtitle">Official Party Platform, Bylaws & Resources for Hawaii Republicans</p>
          </div>
        </section>

        {/* Main Content */}
        <section className="page-content">
          <div className="container">
            <div className="page-intro">
              <h2>Essential Resources for Hawaii Republicans</h2>
              <p>
                Access official party documents, tools, and resources to help you get involved and stay informed about Republican activities across Hawaii.
              </p>
            </div>

            {/* Platform & Bylaws */}
            <div className="page-section">
              <h2>Platform & Bylaws</h2>
              <p>
                Official party platform and governing documents that define our principles and organizational structure.
              </p>
              <div className="resources-grid">
                <a 
                  href="/documents/2024-HRP-Platform-Convention-Updates.pdf" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="resource-card"
                >
                  <h3>2024 HRP Platform</h3>
                  <p>Complete platform document with all convention updates and amendments.</p>
                  <div className="form-cta">Download PDF →</div>
                </a>
                <a 
                  href="/documents/Hawaii-Republican-Party-Bylaws-May-2024.pdf" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="resource-card"
                >
                  <h3>HRP Bylaws</h3>
                  <p>Official party bylaws and organizational structure.</p>
                  <div className="form-cta">Download PDF →</div>
                </a>
                <a 
                  href="/documents/Red-vs-Blue-Guide.pdf" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="resource-card"
                >
                  <h3>Red vs Blue Guide</h3>
                  <p>Comprehensive guide to Republican vs Democratic principles.</p>
                  <div className="form-cta">Download PDF →</div>
                </a>
              </div>
            </div>

            {/* Action Plans & Guides */}
            <div className="page-section">
              <h2>Action Plans & Guides</h2>
              <p>
                Strategic action plans and practical guides for party activities and voter engagement.
              </p>
              <div className="resources-grid">
                <a 
                  href="/documents/HRP-Action-Plan.pdf" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="resource-card"
                >
                  <h3>HRP Action Plan</h3>
                  <p>Strategic action plan for party growth and voter engagement.</p>
                  <div className="form-cta">Download PDF →</div>
                </a>
                <a 
                  href="/documents/PEM-Guide.pdf" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="resource-card"
                >
                  <h3>PEM Guide</h3>
                  <p>Precinct Election Manager guide and procedures.</p>
                  <div className="form-cta">Download PDF →</div>
                </a>
              </div>
            </div>

            {/* County Rules & Bylaws */}
            <div className="page-section">
              <h2>County Rules & Bylaws</h2>
              <p>
                County-specific rules, bylaws, and organizational documents for each county committee.
              </p>
              <div className="resources-grid">
                <a 
                  href="/documents/East-Hawaii-County-GOP-Rules-2021.pdf" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="resource-card"
                >
                  <h3>East Hawaii County GOP Rules</h3>
                  <p>Rules and procedures for East Hawaii County Republican Party.</p>
                  <div className="form-cta">Download PDF →</div>
                </a>
                <a 
                  href="/documents/West-Hawaii-County-GOP-Rules-2023.pdf" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="resource-card"
                >
                  <h3>West Hawaii County GOP Rules</h3>
                  <p>Rules and procedures for West Hawaii County Republican Party.</p>
                  <div className="form-cta">Download PDF →</div>
                </a>
                <a 
                  href="/documents/Maui-County-GOP-Bylaws-2021.pdf" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="resource-card"
                >
                  <h3>Maui County GOP Bylaws</h3>
                  <p>Bylaws and organizational structure for Maui County Republican Party.</p>
                  <div className="form-cta">Download PDF →</div>
                </a>
                <a 
                  href="/documents/Honolulu-County-Republican-Party-Rules-2013.pdf" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="resource-card"
                >
                  <h3>Honolulu County GOP Rules</h3>
                  <p>Rules and procedures for Honolulu County Republican Party.</p>
                  <div className="form-cta">Download PDF →</div>
                </a>
                <a 
                  href="/documents/Kauai-County-GOP-Rules-2023.pdf" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="resource-card"
                >
                  <h3>Kauai County GOP Rules</h3>
                  <p>Rules and procedures for Kauai County Republican Party.</p>
                  <div className="form-cta">Download PDF →</div>
                </a>
              </div>
            </div>

            {/* Official Forms */}
            <div className="page-section">
              <h2>Official Forms</h2>
              <p>
                Official party forms and agreements for data access and contributions.
              </p>
              <div className="resources-grid">
                <a 
                  href="/documents/HIGOP-Data-User-Agreement-2024.pdf" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="resource-card"
                >
                  <h3>HIGOP Data User Agreement</h3>
                  <p>Agreement for accessing Hawaii GOP voter data and resources.</p>
                  <div className="form-cta">Download PDF →</div>
                </a>
                <a 
                  href="/documents/HRP-All-in-One-Contribution-Form-010124.pdf" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="resource-card"
                >
                  <h3>Contribution Form</h3>
                  <p>All-in-one contribution form for party donations and support.</p>
                  <div className="form-cta">Download PDF →</div>
                </a>
              </div>
            </div>

            {/* How-to Guides */}
            <div className="page-section">
              <h2>How-to Guides</h2>
              <p>
                Step-by-step guides and tutorials for party activities and voter engagement.
              </p>
              <div className="resources-grid">
                <a 
                  href="/documents/How-to-Run-for-Office.pdf" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="resource-card"
                >
                  <h3>How to Run for Office</h3>
                  <p>Complete guide for Republican candidates running for office in Hawaii.</p>
                  <div className="form-cta">Download PDF →</div>
                </a>
                <a 
                  href="/documents/Precinct-Organization-Guide.pdf" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="resource-card"
                >
                  <h3>Precinct Organization Guide</h3>
                  <p>Guide for organizing and managing precinct-level Republican activities.</p>
                  <div className="form-cta">Download PDF →</div>
                </a>
                <a 
                  href="/documents/Voter-Registration-Guide.pdf" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="resource-card"
                >
                  <h3>Voter Registration Guide</h3>
                  <p>Step-by-step guide for helping voters register and participate in elections.</p>
                  <div className="form-cta">Download PDF →</div>
                </a>
              </div>
            </div>

            {/* Contact Section */}
            <div className="contact-section">
              <div className="container">
                <h2>Need Help?</h2>
                <div className="contact-grid">
                  <div className="contact-card">
                    <h3>Party Headquarters</h3>
                    <p>Contact the Hawaii Republican Party for general inquiries and support.</p>
                    <a href="mailto:info@hawaiigop.org">info@hawaiigop.org</a>
                  </div>
                  <div className="contact-card">
                    <h3>Technical Support</h3>
                    <p>Need help accessing documents or technical assistance?</p>
                    <a href="mailto:support@hawaiigop.org">support@hawaiigop.org</a>
                  </div>
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