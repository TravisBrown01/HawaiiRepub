import Link from 'next/link';

const values = [
  {
    icon: 'fas fa-cross',
    title: 'Faith',
    description: 'We believe in the importance of faith and traditional values.'
  },
  {
    icon: 'fas fa-heart',
    title: 'Family',
    description: 'We support strong families as the foundation of society.'
  },
  {
    icon: 'fas fa-flag',
    title: 'Freedom',
    description: 'We defend individual liberty and constitutional rights.'
  }
];

export default function ValuesPreview() {
  return (
    <section className="values-preview-section">
      <h2 className="values-preview-headline">Our Core Values</h2>
      <div className="values-preview-grid">
        {values.map((value, idx) => (
          <div className="values-preview-card" key={idx}>
            <span className="values-preview-icon">
              <i className={value.icon}></i>
            </span>
            <h3>{value.title}</h3>
            <p>{value.description}</p>
          </div>
        ))}
      </div>
      <Link href="/about" className="values-preview-btn">Learn More</Link>
    </section>
  );
} 