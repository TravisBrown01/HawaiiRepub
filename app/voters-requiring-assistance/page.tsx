'use client';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Image from 'next/image';

export default function VotersRequiringAssistance() {
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
            <h1>Voters Requiring Assistance</h1>
            <p className="subtitle">Accessible Voting Options in Hawaii</p>
          </div>
        </section>

        {/* Main Content */}
        <section className="college-students-content">
          <div className="container">
            <div className="main-content">
              <div className="college-students-intro">
                <h2>Voting Accessibility in Hawaii</h2>
                <p>
                  A voter who requires assistance to vote, by reason of disability, visual or hearing impairment, 
                  or inability to read or write, may request assistance from a person of their choice other than 
                  their employer or agent of their employer or union.
                </p>
                <p className="important-note">
                  <strong>Important:</strong> All registered voters receive a mail ballot packet approximately 
                  18 days prior to the election, and multiple accessible voting options are available.
                </p>
              </div>

              {/* Voting Options */}
              <div className="application-section">
                <h2>Accessible Voting Options</h2>
                <div className="forms-grid">
                  <div className="form-card">
                    <div className="form-icon">
                      <i className="fas fa-envelope"></i>
                    </div>
                    <h3>Vote at Home with Paper Ballot</h3>
                    <p>All registered voters receive a mail ballot packet approximately 18 days prior to the election.</p>
                  </div>

                  <div className="form-card">
                    <div className="form-icon">
                      <i className="fas fa-laptop"></i>
                    </div>
                    <h3>Accessible Electronic Ballot</h3>
                    <p>Voters with special needs may request an accessible electronic ballot from their County Elections Division.</p>
                  </div>

                  <div className="form-card">
                    <div className="form-icon">
                      <i className="fas fa-touchscreen"></i>
                    </div>
                    <h3>Ballot Marking Device</h3>
                    <p>Voter service centers are equipped with accessible voting equipment including the Verity Touch Writer.</p>
                  </div>
                </div>
              </div>

              {/* Electronic Ballot Demo */}
              <div className="application-section">
                <h2>Try the Accessible Electronic Ballot System</h2>
                <p>
                  Experience the accessible electronic ballot system firsthand. This demo allows you to see how voters with 
                  disabilities can mark their ballots privately and independently using assistive technology.
                </p>
                
                {/* Demo Login Card */}
                <div className="demo-login-section">
                  <div className="demo-card">
                    <div className="demo-header">
                      <div className="demo-icon">
                        <i className="fas fa-laptop"></i>
                      </div>
                      <h3>Demo Login Information</h3>
                    </div>
                    <div className="demo-credentials">
                      <div className="credential-item">
                        <span className="credential-label">First Name:</span>
                        <span className="credential-value">Jane</span>
                      </div>
                      <div className="credential-item">
                        <span className="credential-label">Last Name:</span>
                        <span className="credential-value">Demo</span>
                      </div>
                      <div className="credential-item">
                        <span className="credential-label">Date of Birth:</span>
                        <span className="credential-value">01/01/1950</span>
                      </div>
                      <div className="credential-item">
                        <span className="credential-label">Access PIN:</span>
                        <span className="credential-value">090909</span>
                      </div>
                    </div>
                    <a 
                      href="https://app.enhancedvoting.com/ebd/voter/hawaii" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="demo-button"
                    >
                      <i className="fas fa-external-link-alt"></i>
                      Launch Demo System
                    </a>
                  </div>
                </div>

                {/* How It Works */}
                <div className="how-it-works-section">
                  <h3>How the Electronic Ballot System Works</h3>
                  <div className="steps-grid">
                    <div className="step-card">
                      <div className="step-number">1</div>
                      <h4>Request Access</h4>
                      <p>Contact your County Elections Division to request an accessible electronic ballot.</p>
                    </div>

                    <div className="step-card">
                      <div className="step-number">2</div>
                      <h4>Receive Ballot</h4>
                      <p>Your ballot will be electronically transmitted to you via email or secure download.</p>
                    </div>

                    <div className="step-card">
                      <div className="step-number">3</div>
                      <h4>Mark Privately</h4>
                      <p>Download and mark your ballot privately using your own assistive technology.</p>
                    </div>

                    <div className="step-card">
                      <div className="step-number">4</div>
                      <h4>Return Ballot</h4>
                      <p>Return your completed ballot electronically or use the return envelope from your mail packet.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Voter Service Centers */}
              <div className="election-dates-section">
                <h2>Voter Service Centers</h2>
                <p>
                  Voter service centers are equipped with accessible voting equipment. Voters may use an accessible 
                  ballot marking device, Verity Touch Writer, to vote their ballot and then print and cast their ballot. 
                  The printed ballot is the same as the one used by all voters whether at the voter service center or by mail.
                </p>
                <div className="dates-grid">
                  <div className="date-card">
                    <h3>Primary Election</h3>
                    <div className="date-item">
                      <span className="date-label">Service Centers Open:</span>
                      <span className="date-value">July 27 - August 8, 2026</span>
                    </div>
                    <div className="date-item">
                      <span className="date-label">Hours:</span>
                      <span className="date-value">10 business days prior</span>
                    </div>
                    <div className="date-item">
                      <span className="date-label">Closed:</span>
                      <span className="date-value">Sundays</span>
                    </div>
                  </div>

                  <div className="date-card">
                    <h3>General Election</h3>
                    <div className="date-item">
                      <span className="date-label">Service Centers Open:</span>
                      <span className="date-value">October 20 - November 3, 2026</span>
                    </div>
                    <div className="date-item">
                      <span className="date-label">Hours:</span>
                      <span className="date-value">10 business days prior</span>
                    </div>
                    <div className="date-item">
                      <span className="date-label">Closed:</span>
                      <span className="date-value">Sundays</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Assistance Guidelines */}
              <div className="steps-section">
                <h2>Guidelines for Individuals Providing Voting Assistance</h2>
                <p>
                  If a resident of a care facility requests assistance from facility personnel in registering to vote 
                  and voting their ballot, the following guidelines should be observed to protect the voter's rights:
                </p>
                <div className="steps-grid">
                  <div className="step-card">
                    <div className="step-number">1</div>
                    <h3>Involve Family Members</h3>
                    <p>Reach out to family members to get them involved in the process of registration and voting.</p>
                  </div>

                  <div className="step-card">
                    <div className="step-number">2</div>
                    <h3>Verify Qualifications</h3>
                    <p>Ensure that the resident meets all the qualifications to register to vote.</p>
                  </div>

                  <div className="step-card">
                    <div className="step-number">3</div>
                    <h3>Maintain Nonpartisanship</h3>
                    <p>When providing assistance in voting, staff must remain nonpartisan and there should be at least two people of differing political affiliation present.</p>
                  </div>

                  <div className="step-card">
                    <div className="step-number">4</div>
                    <h3>Respect Privacy</h3>
                    <p>No one may ask a voter to see or look at the contests of their ballot or choice of political affiliation.</p>
                  </div>

                  <div className="step-card">
                    <div className="step-number">5</div>
                    <h3>Authorized Assistance Only</h3>
                    <p>No one may mark a person's ballot or direct a person in voting without authorization.</p>
                  </div>

                  <div className="step-card">
                    <div className="step-number">6</div>
                    <h3>Prevent Fraud</h3>
                    <p>An attempt to vote in the name of another without specific authorization is illegal.</p>
                  </div>
                </div>
              </div>

              {/* Voter Fraud Prevention */}
              <div className="application-section">
                <h2>Voter and Election Fraud Prevention</h2>
                <p>The following actions constitute voter and election fraud:</p>
                <div className="forms-grid">
                  <div className="form-card">
                    <div className="form-icon">
                      <i className="fas fa-ban"></i>
                    </div>
                    <h3>Bribery & Coercion</h3>
                    <p>Offering money or valuable consideration to induce voting or refraining from voting for any particular person.</p>
                  </div>

                  <div className="form-card">
                    <div className="form-icon">
                      <i className="fas fa-exclamation-triangle"></i>
                    </div>
                    <h3>Threats & Intimidation</h3>
                    <p>Threatening, forcing or intimidating a voter to refrain from voting or to vote for any particular person or party.</p>
                  </div>

                  <div className="form-card">
                    <div className="form-icon">
                      <i className="fas fa-user-times"></i>
                    </div>
                    <h3>Impersonation</h3>
                    <p>Voting or attempting to vote in the name of any other person, living or dead, or in some fictitious name.</p>
                  </div>

                  <div className="form-card">
                    <div className="form-icon">
                      <i className="fas fa-copy"></i>
                    </div>
                    <h3>Double Voting</h3>
                    <p>Having already voted and knowingly attempting to vote again, or giving more than one ballot for the same office.</p>
                  </div>
                </div>
                <p className="important-note">
                  <strong>Legal Penalty:</strong> Pursuant to Hawaii law, any person who knowingly furnishes false information 
                  on the voter registration application or absentee application may be guilty of a Class C Felony, 
                  punishable by up to 5 years imprisonment and/or $10,000 fine.
                </p>
              </div>

              {/* ASL Video Section */}
              <div className="video-section">
                <h2>Hawaii Elections Explained 2024 (ASL)</h2>
                <p>
                  Watch this American Sign Language video explaining Hawaii's election process and accessible voting options.
                </p>
                <div className="video-container">
                  <div className="video-wrapper">
                    <iframe
                      src="https://www.youtube.com/embed/KBzXADP-k5M?si=VaRfb9v70jFbMsi0"
                      title="Hawaii Elections Explained 2024 - American Sign Language"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                    ></iframe>
                  </div>
                </div>
                <p className="video-caption">
                  This video provides a comprehensive explanation of Hawaii's election process in American Sign Language.
                </p>
              </div>

              {/* Accessibility Resources */}
              <div className="application-section">
                <h2>Accessibility Resources</h2>
                <p>
                  Download accessibility brochures in multiple languages and formats to help you understand your voting options.
                </p>
                
                {/* Brochures Section */}
                <div className="forms-grid">
                  <a 
                    href="/documents/accessibility-brochure-english.pdf" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="form-card"
                  >
                    <div className="form-icon">
                      <i className="fas fa-file-pdf"></i>
                    </div>
                    <h3>English</h3>
                    <p>Accessibility Brochure</p>
                    <div className="form-cta">Download PDF →</div>
                  </a>

                  <a 
                    href="/documents/accessibility-brochure-chinese.pdf" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="form-card"
                  >
                    <div className="form-icon">
                      <i className="fas fa-file-pdf"></i>
                    </div>
                    <h3>中文 (Chinese)</h3>
                    <p>Accessibility Brochure</p>
                    <div className="form-cta">Download PDF →</div>
                  </a>

                  <a 
                    href="/documents/accessibility-brochure-hawaiian.pdf" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="form-card"
                  >
                    <div className="form-icon">
                      <i className="fas fa-file-pdf"></i>
                    </div>
                    <h3>ʻŌlelo Hawaiʻi (Hawaiian)</h3>
                    <p>Accessibility Brochure</p>
                    <div className="form-cta">Download PDF →</div>
                  </a>

                  <a 
                    href="/documents/accessibility-brochure-ilocano.pdf" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="form-card"
                  >
                    <div className="form-icon">
                      <i className="fas fa-file-pdf"></i>
                    </div>
                    <h3>Ilokano (Ilocano)</h3>
                    <p>Accessibility Brochure</p>
                    <div className="form-cta">Download PDF →</div>
                  </a>

                  <a 
                    href="/documents/accessibility-brochure-tagalog.pdf" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="form-card"
                  >
                    <div className="form-icon">
                      <i className="fas fa-file-pdf"></i>
                    </div>
                    <h3>Tagalog (Tagalog)</h3>
                    <p>Accessibility Brochure</p>
                    <div className="form-cta">Download PDF →</div>
                  </a>

                  <a 
                    href="/documents/accessibility-brochure-audio.mp3" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="form-card"
                  >
                    <div className="form-icon">
                      <i className="fas fa-volume-up"></i>
                    </div>
                    <h3>Audio Version</h3>
                    <p>Accessibility Brochure</p>
                    <div className="form-cta">Listen →</div>
                  </a>
                </div>
              </div>

              {/* Contact Information */}
              <div className="contact-section">
                <h2>Contact Information</h2>
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