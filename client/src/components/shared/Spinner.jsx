import { motion } from 'framer-motion';

const Spinner = () => {
  return (
    <div className="spinner-container" style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '300px',
      gap: '1.5rem'
    }}>
      <div style={{ position: 'relative', width: '80px', height: '80px' }}>
        {/* Outer Glowing Circle */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          style={{
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            border: '4px solid transparent',
            borderTopColor: 'var(--primary)',
            borderBottomColor: 'var(--primary-dark)',
            filter: 'drop-shadow(0 0 8px var(--primary))',
            position: 'absolute',
            top: 0,
            left: 0
          }}
        />
        {/* Inner Counter-Rotating Circle */}
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          style={{
            width: '50px',
            height: '50px',
            borderRadius: '50%',
            border: '3px solid transparent',
            borderLeftColor: 'var(--primary-dark)',
            borderRightColor: '#8B5CF6',
            position: 'absolute',
            top: '15px',
            left: '15px'
          }}
        />
      </div>
      <motion.p
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        style={{
          fontFamily: 'Outfit, sans-serif',
          fontWeight: 500,
          color: 'var(--text-muted)',
          letterSpacing: '0.1em'
        }}
      >
        LOADING STUDYNOOK...
      </motion.p>
    </div>
  );
};

export default Spinner;
