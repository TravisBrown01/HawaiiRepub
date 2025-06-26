import Header from '../components/Header';
import Footer from '../components/Footer';
import Image from 'next/image';

const stateLeaders = [
  {
    name: 'Arthur Hannemann',
    title: 'State Chair',
    email: '',
    photo: 'https://ui-avatars.com/api/?name=Arthur+Hannemann&background=ececec&color=bb2222&size=120&font-size=0.5',
  },
  {
    name: 'Shirlene DelaCruz Santiago Ostrov',
    title: 'Vice Chair (Coordinated Campaigns)',
    email: '',
    photo: 'https://ui-avatars.com/api/?name=Shirlene+DelaCruz+Santiago+Ostrov&background=ececec&color=bb2222&size=120&font-size=0.5',
  },
  {
    name: 'Bob McDermott',
    title: 'Vice Chair (Recruitment & Training)',
    email: '',
    photo: 'https://ui-avatars.com/api/?name=Bob+McDermott&background=ececec&color=bb2222&size=120&font-size=0.5',
  },
  {
    name: 'Steve Yoder',
    title: 'Vice Chair (Communications)',
    email: '',
    photo: 'https://ui-avatars.com/api/?name=Steve+Yoder&background=ececec&color=bb2222&size=120&font-size=0.5',
  },
  {
    name: 'Jackie Beckman',
    title: 'Vice Chair (Community Services)',
    email: '',
    photo: 'https://ui-avatars.com/api/?name=Jackie+Beckman&background=ececec&color=bb2222&size=120&font-size=0.5',
  },
  {
    name: 'Susan Duffy',
    title: 'Vice Chair (Coalitions)',
    email: '',
    photo: 'https://ui-avatars.com/api/?name=Susan+Duffy&background=ececec&color=bb2222&size=120&font-size=0.5',
  },
  {
    name: 'Leslie Jones',
    title: 'Secretary',
    email: '',
    photo: 'https://ui-avatars.com/api/?name=Leslie+Jones&background=ececec&color=bb2222&size=120&font-size=0.5',
  },
  {
    name: 'Dennis Mataia',
    title: 'Treasurer',
    email: '',
    photo: 'https://ui-avatars.com/api/?name=Dennis+Mataia&background=ececec&color=bb2222&size=120&font-size=0.5',
  },
];

export default function LeadershipPage() {
  return (
    <div>
      <Header />
      <main className="leadership-page">
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
            <h1>Leadership</h1>
            <p className="subtitle">Meet the State Leadership of the Hawaii Republican Party</p>
          </div>
        </section>
        <section className="leadership-section">
          <div className="container">
            <h2 className="leadership-title">State Leadership</h2>
            <div className="leadership-grid">
              {stateLeaders.map((leader) => (
                <div className="leader-card" key={leader.name}>
                  <div className="leader-photo-wrapper">
                    <Image
                      src={leader.photo}
                      alt={leader.name}
                      width={120}
                      height={120}
                      className="leader-photo"
                    />
                  </div>
                  <h3 className="leader-name">{leader.name}</h3>
                  <p className="leader-title">{leader.title}</p>
                  {leader.email && (
                    <a href={`mailto:${leader.email}`} className="leader-email">{leader.email}</a>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
} 