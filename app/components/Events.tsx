import Link from 'next/link';

const events = [
  {
    date: 'July 15, 2024',
    title: 'State Convention',
    description: 'Join us for the annual Hawaii Republican Party State Convention. All members welcome!',
    link: '#'
  },
  {
    date: 'August 3, 2024',
    title: 'Voter Registration Drive',
    description: 'Help register new voters in your community and make a difference this election season.',
    link: '#'
  },
  {
    date: 'September 10, 2024',
    title: 'Candidate Forum',
    description: 'Meet the candidates and hear their vision for Hawaii’s future. Open to the public.',
    link: '#'
  }
];

export default function Events() {
  return (
    <section className="events-section">
      <h2 className="events-headline">Upcoming Events</h2>
      <div className="events-list">
        {events.map((event, idx) => (
          <div className="event-card" key={idx}>
            <div className="event-date">{event.date}</div>
            <div className="event-info">
              <h3>{event.title}</h3>
              <p>{event.description}</p>
              <Link href={event.link} className="event-link">Learn More</Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
} 