import React, { useState, useEffect, useRef } from 'react';
import { Home, MapPin, DollarSign, CloudSun, ChevronRight, Compass, Navigation, Zap, X, Info, Car, Calendar, ArrowLeft, Map, Sun, Moon, Trophy, AlertTriangle, CheckCircle, Heart, Share2, Clock, Tag, Search, Filter, Users, Calendar as CalendarIcon, Mail, Phone, Facebook, Twitter, Instagram, Linkedin, Github, TreePine } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { mockLocations, IMG } from './supabase';
import { StarRating } from './components/StarRating';

const findSearchMatch = (query) => {
  if (!query) return null;
  const lowerQuery = query.toLowerCase().trim();

  // 1. Direct District Match (Exact)
  const exactDistrict = Object.keys(mockLocations).find(key => key.toLowerCase() === lowerQuery);
  if (exactDistrict) return { type: 'district', districtKey: exactDistrict };

  // 2. Search through all data
  for (const [key, data] of Object.entries(mockLocations)) {
    // Partial District Name Match
    if (key.toLowerCase().includes(lowerQuery)) {
      return { type: 'district', districtKey: key };
    }
    // Place Name Match
    const placeMatch = data.places.find(p => p.name.toLowerCase().includes(lowerQuery));
    if (placeMatch) {
      return { type: 'place', districtKey: key, placeData: placeMatch };
    }
  }
  return null;
};

const Toast = ({ message, onClose }) => (
  <motion.div
    initial={{ opacity: 0, y: -50, x: '-50%' }}
    animate={{ opacity: 1, y: 20, x: '-50%' }}
    exit={{ opacity: 0, y: -50, x: '-50%' }}
    style={{
      position: 'fixed',
      top: '0',
      left: '50%',
      zIndex: 1000,
      background: 'rgba(220, 38, 38, 0.9)',
      color: 'white',
      padding: '1rem 2rem',
      borderRadius: '30px',
      backdropFilter: 'blur(10px)',
      boxShadow: '0 10px 30px rgba(220, 38, 38, 0.3)',
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      fontWeight: 600
    }}
  >
    <AlertTriangle size={20} />
    {message}
    <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'white', marginLeft: '10px', cursor: 'pointer' }}>
      <X size={18} />
    </button>
  </motion.div>
);

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
  const [quizScore, setQuizScore] = useState({ budget: 0, duration: 0, interest: '' });
  const [favorites, setFavorites] = useState([]);
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [sortBy, setSortBy] = useState('recommended');
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setSuggestions([]);
      return;
    }

    const lowerQuery = searchQuery.toLowerCase().trim();
    const newSuggestions = [];

    Object.entries(mockLocations).forEach(([key, data]) => {
      // District Match
      if (key.toLowerCase().includes(lowerQuery)) {
        newSuggestions.push({ type: 'District', name: key });
      }
      // Places Match
      data.places.forEach(p => {
        if (p.name.toLowerCase().includes(lowerQuery)) {
          newSuggestions.push({ type: 'Place', name: p.name, district: key });
        }
      });
    });

    setSuggestions(newSuggestions.slice(0, 5)); // Limit to 5 suggestions
  }, [searchQuery]);

  const showNotification = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

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

  const handleExplore = (targetInput) => {
    let match = null;
    const queryToUse = targetInput || searchQuery;

    if (queryToUse) {
      match = findSearchMatch(queryToUse);
    }
    // Fallback to current default 'place' if valid and no search query
    else if (!queryToUse && place && mockLocations[place]) {
      match = { type: 'district', districtKey: place };
    }

    if (!match) {
      showNotification("Result not found. Try another destination!");
      return;
    }

    setSuggestions([]); // Clear suggestions logic
    if (targetInput) setSearchQuery(targetInput); // Update input to match selection

    // Apply Logic
    if (match.type === 'district') {
      setPlace(match.districtKey);
      setSelectedData(mockLocations[match.districtKey]);
      setMapView(false);
      setCategoryFilter('All');
      setSortBy('recommended');
      setScreen('places');
      setSelectedPlaceDetail(null); // Clear any previous modal
    } else if (match.type === 'place') {
      setPlace(match.districtKey);
      setSelectedData(mockLocations[match.districtKey]);
      setMapView(false);
      setCategoryFilter('All');
      setSortBy('recommended');
      setScreen('places');
      setTimeout(() => setSelectedPlaceDetail(match.placeData), 100); // Slight delay for smooth transition
    }
  };

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

  const Navbar = () => (
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
          style={{ width: '40px', height: '40px', padding: '0', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', color: 'var(--primary)', cursor: 'pointer', background: 'rgba(255,255,255,0.05)' }}
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

  const QuizScreen = () => {
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
          <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Destination Matcher</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '3rem' }}>Question {step + 1} of {questions.length}</p>
          <h3 style={{ fontSize: '1.8rem', marginBottom: '3rem' }}>{questions[step].q}</h3>
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
            <h2 style={{ fontSize: '2.5rem', margin: '0' }}>{place?.name || 'Loading...'}</h2>
          </div>
        </div>

        <div style={{ padding: '2.5rem' }}>
          <p style={{ fontSize: '1.2rem', color: 'white', opacity: 0.9, lineHeight: '1.6', marginBottom: '2.5rem' }}>
            {(place?.longDescription || place?.description) ? (place.longDescription || place.description + " Experience the rich heritage and scenic beauty of this remarkable destination in Tamil Nadu.") : "Loading description..."}
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem' }}>
            <div className="glass" style={{ padding: '1.5rem', background: 'rgba(255,255,255,0.03)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--primary)', marginBottom: '10px' }}>
                <Calendar size={20} />
                <span style={{ fontWeight: 700, fontSize: '0.9rem', textTransform: 'uppercase' }}>Best Time</span>
              </div>
              <p style={{ margin: '0', fontSize: '1rem' }}>{place?.bestTime || 'October to March'}</p>
            </div>

            <div className="glass" style={{ padding: '1.5rem', background: 'rgba(255,255,255,0.03)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--accent)', marginBottom: '10px' }}>
                <Car size={20} />
                <span style={{ fontWeight: 700, fontSize: '0.9rem', textTransform: 'uppercase' }}>How to Reach</span>
              </div>
              <p style={{ margin: '0', fontSize: '1rem' }}>{place?.howToReach || 'Well connected by road and rail from major cities.'}</p>
            </div>
          </div>

          <button className="btn-primary" style={{ width: '100%', marginTop: '3rem' }} onClick={onClose}>
            Back to Explore
          </button>
        </div>
      </motion.div>
    </motion.div>
  );

  const Footer = () => (
    <footer style={{
      marginTop: '8rem',
      background: 'linear-gradient(to top, rgba(2, 6, 23, 0.95), transparent)',
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
                    background: 'rgba(255,255,255,0.05)',
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
                    e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
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
            <h4 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1.5rem', color: 'white' }}>Quick Links</h4>
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
            <h4 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1.5rem', color: 'white' }}>Popular Destinations</h4>
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
            <h4 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1.5rem', color: 'white' }}>Contact Us</h4>
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

  return (
    <div style={{ minHeight: '100vh' }}>
      <Navbar />
      <AnimatePresence>
        {notification && <Toast message={notification} onClose={() => setNotification(null)} />}
      </AnimatePresence>
      <div className="container">
        <AnimatePresence mode="wait">
          {screen === 'home' && (
            <PageTransition key="home">
              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '4rem', alignItems: 'center', marginTop: '5vh' }}>
                <div>
                  <motion.h1
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    style={{ fontSize: '5rem', lineHeight: '1.1', marginBottom: '1.5rem', color: 'white' }}
                  >
                    Experience the <span style={{ color: 'var(--primary)' }}>Spirit</span> of Tamil Nadu
                  </motion.h1>
                  <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)', marginBottom: '3rem', maxWidth: '600px' }}>
                    From the mist-covered peaks of the Western Ghats to the ancient stone carvings of Mahabalipuram, embark on a journey through India's cultural heartland.
                  </p>
                  <div style={{ display: 'flex', gap: '1.5rem' }}>
                    <button className="btn-primary" onClick={() => handleExplore()}>
                      Start Journey <Navigation size={20} />
                    </button>
                  </div>

                </div>

                {/* Search Bar and Quick Filters */}
                <div style={{ maxWidth: '700px' }}>
                  {/* Search Bar */}
                  <div className="glass" style={{ padding: '1rem', marginBottom: '2rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', position: 'relative' }}>
                      <Search size={24} color="var(--primary)" />
                      <div style={{ flex: 1, position: 'relative' }}>
                        <input
                          type="text"
                          placeholder="Search destinations in Tamil Nadu..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          style={{
                            width: '100%',
                            background: 'rgba(255,255,255,0.05)',
                            border: 'none',
                            padding: '0.75rem 1rem',
                            fontSize: '1.1rem',
                            color: 'white',
                            fontWeight: 500,
                            outline: 'none',
                            borderRadius: '8px'
                          }}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              handleExplore();
                            }
                          }}
                        />
                        {/* Search Suggestions Dropdown */}
                        <AnimatePresence>
                          {suggestions.length > 0 && (
                            <motion.ul
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: 10 }}
                              style={{
                                position: 'absolute',
                                top: '100%',
                                left: 0,
                                right: 0,
                                background: 'rgba(20, 20, 30, 0.95)',
                                backdropFilter: 'blur(10px)',
                                borderRadius: '0 0 12px 12px',
                                marginTop: '5px',
                                padding: '0.5rem 0',
                                listStyle: 'none',
                                zIndex: 100,
                                border: '1px solid var(--glass-border)',
                                boxShadow: '0 10px 25px rgba(0,0,0,0.5)'
                              }}
                            >
                              {suggestions.map((s, i) => (
                                <li
                                  key={i}
                                  onClick={() => handleExplore(s.name)}
                                  style={{
                                    padding: '0.75rem 1.5rem',
                                    cursor: 'pointer',
                                    borderBottom: i !== suggestions.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    color: 'white',
                                    transition: 'background 0.2s'
                                  }}
                                  onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
                                  onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                                >
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    {s.type === 'District' ? <MapPin size={16} color="var(--primary)" /> : <TreePine size={16} color="var(--accent)" />}
                                    <span>{s.name}</span>
                                  </div>
                                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>{s.type}</span>
                                </li>
                              ))}
                            </motion.ul>
                          )}
                        </AnimatePresence>
                      </div>
                      <button
                        className="btn-primary"
                        style={{ padding: '0.75rem 2rem', fontSize: '1rem' }}
                        onClick={() => handleExplore()}
                      >
                        Explore
                      </button>
                    </div>
                  </div>

                  {/* Quick Category Filters */}
                  <div className="glass" style={{ padding: '2rem' }}>
                    <h4 style={{ marginBottom: '1.5rem', fontSize: '1.1rem', fontWeight: 600 }}>Quick Filters</h4>
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
                            setCategoryFilter(category.value);
                            setPlace('Chennai');
                            handleExplore('Chennai');
                          }}
                          style={{
                            padding: '1.5rem 1rem',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: '0.75rem',
                            background: categoryFilter === category.value ? 'rgba(249, 115, 22, 0.2)' : 'rgba(255,255,255,0.03)',
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
                            color: categoryFilter === category.value ? 'var(--primary)' : 'white',
                            textAlign: 'center'
                          }}>
                            {category.label}
                          </span>
                        </motion.button>
                      ))}
                    </div>

                    {/* Quick Info */}
                    <div style={{ marginTop: '2rem', padding: '1.5rem', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', border: '1px dashed var(--glass-border)' }}>
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

          {(screen === 'places' && selectedData) && (
            <PageTransition key="places">
              <div style={{ marginBottom: '1.5rem' }}>
                <button className="btn-secondary" onClick={() => setScreen('home')} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '0.6rem 1.2rem' }}>
                  <ArrowLeft size={16} /> Back to Planner
                </button>
              </div>
              <div style={{ marginBottom: '3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                <div>
                  <h2 style={{ fontSize: '3.5rem', marginBottom: '0.5rem' }}>{selectedData?.name}</h2>
                  <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>Curated experiences for your {days}-day venture</p>
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
                          onClick={() => setCategoryFilter(cat)}
                          className={categoryFilter === cat ? 'filter-btn active' : 'filter-btn'}
                          style={{
                            padding: '0.5rem 1rem',
                            borderRadius: '20px',
                            border: categoryFilter === cat ? '2px solid var(--primary)' : '1px solid var(--glass-border)',
                            background: categoryFilter === cat ? 'rgba(249, 115, 22, 0.2)' : 'rgba(255,255,255,0.05)',
                            color: categoryFilter === cat ? 'var(--primary)' : 'white',
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
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      style={{ padding: '0.5rem 1rem', borderRadius: '8px', fontSize: '0.9rem' }}
                    >
                      <option value="recommended">Recommended</option>
                      <option value="rating">Highest Rated</option>
                      <option value="reviews">Most Reviewed</option>
                      <option value="name">Alphabetical</option>
                    </select>
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
                          <div>
                            <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', fontWeight: 700 }}>{p.name}</h3>
                            <StarRating rating={p.rating} reviewCount={p.reviewCount} />
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
                                  background: 'rgba(255,255,255,0.1)',
                                  color: 'var(--accent)',
                                  border: '1px solid rgba(255,255,255,0.2)',
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

                          {/* Quick Info */}
                          <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                              <Clock size={14} />
                              <span>{p.duration}</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                              <DollarSign size={14} />
                              <span>{p.entryFee}</span>
                            </div>
                          </div>

                          {/* Action Buttons */}
                          <div style={{ display: 'flex', gap: '1rem', marginTop: 'auto' }}>
                            <button
                              className="btn-primary"
                              style={{ padding: '0.5rem 1.5rem', fontSize: '0.9rem' }}
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedPlaceDetail(p);
                              }}
                            >
                              View Details <ChevronRight size={16} />
                            </button>
                            <button
                              className="btn-secondary"
                              style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}
                              onClick={(e) => {
                                e.stopPropagation();
                                navigator.clipboard.writeText(`Check out ${p.name} in ${selectedData.name}!`);
                              }}
                            >
                              <Share2 size={16} />
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  <div className="glass" style={{ marginTop: '4rem', padding: '3rem' }}>
                    <h2 style={{ marginBottom: '2.5rem' }}>Suggested Itinerary</h2>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '3rem' }}>
                      {Array.from({ length: Math.min(days, 3) }).map((_, i) => (
                        <div key={i} style={{ borderLeft: '3px solid var(--primary)', paddingLeft: '2rem' }}>
                          <h4 style={{ color: 'var(--primary)', textTransform: 'uppercase', fontSize: '0.85rem', letterSpacing: '2px', marginBottom: '0.5rem' }}>Day 0{i + 1}</h4>
                          <h3 style={{ marginBottom: '1rem', fontSize: '1.5rem' }}>{i === 0 ? 'Arrival & Discovery' : i === 1 ? 'Nature & Landscapes' : 'Heritage Walk'}</h3>
                          <p style={{ color: 'var(--text-muted)', fontSize: '1rem', lineHeight: '1.6' }}>
                            Visit the {selectedData?.places?.[i % (selectedData?.places?.length || 1)]?.name || 'Main Attraction'} in the morning. Explore local markets and enjoy authentic Tamil cuisine in the evening.
                          </p>
                        </div>
                      ))}
                      {days > 3 && (
                        <div style={{ borderLeft: '3px solid var(--accent)', paddingLeft: '2rem', opacity: 0.7 }}>
                          <h4 style={{ color: 'var(--accent)', textTransform: 'uppercase', fontSize: '0.85rem', letterSpacing: '2px', marginBottom: '0.5rem' }}>Day 04+</h4>
                          <h3 style={{ marginBottom: '1rem', fontSize: '1.5rem' }}>Extended Exploration</h3>
                          <p style={{ color: 'var(--text-muted)', fontSize: '1rem', lineHeight: '1.6' }}>Relax at your leisure or revisit your favorite spots from the first few days. Consider exploring nearby rural villages for a deeper experience.</p>
                        </div>
                      )}
                    </div>
                  </div>
                </>
              )}
            </PageTransition>
          )}

          {(screen === 'cost' && selectedData) && (
            <PageTransition key="cost">
              <div className="glass" style={{ padding: '4rem', maxWidth: '800px', margin: '2rem auto' }}>
                <div style={{ marginBottom: '2rem' }}>
                  <button className="btn-secondary" onClick={() => setScreen('places')} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '0.6rem 1.2rem' }}>
                    <ArrowLeft size={16} /> Back to Places
                  </button>
                </div>
                <h2 style={{ marginBottom: '1rem', textAlign: 'center', fontSize: '2.5rem' }}>Travel Budget Calculator</h2>
                <p style={{ color: 'var(--text-muted)', textAlign: 'center', marginBottom: '3rem' }}>Dynamic cost estimation for {selectedData.name}</p>

                <div className="glass" style={{ padding: '2rem', marginBottom: '3rem', background: 'rgba(255,255,255,0.02)', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Trip Duration</label>
                    <select value={days} onChange={(e) => setDays(parseInt(e.target.value))}>
                      {[1, 2, 3, 4, 5, 6, 7].map(d => (
                        <option key={d} value={d}>{d} {d === 1 ? 'Day' : 'Days'}</option>
                      ))}
                    </select>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Max Budget (₹)</label>
                    <input
                      type="number"
                      value={maxBudget}
                      onChange={(e) => setMaxBudget(parseInt(e.target.value) || 0)}
                      placeholder="Enter limit"
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                  {(() => {
                    const total = (selectedData.travelCost * travelers) + (days * selectedData.stayCostPerDay * Math.ceil(travelers / 2)) + (days * selectedData.foodCostPerDay * travelers);
                    const overBudget = total > maxBudget;
                    return (
                      <>
                        {maxBudget > 0 && (
                          <div className={`budget-alert ${overBudget ? 'alert-warning' : 'alert-success'}`}>
                            {overBudget ? <AlertTriangle size={18} /> : <CheckCircle size={18} />}
                            {overBudget
                              ? `Wait! Your estimate is ₹${(total - maxBudget).toLocaleString()} over your selected budget.`
                              : `Great! This plan fits perfectly within your ₹${maxBudget.toLocaleString()} budget.`}
                          </div>
                        )}
                      </>
                    );
                  })()}
                  {[
                    { label: 'Travel Expenses', value: selectedData.travelCost * travelers, sub: `₹${selectedData.travelCost} per person`, icon: <Navigation size={20} /> },
                    { label: `Accommodation (${days} nights)`, value: days * selectedData.stayCostPerDay * (Math.ceil(travelers / 2)), sub: `Assuming twin sharing @ ₹${selectedData.stayCostPerDay}/room`, icon: <Home size={20} /> },
                    { label: `Food & Dining`, value: days * (selectedData.foodCostPerDay * travelers), sub: `₹${selectedData.foodCostPerDay} per person/day`, icon: <Zap size={20} /> }
                  ].map((item, id) => (
                    <div key={id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '1.5rem', borderBottom: '1px solid var(--glass-border)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                        <div style={{ padding: '10px', background: 'rgba(255,255,255,0.05)', borderRadius: '12px', color: 'var(--primary)' }}>{item.icon}</div>
                        <div>
                          <span style={{ fontSize: '1.1rem', fontWeight: 500, display: 'block' }}>{item.label}</span>
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{item.sub}</span>
                        </div>
                      </div>
                      <span style={{ fontSize: '1.2rem', fontWeight: 700 }}>₹{item.value.toLocaleString()}</span>
                    </div>
                  ))}

                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '2.5rem', background: 'linear-gradient(90deg, rgba(249, 115, 22, 0.1), transparent)', borderRadius: '24px', border: '1px solid var(--primary)', marginTop: '1.5rem' }}>
                    <div>
                      <span style={{ fontSize: '1.1rem', color: 'var(--text-muted)', display: 'block' }}>Total Estimate</span>
                      <span style={{ fontSize: '2.8rem', fontWeight: 800, color: 'var(--primary)' }}>
                        ₹{((selectedData.travelCost * travelers) + (days * selectedData.stayCostPerDay * Math.ceil(travelers / 2)) + (days * selectedData.foodCostPerDay * travelers)).toLocaleString()}
                      </span>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                      <button className="btn-primary" style={{ padding: '1rem 2.5rem' }}>Get Full Quote</button>
                    </div>
                  </div>
                </div>

                <button className="btn-secondary" onClick={() => setScreen('places')} style={{ width: '100%', marginTop: '3.5rem' }}>
                  Return to Exploration
                </button>
              </div>
            </PageTransition>
          )}

          {(screen === 'weather' && selectedData) && (
            <PageTransition key="weather">
              <div className="glass" style={{ padding: '4rem 3rem', maxWidth: '900px', margin: '3rem auto', textAlign: 'center' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
                  <button className="btn-secondary" onClick={() => setScreen('places')} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '0.6rem 1.2rem' }}>
                    <ArrowLeft size={16} /> Back
                  </button>
                  <h4 style={{ color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '3px', margin: '0' }}>Weekly Outlook</h4>
                  <div style={{ width: '100px' }}></div> {/* Spacer */}
                </div>

                <h2 style={{ marginBottom: '2rem', fontSize: '3rem' }}>{selectedData.name} Sky</h2>

                <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '4rem', alignItems: 'center', marginBottom: '4rem' }}>
                  <div className="glass" style={{ padding: '3rem', background: 'rgba(255,255,255,0.02)' }}>
                    <div style={{ position: 'relative', display: 'inline-block' }}>
                      <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '150px', height: '150px', background: 'var(--primary)', filter: 'blur(60px)', opacity: 0.2, borderRadius: '50%' }}></div>
                      <CloudSun size={100} color="var(--primary)" style={{ position: 'relative' }} />
                    </div>
                    <div style={{ fontSize: '5rem', fontWeight: 800, margin: '1rem 0', color: 'white' }}>{selectedData?.weather?.temp || '--'}°</div>
                    <div style={{ fontSize: '1.5rem', color: 'var(--text-muted)' }}>{selectedData?.weather?.condition || '--'}</div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    {selectedData?.weatherRecommendations && (
                      <div className="glass" style={{ padding: '2rem', background: 'rgba(249, 115, 22, 0.1)', border: '1px solid var(--primary)', marginBottom: '1rem' }}>
                        <Zap size={24} color="var(--primary)" style={{ marginBottom: '1rem' }} />
                        <span style={{ display: 'block', color: 'var(--primary)', fontWeight: 800, fontSize: '0.8rem', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Travel Recommendation</span>
                        <p style={{ margin: 0, fontSize: '1.1rem', fontWeight: 600 }}>
                          {selectedData.weatherRecommendations[selectedData.weather.condition] || "Enjoy the beautiful sights of the city!"}
                        </p>
                      </div>
                    )}
                    <div className="glass" style={{ padding: '2rem', background: 'rgba(255,255,255,0.03)', textAlign: 'left' }}>
                      <span style={{ display: 'block', color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '0.5rem', textTransform: 'uppercase' }}>Humidity</span>
                      <span style={{ fontSize: '2rem', fontWeight: 700 }}>64%</span>
                    </div>
                    <div className="glass" style={{ padding: '2rem', background: 'rgba(255,255,255,0.03)', textAlign: 'left' }}>
                      <span style={{ display: 'block', color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '0.5rem', textTransform: 'uppercase' }}>Wind Speed</span>
                      <span style={{ fontSize: '2rem', fontWeight: 700 }}>12 km/h</span>
                    </div>
                  </div>
                </div>

                <div style={{ marginTop: '4rem' }}>
                  <h3 style={{ textAlign: 'left', marginBottom: '2rem', fontSize: '1.8rem' }}>7-Day Forecast</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '1rem', overflowX: 'auto', paddingBottom: '1rem' }}>
                    {selectedData?.weather?.forecast?.map((f, i) => (
                      <div key={i} className="glass" style={{ padding: '1.5rem 1rem', background: i === 0 ? 'rgba(249, 115, 22, 0.1)' : 'rgba(255,255,255,0.02)', border: i === 0 ? '1px solid var(--primary)' : '1px solid var(--glass-border)' }}>
                        <span style={{ display: 'block', fontSize: '0.9rem', fontWeight: 700, marginBottom: '1rem', color: i === 0 ? 'var(--primary)' : 'var(--text-muted)' }}>{f.day}</span>
                        <CloudSun size={24} style={{ marginBottom: '1rem', color: i === 0 ? 'var(--primary)' : 'white' }} />
                        <span style={{ display: 'block', fontSize: '1.4rem', fontWeight: 800 }}>{f.temp}°</span>
                        <span style={{ display: 'block', fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.5rem', whiteSpace: 'nowrap' }}>{f.condition}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {selectedData?.tourismDetails && (
                  <div style={{ marginTop: '5rem', textAlign: 'left' }}>
                    <div className="glass" style={{ padding: '3rem', marginBottom: '3rem' }}>
                      <h3 style={{ fontSize: '2rem', marginBottom: '1.5rem', color: 'var(--primary)' }}>Best Time to Visit</h3>
                      <p style={{ fontSize: '1.1rem', lineHeight: '1.7', color: 'white', opacity: 0.9 }}>
                        {selectedData.tourismDetails.bestTimeToVisit}
                      </p>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem', marginBottom: '4rem' }}>
                      {selectedData.tourismDetails.seasons.map((season, idx) => (
                        <div key={idx} className="glass" style={{ padding: '2rem' }}>
                          <h4 style={{ color: 'var(--accent)', marginBottom: '1rem', fontSize: '1.2rem' }}>{season.name}</h4>
                          <div style={{ fontWeight: 700, fontSize: '1.5rem', marginBottom: '0.5rem' }}>{season.temp}</div>
                          <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>{season.description}</p>
                        </div>
                      ))}
                    </div>

                    <div className="glass" style={{ padding: '3rem', marginBottom: '4rem' }}>
                      <h3 style={{ fontSize: '2rem', marginBottom: '2.5rem' }}>Cultural Celebrations</h3>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                        {selectedData.tourismDetails.festivals.map((fest, idx) => (
                          <div key={idx} style={{ display: 'grid', gridTemplateColumns: '150px 1fr', gap: '2rem', alignItems: 'start' }}>
                            <div style={{ fontWeight: 800, color: 'var(--primary)', textTransform: 'uppercase', fontSize: '0.9rem', letterSpacing: '1px' }}>{fest.month}</div>
                            <div>
                              <div style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '0.5rem' }}>{fest.name}</div>
                              <p style={{ color: 'var(--text-muted)', fontSize: '1rem' }}>{fest.description}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem', alignItems: 'start' }}>
                      <div className="glass" style={{ padding: '2.5rem' }}>
                        <h3 style={{ fontSize: '1.8rem', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <Navigation size={24} color="var(--primary)" /> Travel Essentials
                        </h3>
                        <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                          {selectedData.tourismDetails.travelTips.map((tip, idx) => (
                            <li key={idx} style={{ display: 'flex', gap: '12px', fontSize: '1rem', color: 'white', opacity: 0.85 }}>
                              <span style={{ color: 'var(--primary)', fontWeight: 900 }}>•</span> {tip}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="glass" style={{ padding: '2.5rem', background: 'rgba(249, 115, 22, 0.05)' }}>
                        <h3 style={{ fontSize: '1.8rem', marginBottom: '1.5rem' }}>Rainfall Pattern</h3>
                        <p style={{ fontSize: '1.1rem', lineHeight: '1.7', color: 'var(--text-muted)' }}>
                          {selectedData.tourismDetails.rainfall}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                <button className="btn-primary" onClick={() => setScreen('places')} style={{ width: '100%', marginTop: '5rem' }}>
                  Return to Exploration
                </button>
              </div>
            </PageTransition>
          )}
          {screen === 'quiz' && <QuizScreen />}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {selectedPlaceDetail && (
          <DetailModal
            place={selectedPlaceDetail}
            onClose={() => setSelectedPlaceDetail(null)}
          />
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
}

