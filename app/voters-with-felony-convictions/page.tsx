'use client';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Image from 'next/image';

export default function VotersWithFelonyConvictions() {
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
            <h1>Voters with Felony Convictions</h1>
            <p className="subtitle">Understanding Your Voting Rights in Hawaii</p>
          </div>
        </section>

        {/* Main Content */}
        <section className="college-students-content">
          <div className="container">
            <div className="main-content">
              <div className="college-students-intro">
                <h2>Voting Rights for Individuals with Felony Convictions</h2>
                <p>
                  Understanding your voting rights after a felony conviction is important. Hawaii has specific laws 
                  regarding when individuals with felony convictions can and cannot vote.
                </p>
                <p className="important-note">
                  <strong>Important:</strong> A voter sentenced for a felony, from the time of the person's sentence 
                  until the person's final discharge, may not vote in an election. However, if a person is placed on 
                  probation or the person is paroled after commitment to imprisonment, the person may register and vote 
                  during the period of the probation or parole.
                </p>
              </div>

              {/* Voting Rights Overview */}
              <div className="application-section">
                <h2>When You Can and Cannot Vote</h2>
                <div className="forms-grid">
                  <div className="form-card">
                    <div className="form-icon">
                      <i className="fas fa-times-circle"></i>
                    </div>
                    <h3>Cannot Vote</h3>
                    <p>During the period from sentencing until final discharge from the sentence.</p>
                  </div>

                  <div className="form-card">
                    <div className="form-icon">
                      <i className="fas fa-check-circle"></i>
                    </div>
                    <h3>Can Vote</h3>
                    <p>While on probation or parole after commitment to imprisonment.</p>
                  </div>

                  <div className="form-card">
                    <div className="form-icon">
                      <i className="fas fa-user-check"></i>
                    </div>
                    <h3>Fully Restored</h3>
                    <p>After final discharge from the sentence, voting rights are automatically restored.</p>
                  </div>
                </div>
              </div>

              {/* Legal References */}
              <div className="application-section">
                <h2>Legal References & Official Documents</h2>
                <p>
                  For complete information about voting rights for individuals with felony convictions, 
                  please refer to the following legal sources and official documents:
                </p>
                <div className="forms-grid">
                  <a 
                    href="https://lrb.hawaii.gov/constitution/#articleii" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="form-card"
                  >
                    <div className="form-icon">
                      <i className="fas fa-gavel"></i>
                    </div>
                    <h3>Hawaii State Constitution</h3>
                    <p>Article II, Section 2 - Disqualification</p>
                    <div className="form-cta">View Constitution →</div>
                  </a>

                  <a 
                    href="https://data.capitol.hawaii.gov/hrscurrent/Vol14_Ch0701-0853/HRS0831/HRS_0831-0002.htm" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="form-card"
                  >
                    <div className="form-icon">
                      <i className="fas fa-book"></i>
                    </div>
                    <h3>Hawaii Revised Statutes</h3>
                    <p>HRS §831-2 - Disqualification from voting</p>
                    <div className="form-cta">View Statutes →</div>
                  </a>

                  <a 
                    href="/documents/Impact-of-a-Felony-Conviction.pdf" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="form-card"
                  >
                    <div className="form-icon">
                      <i className="fas fa-file-pdf"></i>
                    </div>
                    <h3>Impact of a Felony Conviction</h3>
                    <p>Official document on voting rights restoration</p>
                    <div className="form-cta">Download PDF →</div>
                  </a>
                </div>
              </div>

              {/* Registration Process */}
              <div className="steps-section">
                <h2>How to Register to Vote After a Felony Conviction</h2>
                <p>
                  If you are eligible to vote (on probation, parole, or after final discharge), 
                  follow these steps to register:
                </p>
                <div className="steps-grid">
                  <div className="step-card">
                    <div className="step-number">1</div>
                    <h3>Verify Eligibility</h3>
                    <p>Confirm that you are on probation, parole, or have completed your sentence and received final discharge.</p>
                  </div>

                  <div className="step-card">
                    <div className="step-number">2</div>
                    <h3>Gather Documentation</h3>
                    <p>Have your probation/parole documents or discharge papers ready to verify your status.</p>
                  </div>

                  <div className="step-card">
                    <div className="step-number">3</div>
                    <h3>Register to Vote</h3>
                    <p>Use the standard voter registration process - online, by mail, or in person at a voter service center.</p>
                  </div>

                  <div className="step-card">
                    <div className="step-number">4</div>
                    <h3>Provide Information</h3>
                    <p>You may need to provide information about your conviction and current status if requested.</p>
                  </div>

                  <div className="step-card">
                    <div className="step-number">5</div>
                    <h3>Receive Confirmation</h3>
                    <p>You will receive confirmation of your registration and be able to vote in upcoming elections.</p>
                  </div>
                </div>
              </div>

              {/* Important Considerations */}
              <div className="application-section">
                <h2>Important Considerations</h2>
                <div className="forms-grid">
                  <div className="form-card">
                    <div className="form-icon">
                      <i className="fas fa-info-circle"></i>
                    </div>
                    <h3>Automatic Restoration</h3>
                    <p>Voting rights are automatically restored after final discharge - no additional application needed.</p>
                  </div>

                  <div className="form-card">
                    <div className="form-icon">
                      <i className="fas fa-calendar-check"></i>
                    </div>
                    <h3>Timing Matters</h3>
                    <p>The key factor is your current status, not the nature of the original conviction.</p>
                  </div>

                  <div className="form-card">
                    <div className="form-icon">
                      <i className="fas fa-shield-alt"></i>
                    </div>
                    <h3>Privacy Protected</h3>
                    <p>Your voting record is private and separate from your criminal record.</p>
                  </div>

                  <div className="form-card">
                    <div className="form-icon">
                      <i className="fas fa-phone"></i>
                    </div>
                    <h3>Get Help</h3>
                    <p>If you're unsure about your eligibility, contact the Hawaii Office of Elections for guidance.</p>
                    <a href="tel:8084538683" className="form-cta">Call (808) 453-8683 →</a>
                  </div>
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

              {/* Additional Resources */}
              <div className="contact-section">
                <h2>Additional Resources</h2>
                <div className="contact-grid">
                  <div className="contact-card">
                    <h3>Voter Registration</h3>
                    <p><strong>Online Registration:</strong> <a href="https://olvr.hawaii.gov" target="_blank" rel="noopener noreferrer">olvr.hawaii.gov</a></p>
                    <p><strong>Voter Service Centers:</strong> <a href="https://elections.hawaii.gov/voter-service-centers-and-places-of-deposit/" target="_blank" rel="noopener noreferrer">Find Locations</a></p>
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