import React, { useState, useEffect, useRef } from 'react';
import { Home, MapPin, DollarSign, CloudSun, ChevronRight, Compass, Navigation, Zap, X, Info, Car, Calendar, ArrowLeft, Map, Sun, Moon, Trophy, AlertTriangle, CheckCircle, Heart, Share2, Clock, Tag, Search, Filter, Users, Calendar as CalendarIcon, Mail, Phone, Facebook, Twitter, Instagram, Linkedin, Github } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { mockLocations, IMG } from './supabase';
import { StarRating } from './components/StarRating';
import BudgetCalculator from './components/BudgetCalculator';
import WeatherInfo from './components/WeatherInfo';

// --- Helper for Global Search ---
const getAllPlaces = () => {
  const allPlaces = [];
  Object.entries(mockLocations).forEach(([districtName, data]) => {
    if (data.places) {
      // Add district name to each place for context
      const placesWithDistrict = data.places.map(p => ({
        ...p,
        district: districtName,
        // Ensure image fallback exists
        image: p.image || IMG.HERITAGE
      }));
      allPlaces.push(...placesWithDistrict);
    }
  });
  return allPlaces;
};

// --- Top-Level Components to prevent re-mounting ---

const PageTransition = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
  >
    {children}
  </motion.div>
);

const Navbar = ({ screen, setScreen, isLightMode, setIsLightMode }) => (
  <nav className="navbar">
    <div className="logo" onClick={() => setScreen('home')} style={{ cursor: 'pointer' }}>
      <Compass size={32} />
      <span>TN Guide</span>
    </div>
    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
      <div className="glass hide-mobile" style={{ padding: '0.4rem 0.8rem', borderRadius: '20px', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--success)', border: '1px solid var(--success)', marginRight: '0.5rem' }}>
        <Zap size={14} /> Offline Ready
      </div>
      <button
        className={`nav-btn ${screen === 'quiz' ? 'active' : ''}`}
        onClick={() => setScreen('quiz')}
      >
        <Trophy size={18} /> <span>Quiz</span>
      </button>
      <button
        onClick={() => setIsLightMode(!isLightMode)}
        className="glass theme-toggle-btn"
        style={{ width: '40px', height: '40px', padding: '0', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', color: isLightMode ? 'var(--text)' : 'var(--primary)', cursor: 'pointer', background: 'var(--glass-highlight)', border: '1px solid var(--glass-border)' }}
        title="Toggle Theme"
      >
        {isLightMode ? <Moon size={20} /> : <Sun size={20} />}
      </button>
      <button
        onClick={() => setScreen('home')}
        className={`nav-btn ${screen === 'home' ? 'active' : ''}`}
      >
        Home
      </button>
    </div>
  </nav>
);

const Carousel = ({ images, activeIndex, name }) => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!images || images.length <= 1) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 3000);
    return () => clearInterval(timer);
  }, [images]);

  const displayImages = images || [IMG.HERITAGE];

  return (
    <div className="carousel-container">
      {displayImages.map((img, idx) => (
        <div key={idx} className={`carousel-slide ${idx === current ? 'active' : ''}`}>
          <img
            src={img}
            alt={`${name} view ${idx + 1}`}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
          {displayImages.length > 1 && (
            <div style={{ position: 'absolute', bottom: '20px', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '8px' }}>
              {displayImages.map((_, dotIdx) => (
                <div key={dotIdx} style={{ width: '8px', height: '8px', borderRadius: '50%', background: dotIdx === current ? 'var(--primary)' : 'rgba(255,255,255,0.5)' }}></div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

const QuizScreen = ({ setPlace, setDays, setMaxBudget, handleExplore }) => {
  const questions = [
    { q: "What's your preferred travel budget?", options: [{ t: "Budget Friendly", v: 10000 }, { t: "Moderate", v: 30000 }, { t: "Luxury", v: 70000 }] },
    { q: "How long is your escape?", options: [{ t: "Quick Trip (1-2 days)", v: 2 }, { t: "Weekend (3-4 days)", v: 4 }, { t: "Long Break (5+ days)", v: 7 }] },
    { q: "What vibe are you looking for?", options: [{ t: "City Lights & Culture", v: 'Chennai' }, { t: "Tea Estates & Hills", v: 'Coimbatore' }, { t: "History & Nature", v: 'Krishnagiri' }] }
  ];

  const [step, setStep] = useState(0);
  const [results, setResults] = useState([]);

  const handleNext = (val) => {
    const newResults = [...results, val];
    if (step < questions.length - 1) {
      setResults(newResults);
      setStep(step + 1);
    } else {
      const destination = newResults[2];
      setPlace(destination);
      setDays(newResults[1]);
      setMaxBudget(newResults[0]);
      handleExplore(destination);
    }
  };

  return (
    <PageTransition key="quiz">
      <div className="glass quiz-card">
        <div className="quiz-progress">
          <div className="quiz-progress-bar" style={{ width: `${((step + 1) / questions.length) * 100}%` }}></div>
        </div>
        <h2 style={{ fontSize: '2rem', marginBottom: '1rem', color: 'var(--text)' }}>Destination Matcher</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '3rem' }}>Question {step + 1} of {questions.length}</p>
        <h3 style={{ fontSize: '1.8rem', marginBottom: '3rem', color: 'var(--text)' }}>{questions[step].q}</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {questions[step].options.map((opt, i) => (
            <button key={i} className="quiz-option" onClick={() => handleNext(opt.v)}>
              {opt.t}
            </button>
          ))}
        </div>
      </div>
    </PageTransition>
  );
};

const DetailModal = ({ place, onClose }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="modal-overlay"
    onClick={onClose}
  >
    <motion.div
      initial={{ scale: 0.9, opacity: 0, y: 20 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      exit={{ scale: 0.9, opacity: 0, y: 20 }}
      className="glass modal-content"
      onClick={e => e.stopPropagation()}
      style={{ maxWidth: '800px', width: '90%', maxHeight: '90vh', overflowY: 'auto', padding: '0', borderRadius: '24px' }}
    >
      <div style={{ position: 'relative', height: '350px' }}>
        <Carousel images={place?.images} name={place?.name} />
        <button onClick={onClose} style={{ position: 'absolute', top: '20px', right: '20px', background: 'rgba(0,0,0,0.5)', border: 'none', borderRadius: '50%', padding: '10px', color: 'white', zIndex: 10 }}>
          <X size={24} />
        </button>
        <div style={{ position: 'absolute', bottom: '0', left: '0', right: '0', padding: '3rem 2rem 2rem', background: 'linear-gradient(transparent, rgba(10,10,15,0.9))', zIndex: 5 }}>
          <h2 style={{ fontSize: '2.5rem', margin: '0', color: 'white' }}>{place?.name || 'Loading...'}</h2>
        </div>
      </div>

      <div style={{ padding: '2.5rem' }}>
        <p style={{ fontSize: '1.2rem', color: 'var(--text)', opacity: 0.9, lineHeight: '1.6', marginBottom: '2.5rem' }}>
          {(place?.longDescription || place?.description) ? (place.longDescription || place.description + " Experience the rich heritage and scenic beauty of this remarkable destination in Tamil Nadu.") : "Loading description..."}
        </p>

        {place?.district && (
          <div style={{ display: 'inline-block', padding: '4px 12px', background: 'var(--primary)', color: 'white', borderRadius: '20px', fontSize: '0.8rem', fontWeight: '600', marginBottom: '2rem' }}>
            📍 {place.district}
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem' }}>
          <div className="glass" style={{ padding: '1.5rem', background: 'var(--glass-highlight)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--primary)', marginBottom: '10px' }}>
              <Calendar size={20} />
              <span style={{ fontWeight: 700, fontSize: '0.9rem', textTransform: 'uppercase' }}>Best Time</span>
            </div>
            <p style={{ margin: '0', fontSize: '1rem', color: 'var(--text)' }}>{place?.bestTime || 'October to March'}</p>
          </div>

          <div className="glass" style={{ padding: '1.5rem', background: 'var(--glass-highlight)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--accent)', marginBottom: '10px' }}>
              <Car size={20} />
              <span style={{ fontWeight: 700, fontSize: '0.9rem', textTransform: 'uppercase' }}>How to Reach</span>
            </div>
            <p style={{ margin: '0', fontSize: '1rem', color: 'var(--text)' }}>{place?.howToReach || 'Well connected by road and rail from major cities.'}</p>
          </div>
        </div>

        <button className="btn-primary" style={{ width: '100%', marginTop: '3rem' }} onClick={onClose}>
          Back to Explore
        </button>
      </div>
    </motion.div>
  </motion.div>
);

const Footer = ({ setScreen, setPlace, handleExplore }) => (
  <footer style={{
    marginTop: '8rem',
    background: 'linear-gradient(to top, var(--surface), transparent)',
    borderTop: '1px solid var(--glass-border)',
    padding: '4rem 0 2rem'
  }}>
    <div className="container">
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '3rem',
        marginBottom: '3rem'
      }}>
        {/* About Section */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1rem' }}>
            <Compass size={32} color="var(--primary)" />
            <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--primary)' }}>TN Guide</h3>
          </div>
          <p style={{ color: 'var(--text-muted)', lineHeight: '1.6', marginBottom: '1.5rem' }}>
            Your ultimate companion for exploring the rich cultural heritage and natural beauty of Tamil Nadu.
          </p>
          <div style={{ display: 'flex', gap: '1rem' }}>
            {[
              { icon: <Facebook size={20} />, link: '#' },
              { icon: <Twitter size={20} />, link: '#' },
              { icon: <Instagram size={20} />, link: '#' },
              { icon: <Linkedin size={20} />, link: '#' }
            ].map((social, idx) => (
              <a
                key={idx}
                href={social.link}
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  background: 'var(--glass-highlight)',
                  border: '1px solid var(--glass-border)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--text-muted)',
                  transition: 'all 0.3s ease',
                  textDecoration: 'none'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'var(--primary)';
                  e.currentTarget.style.color = 'white';
                  e.currentTarget.style.transform = 'translateY(-4px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'var(--glass-highlight)';
                  e.currentTarget.style.color = 'var(--text-muted)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                {social.icon}
              </a>
            ))}
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1.5rem', color: 'var(--text)' }}>Quick Links</h4>
          <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {['Home', 'Destinations', 'Quiz', 'About Us', 'Contact'].map((link, idx) => (
              <li key={idx}>
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    if (link === 'Home') setScreen('home');
                    else if (link === 'Quiz') setScreen('quiz');
                  }}
                  style={{
                    color: 'var(--text-muted)',
                    textDecoration: 'none',
                    transition: 'all 0.3s ease',
                    display: 'inline-block'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = 'var(--primary)';
                    e.currentTarget.style.transform = 'translateX(5px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = 'var(--text-muted)';
                    e.currentTarget.style.transform = 'translateX(0)';
                  }}
                >
                  {link}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Popular Destinations */}
        <div>
          <h4 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1.5rem', color: 'var(--text)' }}>Popular Destinations</h4>
          <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {['Chennai', 'Coimbatore', 'Madurai', 'Ooty', 'Kodaikanal'].map((dest, idx) => (
              <li key={idx}>
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    setPlace(dest);
                    handleExplore(dest);
                  }}
                  style={{
                    color: 'var(--text-muted)',
                    textDecoration: 'none',
                    transition: 'all 0.3s ease',
                    display: 'inline-block'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = 'var(--primary)';
                    e.currentTarget.style.transform = 'translateX(5px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = 'var(--text-muted)';
                    e.currentTarget.style.transform = 'translateX(0)';
                  }}
                >
                  {dest}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h4 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1.5rem', color: 'var(--text)' }}>Contact Us</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text-muted)' }}>
              <Mail size={18} color="var(--primary)" />
              <span style={{ fontSize: '0.9rem' }}>info@tnguide.com</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text-muted)' }}>
              <Phone size={18} color="var(--primary)" />
              <span style={{ fontSize: '0.9rem' }}>+91 123 456 7890</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text-muted)' }}>
              <MapPin size={18} color="var(--primary)" />
              <span style={{ fontSize: '0.9rem' }}>Chennai, Tamil Nadu, India</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div style={{
        paddingTop: '2rem',
        borderTop: '1px solid var(--glass-border)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: 0 }}>
          © 2026 TN Guide. All rights reserved. Made with ❤️ for Tamil Nadu
        </p>
        <div style={{ display: 'flex', gap: '2rem' }}>
          {['Privacy Policy', 'Terms of Service', 'Sitemap'].map((link, idx) => (
            <a
              key={idx}
              href="#"
              style={{
                color: 'var(--text-muted)',
                textDecoration: 'none',
                fontSize: '0.9rem',
                transition: 'color 0.3s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = 'var(--primary)'}
              onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
            >
              {link}
            </a>
          ))}
        </div>
      </div>
    </div>
  </footer>
);

// --- Main App Component ---

export default function App() {
  const [screen, setScreen] = useState('home');
  const [place, setPlace] = useState('Chennai');
  const [days, setDays] = useState(3);
  const [selectedData, setSelectedData] = useState(null);
  const [selectedPlaceDetail, setSelectedPlaceDetail] = useState(null);
  const [travelers, setTravelers] = useState(1);
  const [mapView, setMapView] = useState(false);
  const [isLightMode, setIsLightMode] = useState(false);
  const [maxBudget, setMaxBudget] = useState(50000);
  const [favorites, setFavorites] = useState([]);
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [sortBy, setSortBy] = useState('recommended');

  // Search State
  const [searchInput, setSearchInput] = useState('');
  const [searchAlert, setSearchAlert] = useState(null);

  useEffect(() => {
    if (isLightMode) document.documentElement.classList.add('light-mode');
    else document.documentElement.classList.remove('light-mode');
  }, [isLightMode]);

  const toggleFavorite = (placeName) => {
    setFavorites(prev =>
      prev.includes(placeName)
        ? prev.filter(name => name !== placeName)
        : [...prev, placeName]
    );
  };

  const getFilteredAndSortedPlaces = (places) => {
    if (!places) return [];

    let filtered = places;

    // Filter by category
    if (categoryFilter !== 'All') {
      filtered = filtered.filter(p => p.category?.includes(categoryFilter));
    }

    // Sort
    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return (b.rating || 0) - (a.rating || 0);
        case 'reviews':
          return (b.reviewCount || 0) - (a.reviewCount || 0);
        case 'name':
          return a.name.localeCompare(b.name);
        default: // recommended
          return 0;
      }
    });

    return sorted;
  };

  const handleExplore = (targetPlace, filterCategory = null) => {
    setScreen('places');
    setSortBy('recommended');
    setMapView(false);

    if (filterCategory) {
      setCategoryFilter(filterCategory);
      // If a specific category is requested from Home, we go Global by default
      targetPlace = 'Tamil Nadu';
    } else {
      // If Just "Explore" is clicked without specific category, we use "All"
      setCategoryFilter('All');
    }

    // Handle Global View
    if (targetPlace === 'Tamil Nadu') {
      const allPlaces = getAllPlaces();
      setSelectedData({
        name: 'Tamil Nadu',
        description: 'Showing all destinations across Tamil Nadu',
        places: allPlaces,
        mapEmbedUrl: null // or general map
      });
      setPlace('Tamil Nadu');
    } else {
      const p = targetPlace || place;
      const data = mockLocations[p] || mockLocations['Chennai'];
      setSelectedData(data);
      setPlace(p);
    }
  };

  // Improved Search Logic
  const handleSearchCommit = () => {
    if (!searchInput.trim()) {
      setSearchAlert("Please enter a destination to search.");
      setTimeout(() => setSearchAlert(null), 3000);
      return;
    }

    const query = searchInput.toLowerCase();

    // 1. Search for a District Key first (Exact or partial match)
    const matchedLocation = Object.keys(mockLocations).find(loc =>
      loc.toLowerCase().includes(query)
    );

    if (matchedLocation) {
      handleExplore(matchedLocation);
      setSearchInput('');
      return;
    }

    // 2. Search for a specific PLACE (e.g. "Marina Beach")
    // We scan all places in all districts
    let foundPlace = null;
    let foundDistrict = null;

    Object.entries(mockLocations).forEach(([district, data]) => {
      if (foundPlace) return; // specific find
      const match = data.places?.find(p => p.name.toLowerCase().includes(query));
      if (match) {
        foundPlace = match;
        foundDistrict = district;
      }
    });

    if (foundPlace && foundDistrict) {
      handleExplore(foundDistrict); // Go to that district
      // Optionally we could auto-open the detail, but going to the district is safe
      // Ideally we should maybe filter or scroll, but this is a good start.
      // Better UX: Filter the destination view to show ONLY this place or highlight it?
      // simple: just go to district.
      setSearchInput('');
      return;
    }

    // 3. No match found
    setSearchAlert(`No guide found for "${searchInput}". Try Chennai, Ooty, or Madurai.`);
    setTimeout(() => setSearchAlert(null), 3000);
  };

  return (
    <div style={{ minHeight: '100vh' }}>
      <Navbar screen={screen} setScreen={setScreen} isLightMode={isLightMode} setIsLightMode={setIsLightMode} />
      <div className="container">
        <AnimatePresence mode="wait">
          {screen === 'home' && (
            <PageTransition key="home">
              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '4rem', alignItems: 'center', marginTop: '5vh' }}>
                <div>
                  <motion.h1
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    style={{ fontSize: '5rem', lineHeight: '1.1', marginBottom: '1.5rem', color: 'var(--text)' }}
                  >
                    Experience the <span style={{ color: 'var(--primary)' }}>Spirit</span> of Tamil Nadu
                  </motion.h1>
                  <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)', marginBottom: '3rem', maxWidth: '600px' }}>
                    From the mist-covered peaks of the Western Ghats to the ancient stone carvings of Mahabalipuram, embark on a journey through India's cultural heartland.
                  </p>
                  <div style={{ display: 'flex', gap: '1.5rem' }}>
                    <button className="btn-primary" onClick={() => handleExplore('Tamil Nadu')}>
                      Start Journey <Navigation size={20} />
                    </button>
                  </div>

                </div>

                {/* Search Bar and Quick Filters */}
                <div style={{ maxWidth: '700px' }}>
                  {/* Search Bar */}
                  <div className="glass" style={{ padding: '1rem', marginBottom: '2rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <Search size={24} color="var(--primary)" />
                      <input
                        type="text"
                        placeholder="Search destinations in Tamil Nadu..."
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            handleSearchCommit();
                          }
                        }}
                        style={{
                          flex: 1,
                          background: 'var(--glass-highlight)',
                          border: 'none',
                          padding: '0.75rem 1rem',
                          fontSize: '1.1rem',
                          color: 'var(--text)',
                          fontWeight: 500,
                          outline: 'none',
                          borderRadius: '8px'
                        }}
                      />
                      <button
                        className="btn-primary"
                        style={{ padding: '0.75rem 2rem', fontSize: '1rem' }}
                        onClick={handleSearchCommit}
                      >
                        Explore
                      </button>
                    </div>
                    {searchAlert && (
                      <div style={{ marginTop: '0.8rem', color: 'var(--warning)', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <AlertTriangle size={14} /> {searchAlert}
                      </div>
                    )}
                  </div>

                  {/* Quick Category Filters */}
                  <div className="glass" style={{ padding: '2rem' }}>
                    <h4 style={{ marginBottom: '1.5rem', fontSize: '1.1rem', fontWeight: 600, color: 'var(--text)' }}>Quick Filters</h4>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '1rem' }}>
                      {[
                        { icon: <MapPin size={24} />, label: 'All Places', value: 'All' },
                        { icon: <Home size={24} />, label: 'Temples', value: 'Temple' },
                        { icon: <CloudSun size={24} />, label: 'Beaches', value: 'Beach' },
                        { icon: <Navigation size={24} />, label: 'Hill Stations', value: 'Hill Station' },
                        { icon: <Compass size={24} />, label: 'Heritage', value: 'Heritage' },
                        { icon: <Zap size={24} />, label: 'Nature', value: 'Nature' }
                      ].map((category, idx) => (
                        <motion.button
                          key={idx}
                          className="glass"
                          whileHover={{ scale: 1.05, y: -4 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => {
                            // Global filtering - switch to global view
                            handleExplore('Tamil Nadu', category.value);
                          }}
                          style={{
                            padding: '1.5rem 1rem',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: '0.75rem',
                            background: categoryFilter === category.value ? 'rgba(249, 115, 22, 0.2)' : 'var(--glass-highlight)',
                            border: categoryFilter === category.value ? '2px solid var(--primary)' : '1px solid var(--glass-border)',
                            borderRadius: '16px',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease'
                          }}
                        >
                          <div style={{ color: categoryFilter === category.value ? 'var(--primary)' : 'var(--accent)' }}>
                            {category.icon}
                          </div>
                          <span style={{
                            fontSize: '0.9rem',
                            fontWeight: 600,
                            color: categoryFilter === category.value ? 'var(--primary)' : 'var(--text)',
                            textAlign: 'center'
                          }}>
                            {category.label}
                          </span>
                        </motion.button>
                      ))}
                    </div>

                    {/* Quick Info */}
                    <div style={{ marginTop: '2rem', padding: '1.5rem', background: 'var(--glass-highlight)', borderRadius: '12px', border: '1px dashed var(--glass-border)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                        <Zap size={18} color="var(--accent)" />
                        <span style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--accent)' }}>QUICK TRAVEL INFO</span>
                      </div>
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.6' }}>
                        Tamil Nadu is best visited between October and March. Most districts are well connected by the Southern Railway and extensive bus networks.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </PageTransition>
          )}

          {screen === 'quiz' && (
            <QuizScreen setPlace={setPlace} setDays={setDays} setMaxBudget={setMaxBudget} handleExplore={handleExplore} />
          )}

          {(screen === 'places' && selectedData) && (
            <PageTransition key="places">
              <div style={{ marginBottom: '1.5rem' }}>
                <button className="btn-secondary" onClick={() => setScreen('home')} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '0.6rem 1.2rem' }}>
                  <ArrowLeft size={16} /> Back to Planner
                </button>
              </div>
              <div style={{ marginBottom: '3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                <div>
                  <h2 style={{ fontSize: '3.5rem', marginBottom: '0.5rem', color: 'var(--text)' }}>
                    {place === 'Tamil Nadu' && categoryFilter !== 'All'
                      ? `All ${categoryFilter}s in Tamil Nadu`
                      : selectedData?.name}
                  </h2>
                  <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>
                    {place === 'Tamil Nadu'
                      ? `Explore ${categoryFilter === 'All' ? 'all' : categoryFilter.toLowerCase()} destinations across Tamil Nadu`
                      : `Curated experiences for your ${days}-day venture`
                    }
                  </p>
                </div>
                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                  {selectedData?.mapEmbedUrl && (
                    <button
                      className={`btn-secondary ${mapView ? 'active' : ''}`}
                      onClick={() => setMapView(!mapView)}
                      style={{ display: 'flex', alignItems: 'center', gap: '8px', color: mapView ? 'var(--primary)' : 'white' }}
                    >
                      <Map size={18} /> {mapView ? 'Show Places' : 'Interactive Map'}
                    </button>
                  )}
                  <button className="btn-secondary" onClick={() => setScreen('cost')}>
                    <DollarSign size={18} /> Budget Calculator
                  </button>
                  <button className="btn-secondary" onClick={() => setScreen('weather')}>
                    <CloudSun size={18} /> Weather Info
                  </button>
                </div>
              </div>

              {mapView && selectedData?.mapEmbedUrl ? (
                <div className="glass" style={{ height: '600px', padding: '1rem', overflow: 'hidden', borderRadius: '24px' }}>
                  <iframe
                    src={selectedData.mapEmbedUrl}
                    width="100%"
                    height="100%"
                    style={{ border: 0, borderRadius: '16px' }}
                    allowFullScreen=""
                    loading="lazy"
                    title="District Map"
                  ></iframe>
                </div>
              ) : (
                <>
                  {/* Filter and Sort Bar */}
                  <div className="glass" style={{ padding: '1.5rem', marginBottom: '2rem', display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                      {['All', 'Temple', 'Beach', 'Hill Station', 'Heritage', 'Nature'].map(cat => (
                        <button
                          key={cat}
                          onClick={() => {
                            // If they click a category in Places view, we switch to Global Search Context
                            // EXCEPT if they are viewing a specific District, they might want to just filter that district.
                            // Requirements: "Category tabs should act as GLOBAL filters"

                            if (cat === 'All' && place !== 'Tamil Nadu') {
                              // "All" keeps us in current district, just resets filter
                              setCategoryFilter('All');
                            } else {
                              // Any specific category click -> Switch to Global View of that category
                              handleExplore('Tamil Nadu', cat);
                            }
                          }}
                          className={categoryFilter === cat ? 'filter-btn active' : 'filter-btn'}
                          style={{
                            padding: '0.5rem 1rem',
                            borderRadius: '20px',
                            border: categoryFilter === cat ? '2px solid var(--primary)' : '1px solid var(--glass-border)',
                            background: categoryFilter === cat ? 'rgba(249, 115, 22, 0.2)' : 'var(--glass-highlight)',
                            color: categoryFilter === cat ? 'var(--primary)' : 'var(--text)',
                            fontSize: '0.85rem',
                            fontWeight: 600,
                            cursor: 'pointer',
                            transition: 'all 0.3s ease'
                          }}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>

                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                      {place === 'Tamil Nadu' && (
                        <div style={{ fontSize: '0.9rem', color: 'var(--accent)', fontWeight: 600 }}>
                          Global View
                        </div>
                      )}
                      <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        style={{ padding: '0.5rem 1rem', borderRadius: '8px', fontSize: '0.9rem', color: 'var(--text)' }}
                      >
                        <option value="recommended">Recommended</option>
                        <option value="rating">Highest Rated</option>
                        <option value="reviews">Most Reviewed</option>
                        <option value="name">Alphabetical</option>
                      </select>
                    </div>
                  </div>

                  {/* Places List */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    {getFilteredAndSortedPlaces(selectedData?.places)?.map((p, idx) => (
                      <motion.div
                        key={idx}
                        className="glass place-list-item"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        style={{
                          display: 'flex',
                          gap: '1.5rem',
                          padding: '1.5rem',
                          cursor: 'pointer',
                          transition: 'all 0.3s ease',
                          position: 'relative',
                          overflow: 'hidden'
                        }}
                        whileHover={{ scale: 1.02, boxShadow: '0 20px 60px rgba(249, 115, 22, 0.3)' }}
                        onClick={() => setSelectedPlaceDetail(p)}
                      >
                        {/* Image Thumbnail */}
                        <div style={{
                          width: '250px',
                          height: '180px',
                          flexShrink: 0,
                          borderRadius: '12px',
                          overflow: 'hidden',
                          position: 'relative'
                        }}>
                          <img
                            src={p.image}
                            alt={p.name}
                            style={{
                              width: '100%',
                              height: '100%',
                              objectFit: 'cover',
                              transition: 'transform 0.3s ease'
                            }}
                            onError={(e) => { e.target.src = IMG.HERITAGE; }}
                            onMouseEnter={(e) => e.target.style.transform = 'scale(1.1)'}
                            onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                          />
                          {p.badge && (
                            <div style={{
                              position: 'absolute',
                              top: '10px',
                              left: '10px',
                              background: 'var(--primary)',
                              color: 'white',
                              padding: '0.25rem 0.75rem',
                              borderRadius: '20px',
                              fontSize: '0.75rem',
                              fontWeight: 700
                            }}>
                              {p.badge}
                            </div>
                          )}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleFavorite(p.name);
                            }}
                            style={{
                              position: 'absolute',
                              top: '10px',
                              right: '10px',
                              background: 'rgba(0,0,0,0.6)',
                              border: 'none',
                              borderRadius: '50%',
                              padding: '0.5rem',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              transition: 'all 0.3s ease'
                            }}
                          >
                            <Heart
                              size={18}
                              fill={favorites.includes(p.name) ? 'var(--primary)' : 'none'}
                              color={favorites.includes(p.name) ? 'var(--primary)' : 'white'}
                            />
                          </button>
                        </div>

                        {/* Content */}
                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <div>
                              <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', fontWeight: 700, color: 'var(--text)' }}>{p.name}</h3>
                              <StarRating rating={p.rating} reviewCount={p.reviewCount} />
                            </div>
                            {p.district && (
                              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', background: 'var(--glass-highlight)', padding: '4px 10px', borderRadius: '12px', border: '1px solid var(--glass-border)' }}>
                                {p.district}
                              </div>
                            )}
                          </div>

                          {/* Categories */}
                          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                            {p.category?.map((cat, i) => (
                              <span
                                key={i}
                                style={{
                                  fontSize: '0.75rem',
                                  padding: '0.25rem 0.75rem',
                                  borderRadius: '12px',
                                  background: 'var(--glass-highlight)',
                                  color: 'var(--accent)',
                                  border: '1px solid var(--glass-border)',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '0.25rem'
                                }}
                              >
                                <Tag size={12} /> {cat}
                              </span>
                            ))}
                          </div>

                          <p style={{
                            color: 'var(--text-muted)',
                            fontSize: '0.95rem',
                            lineHeight: '1.6',
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden'
                          }}>
                            {p.description}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </>
              )}
              {selectedPlaceDetail && (
                <DetailModal place={selectedPlaceDetail} onClose={() => setSelectedPlaceDetail(null)} />
              )}
            </PageTransition>
          )}

          {/* Fallback/Other Screens (Cost, Weather - Placeholder logic from original, reused screen states) */}
// ... imports at the top need to include the new components
          // I will do imports in a separate replacement chunk for clarity and safety in locating lines.
          // This chunk focuses on the render logic replacement.

          {screen === 'cost' && (
            <PageTransition key="cost">
              <BudgetCalculator
                initialDestination={place === 'Tamil Nadu' ? 'Chennai' : place}
                initialDays={days}
                onBack={() => setScreen('places')}
              />
            </PageTransition>
          )}

          {screen === 'weather' && (
            <PageTransition key="weather">
              <WeatherInfo
                initialPlace={place === 'Tamil Nadu' ? 'Chennai' : place}
                onBack={() => setScreen('places')}
              />
            </PageTransition>
          )}

        </AnimatePresence>
      </div>
      <Footer setScreen={setScreen} setPlace={setPlace} handleExplore={handleExplore} />
    </div>
  );
}
