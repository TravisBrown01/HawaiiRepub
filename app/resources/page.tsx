'use client';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Image from 'next/image';

export default function ResourcesPage() {
  return (
    <div>
      <Header />
      <main className="resources-page">
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
            <h1>Party Resources</h1>
            <p className="subtitle">Tools, Platform, Bylaws & Forms for Hawaii Republicans</p>
          </div>
        </section>

        {/* Main Content */}
        <section className="resources-content">
          <div className="container">
            <div className="main-content">
              <div className="resources-intro">
                <h2>Essential Resources for Hawaii Republicans</h2>
                <p>
                  Access official party documents, tools, and resources to help you get involved and stay informed about Republican activities across Hawaii.
                </p>
              </div>

              {/* Platform & Bylaws */}
              <div className="resources-section">
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
              <div className="resources-section">
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
              <div className="resources-section">
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
              <div className="resources-section">
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
              <div className="resources-section">
                <h2>How-to Guides</h2>
                <p>
                  Step-by-step guides for common party activities and procedures.
                </p>
                <div className="resources-grid">
                  <a 
                    href="/documents/How-to-Submit-Testimony-Hawaii-Legislature.pdf" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="resource-card"
                  >
                    <h3>How to Submit Testimony</h3>
                    <p>Step-by-step guide for submitting testimony to the Hawaii State Legislature.</p>
                    <div className="form-cta">Download PDF →</div>
                  </a>
                  <a 
                    href="/documents/FEC-Campaign-Guide.pdf" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="resource-card"
                  >
                    <h3>FEC Campaign Guide</h3>
                    <p>Federal Election Commission campaign finance guide.</p>
                    <div className="form-cta">Download PDF →</div>
                  </a>
                  <a 
                    href="/documents/CSC-Campaign-Spending-Law.pdf" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="resource-card"
                  >
                    <h3>CSC Campaign Spending Law</h3>
                    <p>Hawaii Campaign Spending Commission laws and regulations.</p>
                    <div className="form-cta">Download PDF →</div>
                  </a>
                  <a 
                    href="https://www.opensecrets.org/states/HI/candidates/2022" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="resource-card"
                  >
                    <h3>Open Secrets – Who Donated to Whom</h3>
                    <p>Explore who donated to Hawaii candidates and campaigns.</p>
                    <div className="form-cta">View Guide →</div>
                  </a>
                  <a 
                    href="https://ags.hawaii.gov/campaign/nc/independent-expenditure-committees/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="resource-card"
                  >
                    <h3>Super PACs in Hawaii</h3>
                    <p>Official list and info on Hawaii's registered Super PACs (Independent Expenditure Committees).</p>
                    <div className="form-cta">View Guide →</div>
                  </a>
                  <a 
                    href="https://ags.hawaii.gov/campaign/contribution-limits/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="resource-card"
                  >
                    <h3>Contribution Limits – CSC</h3>
                    <p>Official Hawaii Campaign Spending Commission contribution limits.</p>
                    <div className="form-cta">View Guide →</div>
                  </a>
                  <a 
                    href="https://ballotpedia.org/Main_Page" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="resource-card"
                  >
                    <h3>Ballotpedia</h3>
                    <p>Comprehensive information on Hawaii elections, candidates, and ballot measures.</p>
                    <div className="form-cta">View Guide →</div>
                  </a>
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