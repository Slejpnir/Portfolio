import React, { useState } from 'react';

const healedTattoos = [
  { src: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb', title: 'Dragon Sleeve' },
  { src: 'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2', title: 'Rose Handpiece' },
];

const flashDesigns = [
  { src: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca', title: 'Skull and Dagger' },
  { src: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429', title: 'Phoenix Flash' },
];

function Header({ currentSection, setSection }) {
  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'gallery', label: 'Gallery' },
    { id: 'about', label: 'About' },
    { id: 'booking', label: 'Booking' },
  ];
  return (
    <header className="sticky top-0 z-50 backdrop-blur bg-zinc-950/70">
      <nav className="container mx-auto flex items-center justify-between py-4">
        <span className="text-2xl font-bold cursor-pointer" onClick={() => setSection('home')}>Ink<span className="text-emerald-400">Craft</span></span>
        <ul className="flex gap-6">
          {navItems.map(({ id, label }) => (
            <li key={id}>
              <button
                className={`hover:text-emerald-400 transition ${currentSection === id ? 'text-emerald-400' : ''}`}
                onClick={() => setSection(id)}
              >
                {label}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}

function Footer() {
  return (
    <footer className="border-t border-zinc-800 mt-12">
      <div className="container mx-auto py-6 text-center text-sm text-zinc-500">
        © {new Date().getFullYear()} InkCraft Studio. All Rights Reserved.
      </div>
    </footer>
  );
}

function Button({ children, variant = 'solid', size = 'md', className = '', ...props }) {
  const base = 'inline-flex items-center justify-center rounded font-medium transition focus:outline-none focus:ring-2 focus:ring-emerald-400 disabled:opacity-50';
  const variants = {
    solid: 'bg-emerald-400 text-zinc-950 hover:bg-emerald-500',
    outline: 'border border-emerald-400 text-emerald-400 hover:bg-emerald-400 hover:text-zinc-950',
  };
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2',
    lg: 'px-6 py-3 text-lg',
  };
  const classes = [base, variants[variant], sizes[size], className].filter(Boolean).join(' ');
  return <button className={classes} {...props}>{children}</button>;
}

function GalleryGrid({ tattoos, onBook }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {tattoos.map((t) => (
        <div key={t.src} className="relative overflow-hidden rounded-2xl shadow-lg flex flex-col">
          <img src={t.src} alt={t.title} className="object-cover w-full h-64" />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/80 to-transparent p-4 flex items-end">
            <h3 className="text-lg font-semibold text-white">{t.title}</h3>
          </div>
          {onBook && (
            <div className="relative z-10 p-4 bg-zinc-950/80 flex justify-center">
              <Button size="sm" variant="outline" onClick={() => onBook(t.title)}>
                Book this design
              </Button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function HomeSection({ setSection }) {
  return (
    <section className="text-center space-y-6">
      <h1 className="text-5xl font-extrabold">Ink by <span className="text-emerald-400">Your Name</span></h1>
      <p className="max-w-xl mx-auto">
        Bold lines, vivid colors, and custom designs that tell your story. Explore my work and book your next piece.
      </p>
      <div className="flex justify-center gap-4">
        <Button size="lg" onClick={() => setSection('gallery')}>View Gallery</Button>
        <Button variant="outline" size="lg" onClick={() => setSection('booking')}>Book Session</Button>
      </div>
    </section>
  );
}

function GallerySection({ onBookFlash }) {
  const [tab, setTab] = useState('healed');
  return (
    <section>
      <h2 className="text-4xl font-bold mb-6">Gallery</h2>
      <div className="flex gap-4 mb-6">
        <Button
          variant={tab === 'healed' ? 'solid' : 'outline'}
          onClick={() => setTab('healed')}
        >
          Healed Tattoos
        </Button>
        <Button
          variant={tab === 'flash' ? 'solid' : 'outline'}
          onClick={() => setTab('flash')}
        >
          Flash Designs
        </Button>
      </div>
      {tab === 'healed' ? (
        <GalleryGrid tattoos={healedTattoos} />
      ) : (
        <GalleryGrid tattoos={flashDesigns} onBook={onBookFlash} />
      )}
    </section>
  );
}

function AboutSection() {
  return (
    <section className="prose prose-invert max-w-none">
      <h2>About Me</h2>
      <p>
        I'm a Kyiv‑based tattoo artist with 8+ years of experience in neo‑traditional, illustrative, and blackwork styles.
        My studio offers a clean, comfortable environment where creativity thrives.
      </p>
    </section>
  );
}

function BookingSection({ prefillDescription }) {
  const [submitted, setSubmitted] = useState(false);
  const [description, setDescription] = useState(prefillDescription || '');
  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };
  return submitted ? (
    <div className="text-center">
      <h2 className="text-3xl font-semibold mb-4">Thank you!</h2>
      <p>I'll get back to you within 24 hours.</p>
    </div>
  ) : (
    <form onSubmit={handleSubmit} className="grid gap-4 max-w-lg mx-auto">
      <input required className="p-3 rounded bg-zinc-800" placeholder="Name" />
      <input required type="email" className="p-3 rounded bg-zinc-800" placeholder="Email" />
      <textarea
        required
        className="p-3 rounded bg-zinc-800"
        rows={5}
        placeholder="Describe your idea"
        value={description}
        onChange={e => setDescription(e.target.value)}
      />
      <Button type="submit">Send Request</Button>
    </form>
  );
}

export default function TattooPortfolio() {
  const [section, setSection] = useState('home');
  const [prefillDescription, setPrefillDescription] = useState('');

  const handleBookFlash = (title) => {
    setPrefillDescription(`I want to book the flash design: ${title}`);
    setSection('booking');
  };

  return (
    <div className="bg-zinc-950 text-zinc-100 font-sans min-h-screen flex flex-col">
      <Header currentSection={section} setSection={setSection} />
      <main className="container mx-auto px-4 py-8 flex-1">
        {section === 'home' && <HomeSection setSection={setSection} />}
        {section === 'gallery' && <GallerySection onBookFlash={handleBookFlash} />}
        {section === 'about' && <AboutSection />}
        {section === 'booking' && <BookingSection prefillDescription={prefillDescription} />}
      </main>
      <Footer />
    </div>
  );
}
