import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiMapPin, FiUsers, FiDollarSign, FiLayers } from 'react-icons/fi';

const RoomCard = ({ room }) => {
  const { _id, name, description, image, floor, capacity, hourlyRate, amenities = [] } = room;

  // Truncate description to ~100 chars
  const shortDesc = description?.length > 100 
    ? `${description.substring(0, 97)}...` 
    : description;

  // Handle amenities overflow
  const visibleAmenities = amenities.slice(0, 3);
  const remainingCount = amenities.length - 3;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8, transition: { duration: 0.2 } }}
      className="card"
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        backgroundColor: 'var(--surface)',
        borderRadius: '16px',
        border: '1px solid var(--border)',
        overflow: 'hidden',
        boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
        position: 'relative',
        transition: 'border-color 0.3s, background-color 0.3s, box-shadow 0.3s'
      }}
    >
      {/* Rate Badge (Overlayed on image) */}
      <div style={{
        position: 'absolute',
        top: '12px',
        right: '12px',
        background: 'linear-gradient(135deg, var(--primary) 0%, #0F766E 100%)',
        color: 'white',
        fontWeight: 600,
        fontSize: '0.9rem',
        padding: '6px 12px',
        borderRadius: '20px',
        boxShadow: '0 4px 10px rgba(13, 148, 136, 0.3)',
        zIndex: 10,
        display: 'flex',
        alignItems: 'center',
        gap: '2px'
      }}>
        <FiDollarSign size={14} />
        <span>{hourlyRate}/hr</span>
      </div>

      {/* Room Image */}
      <div style={{
        width: '100%',
        height: '200px',
        overflow: 'hidden',
        position: 'relative',
        backgroundColor: 'rgba(0,0,0,0.05)'
      }}>
        <img 
          src={image || 'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=600&auto=format&fit=crop'} 
          alt={name}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.3s ease'
          }}
          loading="lazy"
        />
      </div>

      {/* Room Content */}
      <div style={{
        padding: '1.25rem',
        display: 'flex',
        flexDirection: 'column',
        flexGrow: 1,
        gap: '0.75rem'
      }}>
        {/* Room Title */}
        <h3 style={{
          fontFamily: 'Outfit, sans-serif',
          fontSize: '1.25rem',
          fontWeight: 700,
          color: 'var(--text-main)',
          margin: 0
        }}>
          {name}
        </h3>

        {/* Short Description */}
        <p style={{
          fontSize: '0.9rem',
          color: 'var(--text-muted)',
          margin: 0,
          lineHeight: '1.5',
          flexGrow: 1
        }}>
          {shortDesc}
        </p>

        {/* Specifications (Floor and Capacity) */}
        <div style={{
          display: 'flex',
          gap: '1rem',
          fontSize: '0.85rem',
          color: 'var(--text-muted)',
          borderTop: '1px solid var(--border)',
          borderBottom: '1px solid var(--border)',
          padding: '0.75rem 0',
          marginTop: '0.25rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <FiLayers className="text-primary" style={{ color: 'var(--primary)' }} />
            <span>Floor: {floor}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <FiUsers className="text-primary" style={{ color: 'var(--primary)' }} />
            <span>Capacity: {capacity} seats</span>
          </div>
        </div>

        {/* Amenities Chips */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '0.35rem',
          minHeight: '26px'
        }}>
          {visibleAmenities.map((amenity, idx) => (
            <span 
              key={idx} 
              style={{
                fontSize: '0.75rem',
                fontWeight: 500,
                color: 'var(--primary)',
                backgroundColor: 'rgba(13, 148, 136, 0.1)',
                padding: '3px 8px',
                borderRadius: '6px',
                transition: 'background-color 0.3s'
              }}
            >
              {amenity}
            </span>
          ))}
          {remainingCount > 0 && (
            <span 
              style={{
                fontSize: '0.75rem',
                fontWeight: 500,
                color: 'var(--text-muted)',
                backgroundColor: 'var(--border)',
                padding: '3px 8px',
                borderRadius: '6px',
                transition: 'background-color 0.3s'
              }}
            >
              +{remainingCount} more
            </span>
          )}
        </div>

        {/* View Details CTA Button */}
        <Link 
          to={`/rooms/${_id}`} 
          className="btn btn-primary"
          style={{
            marginTop: '0.5rem',
            width: '100%',
            fontWeight: 600,
            padding: '10px 16px',
            borderRadius: '10px',
            fontSize: '0.9rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%)',
            border: 'none',
            color: 'white',
            boxShadow: '0 4px 10px rgba(13, 148, 136, 0.15)'
          }}
        >
          View Details
        </Link>
      </div>
    </motion.div>
  );
};

export default RoomCard;
