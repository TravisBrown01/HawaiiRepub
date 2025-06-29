'use client';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Image from 'next/image';
import { JoinUsCardFullWidth } from '../components/JoinUsCard';

export default function DonatePage() {
  return (
    <div>
      <Header />
      <main className="donate-page">
        {/* Hero Section */}
        <section className="donate-hero">
          <div className="container">
            <div className="donate-hero-logo">
              <Image
                src="/images/hawaii-gop-logo.png"
                alt="Hawaii Republican Party Logo"
                width={100}
                height={100}
                priority
              />
            </div>
            <h1>Support Our Mission</h1>
            <p className="subtitle">Your donation helps us build a stronger Hawaii and promote conservative values across our state</p>
          </div>
        </section>

        {/* Main Content */}
        <section className="page-content">
          <div className="container">
            <div className="page-intro">
              <h2>Ways to Donate</h2>
              <p>
                Every contribution makes a difference in our mission to promote conservative values and build a stronger Hawaii. Choose the donation method that works best for you.
              </p>
            </div>

            {/* Online Donations */}
            <div className="page-section">
              <h2>Online Donations</h2>
              <p>
                The fastest and most convenient way to support our mission. All online donations are processed securely through our official donation platform.
              </p>
              <div className="donation-methods-grid">
                <div className="donation-method-card">
                  <div className="method-icon">
                    <i className="fas fa-globe"></i>
                  </div>
                  <h3>Official Website</h3>
                  <p>Donate directly through our secure online platform with multiple payment options.</p>
                  <a 
                    href="https://secure.winred.com/hawaiigop/donate"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="donation-btn primary"
                  >
                    Donate Online →
                  </a>
                </div>
                <div className="donation-method-card">
                  <div className="method-icon">
                    <i className="fas fa-mobile-alt"></i>
                  </div>
                  <h3>Mobile Donations via Zeffy</h3>
                  <p>Quick and easy donations through our mobile-optimized Zeffy platform.</p>
                  <a 
                    href="https://www.zeffy.com/en-US/donation-form/daf26066-85a6-480f-a83f-a50b6350abc5?amount=47"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="donation-btn primary"
                  >
                    Donate via Zeffy →
                  </a>
                </div>
              </div>
            </div>

            {/* Quick Donation Amounts */}
            <div className="page-section">
              <h2>Quick Donation Amounts</h2>
              <p>
                Choose from our most popular donation amounts or enter your own custom amount.
              </p>
              <div className="quick-amounts-grid">
                <a 
                  href="https://secure.winred.com/hawaiigop/donate?amount=25"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="amount-card"
                >
                  <div className="amount-value">$25</div>
                  <div className="amount-label">Starter</div>
                </a>
                <a 
                  href="https://secure.winred.com/hawaiigop/donate?amount=50"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="amount-card"
                >
                  <div className="amount-value">$50</div>
                  <div className="amount-label">Supporter</div>
                </a>
                <a 
                  href="https://secure.winred.com/hawaiigop/donate?amount=100"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="amount-card"
                >
                  <div className="amount-value">$100</div>
                  <div className="amount-label">Patriot</div>
                </a>
                <a 
                  href="https://secure.winred.com/hawaiigop/donate?amount=250"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="amount-card"
                >
                  <div className="amount-value">$250</div>
                  <div className="amount-label">Leader</div>
                </a>
                <a 
                  href="https://secure.winred.com/hawaiigop/donate?amount=500"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="amount-card"
                >
                  <div className="amount-value">$500</div>
                  <div className="amount-label">Champion</div>
                </a>
                <a 
                  href="https://secure.winred.com/hawaiigop/donate"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="amount-card custom"
                >
                  <div className="amount-value">Custom</div>
                  <div className="amount-label">Any Amount</div>
                </a>
              </div>
            </div>

            {/* Donation Steps */}
            <div className="steps-section">
              <h2>How to Donate Online</h2>
              <p>
                Follow these simple steps to make your secure online donation.
              </p>
              <div className="steps-grid">
                <div className="step-card">
                  <div className="step-number">1</div>
                  <h3>Choose Your Amount</h3>
                  <p>Select from our preset amounts or enter your custom donation amount.</p>
                </div>
                <div className="step-card">
                  <div className="step-number">2</div>
                  <h3>Enter Your Information</h3>
                  <p>Provide your contact details and payment information securely.</p>
                </div>
                <div className="step-card">
                  <div className="step-number">3</div>
                  <h3>Complete Your Donation</h3>
                  <p>Review your donation and click to complete the secure transaction.</p>
                </div>
                <div className="step-card">
                  <div className="step-number">4</div>
                  <h3>Receive Confirmation</h3>
                  <p>Get an immediate confirmation email for your records.</p>
                </div>
              </div>
            </div>

            {/* Check Donations */}
            <div className="page-section">
              <h2>Donate by Check</h2>
              <p>
                Prefer to donate by check? We accept personal checks, cashier's checks, and money orders.
              </p>
              <div className="check-donation-info">
                <div className="check-details">
                  <h3>Make checks payable to:</h3>
                  <div className="payable-to">Hawaii Republican Party</div>
                  
                  <h3>Mail to:</h3>
                  <div className="mailing-address">
                    <p>Hawaii Republican Party</p>
                    <p>725 Kapiolani Blvd, Suite C-105</p>
                    <p>Honolulu, HI 96813</p>
                  </div>

                  <h3>Important Notes:</h3>
                  <ul className="check-notes">
                    <li>Please include your full name and address</li>
                    <li>For tracking purposes, include your email or phone number</li>
                    <li>Checks must be drawn on a U.S. bank</li>
                    <li>Allow 5-7 business days for processing</li>
                  </ul>
                </div>
                <div className="check-icon">
                  <i className="fas fa-check-circle"></i>
                </div>
              </div>
            </div>

            {/* Cash Donations */}
            <div className="page-section">
              <h2>Cash Donations</h2>
              <p>
                Cash donations are typically accepted at official party events and fundraisers.
              </p>
              <div className="cash-donation-info">
                <div className="cash-details">
                  <h3>Event Donations:</h3>
                  <p>Cash donations are accepted at official party events, fundraisers, and meetings. Look for our donation tables or ask event organizers.</p>

                  <h3>Receipts:</h3>
                  <p>Receipts for cash donations are provided upon request. Please ask for a receipt when making your donation.</p>
                </div>
                <div className="cash-icon">
                  <i className="fas fa-dollar-sign"></i>
                </div>
              </div>
            </div>

            {/* Tax Information */}
            <div className="page-section">
              <h2>Tax Information</h2>
              <p>
                Important information about the tax implications of your donation.
              </p>
              <div className="tax-info-grid">
                <div className="tax-card">
                  <div className="tax-icon">
                    <i className="fas fa-receipt"></i>
                  </div>
                  <h3>Not Tax Deductible</h3>
                  <p>Political party donations are not tax deductible for federal income tax purposes. However, they may be deductible for state tax purposes in some states.</p>
                </div>
                <div className="tax-card">
                  <div className="tax-icon">
                    <i className="fas fa-shield-alt"></i>
                  </div>
                  <h3>Privacy</h3>
                  <p>Your donation information is kept confidential and secure. We do not sell or share donor information with third parties.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <JoinUsCardFullWidth />
      </main>
      <Footer />
    </div>
  );
} 