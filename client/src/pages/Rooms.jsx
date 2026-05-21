import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { FiSearch, FiFilter, FiX } from 'react-icons/fi';
import RoomCard from '../components/home/RoomCard';
import Spinner from '../components/shared/Spinner';

const AMENITIES_LIST = [
  "Whiteboard", "Projector", "Wi-Fi", "Power Outlets", "Quiet Zone", "Air Conditioning"
];

const Rooms = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter & Search states
  const [searchQuery, setSearchQuery] = useState("");
  const [activeSearch, setActiveSearch] = useState("");
  
  const [selectedAmenities, setSelectedAmenities] = useState([]);
  const [minRate, setMinRate] = useState("");
  const [maxRate, setMaxRate] = useState("");
  
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    document.title = "StudyNook – Available Rooms";
  }, []);

  useEffect(() => {
    fetchRooms();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeSearch, selectedAmenities, minRate, maxRate]);

  const fetchRooms = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      
      // Build query params
      const params = new URLSearchParams();
      if (activeSearch) params.append('search', activeSearch);
      if (selectedAmenities.length > 0) params.append('amenities', selectedAmenities.join(','));
      if (minRate) params.append('minRate', minRate);
      if (maxRate) params.append('maxRate', maxRate);

      const response = await axios.get(`${apiUrl}/rooms?${params.toString()}`);
      setRooms(response.data);
    } catch (err) {
      console.error("Error fetching rooms:", err);
      setError("Failed to fetch rooms. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setActiveSearch(searchQuery);
  };

  const handleAmenityToggle = (amenity) => {
    setSelectedAmenities(prev => 
      prev.includes(amenity)
        ? prev.filter(a => a !== amenity)
        : [...prev, amenity]
    );
  };

  const clearFilters = () => {
    setSearchQuery("");
    setActiveSearch("");
    setSelectedAmenities([]);
    setMinRate("");
    setMaxRate("");
  };

  return (
    <div className="container py-8" style={{ minHeight: '80vh' }}>
      
      {/* Page Header */}
      <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
        <h1 style={{
          fontFamily: 'Outfit, sans-serif',
          fontSize: 'clamp(2rem, 4vw, 3rem)',
          fontWeight: 800,
          marginBottom: '0.5rem',
          background: 'linear-gradient(90deg, var(--primary) 0%, #8B5CF6 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          Find a Study Space
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>
          Browse all available rooms, filter by your needs, and book instantly.
        </p>
      </div>

      {/* Search and Filters Bar */}
      <div style={{
        backgroundColor: 'var(--surface)',
        borderRadius: '16px',
        padding: '1.5rem',
        marginBottom: '2.5rem',
        border: '1px solid var(--border)',
        boxShadow: '0 4px 20px rgba(0,0,0,0.03)'
      }}>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
        }}>
          {/* Top Row: Search bar & Filter Toggle */}
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '1rem',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            {/* Search Form */}
            <form onSubmit={handleSearchSubmit} style={{
              display: 'flex',
              flexGrow: 1,
              maxWidth: '600px',
              position: 'relative'
            }}>
              <input
                type="text"
                className="form-control"
                placeholder="Search rooms by name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  paddingLeft: '2.5rem',
                  paddingRight: '6rem',
                  height: '48px',
                  borderRadius: '12px'
                }}
              />
              <FiSearch style={{
                position: 'absolute',
                left: '1rem',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--text-muted)'
              }} size={20} />
              <button 
                type="submit" 
                className="btn btn-primary"
                style={{
                  position: 'absolute',
                  right: '4px',
                  top: '4px',
                  bottom: '4px',
                  padding: '0 1.5rem',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                Search
              </button>
            </form>

            {/* Filter Toggle Button */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="btn btn-outline"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                height: '48px',
                borderRadius: '12px',
                borderColor: showFilters ? 'var(--primary)' : 'var(--border)',
                color: showFilters ? 'var(--primary)' : 'var(--text-main)'
              }}
            >
              <FiFilter />
              {showFilters ? 'Hide Filters' : 'Advanced Filters'}
            </button>
          </div>

          {/* Expandable Filters Section */}
          <motion.div
            initial={false}
            animate={{ 
              height: showFilters ? 'auto' : 0,
              opacity: showFilters ? 1 : 0,
              marginTop: showFilters ? '1rem' : 0
            }}
            style={{ overflow: 'hidden' }}
          >
            <div style={{
              paddingTop: '1rem',
              borderTop: '1px solid var(--border)',
              display: 'flex',
              flexWrap: 'wrap',
              gap: '2rem'
            }}>
              {/* Amenities Filter */}
              <div style={{ flex: '1 1 300px' }}>
                <h4 style={{ marginBottom: '0.75rem', fontSize: '0.95rem', fontWeight: 600 }}>Filter by Amenities</h4>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  {AMENITIES_LIST.map(amenity => (
                    <button
                      key={amenity}
                      onClick={() => handleAmenityToggle(amenity)}
                      style={{
                        padding: '6px 12px',
                        borderRadius: '20px',
                        fontSize: '0.85rem',
                        fontWeight: 500,
                        border: '1px solid',
                        borderColor: selectedAmenities.includes(amenity) ? 'var(--primary)' : 'var(--border)',
                        backgroundColor: selectedAmenities.includes(amenity) ? 'rgba(13, 148, 136, 0.1)' : 'transparent',
                        color: selectedAmenities.includes(amenity) ? 'var(--primary)' : 'var(--text-muted)',
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                      }}
                    >
                      {amenity}
                    </button>
                  ))}
                </div>
              </div>

              {/* Hourly Rate Filter */}
              <div style={{ flex: '1 1 200px' }}>
                <h4 style={{ marginBottom: '0.75rem', fontSize: '0.95rem', fontWeight: 600 }}>Hourly Rate Range ($)</h4>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <input 
                    type="number" 
                    placeholder="Min" 
                    className="form-control"
                    value={minRate}
                    onChange={(e) => setMinRate(e.target.value)}
                    min="0"
                    style={{ width: '90px' }}
                  />
                  <span style={{ color: 'var(--text-muted)' }}>—</span>
                  <input 
                    type="number" 
                    placeholder="Max" 
                    className="form-control"
                    value={maxRate}
                    onChange={(e) => setMaxRate(e.target.value)}
                    min="0"
                    style={{ width: '90px' }}
                  />
                </div>
              </div>

              {/* Clear Filters */}
              <div style={{ display: 'flex', alignItems: 'flex-end' }}>
                <button
                  onClick={clearFilters}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    color: 'var(--danger)',
                    background: 'none',
                    border: 'none',
                    fontWeight: 500,
                    cursor: 'pointer',
                    padding: '8px'
                  }}
                >
                  <FiX /> Clear All Filters
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Main Content Area */}
      {loading ? (
        <Spinner />
      ) : error ? (
        <div style={{ textAlign: 'center', color: 'var(--danger)', padding: '2rem' }}>
          {error}
        </div>
      ) : rooms.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{
            textAlign: 'center',
            padding: '5rem 2rem',
            backgroundColor: 'var(--surface)',
            borderRadius: '24px',
            border: '1px dashed var(--border)'
          }}
        >
          <div style={{ fontSize: '4rem', marginBottom: '1rem', opacity: 0.5 }}>🔍</div>
          <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', color: 'var(--text-main)' }}>No rooms found</h3>
          <p style={{ color: 'var(--text-muted)' }}>We couldn't find any rooms matching your current filters and search criteria.</p>
          <button 
            onClick={clearFilters}
            className="btn btn-outline mt-4"
          >
            Clear Filters
          </button>
        </motion.div>
      ) : (
        <div>
          <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', fontWeight: 500 }}>
            Showing {rooms.length} result{rooms.length !== 1 && 's'}
          </p>
          <motion.div 
            initial="hidden"
            animate="show"
            variants={{
              hidden: { opacity: 0 },
              show: {
                opacity: 1,
                transition: { staggerChildren: 0.1 }
              }
            }}
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
              gap: '2rem'
            }}
          >
            {rooms.map(room => (
              <RoomCard key={room._id} room={room} />
            ))}
          </motion.div>
        </div>
      )}

    </div>
  );
};

export default Rooms;
