import { motion } from 'framer-motion';
import { FaStar, FaQuoteLeft } from 'react-icons/fa';

const Testimonials = () => {
  const testimonials = [
    {
      name: "Tahsina Rahman",
      role: "CSE Undergraduate Student",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&auto=format&fit=crop",
      text: "Booking study rooms for our group projects used to be a nightmare with conflicts. StudyNook makes it instant and hassle-free. The dark theme is a lifesaver for late night prep!",
      rating: 5
    },
    {
      name: "Zahid Hasan",
      role: "Library Study Group Leader",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&auto=format&fit=crop",
      text: "I list our department's private tutoring nooks on StudyNook. It makes managing slots incredibly simple. The real-time cost calculator is a perfect feature for campus hosts.",
      rating: 5
    },
    {
      name: "Sabrina Yasmin",
      role: "M.S. Research Scholar",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=150&auto=format&fit=crop",
      text: "I need absolute silence and a whiteboard for my thesis preparation. Being able to filter spaces by quiet zones and whiteboards has boosted my daily productivity. Highly recommended!",
      rating: 5
    }
  ];

  return (
    <section className="py-8" style={{ margin: '3rem 0 1rem 0' }}>
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
          What Our Users Say
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
          Hear from student groups, thesis researchers, and workspace hosts who rely on StudyNook daily.
        </motion.p>
        <div style={{
          width: '60px',
          height: '4px',
          background: 'linear-gradient(90deg, var(--primary) 0%, #8B5CF6 100%)',
          margin: '1rem auto 0 auto',
          borderRadius: '2px'
        }} />
      </div>

      {/* Cards Grid */}
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
          gridTemplateColumns: 'repeat(auto-fit, minmax(285px, 1fr))',
          gap: '2rem'
        }}
      >
        {testimonials.map((t, idx) => (
          <motion.div
            key={idx}
            variants={{
              hidden: { opacity: 0, scale: 0.95 },
              show: { opacity: 1, scale: 1 }
            }}
            whileHover={{ y: -6 }}
            style={{
              backgroundColor: 'var(--surface)',
              borderRadius: '24px',
              padding: '2rem 1.75rem',
              border: '1px solid var(--border)',
              boxShadow: '0 8px 30px rgba(0,0,0,0.03)',
              display: 'flex',
              flexDirection: 'column',
              gap: '1.25rem',
              position: 'relative',
              transition: 'background-color 0.3s, border-color 0.3s, box-shadow 0.3s'
            }}
          >
            {/* Quote Icon Background */}
            <div style={{
              position: 'absolute',
              top: '20px',
              right: '24px',
              color: 'var(--primary)',
              opacity: 0.12
            }}>
              <FaQuoteLeft size={36} />
            </div>

            {/* Stars Rating */}
            <div style={{ display: 'flex', gap: '0.25rem', color: '#FBBF24' }}>
              {[...Array(t.rating)].map((_, i) => (
                <FaStar key={i} size={15} />
              ))}
            </div>

            {/* Quote Text */}
            <p style={{
              fontSize: '0.92rem',
              color: 'var(--text-main)',
              lineHeight: '1.6',
              fontStyle: 'italic',
              margin: 0,
              flexGrow: 1
            }}>
              "{t.text}"
            </p>

            {/* User Profile Info Info */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              borderTop: '1px solid var(--border)',
              paddingTop: '1rem',
              marginTop: '0.25rem'
            }}>
              <img 
                src={t.image} 
                alt={t.name}
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '50%',
                  objectFit: 'cover',
                  border: '2px solid var(--primary)',
                  boxShadow: '0 4px 10px rgba(13, 148, 136, 0.2)'
                }}
              />
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <h4 style={{
                  fontFamily: 'Outfit, sans-serif',
                  fontSize: '1rem',
                  fontWeight: 650,
                  color: 'var(--text-main)',
                  margin: 0
                }}>
                  {t.name}
                </h4>
                <span style={{
                  fontSize: '0.8rem',
                  color: 'var(--text-muted)'
                }}>
                  {t.role}
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
};

export default Testimonials;
