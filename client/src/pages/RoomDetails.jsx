import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { FiMapPin, FiUsers, FiDollarSign, FiClock, FiCheck, FiTrash2, FiEdit2 } from 'react-icons/fi';
import useAuth from '../hooks/useAuth';
import useAxiosSecure from '../hooks/useAxiosSecure';
import Spinner from '../components/shared/Spinner';
import BookingModal from '../components/booking/BookingModal';

const RoomDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  useEffect(() => {
    fetchRoom();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchRoom = async () => {
    try {
      setLoading(true);
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      const response = await axios.get(`${apiUrl}/rooms/${id}`);
      setRoom(response.data);
      document.title = `StudyNook – ${response.data.name}`;
    } catch (err) {
      console.error(err);
      setError("Failed to fetch room details.");
    } finally {
      setLoading(false);
    }
  };

  const isOwner = user && user._id === room?.owner;

  const handleBookClick = () => {
    if (!user) {
      navigate('/login', { state: { from: location } });
    } else {
      setIsBookingModalOpen(true);
    }
  };

  const handleDelete = () => {
    Swal.fire({
      title: 'Delete this room?',
      text: "This action cannot be undone.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: 'var(--danger)',
      cancelButtonColor: 'var(--text-muted)',
      confirmButtonText: 'Yes, delete it!'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axiosSecure.delete(`/rooms/${id}`);
          toast.success("Room deleted successfully");
          navigate('/my-listings');
        } catch (err) {
          toast.error("Failed to delete room");
        }
      }
    });
  };

  if (loading) return <div className="container py-8" style={{ minHeight: '80vh' }}><Spinner /></div>;
  if (error || !room) return (
    <div className="container py-8" style={{ minHeight: '80vh', textAlign: 'center' }}>
      <h2 style={{ color: 'var(--danger)' }}>{error || "Room not found."}</h2>
    </div>
  );

  return (
    <div className="container py-8" style={{ minHeight: '80vh' }}>
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          backgroundColor: 'var(--surface)',
          borderRadius: '24px',
          overflow: 'hidden',
          border: '1px solid var(--border)',
          boxShadow: '0 8px 30px rgba(0,0,0,0.04)'
        }}
      >
        {/* Hero Image Section */}
        <div style={{ position: 'relative', width: '100%', height: '400px' }}>
          <img 
            src={room.image} 
            alt={room.name} 
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
          <div style={{
            position: 'absolute',
            top: 0, left: 0, right: 0, bottom: 0,
            background: 'linear-gradient(to top, rgba(15,23,42,0.9) 0%, transparent 100%)'
          }} />
          
          <div style={{
            position: 'absolute',
            bottom: '2rem',
            left: '2rem',
            right: '2rem',
            color: 'white'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
              <span style={{
                background: 'rgba(255,255,255,0.2)',
                backdropFilter: 'blur(8px)',
                padding: '4px 12px',
                borderRadius: '999px',
                fontSize: '0.85rem',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}>
                <FiClock /> Booked {room.bookingCount} Times
              </span>
            </div>
            <h1 style={{
              fontFamily: 'Outfit, sans-serif',
              fontSize: 'clamp(2rem, 4vw, 3rem)',
              fontWeight: 800,
              margin: 0,
              textShadow: '0 2px 10px rgba(0,0,0,0.5)'
            }}>
              {room.name}
            </h1>
          </div>
        </div>

        {/* Content Section */}
        <div style={{ display: 'flex', flexWrap: 'wrap' }}>
          
          {/* Main Content (Left) */}
          <div style={{ flex: '1 1 60%', padding: '2.5rem' }}>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 600, marginBottom: '1rem' }}>About this room</h3>
            <p style={{ color: 'var(--text-muted)', lineHeight: 1.8, fontSize: '1rem', marginBottom: '2rem' }}>
              {room.description}
            </p>

            <h3 style={{ fontSize: '1.3rem', fontWeight: 600, marginBottom: '1rem' }}>Amenities Included</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '1rem' }}>
              {room.amenities?.map((amenity, idx) => (
                <div key={idx} style={{
                  display: 'flex', alignItems: 'center', gap: '0.5rem',
                  color: 'var(--text-main)', fontWeight: 500
                }}>
                  <div style={{ color: 'var(--primary)' }}><FiCheck size={18} /></div>
                  {amenity}
                </div>
              ))}
            </div>
          </div>

          {/* Booking / Details Panel (Right) */}
          <div style={{ 
            flex: '1 1 35%', 
            padding: '2.5rem', 
            backgroundColor: 'rgba(13, 148, 136, 0.03)',
            borderLeft: '1px solid var(--border)',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.5rem'
          }}>
            <div style={{
              display: 'flex', alignItems: 'center', gap: '1rem',
              paddingBottom: '1.5rem', borderBottom: '1px solid var(--border)'
            }}>
              <div style={{
                background: 'linear-gradient(135deg, var(--primary) 0%, #0F766E 100%)',
                width: '60px', height: '60px', borderRadius: '16px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'white', fontSize: '1.75rem', fontWeight: 800
              }}>
                <FiDollarSign />
              </div>
              <div>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-main)' }}>
                  ${room.hourlyRate} <span style={{ fontSize: '1rem', color: 'var(--text-muted)', fontWeight: 500 }}>/ hr</span>
                </div>
                <div style={{ fontSize: '0.9rem', color: 'var(--primary)', fontWeight: 500 }}>Premium Rate</div>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <FiMapPin /> Floor Level
                </span>
                <span style={{ fontWeight: 600 }}>{room.floor}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <FiUsers /> Capacity
                </span>
                <span style={{ fontWeight: 600 }}>{room.capacity} Persons</span>
              </div>
            </div>

            {/* Actions */}
            <div style={{ marginTop: 'auto', paddingTop: '2rem' }}>
              <button 
                onClick={handleBookClick}
                className="btn btn-primary"
                style={{
                  width: '100%',
                  padding: '16px',
                  fontSize: '1.1rem',
                  fontWeight: 700,
                  borderRadius: '12px',
                  background: 'linear-gradient(90deg, var(--primary) 0%, #8B5CF6 100%)',
                  boxShadow: '0 8px 20px rgba(13, 148, 136, 0.3)',
                  border: 'none',
                  color: 'white'
                }}
              >
                {user ? 'Book Now' : 'Login to Book'}
              </button>

              {isOwner && (
                <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                  <button 
                    onClick={() => navigate('/my-listings')}
                    className="btn"
                    style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', backgroundColor: 'var(--border)', color: 'var(--text-main)' }}
                  >
                    <FiEdit2 /> Edit
                  </button>
                  <button 
                    onClick={handleDelete}
                    className="btn"
                    style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', backgroundColor: 'rgba(244, 63, 94, 0.1)', color: 'var(--danger)' }}
                  >
                    <FiTrash2 /> Delete
                  </button>
                </div>
              )}
            </div>

          </div>
        </div>
      </motion.div>

      {/* Booking Modal */}
      {isBookingModalOpen && (
        <BookingModal 
          room={room} 
          onClose={() => setIsBookingModalOpen(false)} 
          onSuccess={fetchRoom} 
        />
      )}
    </div>
  );
};

export default RoomDetails;
