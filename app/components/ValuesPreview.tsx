import Link from 'next/link';

const values = [
  {
    icon: 'fa-regular fa-cross',
    title: 'Faith',
    description: 'Rooted in faith and traditional values, we support religious freedom and the right to practice beliefs without government interference.'
  },
  {
    icon: 'fa-regular fa-heart',
    title: 'Family',
    description: 'We cherish the family as the foundation of society and support policies that empower and protect families in Hawaii.'
  },
  {
    icon: 'fa-regular fa-flag',
    title: 'Freedom',
    description: 'We believe in individual liberty, limited government, and the protection of God-given rights for all.'
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