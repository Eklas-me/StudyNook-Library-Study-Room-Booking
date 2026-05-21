import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const NotFound = () => { 
  useEffect(() => {
    document.title = "StudyNook – 404 Not Found";
  }, []);

  return (
    <div style={{
      minHeight: '80vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      padding: '2rem'
    }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h1 style={{
          fontSize: 'clamp(5rem, 10vw, 8rem)',
          fontFamily: 'Outfit, sans-serif',
          fontWeight: 900,
          background: 'linear-gradient(135deg, var(--primary) 0%, #8B5CF6 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          margin: 0,
          lineHeight: 1
        }}>
          404
        </h1>
        <h2 style={{
          fontSize: '2rem',
          color: 'var(--text-main)',
          marginBottom: '1rem'
        }}>
          Page Not Found
        </h2>
        <p style={{
          color: 'var(--text-muted)',
          fontSize: '1.1rem',
          maxWidth: '500px',
          marginBottom: '2rem'
        }}>
          Oops! The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </p>
        <Link to="/" className="btn btn-primary" style={{
          padding: '12px 30px',
          borderRadius: '999px',
          fontSize: '1.1rem',
          fontWeight: 600,
          background: 'linear-gradient(90deg, var(--primary) 0%, #0F766E 100%)'
        }}>
          Back to Homepage
        </Link>
      </motion.div>
    </div>
  ); 
};

export default NotFound;
