'use client';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Image from 'next/image';

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
        <section className="education-content">
          <div className="container">
            <div className="main-content">
              {/* Introduction */}
              <div className="education-intro">
                <h2>How Elections Work in Hawaii</h2>
                <p>
                  Hawaii conducts statewide elections in even-numbered years. The primary election is held on the second Saturday in August and the general election is held on the first Tuesday after the first Monday in November. Understanding the voting process helps ensure your voice is heard in our democracy.
                </p>
              </div>

              {/* Video Section */}
              <div className="video-section">
                <h2>Voting in Hawaii: A Complete Guide</h2>
                <div className="video-container">
                  <iframe
                    width="100%"
                    height="400"
                    src="https://www.youtube.com/embed/VIDEO_ID"
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
              <div className="election-types">
                <h2>Types of Elections in Hawaii</h2>
                <div className="types-grid">
                  <div className="type-card">
                    <div className="type-icon">
                      <i className="fas fa-vote-yea"></i>
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
              <div className="mail-voting-section">
                <h2>Voting by Mail in Hawaii</h2>
                <div className="mail-voting-content">
                  <div className="mail-voting-info">
                    <h3>How Mail-In Voting Works</h3>
                    <p>
                      Pursuant to <strong>Act 136, SLH 2019</strong>, elections are conducted by mail. All registered voters automatically receive their ballot in the mail approximately eighteen (18) days prior to the election.
                    </p>
                    
                    <div className="process-steps">
                      <div className="step">
                        <div className="step-number">1</div>
                        <div className="step-content">
                          <h4>Receive Your Ballot</h4>
                          <p>Ballots are mailed to your registered address 18 days before the election.</p>
                        </div>
                      </div>
                      
                      <div className="step">
                        <div className="step-number">2</div>
                        <div className="step-content">
                          <h4>Mark Your Ballot</h4>
                          <p>Review candidates and measures, then make your selections with a pen.</p>
                        </div>
                      </div>
                      
                      <div className="step">
                        <div className="step-number">3</div>
                        <div className="step-content">
                          <h4>Prepare for Return</h4>
                          <p>Fold ballot, place in secrecy sleeve, then in return envelope and sign.</p>
                        </div>
                      </div>
                      
                      <div className="step">
                        <div className="step-number">4</div>
                        <div className="step-content">
                          <h4>Return Your Ballot</h4>
                          <p>Mail or drop off at designated locations by 7:00 PM on Election Day.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Voter Registration */}
              <div className="registration-section">
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
                        <i className="fas fa-address-card"></i>
                        Register to Vote Online
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* Important Dates */}
              <div className="dates-section">
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
                      <span className="date-label">Ballots Arrive:</span>
                      <span className="date-value">July 21, 2026</span>
                    </div>
                    <div className="date-item">
                      <span className="date-label">Voter Service Centers:</span>
                      <span className="date-value">July 27 - August 8, 2026</span>
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
                      <span className="date-label">Ballots Arrive:</span>
                      <span className="date-value">October 16, 2026</span>
                    </div>
                    <div className="date-item">
                      <span className="date-label">Voter Service Centers:</span>
                      <span className="date-value">October 20 - November 3, 2026</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* FAQ Section */}
              <div className="faq-section">
                <h2>Frequently Asked Questions</h2>
                <div className="faq-grid">
                  <div className="faq-item">
                    <h3>How do I vote?</h3>
                    <p>You must be a registered voter to receive a ballot. Review the instructions, contests, and candidates on your ballot and make your selections. After voting, fold the ballot and slip it into the ballot secrecy sleeve, then insert into your return envelope and sign. Return by mail or drop-off location by 7:00 PM on Election Day.</p>
                  </div>

                  <div className="faq-item">
                    <h3>When will I receive my ballot?</h3>
                    <p>You should expect to receive your mail ballot packet at least 18 days prior to the election.</p>
                  </div>

                  <div className="faq-item">
                    <h3>What if I didn't receive my ballot?</h3>
                    <p>If you did not receive your ballot, please contact your County Elections Division and they will issue you a replacement ballot.</p>
                  </div>

                  <div className="faq-item">
                    <h3>What if I make a mistake on my ballot?</h3>
                    <p>If you make a mistake, misplace, or damage your ballot, you may request a replacement ballot with your County Elections Division.</p>
                  </div>

                  <div className="faq-item">
                    <h3>Will my vote count if I don't vote on all measures?</h3>
                    <p>Yes, your ballot will still be counted even if you don't vote on all measures or candidates.</p>
                  </div>

                  <div className="faq-item">
                    <h3>Can I still vote in-person?</h3>
                    <p>Yes, you may vote in-person by visiting any voter service center in your county. Voter service centers are open 10 days through Election Day for in-person voting, same day registration and accessible voting.</p>
                  </div>
                </div>
              </div>

              {/* Special Voter Categories */}
              <div className="special-voters-section">
                <h2>Special Voter Categories</h2>
                <div className="special-voters-grid">
                  <div className="special-voter-card">
                    <div className="voter-icon">
                      <i className="fas fa-graduation-cap"></i>
                    </div>
                    <h3>College Students</h3>
                    <p>Students away at college can request ballots to be mailed to their school address or vote absentee.</p>
                  </div>

                  <div className="special-voter-card">
                    <div className="voter-icon">
                      <i className="fas fa-home"></i>
                    </div>
                    <h3>Houseless Voters</h3>
                    <p>Voters without a permanent address can still register and vote using alternative address options.</p>
                  </div>

                  <div className="special-voter-card">
                    <div className="voter-icon">
                      <i className="fas fa-shield"></i>
                    </div>
                    <h3>Military/Overseas Voters</h3>
                    <p>Military personnel and overseas voters have special procedures for receiving and returning ballots.</p>
                  </div>

                  <div className="special-voter-card">
                    <div className="voter-icon">
                      <i className="fas fa-wheelchair"></i>
                    </div>
                    <h3>Voters Requiring Assistance</h3>
                    <p>Voters with disabilities can request accessible voting options and assistance at polling places.</p>
                  </div>

                  <div className="special-voter-card">
                    <div className="voter-icon">
                      <i className="fas fa-gavel"></i>
                    </div>
                    <h3>Voters with Felony Convictions</h3>
                    <p>Individuals with felony convictions may have their voting rights restored depending on their circumstances.</p>
                  </div>
                </div>
              </div>

              {/* Resources */}
              <div className="resources-section">
                <h2>Additional Resources</h2>
                <div className="resources-grid">
                  <div className="resource-card">
                    <div className="resource-icon">
                      <i className="fas fa-address-card"></i>
                    </div>
                    <h3>Voter Registration</h3>
                    <p>Register to vote or update your registration information.</p>
                    <a 
                      href="https://olvr.hawaii.gov" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="resource-btn"
                    >
                      Register Now
                    </a>
                  </div>

                  <div className="resource-card">
                    <div className="resource-icon">
                      <i className="fas fa-map-marker-alt"></i>
                    </div>
                    <h3>Voting Locations</h3>
                    <p>Find your nearest polling place and ballot drop box locations.</p>
                    <a 
                      href="https://elections.hawaii.gov/voter-service-centers-and-places-of-deposit/" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="resource-btn"
                    >
                      Find Locations
                    </a>
                  </div>

                  <div className="resource-card">
                    <div className="resource-icon">
                      <i className="fas fa-search"></i>
                    </div>
                    <h3>Ballot Status</h3>
                    <p>Track the status of your mail-in ballot and ensure it's counted.</p>
                    <a 
                      href="https://ballotstatus.hawaii.gov" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="resource-btn"
                    >
                      Track Ballot
                    </a>
                  </div>

                  <div className="resource-card">
                    <div className="resource-icon">
                      <i className="fas fa-user-check"></i>
                    </div>
                    <h3>Poll Worker Application</h3>
                    <p>Help ensure fair elections by becoming a poll worker.</p>
                    <a 
                      href="https://elections.hawaii.gov/volunteer/" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="resource-btn"
                    >
                      Apply Now
                    </a>
                  </div>

                  <div className="resource-card">
                    <div className="resource-icon">
                      <i className="fas fa-phone"></i>
                    </div>
                    <h3>Contact Elections Office</h3>
                    <p>Get help with voting questions and concerns.</p>
                    <a 
                      href="tel:808-453-VOTE" 
                      className="resource-btn"
                    >
                      Call Now
                    </a>
                  </div>
                </div>
              </div>

              {/* Quick Actions Grid */}
              <div className="election-actions-grid">
                <div className="election-action-card">
                  <div className="action-icon">
                    <i className="fas fa-address-card"></i>
                  </div>
                  <h3>Register to Vote</h3>
                  <p>Make sure you're registered to vote in Hawaii elections.</p>
                  <a 
                    href="https://olvr.hawaii.gov" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="election-action-btn"
                  >
                    Register Now
                  </a>
                </div>

                <div className="election-action-card">
                  <div className="action-icon">
                    <i className="fas fa-map-marker-alt"></i>
                  </div>
                  <h3>Where to Vote</h3>
                  <p>Find your nearest polling place and ballot drop box locations.</p>
                  <a 
                    href="https://elections.hawaii.gov/voter-service-centers-and-places-of-deposit/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="election-action-btn"
                  >
                    Find Locations
                  </a>
                </div>

                <div className="election-action-card">
                  <div className="action-icon">
                    <i className="fas fa-search"></i>
                  </div>
                  <h3>Track Your Ballot</h3>
                  <p>Track the status of your mail-in ballot and ensure it's counted.</p>
                  <a 
                    href="https://ballotstatus.hawaii.gov" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="election-action-btn"
                  >
                    Track Ballot
                  </a>
                </div>

                <div className="election-action-card">
                  <div className="action-icon">
                    <i className="fas fa-user-check"></i>
                  </div>
                  <h3>Apply as Poll Worker</h3>
                  <p>Help ensure fair elections by becoming a poll worker.</p>
                  <a 
                    href="https://elections.hawaii.gov/volunteer/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="election-action-btn"
                  >
                    Apply Now
                  </a>
                </div>

                <div className="election-action-card">
                  <div className="action-icon">
                    <i className="fas fa-flag"></i>
                  </div>
                  <h3>Report Issues</h3>
                  <p>Report election integrity concerns or suspicious activities.</p>
                  <a 
                    href="#report-form" 
                    className="election-action-btn"
                  >
                    Report Issue
                  </a>
                </div>

                <div className="election-action-card">
                  <div className="action-icon">
                    <i className="fas fa-graduation-cap"></i>
                  </div>
                  <h3>Election Education</h3>
                  <p>Learn about election processes and your rights as a voter.</p>
                  <a 
                    href="/election-education" 
                    className="election-action-btn"
                  >
                    Learn More
                  </a>
                </div>
              </div>

              {/* Education Section */}
              <div id="education" className="education-section">
                <h2>Election Education</h2>
                <div className="education-grid">
                  <div className="education-card">
                    <div className="education-icon">
                      <i className="fas fa-book-open"></i>
                    </div>
                    <h3>Voter Rights</h3>
                    <p>Learn about your rights as a voter in Hawaii and how to protect them.</p>
                    <ul>
                      <li>Right to vote without intimidation</li>
                      <li>Right to assistance if needed</li>
                      <li>Right to a provisional ballot</li>
                      <li>Right to file complaints</li>
                    </ul>
                  </div>
                  <div className="education-card">
                    <div className="education-icon">
                      <i className="fas fa-shield-check"></i>
                    </div>
                    <h3>Election Security</h3>
                    <p>Understanding how Hawaii's election systems work to ensure security.</p>
                    <ul>
                      <li>Mail-in ballot security measures</li>
                      <li>In-person voting procedures</li>
                      <li>Ballot counting and verification</li>
                      <li>Audit processes</li>
                    </ul>
                  </div>
                  <div className="education-card">
                    <div className="education-icon">
                      <i className="fas fa-users"></i>
                    </div>
                    <h3>Poll Watching</h3>
                    <p>How to become an effective poll watcher and monitor election integrity.</p>
                    <ul>
                      <li>Poll watcher rights and responsibilities</li>
                      <li>What to observe and document</li>
                      <li>How to report concerns</li>
                      <li>Training opportunities</li>
                    </ul>
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