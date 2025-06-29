'use client';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Image from 'next/image';
import DonationSection from '../components/DonationSection';

export default function ElectionEducation() {
  return (
    <div>
      <Header />
      <main className="election-education-page">
        {/* Hero Section */}
        <section className="education-hero">
          <div className="container">
            <div className="education-hero-logo">
              <Image
                src="/images/hawaii-gop-logo.png"
                alt="Hawaii Republican Party Logo"
                width={100}
                height={100}
                priority
              />
            </div>
            <h1>Election Education</h1>
            <p className="subtitle">Understanding Hawaii's Voting Process</p>
          </div>
        </section>

        {/* Main Content */}
        <section className="page-content">
          <div className="container">
            {/* Introduction */}
            <div className="page-intro">
              <h2>How Elections Work in Hawaii</h2>
              <p>
                Hawaii conducts statewide elections in even-numbered years. The primary election is held on the second Saturday in August and the general election is held on the first Tuesday after the first Monday in November. Understanding the voting process helps ensure your voice is heard in our democracy.
              </p>
            </div>

            {/* Video Section */}
            <div className="page-section">
              <h2>Voting in Hawaii: A Complete Guide</h2>
              <div className="video-container">
                <iframe
                  width="100%"
                  height="400"
                  src="https://www.youtube.com/embed/X81ATlsLXzU?si=P6D4fCotUAIshThw"
                  title="Voting in Hawaii Guide"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
              <p className="video-caption">
                Learn about Hawaii's mail-in voting system, voter registration, and election processes.
              </p>
            </div>

            {/* Election Types */}
            <div className="page-section">
              <h2>Types of Elections in Hawaii</h2>
              <div className="types-grid">
                <div className="type-card">
                  <div className="type-icon">
                    <i className="fas fa-check-circle"></i>
                  </div>
                  <h3>Primary Election</h3>
                  <p>
                    The primary election nominates candidates to represent political parties in the general election. Hawaii voters do not declare a political affiliation with voter registration, ensuring every voter's right to secrecy.
                  </p>
                  <ul>
                    <li>Held on second Saturday in August</li>
                    <li>Voters select political affiliation on ballot</li>
                    <li>Vote for candidates of chosen party only</li>
                    <li>Nonpartisan candidates also on ballot</li>
                  </ul>
                </div>

                <div className="type-card">
                  <div className="type-icon">
                    <i className="fas fa-flag"></i>
                  </div>
                  <h3>General Election</h3>
                  <p>
                    The general election is a candidate contest where voters may vote for the candidate of their choice regardless of political affiliation.
                  </p>
                  <ul>
                    <li>Held first Tuesday after first Monday in November</li>
                    <li>Vote for candidates regardless of party</li>
                    <li>Federal, state, county, and OHA candidates</li>
                    <li>Constitutional and charter amendments</li>
                  </ul>
                </div>

                <div className="type-card">
                  <div className="type-icon">
                    <i className="fas fa-star"></i>
                  </div>
                  <h3>Presidential Elections</h3>
                  <p>
                    Hawaii does not conduct a presidential preference primary. Political parties independently conduct presidential caucuses to nominate candidates.
                  </p>
                  <ul>
                    <li>Party-run presidential caucuses</li>
                    <li>Electoral College elects president</li>
                    <li>Contact parties directly for participation</li>
                    <li>Held every four years</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Voting by Mail */}
            <div className="steps-section">
              <h2>Voting by Mail in Hawaii</h2>
              <p>
                Pursuant to <strong>Act 136, SLH 2019</strong>, elections are conducted by mail. All registered voters automatically receive their ballot in the mail approximately eighteen (18) days prior to the election.
              </p>
              <div className="steps-grid">
                <div className="step-card">
                  <div className="step-number">1</div>
                  <h3>Receive Your Ballot</h3>
                  <p>Ballots are mailed to your registered address 18 days before the election.</p>
                </div>
                <div className="step-card">
                  <div className="step-number">2</div>
                  <h3>Mark Your Ballot</h3>
                  <p>Review candidates and measures, then make your selections with a pen.</p>
                </div>
                <div className="step-card">
                  <div className="step-number">3</div>
                  <h3>Prepare for Return</h3>
                  <p>Fold ballot, place in secrecy sleeve, then in return envelope and sign.</p>
                </div>
                <div className="step-card">
                  <div className="step-number">4</div>
                  <h3>Return Your Ballot</h3>
                  <p>Mail or drop off at designated locations by 7:00 PM on Election Day.</p>
                </div>
              </div>
            </div>

            {/* Voter Registration */}
            <div className="page-section">
              <h2>Voter Registration Requirements</h2>
              <div className="registration-requirements">
                <div className="requirements-card">
                  <h3>To register to vote in Hawaii, you must be:</h3>
                  <ul>
                    <li><strong>U.S. Citizen</strong> - Must be a citizen of the United States</li>
                    <li><strong>Hawaii Resident</strong> - Must be a resident of the State of Hawaii</li>
                    <li><strong>Age 16+</strong> - Can pre-register at 16, automatically registered at 18</li>
                  </ul>
                  <div className="registration-actions">
                    <a 
                      href="https://olvr.hawaii.gov" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="registration-btn"
                    >
                      <i className="fas fa-id-card"></i>
                      Register to Vote Online
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Important Dates */}
            <div className="page-section">
              <h2>2026 Election Dates & Deadlines</h2>
              <div className="dates-grid">
                <div className="date-card">
                  <h3>Primary Election</h3>
                  <div className="date-item">
                    <span className="date-label">Election Day:</span>
                    <span className="date-value">August 8, 2026</span>
                  </div>
                  <div className="date-item">
                    <span className="date-label">Registration Deadline:</span>
                    <span className="date-value">July 29, 2026</span>
                  </div>
                  <div className="date-item">
                    <span className="date-label">Ballot Mailing:</span>
                    <span className="date-value">July 21, 2026</span>
                  </div>
                </div>

                <div className="date-card">
                  <h3>General Election</h3>
                  <div className="date-item">
                    <span className="date-label">Election Day:</span>
                    <span className="date-value">November 3, 2026</span>
                  </div>
                  <div className="date-item">
                    <span className="date-label">Registration Deadline:</span>
                    <span className="date-value">October 25, 2026</span>
                  </div>
                  <div className="date-item">
                    <span className="date-label">Ballot Mailing:</span>
                    <span className="date-value">October 16, 2026</span>
                  </div>
                </div>
              </div>
            </div>

            {/* FAQ Section */}
            <div className="page-section">
              <h2>Frequently Asked Questions</h2>
              <div className="faq-grid">
                <div className="faq-item">
                  <h3>Can I vote in person?</h3>
                  <p>Yes, you can vote in person at designated voter service centers. These centers are open 10 days before Election Day and on Election Day itself.</p>
                </div>
                <div className="faq-item">
                  <h3>What if I don't receive my ballot?</h3>
                  <p>Contact your County Clerk's Office immediately. You can also visit a voter service center to request a replacement ballot.</p>
                </div>
                <div className="faq-item">
                  <h3>How do I know my ballot was received?</h3>
                  <p>You can track your ballot online at elections.hawaii.gov or contact your County Clerk's Office for status updates.</p>
                </div>
                <div className="faq-item">
                  <h3>Can I register to vote on Election Day?</h3>
                  <p>Yes, Hawaii offers same-day voter registration at voter service centers. You'll need to provide proof of identification and residency.</p>
                </div>
              </div>
            </div>

            {/* Special Voters Section */}
            <div className="page-section">
              <h2>Special Voter Categories</h2>
              <div className="special-voters-grid">
                <div className="special-voter-card">
                  <div className="voter-icon">
                    <i className="fas fa-user-graduate"></i>
                  </div>
                  <h3>College Students</h3>
                  <p>Students can register to vote at their school address or home address. Learn about absentee voting and registration requirements.</p>
                  <a href="/college-students" className="voter-cta">Learn More →</a>
                </div>
                <div className="special-voter-card">
                  <div className="voter-icon">
                    <i className="fas fa-home"></i>
                  </div>
                  <h3>Houseless Voters</h3>
                  <p>Voters without a permanent address can still register and vote. Special provisions ensure your voting rights are protected.</p>
                  <a href="/houseless-voters" className="voter-cta">Learn More →</a>
                </div>
                <div className="special-voter-card">
                  <div className="voter-icon">
                    <i className="fas fa-shield-alt"></i>
                  </div>
                  <h3>Military & Overseas</h3>
                  <p>Active duty military and overseas voters have special voting procedures and extended deadlines.</p>
                  <a href="/military-overseas-voters" className="voter-cta">Learn More →</a>
                </div>
                <div className="special-voter-card">
                  <div className="voter-icon">
                    <i className="fas fa-wheelchair"></i>
                  </div>
                  <h3>Voters Requiring Assistance</h3>
                  <p>Voters with disabilities or who need assistance have special accommodations and support available at polling locations.</p>
                  <a href="/voters-requiring-assistance" className="voter-cta">Learn More →</a>
                </div>
              </div>
            </div>

            {/* Resources Section */}
            <div className="page-section">
              <h2>Additional Resources</h2>
              <div className="resources-grid">
                <a 
                  href="https://elections.hawaii.gov" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="resource-card"
                >
                  <i className="fas fa-globe"></i>
                  <h3>Hawaii Elections Office</h3>
                  <p>Official state elections website with voter information, forms, and updates.</p>
                  <div className="resource-cta">Visit Site →</div>
                </a>
                <a 
                  href="https://olvr.hawaii.gov" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="resource-card"
                >
                  <i className="fas fa-id-card"></i>
                  <h3>Online Voter Registration</h3>
                  <p>Register to vote or update your registration information online.</p>
                  <div className="resource-cta">Register Now →</div>
                </a>
                <a 
                  href="https://elections.hawaii.gov/voter-service-centers-and-places-of-deposit/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="resource-card"
                >
                  <i className="fas fa-map-marker-alt"></i>
                  <h3>Voter Service Centers</h3>
                  <p>Find locations and hours for in-person voting and voter services.</p>
                  <div className="resource-cta">Find Locations →</div>
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Donation Section */}
        <DonationSection />
      </main>
      <Footer />
    </div>
  );
} 