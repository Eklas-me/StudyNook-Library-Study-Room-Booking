import { motion } from 'framer-motion';
import { FiSearch, FiCalendar, FiCheckCircle, FiBookOpen } from 'react-icons/fi';

const HowItWorks = () => {
  const steps = [
    {
      icon: <FiSearch size={28} />,
      title: "1. Search Rooms",
      description: "Filter by floor, seats, and specific amenities to find your ideal quiet study space."
    },
    {
      icon: <FiCalendar size={28} />,
      title: "2. Reserve Slot",
      description: "Pick a date and convenient hourly slots. See the total price calculated in real-time."
    },
    {
      icon: <FiCheckCircle size={28} />,
      title: "3. Conflict-Free Lock",
      description: "Our backend checks for double-bookings instantly, securing your room in a split second."
    },
    {
      icon: <FiBookOpen size={28} />,
      title: "4. Meet & Study",
      description: "Arrive at the library private room, log in, and dive straight into your study session."
    }
  ];

  return (
    <section className="py-8" style={{ margin: '3rem 0' }}>
      {/* Title */}
      <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
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
          How StudyNook Works
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
          Follow these four simple steps to get your private workspace booked conflict-free in less than a minute.
        </motion.p>
        <div style={{
          width: '60px',
          height: '4px',
          background: 'linear-gradient(90deg, var(--primary) 0%, #8B5CF6 100%)',
          margin: '1rem auto 0 auto',
          borderRadius: '2px'
        }} />
      </div>

      {/* Steps Grid */}
      <motion.div 
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        variants={{
          hidden: { opacity: 0 },
          show: {
            opacity: 1,
            transition: { staggerChildren: 0.15 }
          }
        }}
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '2rem'
        }}
      >
        {steps.map((step, index) => (
          <motion.div
            key={index}
            variants={{
              hidden: { opacity: 0, y: 30 },
              show: { opacity: 1, y: 0 }
            }}
            whileHover={{ y: -8 }}
            style={{
              backgroundColor: 'var(--surface)',
              borderRadius: '20px',
              padding: '2rem 1.5rem',
              textAlign: 'center',
              border: '1px solid var(--border)',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.03)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '1rem',
              position: 'relative',
              transition: 'background-color 0.3s, border-color 0.3s, box-shadow 0.3s'
            }}
          >
            {/* Step Icon */}
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, rgba(13, 148, 136, 0.15) 0%, rgba(139, 92, 246, 0.1) 100%)',
              color: 'var(--primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: 'inset 0 2px 4px rgba(255,255,255,0.1)',
              marginBottom: '0.5rem'
            }}>
              {step.icon}
            </div>

            {/* Title */}
            <h3 style={{
              fontFamily: 'Outfit, sans-serif',
              fontSize: '1.25rem',
              fontWeight: 650,
              color: 'var(--text-main)',
              margin: 0
            }}>
              {step.title}
            </h3>

            {/* Description */}
            <p style={{
              fontSize: '0.9rem',
              color: 'var(--text-muted)',
              lineHeight: '1.5',
              margin: 0
            }}>
              {step.description}
            </p>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
};

export default HowItWorks;
