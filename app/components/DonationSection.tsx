'use client';

export default function DonationSection() {
  return (
    <section className="home-donation-section">
      <div className="container">
        <div className="donation-content">
          <div className="donation-text">
            <h2>Support Our Mission</h2>
            <p>Your donation helps us build a stronger Hawaii and promote conservative values across our state. Every contribution makes a difference.</p>
          </div>
          <div className="donation-options">
            <div className="amount-options">
              <a 
                href="https://secure.winred.com/hawaiigop/donate?amount=25"
                target="_blank"
                rel="noopener noreferrer"
                className="amount-option"
              >
                $25
              </a>
              <a 
                href="https://secure.winred.com/hawaiigop/donate?amount=50"
                target="_blank"
                rel="noopener noreferrer"
                className="amount-option"
              >
                $50
              </a>
              <a 
                href="https://secure.winred.com/hawaiigop/donate?amount=250"
                target="_blank"
                rel="noopener noreferrer"
                className="amount-option"
              >
                $250
              </a>
              <a 
                href="https://secure.winred.com/hawaiigop/donate?amount=500"
                target="_blank"
                rel="noopener noreferrer"
                className="amount-option"
              >
                $500
              </a>
              <a 
                href="https://secure.winred.com/hawaiigop/donate"
                target="_blank"
                rel="noopener noreferrer"
                className="amount-option custom-amount"
              >
                Any Amount
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
} 