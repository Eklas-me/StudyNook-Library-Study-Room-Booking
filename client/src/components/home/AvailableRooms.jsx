import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import RoomCard from './RoomCard';
import Spinner from '../shared/Spinner';

const AvailableRooms = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLatestRooms = async () => {
      try {
        setLoading(true);
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
        const response = await axios.get(`${apiUrl}/rooms/latest`);
        setRooms(response.data);
      } catch (err) {
        console.error("Error fetching latest rooms:", err);
        setError("Could not load study rooms at the moment.");
      } finally {
        setLoading(false);
      }
    };

    fetchLatestRooms();
  }, []);

  return (
    <section className="py-8" style={{ margin: '2rem 0' }}>
      {/* Section Title */}
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <motion.h2 
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          style={{
            fontFamily: 'Outfit, sans-serif',
            fontSize: 'clamp(1.75rem, 3vw, 2.5rem)',
            fontWeight: 700,
            marginBottom: '0.5rem',
            color: 'var(--text-main)'
          }}
        >
          Available Study Rooms
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          style={{
            color: 'var(--text-muted)',
            fontSize: '1rem',
            maxWidth: '500px',
            margin: '0 auto'
          }}
        >
          Explore our newest private spaces fully equipped for individuals or collaborative study sessions.
        </motion.p>
        <div style={{
          width: '60px',
          height: '4px',
          background: 'linear-gradient(90deg, var(--primary) 0%, #8B5CF6 100%)',
          margin: '1rem auto 0 auto',
          borderRadius: '2px'
        }} />
      </div>

      {/* Content Rendering */}
      {loading ? (
        <Spinner />
      ) : error ? (
        <div style={{
          textAlign: 'center',
          color: 'var(--danger)',
          padding: '2rem',
          backgroundColor: 'rgba(244, 63, 94, 0.05)',
          borderRadius: '12px',
          border: '1px dashed var(--danger)',
          maxWidth: '500px',
          margin: '0 auto'
        }}>
          {error}
        </div>
      ) : rooms.length === 0 ? (
        <div style={{
          textAlign: 'center',
          color: 'var(--text-muted)',
          padding: '4rem 2rem',
          border: '1px dashed var(--border)',
          borderRadius: '16px',
          backgroundColor: 'var(--surface)'
        }}>
          <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', color: 'var(--text-main)' }}>No study rooms available</h3>
          <p>Please check back later or list your own study room to get started!</p>
        </div>
      ) : (
        <motion.div 
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          variants={{
            hidden: { opacity: 0 },
            show: {
              opacity: 1,
              transition: {
                staggerChildren: 0.1
              }
            }
          }}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '2rem',
            width: '100%'
          }}
        >
          {rooms.map((room) => (
            <RoomCard key={room._id} room={room} />
          ))}
        </motion.div>
      )}
    </section>
  );
};

export default AvailableRooms;
