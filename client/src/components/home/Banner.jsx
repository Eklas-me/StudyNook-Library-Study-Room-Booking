import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const Banner = () => {
  return (
    <section className="banner-section" style={{
      position: 'relative',
      minHeight: '600px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundImage: 'url("https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=1600&auto=format&fit=crop")',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      color: 'white',
      borderRadius: '24px',
      overflow: 'hidden',
      margin: '1.5rem auto',
      boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
      width: '100%'
    }}>
      {/* Dark Backdrop Gradient Overlay */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.9) 0%, rgba(15, 23, 42, 0.75) 50%, rgba(13, 148, 136, 0.4) 100%)',
        zIndex: 1
      }} />

      {/* Grid Pattern Layer */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundImage: `radial-gradient(rgba(255, 255, 255, 0.15) 1px, transparent 1px)`,
        backgroundSize: '24px 24px',
        opacity: 0.3,
        zIndex: 2
      }} />

      {/* Hero Content Container */}
      <div className="container" style={{
        position: 'relative',
        zIndex: 10,
        textAlign: 'center',
        padding: '2rem 1.5rem',
        maxWidth: '800px'
      }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          {/* Accent Mini Tag */}
          <span style={{
            background: 'linear-gradient(90deg, var(--primary) 0%, #8B5CF6 100%)',
            padding: '8px 16px',
            borderRadius: '999px',
            fontSize: '0.85rem',
            fontWeight: 600,
            letterSpacing: '0.05em',
            textTransform: 'uppercase',
            display: 'inline-block',
            marginBottom: '1.5rem',
            boxShadow: '0 4px 12px rgba(13, 148, 136, 0.3)'
          }}>
            🎓 Welcome to StudyNook
          </span>

          {/* Heading */}
          <h1 style={{
            fontFamily: 'Outfit, sans-serif',
            fontSize: 'clamp(2.5rem, 5vw, 4rem)',
            fontWeight: 800,
            lineHeight: 1.15,
            marginBottom: '1.5rem',
            textShadow: '0 4px 12px rgba(0,0,0,0.5)',
            background: 'linear-gradient(to right, #FFFFFF, #E2E8F0, #2DD4BF)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            Find Your Perfect <br />
            <span style={{
              background: 'linear-gradient(90deg, #2DD4BF 0%, #a855f7 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>Study Room</span>
          </h1>

          {/* Description */}
          <p style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: 'clamp(1rem, 2vw, 1.25rem)',
            color: '#CBD5E1',
            marginBottom: '2.5rem',
            lineHeight: 1.6,
            textShadow: '0 2px 4px rgba(0,0,0,0.3)',
            maxWidth: '650px',
            margin: '0 auto 2.5rem auto'
          }}>
            Browse and book quiet, private study rooms in your library. List your own room, manage bookings, and create a focused learning environment.
          </p>

          {/* Buttons Row */}
          <div style={{
            display: 'flex',
            gap: '1rem',
            justifyContent: 'center',
            flexWrap: 'wrap'
          }}>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link to="/rooms" className="btn btn-primary" style={{
                background: 'linear-gradient(135deg, var(--primary) 0%, #8B5CF6 100%)',
                border: 'none',
                padding: '14px 32px',
                fontSize: '1rem',
                fontWeight: 600,
                borderRadius: '12px',
                boxShadow: '0 8px 24px rgba(13, 148, 136, 0.4)',
                color: 'white',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                transition: 'all 0.3s'
              }}>
                Explore Rooms ➜
              </Link>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link to="/add-room" className="btn btn-outline" style={{
                borderColor: '#E2E8F0',
                color: '#FFFFFF',
                padding: '14px 32px',
                fontSize: '1rem',
                fontWeight: 600,
                borderRadius: '12px',
                background: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(8px)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                transition: 'all 0.3s'
              }}>
                List a Room
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Banner;
