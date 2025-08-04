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
  const [designType, setDesignType] = useState('own');
  const [selectedFlash, setSelectedFlash] = useState('');
  const [size, setSize] = useState('');
  const [uploadedFile, setUploadedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Convert file to buffer if uploaded
      let fileData = null;
      if (uploadedFile) {
        const arrayBuffer = await uploadedFile.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        fileData = {
          name: uploadedFile.name,
          data: buffer,
          type: uploadedFile.type
        };
      }

      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          designType,
          selectedFlash,
          size,
          description,
          uploadedFile: fileData
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to send request');
      }

      setSubmitted(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    setUploadedFile(file);
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return submitted ? (
    <div className="text-center">
      <h2 className="text-3xl font-semibold mb-4">Thank you!</h2>
      <p>I'll get back to you within 24 hours.</p>
    </div>
  ) : (
    <form onSubmit={handleSubmit} className="grid gap-4 max-w-lg mx-auto">
      <input 
        required 
        name="name"
        value={formData.name}
        onChange={handleInputChange}
        className="p-3 rounded bg-zinc-800" 
        placeholder="Name" 
      />
      <input 
        required 
        type="email" 
        name="email"
        value={formData.email}
        onChange={handleInputChange}
        className="p-3 rounded bg-zinc-800" 
        placeholder="Email" 
      />
      
      <div className="space-y-3">
        <label className="block text-sm font-medium">Design Type</label>
        <div className="flex gap-4">
          <label className="flex items-center">
            <input
              type="radio"
              name="designType"
              value="own"
              checked={designType === 'own'}
              onChange={(e) => setDesignType(e.target.value)}
              className="mr-2"
            />
            Own Design
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              name="designType"
              value="flash"
              checked={designType === 'flash'}
              onChange={(e) => setDesignType(e.target.value)}
              className="mr-2"
            />
            Flash Design
          </label>
        </div>
      </div>

      {designType === 'own' && (
        <div>
          <label className="block text-sm font-medium mb-2">Upload Design Reference</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="w-full p-3 rounded bg-zinc-800 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-emerald-400 file:text-zinc-950 hover:file:bg-emerald-500"
          />
          {uploadedFile && (
            <p className="text-sm text-emerald-400 mt-2">
              ✓ Selected: {uploadedFile.name}
            </p>
          )}
        </div>
      )}

      {designType === 'flash' && (
        <div>
          <label className="block text-sm font-medium mb-2">Select Flash Design</label>
          <select
            required
            value={selectedFlash}
            onChange={(e) => setSelectedFlash(e.target.value)}
            className="w-full p-3 rounded bg-zinc-800"
          >
            <option value="">Choose a design...</option>
            {flashDesigns.map((design) => (
              <option key={design.title} value={design.title}>
                {design.title}
              </option>
            ))}
          </select>
        </div>
      )}

      <div>
        <label className="block text-sm font-medium mb-2">Size</label>
        <select
          required
          value={size}
          onChange={(e) => setSize(e.target.value)}
          className="w-full p-3 rounded bg-zinc-800"
        >
          <option value="">Select size...</option>
          <option value="small">Small (2-3 inches)</option>
          <option value="medium">Medium (4-6 inches)</option>
          <option value="large">Large (7+ inches)</option>
        </select>
      </div>

      <textarea
        required
        className="p-3 rounded bg-zinc-800"
        rows={5}
        placeholder={designType === 'own' ? "Describe your design idea" : "Additional details or modifications"}
        value={description}
        onChange={e => setDescription(e.target.value)}
      />
      
      {error && (
        <p className="text-red-400 text-sm">{error}</p>
      )}
      
      <Button type="submit" disabled={loading}>
        {loading ? 'Sending...' : 'Send Request'}
      </Button>
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
