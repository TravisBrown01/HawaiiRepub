'use client';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Image from 'next/image';

export default function MilitaryOverseasVoters() {
  return (
    <div>
      <Header />
      <main className="college-students-page">
        {/* Hero Section */}
        <section className="college-students-hero">
          <div className="container">
            <div className="college-students-hero-logo">
              <Image
                src="/images/hawaii-gop-logo.png"
                alt="Hawaii Republican Party Logo"
                width={100}
                height={100}
                priority
              />
            </div>
            <h1>Military & Overseas Voters</h1>
            <p className="subtitle">Voting While Serving or Living Abroad</p>
          </div>
        </section>

        {/* Main Content */}
        <section className="college-students-content">
          <div className="container">
            <div className="main-content">
              <div className="college-students-intro">
                <h2>Voting as a Military Member or Overseas Citizen</h2>
                <p>
                  The Uniformed and Overseas Citizens Absentee Voting Act (UOCAVA) establishes provisions for absent uniformed service members and U.S. citizens residing outside the country to register and vote.
                </p>
                <p>
                  UOCAVA voters are U.S. Citizens who reside outside the U.S. (i.e., overseas). They are eligible to receive a ballot from the state/county in which they last resided immediately prior to moving overseas.
                </p>
                <p className="important-note">
                  <strong>Important:</strong> UOCAVA voters must submit a Federal Post Card Application (FPCA) each election year to receive an absentee ballot.
                </p>
              </div>

              {/* Who Qualifies */}
              <div className="application-section">
                <h2>Who Qualifies as a UOCAVA Voter?</h2>
                <div className="forms-grid">
                  <div className="form-card">
                    <div className="form-icon">
                      <i className="fas fa-shield-alt"></i>
                    </div>
                    <h3>Military Members</h3>
                    <p>Members of the United States Uniformed Services</p>
                  </div>

                  <div className="form-card">
                    <div className="form-icon">
                      <i className="fas fa-users"></i>
                    </div>
                    <h3>Family Members</h3>
                    <p>Spouses and dependents of military members</p>
                  </div>

                  <div className="form-card">
                    <div className="form-icon">
                      <i className="fas fa-globe"></i>
                    </div>
                    <h3>Overseas Citizens</h3>
                    <p>U.S. citizens living overseas temporarily or indefinitely</p>
                  </div>
                </div>
              </div>

              {/* Election Dates */}
              <div className="election-dates-section">
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
                      <span className="date-label">FPCA Deadline:</span>
                      <span className="date-value">August 1, 2026</span>
                    </div>
                    <div className="date-item">
                      <span className="date-label">Ballots Arrive:</span>
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
                      <span className="date-value">October 26, 2026</span>
                    </div>
                    <div className="date-item">
                      <span className="date-label">FPCA Deadline:</span>
                      <span className="date-value">October 27, 2026</span>
                    </div>
                    <div className="date-item">
                      <span className="date-label">Ballots Arrive:</span>
                      <span className="date-value">October 16, 2026</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* FPCA Forms */}
              <div className="application-section">
                <h2>Federal Post Card Application (FPCA)</h2>
                <p>
                  UOCAVA voters must complete a Federal Post Card Application (FPCA) to register to vote and request an absentee ballot. 
                  The FPCA serves as both a voter registration form and an absentee ballot request.
                </p>
                <div className="forms-grid">
                  <a 
                    href="https://www.fvap.gov/eo/overview/materials/forms" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="form-card"
                  >
                    <div className="form-icon">
                      <i className="fas fa-file-pdf"></i>
                    </div>
                    <h3>FPCA Form</h3>
                    <p>Federal Post Card Application</p>
                    <div className="form-cta">Get Form →</div>
                  </a>

                  <a 
                    href="https://elections.hawaii.gov/wp-content/uploads/2024-General-Ballot-Proofs.pdf" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="form-card"
                  >
                    <div className="form-icon">
                      <i className="fas fa-eye"></i>
                    </div>
                    <h3>Sample Ballot</h3>
                    <p>View candidates and ballot questions</p>
                    <div className="form-cta">View Ballot →</div>
                  </a>

                  <a 
                    href="https://www.fvap.gov/eo/overview/materials/forms" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="form-card"
                  >
                    <div className="form-icon">
                      <i className="fas fa-edit"></i>
                    </div>
                    <h3>FWAB Form</h3>
                    <p>Federal Write-In Absentee Ballot</p>
                    <div className="form-cta">Get FWAB →</div>
                  </a>
                </div>
              </div>

              {/* Steps to Vote */}
              <div className="steps-section">
                <h2>How to Vote as a Military or Overseas Voter</h2>
                <div className="steps-grid">
                  <div className="step-card">
                    <div className="step-number">1</div>
                    <h3>Complete FPCA</h3>
                    <p>Fill out the Federal Post Card Application for registration and ballot request.</p>
                  </div>

                  <div className="step-card">
                    <div className="step-number">2</div>
                    <h3>Submit Application</h3>
                    <p>Submit the FPCA to your County Elections Division by the deadline.</p>
                  </div>

                  <div className="step-card">
                    <div className="step-number">3</div>
                    <h3>Receive Ballot</h3>
                    <p>Your ballot will be sent 45 days prior to the election by mail, email, or fax.</p>
                  </div>

                  <div className="step-card">
                    <div className="step-number">4</div>
                    <h3>Vote and Return</h3>
                    <p>Complete your ballot and return it by the deadline (7:00 PM on Election Day).</p>
                  </div>

                  <div className="step-card">
                    <div className="step-number">5</div>
                    <h3>Use FWAB if Needed</h3>
                    <p>If you don't receive your ballot, use the Federal Write-In Absentee Ballot.</p>
                  </div>
                </div>
              </div>

              {/* Military Contacts */}
              <div className="contact-section">
                <h2>Military Voting Assistance</h2>
                <div className="contact-grid">
                  <div className="contact-card">
                    <h3>Federal Voting Assistance Program</h3>
                    <p><strong>Phone:</strong> 800-438-VOTE (8683)</p>
                    <p><strong>Email:</strong> vote@fvap.gov</p>
                    <p><strong>Website:</strong> <a href="https://www.fvap.gov" target="_blank" rel="noopener noreferrer">www.fvap.gov</a></p>
                  </div>

                  <div className="contact-card">
                    <h3>Hawaii Military Contacts</h3>
                    <p><strong>Air Force - Hickam AFB:</strong> (808) 474-5051</p>
                    <p><strong>Army - Schofield Barracks:</strong> (808) 787-1452</p>
                    <p><strong>Marine Corps - MCB Hawaii:</strong> (808) 496-8866</p>
                    <p><strong>Navy - JB Pearl Harbor:</strong> (808) 722-7544</p>
                  </div>
                </div>
              </div>

              {/* Federal Voting Assistance Program */}
              <div className="fvap-section">
                <h2>Federal Voting Assistance Program (FVAP)</h2>
                <p>
                  The Federal Voting Assistance Program (FVAP) is a voting assistance program for service members and their families and overseas citizens.
                </p>
                <div className="fvap-contact">
                  <div className="contact-info">
                    <p><strong>Phone:</strong> 800-438-VOTE (8683)</p>
                    <p><strong>Email:</strong> vote@fvap.gov</p>
                    <p><strong>Website:</strong> <a href="https://www.fvap.gov" target="_blank" rel="noopener noreferrer">www.fvap.gov</a></p>
                  </div>
                </div>
              </div>

              {/* Resources & Contact Information */}
              <div className="contact-section">
                <h2>Resources & Contact Information</h2>
                <div className="contact-grid">
                  <div className="contact-card">
                    <h3>Hawaii Office of Elections</h3>
                    <p><strong>Phone:</strong> (808) 453-8683</p>
                    <p><strong>Toll Free:</strong> 800-442-8683</p>
                    <p><strong>Email:</strong> elections@hawaii.gov</p>
                    <p><strong>Website:</strong> <a href="https://elections.hawaii.gov" target="_blank" rel="noopener noreferrer">elections.hawaii.gov</a></p>
                  </div>

                  <div className="contact-card">
                    <h3>County Elections Divisions</h3>
                    <p><strong>Honolulu:</strong> (808) 768-3800</p>
                    <p><strong>Hawaii:</strong> (808) 961-8277</p>
                    <p><strong>Maui:</strong> (808) 270-7749</p>
                    <p><strong>Kauai:</strong> (808) 241-4800</p>
                    <a 
                      href="https://elections.hawaii.gov/county-elections-divisions/" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="action-btn"
                    >
                      Find County Elections Division →
                    </a>
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