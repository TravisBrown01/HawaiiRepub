'use client';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Image from 'next/image';

export default function HouselessVoters() {
  return (
    <div>
      <Header />
      <main className="houseless-voters-page">
        {/* Hero Section */}
        <section className="houseless-voters-hero">
          <div className="container">
            <div className="houseless-voters-hero-logo">
              <Image
                src="/images/hawaii-gop-logo.png"
                alt="Hawaii Republican Party Logo"
                width={100}
                height={100}
                priority
              />
            </div>
            <h1>Houseless Voters</h1>
            <p className="subtitle">Voting Without a Permanent Address</p>
          </div>
        </section>

        {/* Main Content */}
        <section className="houseless-voters-content">
          <div className="container">
            <div className="main-content">
              <div className="houseless-voters-intro">
                <h2>Voting Rights for Houseless Individuals</h2>
                <p>
                  You have the right to vote in Hawaii elections regardless of your housing situation. 
                  The Hawaii Office of Elections provides multiple options for houseless individuals 
                  to register and vote in elections.
                </p>
                <p className="important-note">
                  <strong>Important:</strong> You can register to vote and cast your ballot even without a permanent address. 
                  Alternative address options are available to ensure your voting rights are protected.
                </p>
              </div>

              {/* Registration Section */}
              <div className="registration-section">
                <h2>Registering to Vote</h2>
                <div className="registration-info">
                  <p>
                    Voter registration is available online, as a part of driver licenses and state ID applications 
                    with the Department of Motor Vehicles (DMV), or by completing a Voter Registration Application. 
                    Paper applications through the DMV and Voter Registration Application must be submitted by 
                    4:30 PM on the tenth day before each election.
                  </p>
                  
                  <div className="deadlines-grid">
                    <div className="deadline-card">
                      <h3>Primary Election</h3>
                      <p>Registration Deadline: July 29, 2026</p>
                    </div>
                    <div className="deadline-card">
                      <h3>General Election</h3>
                      <p>Registration Deadline: October 26, 2026</p>
                    </div>
                  </div>

                  <div className="same-day-registration">
                    <h3>Same Day Registration Available</h3>
                    <p>
                      The County Elections Divisions provide same day registration at voter service centers. 
                      New Hawaii voters can register and vote in-person. Similarly, registered Hawaii voters 
                      can update their voter registration and vote in-person.
                    </p>
                  </div>
                </div>
              </div>

              {/* Address Requirements */}
              <div className="address-section">
                <h2>Address Requirements</h2>
                <div className="address-info">
                  <div className="info-card">
                    <h3>No Address-Matching Requirement</h3>
                    <p>
                      For purposes of registering to vote, there is no address-matching requirement. 
                      If your Hawaii Driver License or Hawaii State ID contains an old address, 
                      the ID is still acceptable, and you may use the ID number to complete the voter registration application. 
                      The ID is used to verify your identity not your residence or mailing address.
                    </p>
                  </div>

                  <div className="info-card">
                    <h3>Residential Address Options</h3>
                    <p>
                      A residential address is required when completing the Voter Registration Application to determine your voting district. 
                      The address can be any identifiable location in the county that describes the voter's physical location. 
                      If the residence does not have a street address, you may provide descriptors including cross streets or landmarks.
                    </p>
                  </div>

                  <div className="info-card">
                    <h3>Mailing Address Options</h3>
                    <p>
                      You may indicate P.O. Box or alternate mail service option, including general delivery, 
                      as your mailing address on the application.
                    </p>
                  </div>
                </div>
              </div>

              {/* Proof of Identification */}
              <div className="identification-section">
                <h2>Proof of Identification</h2>
                <p>
                  You are only required to provide additional proof of identification if all of the following apply:
                </p>
                <ul className="identification-list">
                  <li>You are registering to vote for the <strong>first time</strong> in the State of Hawaii</li>
                  <li>You are mailing in the application</li>
                  <li>You are unable to provide a Hawaii Driver License, Hawaii State ID, or Social Security Number on the application</li>
                </ul>

                <div className="proof-options">
                  <h3>Acceptable Proof of Identification</h3>
                  <div className="proof-grid">
                    <div className="proof-card">
                      <div className="proof-icon">
                        <i className="fas fa-id-card"></i>
                      </div>
                      <h4>Photo ID</h4>
                      <p>A current and valid photo ID</p>
                    </div>

                    <div className="proof-card">
                      <div className="proof-icon">
                        <i className="fas fa-file-invoice"></i>
                      </div>
                      <h4>Utility Bill</h4>
                      <p>A current utility bill showing your name and address</p>
                    </div>

                    <div className="proof-card">
                      <div className="proof-icon">
                        <i className="fas fa-university"></i>
                      </div>
                      <h4>Bank Statement</h4>
                      <p>A current bank statement showing your name and address</p>
                    </div>

                    <div className="proof-card">
                      <div className="proof-icon">
                        <i className="fas fa-money-check"></i>
                      </div>
                      <h4>Government Document</h4>
                      <p>A government check, paycheck, or other government document showing your name and address</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Voting Process */}
              <div className="voting-process-section">
                <h2>Voting Process</h2>
                <div className="process-steps">
                  <div className="process-step">
                    <div className="step-number">1</div>
                    <div className="step-content">
                      <h3>Register to Vote</h3>
                      <p>
                        Register online, at the DMV, or by completing a paper application. 
                        You can also register in-person at voter service centers on election day.
                      </p>
                    </div>
                  </div>

                  <div className="process-step">
                    <div className="step-number">2</div>
                    <div className="step-content">
                      <h3>Receive Your Ballot</h3>
                      <p>
                        As a registered voter, you will receive a ballot in the mail at least 18 days prior to the election 
                        at the mailing address provided with your voter registration.
                      </p>
                    </div>
                  </div>

                  <div className="process-step">
                    <div className="step-number">3</div>
                    <div className="step-content">
                      <h3>Cast Your Vote</h3>
                      <p>
                        You can vote by mail or cast your ballot at any voter service center within your county. 
                        Voter service centers are open ten (10) days prior to each election.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="ballot-dates">
                  <h3>Ballot Arrival Dates</h3>
                  <div className="dates-grid">
                    <div className="date-card">
                      <h4>Primary Election</h4>
                      <p>Ballots arrive: July 21, 2026</p>
                    </div>
                    <div className="date-card">
                      <h4>General Election</h4>
                      <p>Ballots arrive: October 16, 2026</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Key Points */}
              <div className="key-points-section">
                <h2>Key Points for Houseless Voters</h2>
                <div className="points-grid">
                  <div className="point-card">
                    <div className="point-icon">
                      <i className="fas fa-check-circle"></i>
                    </div>
                    <h3>Your Right to Vote</h3>
                    <p>You have the constitutional right to vote regardless of your housing situation.</p>
                  </div>

                  <div className="point-card">
                    <div className="point-icon">
                      <i className="fas fa-map-marker-alt"></i>
                    </div>
                    <h3>Flexible Address Options</h3>
                    <p>Use cross streets, landmarks, or general delivery as your address.</p>
                  </div>

                  <div className="point-card">
                    <div className="point-icon">
                      <i className="fas fa-calendar-day"></i>
                    </div>
                    <h3>Same Day Registration</h3>
                    <p>Register and vote on the same day at voter service centers.</p>
                  </div>

                  <div className="point-card">
                    <div className="point-icon">
                      <i className="fas fa-mail-bulk"></i>
                    </div>
                    <h3>Mail Voting Available</h3>
                    <p>Receive and return your ballot by mail to your preferred address.</p>
                  </div>

                  <div className="point-card">
                    <div className="point-icon">
                      <i className="fas fa-building"></i>
                    </div>
                    <h3>In-Person Voting</h3>
                    <p>Vote in-person at any voter service center in your county.</p>
                  </div>

                  <div className="point-card">
                    <div className="point-icon">
                      <i className="fas fa-shield-alt"></i>
                    </div>
                    <h3>Privacy Protected</h3>
                    <p>Your voting information is confidential and protected by law.</p>
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="contact-section">
                <h2>Need Help? Contact Your County Elections Division</h2>
                <p>
                  If you need assistance with voter registration or have questions about voting as a houseless individual, 
                  contact your County Elections Division:
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
                    <p>Register to vote or update your registration information online.</p>
                    <div className="resource-cta">Register Now →</div>
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
                    <h3>Voter Service Centers</h3>
                    <p>Find voter service centers where you can register and vote in-person.</p>
                    <div className="resource-cta">Find Locations →</div>
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