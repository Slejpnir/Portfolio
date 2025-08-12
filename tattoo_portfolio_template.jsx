import React, { useState, useEffect, useMemo } from 'react';

const healedTattoos = [
  { 
    src: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=60', 
    title: 'Dragon Sleeve',
    alt: 'Detailed neo-traditional dragon sleeve tattoo with vibrant colors and intricate linework',
    style: 'Neo-Traditional',
    tags: ['dragon', 'color', 'sleeve', 'neo-traditional']
  },
  { 
    src: 'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=800&q=60', 
    title: 'Rose Handpiece',
    alt: 'Elegant rose hand tattoo with realistic shading and delicate details',
    style: 'Illustrative',
    tags: ['rose', 'floral', 'hand', 'black & gray']
  },
  { 
    src: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=800&q=60', 
    title: 'Geometric Forearm',
    alt: 'Crisp geometric tattoo on forearm with clean lines and symmetry',
    style: 'Geometric',
    tags: ['geometric', 'linework', 'forearm']
  },
  { 
    src: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=800&q=60', 
    title: 'Blackwork Backpiece',
    alt: 'Bold blackwork back tattoo with strong contrast and negative space',
    style: 'Blackwork',
    tags: ['blackwork', 'back', 'large']
  },
];

const flashDesigns = [
  { 
    src: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=800&q=60', 
    title: 'Skull and Dagger',
    alt: 'Classic skull and dagger flash design with bold blackwork and traditional style',
    style: 'Traditional',
    tags: ['skull', 'dagger', 'traditional', 'blackwork']
  },
  { 
    src: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=800&q=60', 
    title: 'Phoenix Flash',
    alt: 'Mythical phoenix flash design with flowing feathers and dynamic composition',
    style: 'Illustrative',
    tags: ['phoenix', 'bird', 'color']
  },
  { 
    src: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=800&q=60', 
    title: 'Rose Flash',
    alt: 'Classic rose flash design suitable for arm or shoulder',
    style: 'Traditional',
    tags: ['rose', 'floral', 'traditional']
  },
  { 
    src: 'https://images.unsplash.com/photo-1520975916090-3105956dac38?auto=format&fit=crop&w=800&q=60', 
    title: 'Mandala Flash',
    alt: 'Intricate mandala flash with detailed linework',
    style: 'Geometric',
    tags: ['mandala', 'geometric', 'linework']
  },
];

const testimonials = [
  {
    id: 1,
    name: "Sarah M.",
    text: "Amazing work! The detail is incredible and healing was perfect. I get compliments every day on my sleeve.",
    rating: 5,
    style: "Neo-Traditional Sleeve",
    date: "2024"
  },
  {
    id: 2,
    name: "Alex K.",
    text: "Professional artist with a great eye for design. My custom piece turned out exactly how I imagined.",
    rating: 5,
    style: "Custom Design",
    date: "2024"
  },
  {
    id: 3,
    name: "Maria L.",
    text: "Clean studio, sterile equipment, and beautiful results. Highly recommend for any tattoo work.",
    rating: 5,
    style: "Geometric Design",
    date: "2023"
  }
];

function Button({ children, variant = 'solid', size = 'md', className = '', ...props }) {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variants = {
    solid: 'bg-emerald-500 text-zinc-950 hover:bg-emerald-400 focus:ring-emerald-500',
    outline: 'border border-emerald-500 text-emerald-400 hover:bg-emerald-500 hover:text-zinc-950 focus:ring-emerald-500',
    ghost: 'text-emerald-400 hover:bg-emerald-500/10 focus:ring-emerald-500'
  };
  
  const sizes = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg'
  };
  
  return (
    <button 
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

function LoadingSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="bg-zinc-800 rounded-lg aspect-square mb-3"></div>
      <div className="h-4 bg-zinc-800 rounded mb-2"></div>
      <div className="h-3 bg-zinc-800 rounded w-2/3"></div>
      </div>
  );
}

function ErrorPlaceholder() {
  return (
    <div className="text-center py-8">
      <div className="text-4xl mb-4">⚠️</div>
      <p className="text-zinc-400">Failed to load image</p>
    </div>
  );
}

function GalleryGrid({ tattoos, onBook, onImageClick }) {
  const [loadedImages, setLoadedImages] = useState(new Set());
  const [errorImages, setErrorImages] = useState(new Set());

  const handleImageLoad = (imageId) => {
    setLoadedImages(prev => new Set(prev).add(imageId));
  };

  const handleImageError = (imageId) => {
    setErrorImages(prev => new Set(prev).add(imageId));
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {tattoos.map((tattoo, index) => (
          <div key={index} className="group relative transition-transform duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-black/30">
          <div className="relative aspect-square overflow-hidden rounded-lg border border-zinc-800 bg-zinc-900 group-hover:border-emerald-500/40">
            {!loadedImages.has(index) && !errorImages.has(index) && (
              <LoadingSkeleton />
            )}
            
            {errorImages.has(index) ? (
              <ErrorPlaceholder />
            ) : (
              <img
                src={tattoo.src}
                alt={tattoo.alt}
                className={`w-full h-full object-cover transition-all duration-300 cursor-zoom-in ${
                  loadedImages.has(index) ? 'opacity-100' : 'opacity-0'
                }`}
                onLoad={() => handleImageLoad(index)}
                onError={() => handleImageError(index)}
                loading="lazy"
                onClick={() => onImageClick(tattoo)}
              />
            )}
            
            {loadedImages.has(index) && !errorImages.has(index) && (
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center pointer-events-none">
                <div className="text-white text-2xl">🔍</div>
              </div>
            )}
          </div>
          
          <div className="mt-3 space-y-2">
            <h3 className="font-semibold text-lg">{tattoo.title}</h3>
            <p className="text-sm text-zinc-400">{tattoo.style}</p>
            {tattoo.tags && (
              <div className="flex flex-wrap gap-2">
                {tattoo.tags.slice(0, 4).map(tag => (
                  <span key={tag} className="text-xs px-2 py-1 rounded bg-zinc-800 border border-zinc-700 text-zinc-300">#{tag}</span>
                ))}
              </div>
            )}
            {onBook && (
              <Button 
                onClick={() => onBook(tattoo.title)} 
                variant="outline" 
                size="sm"
                className="w-full"
              >
                Book this design
              </Button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

function Header({ currentSection, setSection }) {
const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'gallery', label: 'Gallery' },
    { id: 'about', label: 'About' },
    { id: 'testimonials', label: 'Reviews' },
    { id: 'booking', label: 'Booking' },
  ];
  return (
    <header className="sticky top-0 z-50 backdrop-blur bg-zinc-950/70 border-b border-zinc-800/60">
      <nav className="container mx-auto flex items-center justify-between py-4">
        <span className="text-2xl font-bold cursor-pointer hover:text-emerald-400 transition-colors" onClick={() => setSection('home')}>Ink<span className="text-emerald-400">Craft</span></span>
        <ul className="flex gap-6">
          {navItems.map(({ id, label }) => (
            <li key={id}>
              <button
                className={`hover:text-emerald-400 transition px-2 py-1 rounded ${currentSection === id ? 'text-emerald-400 bg-emerald-500/10' : ''}`}
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
  const socialLinks = [
    { name: 'Instagram', url: 'https://instagram.com/yourusername', icon: '📷' },
    { name: 'Facebook', url: 'https://facebook.com/yourpage', icon: '📘' },
    { name: 'TikTok', url: 'https://tiktok.com/@yourusername', icon: '🎵' },
    { name: 'YouTube', url: 'https://youtube.com/@yourchannel', icon: '📺' }
  ];

  return (
    <footer className="border-t border-zinc-800 mt-12">
      <div className="container mx-auto py-8">
        <div className="grid md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-semibold mb-4">InkCraft</h3>
            <p className="text-zinc-400">Professional tattoo artistry with a passion for unique designs.</p>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-4">Contact</h3>
            <p className="text-zinc-400">By appointment only</p>
            <p className="text-zinc-400">Tue-Sat: 10 AM - 7 PM</p>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-4">Follow</h3>
            <div className="flex gap-4">
              {socialLinks.map(({ name, url, icon }) => (
                <a
                  key={name}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-2xl hover:text-emerald-400 transition-colors"
                  title={name}
                >
                  {icon}
                </a>
              ))}
            </div>
          </div>
        </div>
        <div className="border-t border-zinc-800 mt-8 pt-8 text-center text-zinc-400">
          <p>&copy; 2024 InkCraft. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

function LightboxModal({ image, onClose }) {
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90" onClick={onClose}>
      <div className="relative max-w-4xl max-h-[90vh] p-4" onClick={e => e.stopPropagation()}>
        <button
          onClick={onClose}
          aria-label="Close image"
          className="absolute top-3 right-3 z-10 inline-flex items-center justify-center w-10 h-10 rounded-full bg-black/60 text-white hover:bg-black/80 hover:text-emerald-400 transition"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
            <path fillRule="evenodd" d="M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 01-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z" clipRule="evenodd" />
          </svg>
        </button>
        <img
          src={image.src}
          alt={image.alt}
          className="w-full h-full object-contain max-h-[80vh] rounded-lg"
        />
        <div className="mt-4 text-center text-white">
          <h3 className="text-xl font-semibold">{image.title}</h3>
          <p className="text-emerald-400">{image.style}</p>
        </div>
      </div>
    </div>
  );
}

function HomeSection({ setSection }) {
  return (
    <section className="min-h-[80vh] flex items-center">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-6xl font-bold mb-6">
          Professional <span className="text-emerald-400">Tattoo</span> Artistry
        </h1>
        <p className="text-xl text-zinc-400 mb-8 leading-relaxed max-w-3xl mx-auto">
          Transform your ideas into stunning, permanent artwork. Specializing in custom designs, 
          neo-traditional styles, and creating meaningful pieces that tell your unique story.
        </p>
        
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6 hover:border-emerald-500/40 transition-colors">
            <div className="text-3xl mb-3">🎨</div>
            <h3 className="text-lg font-semibold mb-2">Custom Designs</h3>
            <p className="text-zinc-400 text-sm">Personalized artwork created just for you</p>
          </div>
          <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6 hover:border-emerald-500/40 transition-colors">
            <div className="text-3xl mb-3">⚡</div>
            <h3 className="text-lg font-semibold mb-2">Flash Designs</h3>
            <p className="text-zinc-400 text-sm">Ready-to-ink designs for quick sessions</p>
          </div>
          <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6 hover:border-emerald-500/40 transition-colors">
            <div className="text-3xl mb-3">✨</div>
            <h3 className="text-lg font-semibold mb-2">Professional Quality</h3>
            <p className="text-zinc-400 text-sm">Sterile environment with expert technique</p>
          </div>
        </div>
        
        <div className="flex gap-4 justify-center">
          <Button onClick={() => setSection('gallery')} size="lg">
            View Gallery
          </Button>
          <Button variant="outline" onClick={() => setSection('booking')} size="lg">
            Book Your Session
          </Button>
        </div>
      </div>
    </section>
  );
}

function GallerySection({ onBookFlash }) {
  const [activeTab, setActiveTab] = useState('healed');
  const [selectedImage, setSelectedImage] = useState(null);
  const [query, setQuery] = useState('');
  const [styleFilter, setStyleFilter] = useState('all');
  const [tagFilters, setTagFilters] = useState([]); // multi-select
  const [sortBy, setSortBy] = useState('title-asc');
  const [visibleCount, setVisibleCount] = useState(8);

  const list = activeTab === 'healed' ? healedTattoos : flashDesigns;
  const styles = ['all', ...Array.from(new Set(list.map(i => i.style)))];
  const allTags = Array.from(new Set(list.flatMap(i => i.tags || []))).slice(0, 12);

  const filtered = list
    .filter(item => {
      const matchesStyle = styleFilter === 'all' || item.style === styleFilter;
      const matchesQuery = query.trim() === '' || item.title.toLowerCase().includes(query.toLowerCase());
      const matchesTags = tagFilters.length === 0 || (item.tags || []).some(t => tagFilters.includes(t));
      return matchesStyle && matchesQuery && matchesTags;
    })
    .sort((a, b) => {
      if (sortBy === 'title-asc') return a.title.localeCompare(b.title);
      if (sortBy === 'title-desc') return b.title.localeCompare(a.title);
      // Stable as default
      return 0;
    });

  const visible = filtered.slice(0, visibleCount);

  const handleImageClick = (image) => setSelectedImage(image);
  const handleBookFlash = (title) => onBookFlash(title);

  return (
    <section>
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold mb-4">Gallery</h2>
        <p className="text-zinc-400 text-lg">Explore my latest work and available flash designs</p>
      </div>

      <div className="flex justify-center mb-6">
        <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-1">
          <button
            onClick={() => { setActiveTab('healed'); setVisibleCount(8); setQuery(''); setStyleFilter('all'); }}
            className={`px-6 py-2 rounded-md transition-colors ${
              activeTab === 'healed'
                ? 'bg-emerald-500 text-zinc-950'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            Healed Tattoos
          </button>
          <button
            onClick={() => { setActiveTab('flash'); setVisibleCount(8); setQuery(''); setStyleFilter('all'); }}
            className={`px-6 py-2 rounded-md transition-colors ${
              activeTab === 'flash'
                ? 'bg-emerald-500 text-zinc-950'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            Flash Designs
          </button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto mb-6 grid gap-3 md:grid-cols-3">
        <input
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search by title..."
          className="w-full p-3 rounded bg-zinc-900 border border-zinc-800 focus:border-emerald-500 placeholder-zinc-600"
        />
        <select
          value={styleFilter}
          onChange={e => setStyleFilter(e.target.value)}
          className="w-full p-3 rounded bg-zinc-900 border border-zinc-800 focus:border-emerald-500"
        >
          {styles.map(s => (
            <option key={s} value={s}>{s === 'all' ? 'All Styles' : s}</option>
          ))}
        </select>
        <select
          value={sortBy}
          onChange={e => setSortBy(e.target.value)}
          className="w-full p-3 rounded bg-zinc-900 border border-zinc-800 focus:border-emerald-500"
        >
          <option value="title-asc">Title A→Z</option>
          <option value="title-desc">Title Z→A</option>
        </select>
      </div>

      {allTags.length > 0 && (
        <div className="max-w-5xl mx-auto mb-6 flex flex-wrap gap-2">
          {allTags.map(tag => {
            const active = tagFilters.includes(tag);
            return (
              <button
                key={tag}
                onClick={() => setTagFilters(prev => active ? prev.filter(t => t !== tag) : [...prev, tag])}
                className={`text-xs px-2 py-1 rounded border transition-colors ${active ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300' : 'bg-zinc-900 border-zinc-800 text-zinc-300 hover:border-zinc-700'}`}
                title={active ? 'Click to remove tag filter' : 'Click to add tag filter'}
              >
                #{tag}
              </button>
            );
          })}
          {tagFilters.length > 0 && (
            <button
              onClick={() => setTagFilters([])}
              className="text-xs px-2 py-1 rounded bg-zinc-800 border border-zinc-700 text-zinc-300 hover:border-zinc-600"
            >
              Clear tags
            </button>
          )}
        </div>
      )}

      {visible.length > 0 ? (
        activeTab === 'healed' ? (
          <GalleryGrid tattoos={visible} onImageClick={handleImageClick} />
        ) : (
          <GalleryGrid tattoos={visible} onBook={(t) => handleBookFlash(`I want to book the flash design: ${t}`)} onImageClick={handleImageClick} />
        )
      ) : (
        <div className="text-center text-zinc-400 py-16">
          <div className="text-5xl mb-4">🔎</div>
          <p>No results match your filters. Try clearing search or choosing another style.</p>
        </div>
      )}

      {visible.length < filtered.length && (
        <div className="text-center mt-8">
          <Button onClick={() => setVisibleCount(c => c + 8)} variant="outline">Load more</Button>
        </div>
      )}

      {selectedImage && (
        <LightboxModal image={selectedImage} onClose={() => setSelectedImage(null)} />
      )}
    </section>
  );
}

function AboutSection() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold mb-4">About the Artist</h2>
        <p className="text-zinc-400 text-lg">Passionate about creating unique, meaningful artwork</p>
      </div>
      
      <div className="grid lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <div>
            <h3 className="text-2xl font-semibold mb-3 text-emerald-400">Artist Story</h3>
            <p className="text-zinc-300 leading-relaxed">
              With over 8 years of experience in the tattoo industry, I've dedicated my life to mastering the art of permanent body modification. Every piece I create is a collaboration between artist and client, resulting in unique artwork that tells a personal story.
            </p>
          </div>
          
          <div>
            <h3 className="text-2xl font-semibold mb-3 text-emerald-400">Specialties</h3>
            <ul className="space-y-2 text-zinc-300">
              <li>• Custom Design Creation</li>
              <li>• Neo-Traditional & Traditional Styles</li>
              <li>• Realistic & Illustrative Work</li>
              <li>• Cover-up & Touch-up Services</li>
              <li>• Color & Black & Gray</li>
            </ul>
          </div>
        </div>
        
        <div className="space-y-6">
          <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-4 text-emerald-400">Studio Information</h3>
            <div className="space-y-3 text-zinc-300">
              <div className="flex items-center gap-3">
                <span className="text-emerald-400">📍</span>
                <span>Downtown Studio Location</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-emerald-400">🕒</span>
                <span>Tue-Sat: 10 AM - 7 PM</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-emerald-400">🧼</span>
                <span>Sterile Equipment & Clean Environment</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-emerald-400">📱</span>
                <span>By Appointment Only</span>
              </div>
            </div>
          </div>
          
          <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-4 text-emerald-400">Commitment to Quality</h3>
            <p className="text-zinc-300 leading-relaxed">
              I believe every tattoo should be a masterpiece. From the initial consultation to the final touch-up, I ensure the highest standards of safety, artistry, and customer satisfaction.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function AppointmentCalendar({ onDateSelect, selectedDate, selectedTime, bookedTimes, onToggleBooked }) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [availableDates, setAvailableDates] = useState(new Set());
  const [availableTimes, setAvailableTimes] = useState([]);
  const [isAdminMode, setIsAdminMode] = useState(false);

  // Generate available dates for the next 3 months
  useEffect(() => {
    const dates = new Set();
    const times = [];
    
    // Available dates (example: Tue-Sat for next 3 months)
    const startDate = new Date();
    for (let i = 0; i < 90; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      
      // Only show Tuesday-Saturday (1=Monday, 2=Tuesday, 6=Saturday)
      if (date.getDay() >= 2 && date.getDay() <= 6) {
        dates.add(date.toISOString().split('T')[0]);
      }
    }
    
    // Available time slots (10 AM - 7 PM, 2-hour sessions)
    for (let hour = 10; hour <= 17; hour += 2) {
      times.push(`${hour}:00`);
    }
    
    setAvailableDates(dates);
    setAvailableTimes(times);
  }, []);

  // Admin mode toggle: requires password only when enabling; disabling never asks
  const toggleAdminMode = () => {
    if (isAdminMode) {
      const newAdminMode = false;
      setIsAdminMode(newAdminMode);
      localStorage.setItem('adminMode', String(newAdminMode));
      console.log('🔐 Admin mode deactivated');
      return;
    }

    try {
      const password = prompt('Enter admin password (default: admin123)');
      if (password === 'admin123') {
        const newAdminMode = true;
        setIsAdminMode(newAdminMode);
        localStorage.setItem('adminMode', String(newAdminMode));
        console.log('🔐 Admin mode activated');
      }
    } catch (error) {
      const newAdminMode = true;
      setIsAdminMode(newAdminMode);
      localStorage.setItem('adminMode', String(newAdminMode));
      console.log('🔐 Admin mode activated (fallback)');
    }
  };

  // Check localStorage for admin mode on component mount
  useEffect(() => {
    const savedAdminMode = localStorage.getItem('adminMode') === 'true';
    setIsAdminMode(savedAdminMode);
  }, []);

  // Add keyboard shortcut for admin mode (Ctrl+Shift+A)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'A') {
        e.preventDefault();
        toggleAdminMode();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isAdminMode]);

  const handleTimeClick = (date, time) => {
    if (isAdminMode) {
      // Admin mode: toggle booked status
      onToggleBooked(date, time);
    } else {
      // Client mode: select appointment
      onDateSelect(date, time);
    }
  };

  // Faster lookup using a memoized Set of "date|time"
  const bookedKeySet = useMemo(() => {
    const set = new Set();
    (bookedTimes || []).forEach(b => set.add(`${b.date}|${b.time}`));
    return set;
  }, [bookedTimes]);

  const isTimeBooked = (date, time) => bookedKeySet.has(`${date}|${time}`);

  const isTimeSelected = (date, time) => {
    return selectedDate === date && selectedTime === time;
  };

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDay = firstDay.getDay();
    
    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDay; i++) {
      days.push(null);
    }
    
    // Add all days in the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }
    
    return days;
  };

  const formatDate = (date) => {
    return date.toISOString().split('T')[0];
  };

  const isDateAvailable = (date) => {
    return availableDates.has(formatDate(date));
  };

  const isDateSelected = (date) => {
    return selectedDate === formatDate(date);
  };

  const isDateToday = (date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const goToPreviousMonth = () => {
    setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  const handleDateClick = (date) => {
    if (isDateAvailable(date)) {
      onDateSelect(formatDate(date));
    }
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-semibold text-emerald-400">Select Appointment Date</h3>
          <p className="text-xs text-zinc-500 mt-1">
            💡 <strong>Admin Mode:</strong> Click Admin button or press <kbd className="px-1 py-0.5 bg-zinc-800 rounded text-xs">Ctrl+Shift+A</kbd>
          </p>
        </div>
          <div className="flex gap-2">
          <button
            onClick={toggleAdminMode}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 border-2 ${
              isAdminMode 
                ? 'bg-red-500/20 text-red-400 border-red-500 shadow-lg shadow-red-500/20' 
                : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700 border-zinc-600 hover:border-zinc-500'
            }`}
            title={isAdminMode ? 'Click to exit admin mode' : 'Click to enter admin mode'}
          >
            {isAdminMode ? '🔒 Admin Mode' : '👤 Admin'}
          </button>
          <button
            onClick={goToPreviousMonth}
            className="p-2 rounded bg-zinc-800 hover:bg-zinc-700 transition-colors"
          >
            ←
          </button>
          <button
            onClick={goToNextMonth}
            className="p-2 rounded bg-zinc-800 hover:bg-zinc-700 transition-colors"
          >
            →
          </button>
        </div>
      </div>

      <div className="text-center mb-4">
        <h4 className="text-lg font-medium">
          {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
        </h4>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1 mb-6">
        {dayNames.map(day => (
          <div key={day} className="p-2 text-center text-sm text-zinc-400 font-medium">
            {day}
          </div>
        ))}
        
        {getDaysInMonth(currentMonth).map((date, index) => (
          <div key={index} className="p-2 text-center">
            {date ? (
              <button
                onClick={() => handleDateClick(date)}
                className={`w-8 h-8 rounded-full text-sm transition-all duration-200 ${
                  isDateSelected(date)
                    ? 'bg-emerald-500 text-zinc-950 font-semibold'
                    : isDateAvailable(date)
                    ? 'bg-zinc-800 text-white hover:bg-zinc-700 hover:scale-110'
                    : 'text-zinc-600 cursor-not-allowed'
                } ${
                  isDateToday(date) ? 'ring-2 ring-emerald-400' : ''
                }`}
                disabled={!isDateAvailable(date)}
              >
                {date.getDate()}
              </button>
            ) : (
              <div className="w-8 h-8"></div>
            )}
          </div>
        ))}
      </div>

      {/* Selected Date Info */}
      {selectedDate && (
        <div className="border-t border-zinc-800 pt-4">
          <div className="text-center mb-4">
            <h4 className="text-lg font-medium text-emerald-400">
              {new Date(selectedDate).toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </h4>
            <p className="text-sm text-zinc-400">Available time slots</p>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {availableTimes.map(time => (
              <button
                key={time}
                onClick={() => handleTimeClick(selectedDate, time)}
                disabled={!isAdminMode && isTimeBooked(selectedDate, time)}
                className={`p-3 rounded border transition-all duration-200 ${
                  isTimeSelected(selectedDate, time)
                    ? 'border-emerald-500 bg-emerald-500/10 text-emerald-400'
                    : isTimeBooked(selectedDate, time)
                    ? 'border-red-500 bg-red-500/10 text-red-400 cursor-not-allowed'
                    : 'border-zinc-700 hover:border-emerald-500 hover:bg-emerald-500/5'
                }`}
              >
                {time}
                {isTimeBooked(selectedDate, time) && (
                  <div className="text-xs mt-1">Booked</div>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Legend */}
      <div className="mt-4 pt-4 border-t border-zinc-800">
        <div className="flex items-center justify-center gap-4 text-xs text-zinc-400 mb-2">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
            <span>Selected</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-zinc-800"></div>
            <span>Available</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <span>Booked</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-zinc-600"></div>
            <span>Unavailable</span>
          </div>
        </div>
        {isAdminMode && (
          <div className="text-center text-sm text-red-400 bg-red-500/10 p-3 rounded-lg border-2 border-red-500/30 shadow-lg shadow-red-500/20">
            🔒 <strong>ADMIN MODE ACTIVE</strong> 🔒
            <br />
            <span className="text-xs">Click time slots to mark as booked/unbooked</span>
          </div>
        )}
      </div>
      </div>
  );
}

function BookingSection({ prefillDescription, bookedTimes, onToggleBooked }) {
  const [submitted, setSubmitted] = useState(false);
  const [description, setDescription] = useState(prefillDescription || '');
  const [designType, setDesignType] = useState('own');
  const [selectedFlash, setSelectedFlash] = useState('');
  const [size, setSize] = useState('');
  const [uploadedFile, setUploadedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: ''
  });
  const [errors, setErrors] = useState({});

  const validateField = (name, value) => {
    const newErrors = { ...errors };
    
    switch (name) {
      case 'name':
        if (!value.trim()) {
          newErrors.name = 'Name is required';
        } else if (value.trim().length < 2) {
          newErrors.name = 'Name must be at least 2 characters';
        } else {
          delete newErrors.name;
        }
        break;
      case 'email':
        if (value && !isValidEmail(value)) {
          newErrors.email = 'Please enter a valid email address';
        } else {
          delete newErrors.email;
        }
        break;
      case 'phone':
        if (value && !isValidPhone(value)) {
          newErrors.phone = 'Please enter a valid phone number';
        } else {
          delete newErrors.phone;
        }
        break;
      default:
        break;
    }
    
    setErrors(newErrors);
  };

  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const isValidPhone = (phone) => {
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''));
  };

  const handleDateSelect = (date, time = null) => {
    setSelectedDate(date);
    if (time) {
      setSelectedTime(time);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validate that at least email or phone is provided
    if (!formData.email && !formData.phone) {
      setError('Please provide either an email or phone number');
      setLoading(false);
      return;
    }

    // Validate appointment selection
    if (!selectedDate || !selectedTime) {
      setError('Please select an appointment date and time');
      setLoading(false);
      return;
    }

    // Check for any validation errors
    if (Object.keys(errors).length > 0) {
      setError('Please fix the errors above');
      setLoading(false);
      return;
    }

    try {
      // Convert file to base64 if uploaded
      let fileData = null;
      if (uploadedFile) {
        const reader = new FileReader();
        fileData = await new Promise((resolve) => {
          reader.onload = () => {
            // Convert base64 to buffer on the server side
            const base64Data = reader.result;
            resolve({
              name: uploadedFile.name,
              data: base64Data,
              type: uploadedFile.type
            });
          };
          reader.readAsDataURL(uploadedFile);
        });
      }

      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          designType,
          selectedFlash,
          size,
          description,
          appointmentDate: selectedDate,
          appointmentTime: selectedTime,
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
    if (file) {
      // Check file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        setError('File size must be less than 5MB');
        return;
      }
      // Check file type
      if (!file.type.startsWith('image/')) {
        setError('Please upload an image file');
        return;
      }
      setUploadedFile(file);
      setError(''); // Clear any previous errors
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    validateField(name, value);
  };

  const handleBlur = (e) => {
    validateField(e.target.name, e.target.value);
  };

  return submitted ? (
    <div className="text-center space-y-6 max-w-2xl mx-auto">
      <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-8">
        <div className="text-6xl mb-4">🎉</div>
        <h2 className="text-3xl font-semibold mb-4">Thank you!</h2>
        <p className="text-lg text-zinc-300 mb-6">I'll get back to you within 24 hours.</p>
        <Button onClick={() => window.location.reload()} className="px-8">
          Send Another Request
        </Button>
      </div>
    </div>
  ) : (
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-4xl font-bold mb-4">Book Your Session</h2>
        <p className="text-zinc-400 text-lg">Let's create something amazing together</p>
      </div>
      
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Left Column - Appointment Calendar */}
        <div>
            <AppointmentCalendar 
              onDateSelect={handleDateSelect}
              selectedDate={selectedDate}
              selectedTime={selectedTime}
              bookedTimes={bookedTimes}
              onToggleBooked={onToggleBooked}
            />
          
          {/* Selected Appointment Summary */}
          {selectedDate && selectedTime && (
            <div className="mt-6 bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-4">
              <h4 className="text-lg font-semibold text-emerald-400 mb-2">Selected Appointment</h4>
              <p className="text-white">
                {new Date(selectedDate).toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })} at {selectedTime}
              </p>
            </div>
          )}
        </div>
        
        {/* Right Column - Booking Form */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-emerald-400">Name *</label>
                <input 
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  className={`w-full p-3 rounded bg-zinc-800 border transition-colors ${
                    errors.name ? 'border-red-500' : 'border-zinc-700 hover:border-zinc-600 focus:border-emerald-500'
                  }`}
                  placeholder="Your full name" 
                />
                {errors.name && <p className="text-red-400 text-sm">{errors.name}</p>}
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-emerald-400">Size *</label>
                <select
                  required
                  value={size}
                  onChange={(e) => setSize(e.target.value)}
                  className="w-full p-3 rounded bg-zinc-800 border border-zinc-700 hover:border-zinc-600 focus:border-emerald-500 transition-colors"
                >
                  <option value="">Select size...</option>
                  <option value="small">Small (2-3 inches)</option>
                  <option value="medium">Medium (4-6 inches)</option>
                  <option value="large">Large (7+ inches)</option>
                </select>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-emerald-400">Email</label>
                <input 
                  type="email" 
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  className={`w-full p-3 rounded bg-zinc-800 border transition-colors ${
                    errors.email ? 'border-red-500' : 'border-zinc-700 hover:border-zinc-600 focus:border-emerald-500'
                  }`}
                  placeholder="your.email@example.com" 
                />
                {errors.email && <p className="text-red-400 text-sm">{errors.email}</p>}
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-emerald-400">Phone</label>
                <input 
                  type="tel" 
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  className={`w-full p-3 rounded bg-zinc-800 border transition-colors ${
                    errors.phone ? 'border-red-500' : 'border-zinc-700 hover:border-zinc-600 focus:border-emerald-500'
                  }`}
                  placeholder="+1 (555) 123-4567" 
                />
                {errors.phone && <p className="text-red-400 text-sm">{errors.phone}</p>}
              </div>
            </div>
            
            <div className="space-y-3">
              <label className="block text-sm font-medium text-emerald-400">Design Type</label>
              <div className="flex gap-4">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="designType"
                    value="own"
                    checked={designType === 'own'}
                    onChange={(e) => setDesignType(e.target.value)}
                    className="mr-2 text-emerald-400"
                  />
                  <span className="hover:text-emerald-400 transition-colors">Own Design</span>
                </label>
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="designType"
                    value="flash"
                    checked={designType === 'flash'}
                    onChange={(e) => setDesignType(e.target.value)}
                    className="mr-2 text-emerald-400"
                  />
                  <span className="hover:text-emerald-400 transition-colors">Flash Design</span>
                </label>
              </div>
            </div>

            {designType === 'own' && (
              <div className="space-y-3">
                <label className="block text-sm font-medium text-emerald-400">Upload Design Reference</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="w-full p-3 rounded bg-zinc-800 border border-zinc-700 hover:border-zinc-600 focus:border-emerald-500 transition-colors file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-emerald-400 file:text-zinc-950 hover:file:bg-emerald-500"
                />
                {uploadedFile && (
                  <div className="flex items-center gap-2 text-emerald-400 bg-emerald-500/10 p-3 rounded border border-emerald-500/20">
                    <span>✓</span>
                    <span className="text-sm">{uploadedFile.name}</span>
                    <span className="text-xs text-zinc-500">
                      ({(uploadedFile.size / 1024 / 1024).toFixed(2)} MB)
                    </span>
                  </div>
                )}
              </div>
            )}

            {designType === 'flash' && (
              <div className="space-y-2">
                <label className="block text-sm font-medium text-emerald-400">Select Flash Design *</label>
                <select
                  required
                  value={selectedFlash}
                  onChange={(e) => setSelectedFlash(e.target.value)}
                  className="w-full p-3 rounded bg-zinc-800 border border-zinc-700 hover:border-zinc-600 focus:border-emerald-500 transition-colors"
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

            <div className="space-y-2">
              <label className="block text-sm font-medium text-emerald-400">Description *</label>
              <textarea
                required
                className="w-full p-3 rounded bg-zinc-800 border border-zinc-700 hover:border-zinc-600 focus:border-emerald-500 transition-colors"
                rows={5}
                placeholder={designType === 'own' ? "Describe your design idea in detail..." : "Any modifications or additional details..."}
                value={description}
                onChange={e => setDescription(e.target.value)}
              />
            </div>

            <div className="pt-4">
              <p className="text-xs text-zinc-500 text-center mb-4">
                Please provide either an email or phone number for contact
              </p>
              
              {error && (
                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded text-red-400 text-sm mb-4">
                  {error}
                </div>
              )}
              
              {selectedDate && selectedTime && bookedTimes.some(b => b.date === selectedDate && b.time === selectedTime) && (
                <div className="p-3 mb-3 rounded bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                  This slot is currently marked as booked. Please choose another time.
                </div>
              )}
              <Button 
                type="submit" 
                disabled={
                  loading ||
                  Object.keys(errors).length > 0 ||
                  !selectedDate ||
                  !selectedTime ||
                  bookedTimes.some(b => b.date === selectedDate && b.time === selectedTime)
                }
                className="w-full text-lg py-4"
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                    Sending Request...
                  </div>
                ) : (
                  'Book Appointment'
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

function TestimonialCard({ testimonial }) {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
      <div className="flex items-center gap-2 mb-3">
        {[...Array(testimonial.rating)].map((_, i) => (
          <span key={i} className="text-yellow-400">⭐</span>
        ))}
      </div>
      <p className="text-zinc-300 mb-4 italic">"{testimonial.text}"</p>
      <div className="flex items-center justify-between">
        <div>
          <p className="font-semibold text-emerald-400">{testimonial.name}</p>
          <p className="text-sm text-zinc-500">{testimonial.style}</p>
        </div>
        <span className="text-sm text-zinc-500">{testimonial.date}</span>
      </div>
    </div>
  );
}

function TestimonialsSection({ setSection }) {
  return (
    <section>
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold mb-4">Client Reviews</h2>
        <p className="text-zinc-400 text-lg">See what clients say about their experience</p>
      </div>
      
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {testimonials.map((testimonial) => (
          <TestimonialCard key={testimonial.id} testimonial={testimonial} />
        ))}
      </div>
      
      <div className="text-center">
        <Button onClick={() => setSection('booking')} size="lg">
          Book Your Session
        </Button>
      </div>
    </section>
  );
}

export default function TattooPortfolio() {
  const [currentSection, setCurrentSection] = useState('home');
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [prefillDescription, setPrefillDescription] = useState('');
  const [bookedTimes, setBookedTimes] = useState([]);

  // Load bookings from API (fallback to demo if API unavailable)
  useEffect(() => {
    let canceled = false;
    (async () => {
      try {
        const res = await fetch('/api/bookings');
        if (!res.ok) throw new Error('Failed to load bookings');
        const json = await res.json();
        if (!canceled && Array.isArray(json.bookings)) {
          setBookedTimes(json.bookings);
        }
      } catch (_) {
        if (!canceled) {
          setBookedTimes([
            { date: '2024-12-20', time: '14:00' },
            { date: '2024-12-21', time: '10:00' },
            { date: '2024-12-23', time: '16:00' }
          ]);
        }
      }
    })();
    return () => { canceled = true; };
  }, []);

  // Periodically refresh bookings so all visitors see updates (Redis-backed)
  useEffect(() => {
    const intervalId = setInterval(async () => {
      try {
        const res = await fetch('/api/bookings');
        if (!res.ok) return;
        const json = await res.json();
        if (Array.isArray(json.bookings)) {
          setBookedTimes(json.bookings);
        }
      } catch (_) {}
    }, 20000); // every 20s
    return () => clearInterval(intervalId);
  }, []);

  const handleSectionChange = (section) => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentSection(section);
      setIsTransitioning(false);
    }, 150);
  };

  const handleBookFlash = (title) => {
    setPrefillDescription(`I want to book the flash design: ${title}`);
    handleSectionChange('booking');
  };

  const toggleBooked = async (date, time) => {
    // Optimistic update
    setBookedTimes((prev) => {
      const exists = prev.some((b) => b.date === date && b.time === time);
      if (exists) {
        return prev.filter((b) => !(b.date === date && b.time === time));
      }
      return [...prev, { date, time }];
    });

    try {
      await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ date, time })
      });
    } catch (e) {
      // Rollback on error
      setBookedTimes((prev) => {
        const exists = prev.some((b) => b.date === date && b.time === time);
        if (exists) {
          return prev.filter((b) => !(b.date === date && b.time === time));
        }
        return [...prev, { date, time }];
      });
    }
  };

  return (
    <div className="bg-zinc-950 text-zinc-100 font-sans min-h-screen flex flex-col">
      <Header currentSection={currentSection} setSection={handleSectionChange} />
      <main className="container mx-auto px-4 py-8 flex-1">
        <div className={`transition-opacity duration-150 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}>
          {currentSection === 'home' && <HomeSection setSection={handleSectionChange} />}
          {currentSection === 'gallery' && <GallerySection onBookFlash={handleBookFlash} />}
          {currentSection === 'about' && <AboutSection />}
          {currentSection === 'booking' && <BookingSection prefillDescription={prefillDescription} bookedTimes={bookedTimes} onToggleBooked={toggleBooked} />}
          {currentSection === 'testimonials' && <TestimonialsSection setSection={handleSectionChange} />}
        </div>
      </main>
      <Footer />
    </div>
  );
}
