'use client';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Image from 'next/image';

export default function ElectionIntegrity() {
  return (
    <div>
      <Header />
      <main className="election-integrity-page">
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
            <h1>Election Integrity</h1>
            <p className="subtitle">Protecting Democracy in Hawaii</p>
          </div>
        </section>

        {/* Main Content */}
        <section className="election-content">
          <div className="container">
            <div className="main-content">
              <div className="election-intro">
                <h2>Ensuring Free, Fair, and Transparent Elections</h2>
                <p>
                  Election integrity is a high priority for the Hawaii Republican Party. Our very democratic process relies on free, fair, and transparent elections that voters across the political spectrum can trust. We are committed to restoring election transparency and ensuring voters have confidence in future election processes.
                </p>
                <p>
                  The Hawaii Republican Party's Election Integrity Committee represents a renewed focus on continuing this important work and fighting attempts to change election laws that could compromise our democratic process. This committee works closely with county parties and other stakeholders across Hawaii on voting policies and best practices.
                </p>
              </div>

              {/* Quick Actions Grid */}
              <div className="election-actions-grid">
                <div className="election-action-card">
                  <div className="action-icon">
                    <i className="fas fa-exclamation-triangle"></i>
                  </div>
                  <h3>Report Issues</h3>
                  <p>Report suspicious activities or election integrity concerns.</p>
                  <a 
                    href="#report-form" 
                    className="election-action-btn"
                  >
                    Report Issue
                  </a>
                </div>

                <div className="election-action-card">
                  <div className="action-icon">
                    <i className="fas fa-user-friends"></i>
                  </div>
                  <h3>Become a Poll Watcher</h3>
                  <p>Help monitor elections and ensure transparency at polling places.</p>
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
                    <i className="fas fa-book"></i>
                  </div>
                  <h3>Get Educated</h3>
                  <p>Learn about election processes and your rights as a voter.</p>
                  <a 
                    href="/election-education" 
                    className="election-action-btn"
                  >
                    Learn More
                  </a>
                </div>

                <div className="election-action-card">
                  <div className="action-icon">
                    <i className="fas fa-id-card"></i>
                  </div>
                  <h3>Register to Vote</h3>
                  <p>Ensure you're registered and your information is current.</p>
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
                    <i className="fas fa-binoculars"></i>
                  </div>
                  <h3>Track Your Ballot</h3>
                  <p>Monitor your ballot's journey from mailing to counting.</p>
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
                    <i className="fas fa-map"></i>
                  </div>
                  <h3>Find Voting Locations</h3>
                  <p>Locate your nearest polling place and ballot drop boxes.</p>
                  <a 
                    href="https://elections.hawaii.gov/voter-service-centers-and-places-of-deposit/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="election-action-btn"
                  >
                    Find Locations
                  </a>
                </div>
              </div>

              {/* Election Integrity Mission */}
              <div className="election-mission">
                <h2>Our Mission</h2>
                <div className="mission-content">
                  <div className="mission-text">
                    <p>
                      The Hawaii Republican Party's Election Integrity Committee is dedicated to ensuring that every vote counts and every voice is heard. We work to:
                    </p>
                    <ul>
                      <li>Ensure poll watchers are allowed to properly observe counting processes</li>
                      <li>Advocate for transparent and secure voting systems</li>
                      <li>Educate voters about their rights and responsibilities</li>
                      <li>Monitor election procedures and report irregularities</li>
                      <li>Support fair and accessible voting for all Hawaii residents</li>
                    </ul>
                    <p>
                      Our goal is to restore confidence in our electoral process and ensure that all Americans have faith in our elections process.
                    </p>
                  </div>
                </div>
              </div>

              {/* Report Form Section */}
              <div id="report-form" className="report-section">
                <h2>Report Election Integrity Issues</h2>
                <p className="report-intro">
                  If you witness or experience any election integrity concerns, please report them to us. Your information helps us ensure fair and transparent elections in Hawaii.
                </p>
                <div className="report-form-container">
                  <form className="report-form">
                    <div className="form-row">
                      <div className="form-group">
                        <label htmlFor="firstName">First Name *</label>
                        <input type="text" id="firstName" name="firstName" required />
                      </div>
                      <div className="form-group">
                        <label htmlFor="lastName">Last Name *</label>
                        <input type="text" id="lastName" name="lastName" required />
                      </div>
                    </div>
                    <div className="form-group">
                      <label htmlFor="email">Email Address *</label>
                      <input type="email" id="email" name="email" required />
                    </div>
                    <div className="form-group">
                      <label htmlFor="phone">Phone Number</label>
                      <input type="tel" id="phone" name="phone" />
                    </div>
                    <div className="form-group">
                      <label htmlFor="zipCode">Zip Code *</label>
                      <input type="text" id="zipCode" name="zipCode" required />
                    </div>
                    <div className="form-group">
                      <label htmlFor="issueType">Type of Issue *</label>
                      <select id="issueType" name="issueType" required>
                        <option value="">Select an issue type</option>
                        <option value="voter-intimidation">Voter Intimidation</option>
                        <option value="ballot-tampering">Ballot Tampering</option>
                        <option value="polling-place-issues">Polling Place Issues</option>
                        <option value="registration-problems">Registration Problems</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label htmlFor="description">Description of Issue *</label>
                      <textarea 
                        id="description" 
                        name="description" 
                        rows={5} 
                        placeholder="Please provide a detailed description of what you observed or experienced..."
                        required
                      ></textarea>
                    </div>
                    <div className="form-group">
                      <label htmlFor="location">Location (if applicable)</label>
                      <input type="text" id="location" name="location" placeholder="Address, polling place, or general area" />
                    </div>
                    <div className="form-group">
                      <label htmlFor="date">Date of Incident</label>
                      <input type="date" id="date" name="date" />
                    </div>
                    <button type="submit" className="submit-btn">
                      <i className="fas fa-paper-plane"></i>
                      Submit Report
                    </button>
                  </form>
                </div>
              </div>

              {/* Education Section */}
              <div id="education" className="education-section">
                <h2>Election Education</h2>
                <div className="education-grid">
                  <div className="education-card">
                    <div className="education-icon">
                      <i className="fas fa-balance-scale"></i>
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
                      <i className="fas fa-lock"></i>
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
                      <i className="fas fa-eye"></i>
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
                  <div className="education-card">
                    <div className="education-icon">
                      <i className="fas fa-hands-helping"></i>
                    </div>
                    <h3>Community Engagement</h3>
                    <p>Get involved in your community to promote election integrity.</p>
                    <ul>
                      <li>Volunteer opportunities</li>
                      <li>Community outreach programs</li>
                      <li>Educational workshops</li>
                      <li>Networking events</li>
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