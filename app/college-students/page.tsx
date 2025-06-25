'use client';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Image from 'next/image';

export default function CollegeStudents() {
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
            <h1>College Students</h1>
            <p className="subtitle">Voting While Away at College</p>
          </div>
        </section>

        {/* Main Content */}
        <section className="college-students-content">
          <div className="container">
            <div className="main-content">
              <div className="college-students-intro">
                <h2>Voting as a College Student</h2>
                <p>
                  If you are a Hawaii resident attending an out-of-state college, and would like to vote in Hawaii elections, 
                  you will need to submit an Absentee Application to request for your ballot to be mailed to your current mailing address. 
                  You will need to submit an Absentee Application each election year that you are away from your Hawaii residence.
                </p>
                <p>
                  Similarly, if you are a Hawaii resident attending college in-state, you may submit an Absentee Application 
                  to have your ballot mailed to your campus address.
                </p>
                <p className="important-note">
                  <strong>Important:</strong> Absentee Applications must be received by your County Elections Division 
                  at least seven (7) days prior to the election.
                </p>
              </div>

              {/* Election Dates */}
              <div className="election-dates-section">
                <h2>2026 Election Dates</h2>
                <div className="dates-grid">
                  <div className="date-card">
                    <h3>Primary Election</h3>
                    <div className="date-item">
                      <span className="date-label">Election Day:</span>
                      <span className="date-value">August 8, 2026</span>
                    </div>
                    <div className="date-item">
                      <span className="date-label">Absentee Request Deadline:</span>
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
                      <span className="date-label">Absentee Request Deadline:</span>
                      <span className="date-value">October 27, 2026</span>
                    </div>
                    <div className="date-item">
                      <span className="date-label">Ballots Arrive:</span>
                      <span className="date-value">October 16, 2026</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Application Forms */}
              <div className="application-section">
                <h2>Absentee Ballot Application Forms</h2>
                <p>
                  Download and complete the appropriate absentee ballot application form. 
                  Forms are available in multiple languages:
                </p>
                <div className="forms-grid">
                  <a 
                    href="https://elections.hawaii.gov/wp-content/uploads/1437358-01-Hawaii-Votes%5Fabsentee-application%5FFinal.pdf" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="form-card"
                  >
                    <div className="form-icon">
                      <i className="fas fa-file-pdf"></i>
                    </div>
                    <h3>English</h3>
                    <p>Absentee Ballot Application</p>
                    <div className="form-cta">Download PDF →</div>
                  </a>

                  <a 
                    href="https://elections.hawaii.gov/wp-content/uploads/AB-Form-English-02.15.22%5FTChinese-updated-LR.pdf" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="form-card"
                  >
                    <div className="form-icon">
                      <i className="fas fa-file-pdf"></i>
                    </div>
                    <h3>中文 (Chinese)</h3>
                    <p>Absentee Ballot Application</p>
                    <div className="form-cta">Download PDF →</div>
                  </a>

                  <a 
                    href="https://elections.hawaii.gov/wp-content/uploads/1438707-01-2023-Hawaii-Votes%5Fabsentee-application%5FHawaiian%5FFinal.pdf" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="form-card"
                  >
                    <div className="form-icon">
                      <i className="fas fa-file-pdf"></i>
                    </div>
                    <h3>ʻŌlelo Hawaiʻi (Hawaiian)</h3>
                    <p>Absentee Ballot Application</p>
                    <div className="form-cta">Download PDF →</div>
                  </a>

                  <a 
                    href="https://elections.hawaii.gov/wp-content/uploads/AB-Form-English-02.15.22%5FIlocano-LR.pdf" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="form-card"
                  >
                    <div className="form-icon">
                      <i className="fas fa-file-pdf"></i>
                    </div>
                    <h3>Ilokano (Ilocano)</h3>
                    <p>Absentee Ballot Application</p>
                    <div className="form-cta">Download PDF →</div>
                  </a>

                  <a 
                    href="https://elections.hawaii.gov/wp-content/uploads/AB-Form-English-02.15.22-Tagalog%5FUpdated%5FLR.pdf" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="form-card"
                  >
                    <div className="form-icon">
                      <i className="fas fa-file-pdf"></i>
                    </div>
                    <h3>Tagalog (Tagalog)</h3>
                    <p>Absentee Ballot Application</p>
                    <div className="form-cta">Download PDF →</div>
                  </a>
                </div>
              </div>

              {/* Steps to Vote */}
              <div className="steps-section">
                <h2>How to Vote as a College Student</h2>
                <div className="steps-grid">
                  <div className="step-card">
                    <div className="step-number">1</div>
                    <h3>Download Application</h3>
                    <p>Download the absentee ballot application form in your preferred language from the links above.</p>
                  </div>

                  <div className="step-card">
                    <div className="step-number">2</div>
                    <h3>Complete the Form</h3>
                    <p>Fill out the application with your current mailing address (college address) and other required information.</p>
                  </div>

                  <div className="step-card">
                    <div className="step-number">3</div>
                    <h3>Submit Application</h3>
                    <p>Mail or deliver the completed application to your County Elections Division at least 7 days before the election.</p>
                  </div>

                  <div className="step-card">
                    <div className="step-number">4</div>
                    <h3>Receive Your Ballot</h3>
                    <p>Your ballot will be mailed to your college address approximately 2-3 weeks before the election.</p>
                  </div>

                  <div className="step-card">
                    <div className="step-number">5</div>
                    <h3>Vote and Return</h3>
                    <p>Complete your ballot and return it by mail. Make sure it's postmarked by Election Day.</p>
                  </div>

                  <div className="step-card">
                    <div className="step-number">6</div>
                    <h3>Track Your Ballot</h3>
                    <p>Use the ballot tracking system to ensure your vote is received and counted.</p>
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="contact-section">
                <h2>Need Help? Contact Your County Elections Division</h2>
                <p>
                  If you would like to request a Voter Registration Certificate, or would like more information 
                  about absentee voting, contact your County Elections Division:
                </p>
                <div className="contact-grid">
                  <div className="contact-card">
                    <h3>Hawaii County</h3>
                    <p>Phone: (808) 961-8277</p>
                    <p>Email: elections@hawaiicounty.gov</p>
                  </div>

                  <div className="contact-card">
                    <h3>Maui County</h3>
                    <p>Phone: (808) 270-7749</p>
                    <p>Email: elections@mauicounty.gov</p>
                  </div>

                  <div className="contact-card">
                    <h3>Kauai County</h3>
                    <p>Phone: (808) 241-4800</p>
                    <p>Email: elections@kauai.gov</p>
                  </div>

                  <div className="contact-card">
                    <h3>Honolulu County</h3>
                    <p>Phone: (808) 768-3800</p>
                    <p>Email: elections@honolulu.gov</p>
                  </div>
                </div>
              </div>

              {/* Additional Resources */}
              <div className="resources-section">
                <h2>Additional Resources</h2>
                <div className="resources-grid">
                  <a 
                    href="https://olvr.hawaii.gov" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="resource-card"
                  >
                    <div className="resource-icon">
                      <i className="fas fa-id-card"></i>
                    </div>
                    <h3>Register to Vote</h3>
                    <p>Register to vote or update your registration information.</p>
                    <div className="resource-cta">Register Now →</div>
                  </a>

                  <a 
                    href="https://ballotstatus.hawaii.gov" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="resource-card"
                  >
                    <div className="resource-icon">
                      <i className="fas fa-binoculars"></i>
                    </div>
                    <h3>Track Your Ballot</h3>
                    <p>Track the status of your mail-in ballot and ensure it's counted.</p>
                    <div className="resource-cta">Track Ballot →</div>
                  </a>

                  <a 
                    href="https://elections.hawaii.gov/voter-service-centers-and-places-of-deposit/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="resource-card"
                  >
                    <div className="resource-icon">
                      <i className="fas fa-map"></i>
                    </div>
                    <h3>Voting Locations</h3>
                    <p>Find your nearest polling place and ballot drop box locations.</p>
                    <div className="resource-cta">Find Locations →</div>
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