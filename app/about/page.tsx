'use client';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Image from 'next/image';
import { useState } from 'react';

export default function About() {
  const [showFreedomMore, setShowFreedomMore] = useState(false);
  const [showFamilyMore, setShowFamilyMore] = useState(false);
  const [showFaithMore, setShowFaithMore] = useState(false);
  return (
    <div>
      <Header />
      <main className="about-page">
        {/* Hero Section */}
        <section className="about-hero">
          <div className="container">
            <div className="about-hero-logo">
              <Image
                src="/images/hawaii-gop-logo.png"
                alt="Hawaii Republican Party Logo"
                width={100}
                height={100}
                priority
              />
            </div>
            <h1>About Us</h1>
            <p className="subtitle">The Hawaii Republican Party</p>
          </div>
        </section>

        {/* Main Content */}
        <section className="page-content">
          <div className="container">
            <div className="philosophy-row philosophy-row--force-right">
              <div className="philosophy-text">
                <h2>Our Philosophy</h2>
                <p>
                  We, the Hawai'i Republican Party, support the historic concept of our Constitutional Republic, established by our nation's founders. We oppose the concept that the state is sovereign over the affairs of men, the family, or the church. We believe that government properly exists by the consent of the governed and must be restrained from intruding into the freedoms of its citizens. The function of government is not to grant rights, but to protect the unalienable, God-given rights of life, liberty, property, and the pursuit of happiness of all.
                </p>
                <p>
                  We are grateful for divine guidance, and mindful of our Hawaiian heritage and uniqueness as an Island state, dedicate our efforts to fulfill the philosophy decreed by the Hawaiʻi State motto,
                  <em>"Ua Mau ke Ea o ka 'Āina i ka Pono"</em> (The life of the land is perpetuated in righteousness).
                </p>
                <div className="philosophy-image-centered">
                  <Image
                    src="/images/haleakala-mountains.jpg"
                    alt="Haleakala mountains and clouds, Hawaii"
                    width={400}
                    height={300}
                    className="philosophy-img-centered"
                    priority
                  />
                </div>
              </div>
            </div>
            <div className="commitment-row">
              <div className="commitment-text">
                <h2>Our Commitment</h2>
                <p>
                  Affirming our belief in God, we still hold these truths to be self-evident: that all men are created equal, that they are endowed by their Creator with certain unalienable Rights, that among these are Life, Liberty, and the Pursuit of Happiness and Property ownership.
                </p>
                <blockquote className="pull-quote">
                  "Throughout the world, people dare to dream of freedom and opportunity. The Hawai'I Republican Party unequivocally defends that dream."
                </blockquote>
                <p>
                  We strive to preserve the freedom given to us by God, implemented by our Founding Fathers, and embodied in the Constitution, to control our destiny, nurture the integrity of our people and culture, and preserve the quality of life that we desire.
                </p>
                <p>
                  We honor the leadership of our Republican forefathers who passionately believed and applied these principles and values so well with special appreciation for the leadership of President Abraham Lincoln, Prince Jonah Kuhio Kalaniana'ole, and President Ronald Reagan.
                </p>
                <div className="commitment-image-centered">
                  <Image
                    src="/images/Commitment.jpg"
                    alt="Commitment"
                    width={400}
                    height={300}
                    className="commitment-img-centered"
                    priority
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Core Values Section */}
        <section className="core-values-section">
          <div className="container">
            <h2>Our Core Values</h2>
            <div className="values-grid">
              <div className="value-card">
                <div className="value-icon">
                  <i className="fas fa-cross"></i>
                </div>
                <h3>Faith</h3>
                <p>
                  {showFaithMore ? (
                    <>The Republican party, is rooted in principles of limited government, personal liberty, and economic conservatism, the party also has a strong  faith base and traditional values.  the party has cultivated relationship with  conservative Christian organizations, embracing their moral perspectives on issues like abortion and religious freedom. This connection between faith and the Republican platform highlights a commitment to preserving traditional values while advocating for the rights of individuals and religious institutions to practice their beliefs without undue government intervention, as is guaranteed in the First Amendment.</>
                  ) : (
                    <>The Republican party, is rooted in principles of limited government, personal liberty, and economic conservatism, the party also has a strong faith base and traditional values. The party has cultivated relationship with conservative Christian organizations, embracing their moral perspectives on issues like abortion and religious freedom.</>
                  )}
                </p>
                {!showFaithMore && (
                  <button className="show-more" onClick={() => setShowFaithMore(true)}>
                    Show More
                  </button>
                )}
              </div>
              <div className="value-card">
                <div className="value-icon">
                  <i className="fas fa-heart"></i>
                </div>
                <h3>Family</h3>
                <p>
                  {showFamilyMore ? (
                    <>
                      The Republican Party cherishes the bedrock value of family as the foundational unit of our society, an institution that nurtures our citizens, instills values, and fosters resilience in the face of challenges. We believe in empowering families, recognizing that the best decisions are often those made closest to home. As such, we are committed to policies that reduce governmental intrusion in family matters, promote parental rights, and support family-friendly economic measures.  We envision an America where families are respected, protected, and encouraged to flourish.
                    </>
                  ) : (
                    <>
                      "The Republican Party cherishes the bedrock value of family as the foundational unit of our society, an institution that nurtures our citizens, instills values, and fosters resilience in the face of challenges. We believe in empowering families, recognizing that the best decisions are often those made closest to home. As such, we are committed to policies that strengthen family bonds and support parental rights."
                    </>
                  )}
                </p>
                {!showFamilyMore && (
                  <button className="show-more" onClick={() => setShowFamilyMore(true)}>
                    Show More
                  </button>
                )}
              </div>
              <div className="value-card">
                <div className="value-icon">
                  <i className="fas fa-flag"></i>
                </div>
                <h3>Freedom</h3>
                <p>
                  {showFreedomMore ? (
                    <>
                      The Republican Party believes in the fundamental principle of freedom as the cornerstone of our great nation. This platform is built on the conviction that every American has the right to pursue their own version of the American Dream, unencumbered by intrusive governmental overreach. Our policies aim to limit the size and scope of government, reducing unnecessary regulations on individuals and businesses alike, thereby fostering an environment where personal responsibility is championed and individual liberty flourishes. We stand firm in our belief that the rights and freedoms are given by God and guaranteed in our founding documents.  We must work to protect these freedoms for future generations, ensuring that America remains a Constitutional Republic.
                    </>
                  ) : (
                    <>
                      The Republican Party believes in the fundamental principle of freedom as the cornerstone of our great nation. This platform is built on the conviction that every American has the right to pursue their own version of the American Dream, unencumbered by intrusive governmental overreach. Our policies aim to limit the size and scope of government while maximizing individual liberty and opportunity.
                    </>
                  )}
                </p>
                {!showFreedomMore && (
                  <button className="show-more" onClick={() => setShowFreedomMore(true)}>
                    Show More
                  </button>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Principles Section */}
        <section className="principles-section">
          <div className="container">
            <div className="principles-header no-bg">
              <div className="principles-content">
                <h2>Principles of the Republican Platform</h2>
                <p className="principles-intro">
                  We, the Hawaiʻi Republican Party, expect our elected leaders to uphold these principles in words, actions, and legislation.
                </p>
              </div>
            </div>
            <div className="principles-grid">
              <div className="principle-item no-bg">
                <i className="fas fa-scroll"></i>
                <p>"The laws of nature and nature's God," and we support the strict adherence to the original language and intent of the Declaration of Independence and the Constitutions of the United States and of Hawaiʻi.</p>
              </div>
              <div className="principle-item no-bg">
                <i className="fas fa-heart"></i>
                <p>The sanctity of innocent human life, created in the image of God, which should be equally protected from fertilization to natural death.</p>
              </div>
              <div className="principle-item no-bg">
                <i className="fas fa-shield"></i>
                <p>Preserving individual, Hawaiʻi state, and American sovereignty and freedom.</p>
              </div>
              <div className="principle-item no-bg">
                <i className="fas fa-building"></i>
                <p>Limiting government power to those items enumerated in the United States and Hawaiʻi Constitutions.</p>
              </div>
              <div className="principle-item no-bg">
                <i className="fas fa-user-check"></i>
                <p>Personal accountability and responsibility.</p>
              </div>
              <div className="principle-item no-bg">
                <i className="fas fa-heart"></i>
                <p>Self-sufficient families, founded on the traditional marriage of a biological man and biological woman.</p>
              </div>
              <div className="principle-item no-bg">
                <i className="fas fa-graduation-cap"></i>
                <p>Having an educated population, with parents having the freedom of choice for the education of their children.</p>
              </div>
              <div className="principle-item no-bg">
                <i className="fas fa-shield-alt"></i>
                <p>The unalienable right of the people to defend themselves, their family, and their property.</p>
              </div>
              <div className="principle-item no-bg">
                <i className="fas fa-balance-scale"></i>
                <p>Equal justice under the law for all citizens, regardless of race, creed, color, national origin, age, or gender.</p>
              </div>
              <div className="principle-item no-bg">
                <i className="fas fa-hand-holding-usd"></i>
                <p>Private property rights and the free enterprise system as the foundation of economic prosperity.</p>
              </div>
              <div className="principle-item no-bg">
                <i className="fas fa-leaf"></i>
                <p>Responsible stewardship of our natural resources and environment.</p>
              </div>
              <div className="principle-item no-bg">
                <i className="fas fa-globe"></i>
                <p>Strong national defense and a foreign policy that promotes peace through strength.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Platform Section */}
        <section className="platform-section">
          <div className="container">
            <h2>Our Platform</h2>
            <div className="download-grid">
              <a 
                href="/documents/2024-HRP-Platform-Convention-Updates.pdf" 
                target="_blank" 
                rel="noopener noreferrer"
                className="download-card"
              >
                <div className="download-bg">
                  <div className="download-bg-image"></div>
                  <div className="download-overlay"></div>
                </div>
                <div className="download-content">
                  <div className="download-icon">
                    <i className="fas fa-file-pdf"></i>
                  </div>
                  <h3>2024 HRP Platform</h3>
                  <p>Complete platform document with all convention updates and amendments.</p>
                  <div className="download-btn">Download PDF →</div>
                </div>
              </a>
              <a 
                href="/documents/Hawaii-Republican-Party-Bylaws-May-2024.pdf" 
                target="_blank" 
                rel="noopener noreferrer"
                className="download-card"
              >
                <div className="download-bg">
                  <div className="download-bg-image"></div>
                  <div className="download-overlay"></div>
                </div>
                <div className="download-content">
                  <div className="download-icon">
                    <i className="fas fa-file-pdf"></i>
                  </div>
                  <h3>HRP Bylaws</h3>
                  <p>Official party bylaws and organizational structure.</p>
                  <div className="download-btn">Download PDF →</div>
                </div>
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
} 