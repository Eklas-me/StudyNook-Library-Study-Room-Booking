import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import toast from 'react-hot-toast';
import { FiXCircle, FiCalendar, FiClock, FiCheckCircle } from 'react-icons/fi';
import useAxiosSecure from '../hooks/useAxiosSecure';
import Spinner from '../components/shared/Spinner';

const MyBookings = () => {
  const axiosSecure = useAxiosSecure();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = "StudyNook – My Bookings";
    fetchMyBookings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchMyBookings = async () => {
    try {
      setLoading(true);
      const response = await axiosSecure.get('/bookings/my-bookings');
      setBookings(response.data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load your bookings.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = (bookingId) => {
    Swal.fire({
      title: 'Cancel Booking?',
      text: "Are you sure you want to cancel this booking? This cannot be undone.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: 'var(--danger)',
      cancelButtonColor: 'var(--text-muted)',
      confirmButtonText: 'Yes, cancel it!'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axiosSecure.patch(`/bookings/${bookingId}/cancel`);
          toast.success("Booking cancelled successfully.");
          
          // Update local state to reflect cancellation
          setBookings(prev => 
            prev.map(b => b._id === bookingId ? { ...b, status: 'cancelled' } : b)
          );
        } catch (err) {
          toast.error(err.response?.data?.message || "Failed to cancel booking");
        }
      }
    });
  };

  // Helper to check if booking is in the future
  const isFutureBooking = (dateString) => {
    const bookingDate = new Date(dateString);
    const today = new Date();
    // Reset time portion for fair comparison
    today.setHours(0,0,0,0);
    return bookingDate >= today;
  };

  return (
    <div className="container py-8" style={{ minHeight: '80vh' }}>
      
      <div style={{ marginBottom: '3rem', textAlign: 'center' }}>
        <h1 style={{
          fontFamily: 'Outfit, sans-serif',
          fontSize: 'clamp(2rem, 3vw, 2.5rem)',
          fontWeight: 800,
          color: 'var(--text-main)',
          marginBottom: '0.25rem'
        }}>
          My Bookings
        </h1>
        <p style={{ color: 'var(--text-muted)' }}>View and manage your upcoming study sessions.</p>
        <div style={{
          width: '60px',
          height: '4px',
          background: 'linear-gradient(90deg, var(--primary) 0%, #8B5CF6 100%)',
          margin: '1rem auto 0 auto',
          borderRadius: '2px'
        }} />
      </div>

      {loading ? (
        <Spinner />
      ) : bookings.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '4rem 2rem',
          backgroundColor: 'var(--surface)',
          borderRadius: '24px',
          border: '1px dashed var(--border)'
        }}>
          <div style={{ fontSize: '3rem', opacity: 0.5, marginBottom: '1rem' }}>📅</div>
          <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>You have no bookings yet.</h3>
          <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>Explore our available rooms and book your first quiet space.</p>
          <Link to="/rooms" className="btn btn-primary">Browse Rooms</Link>
        </div>
      ) : (
        <motion.div
          initial="hidden"
          animate="show"
          variants={{
            hidden: { opacity: 0 },
            show: { opacity: 1, transition: { staggerChildren: 0.1 } }
          }}
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1.5rem',
            maxWidth: '900px',
            margin: '0 auto'
          }}
        >
          {bookings.map(booking => {
            const isCancelable = booking.status === 'confirmed' && isFutureBooking(booking.date);

            return (
              <motion.div
                key={booking._id}
                variants={{ hidden: { opacity: 0, x: -20 }, show: { opacity: 1, x: 0 } }}
                style={{
                  backgroundColor: 'var(--surface)',
                  borderRadius: '16px',
                  border: '1px solid var(--border)',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
                  display: 'flex',
                  flexDirection: 'row',
                  overflow: 'hidden',
                  flexWrap: 'wrap'
                }}
              >
                {/* Room Image (Left) */}
                <div style={{ width: '200px', flexShrink: 0, minHeight: '150px' }}>
                  <img 
                    src={booking.room?.image || 'https://via.placeholder.com/200'} 
                    alt={booking.room?.name || 'Room'} 
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>

                {/* Booking Info (Middle) */}
                <div style={{ padding: '1.5rem', flexGrow: 1, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <h3 style={{ fontFamily: 'Outfit', fontSize: '1.25rem', margin: 0 }}>
                      {booking.room?.name || 'Unknown Room'}
                    </h3>
                    
                    {/* Status Badge */}
                    {booking.status === 'confirmed' ? (
                      <span style={{ 
                        background: 'rgba(16, 185, 129, 0.1)', color: 'var(--success)',
                        padding: '4px 10px', borderRadius: '999px', fontSize: '0.8rem', fontWeight: 600,
                        display: 'flex', alignItems: 'center', gap: '0.25rem'
                      }}>
                        <FiCheckCircle /> Confirmed
                      </span>
                    ) : (
                      <span style={{ 
                        background: 'rgba(244, 63, 94, 0.1)', color: 'var(--danger)',
                        padding: '4px 10px', borderRadius: '999px', fontSize: '0.8rem', fontWeight: 600,
                        display: 'flex', alignItems: 'center', gap: '0.25rem'
                      }}>
                        <FiXCircle /> Cancelled
                      </span>
                    )}
                  </div>

                  <div style={{ display: 'flex', gap: '1.5rem', color: 'var(--text-muted)', fontSize: '0.95rem' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <FiCalendar /> {booking.date}
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <FiClock /> {booking.startTime} - {booking.endTime}
                    </span>
                  </div>

                  {booking.specialNote && (
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontStyle: 'italic', marginTop: '0.25rem' }}>
                      Note: "{booking.specialNote}"
                    </div>
                  )}
                </div>

                {/* Actions & Price (Right) */}
                <div style={{ 
                  padding: '1.5rem', 
                  borderLeft: '1px solid var(--border)',
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  minWidth: '150px',
                  backgroundColor: 'rgba(13, 148, 136, 0.02)'
                }}>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', textTransform: 'uppercase' }}>Total Cost</div>
                  <div style={{ fontFamily: 'Outfit', fontSize: '1.5rem', fontWeight: 800, color: 'var(--primary)', marginBottom: '1rem' }}>
                    ${booking.totalCost?.toFixed(2)}
                  </div>
                  
                  {isCancelable && (
                    <button 
                      onClick={() => handleCancel(booking._id)}
                      className="btn"
                      style={{
                        width: '100%',
                        backgroundColor: 'rgba(244, 63, 94, 0.1)',
                        color: 'var(--danger)',
                        border: '1px solid rgba(244, 63, 94, 0.2)',
                        fontSize: '0.9rem',
                        fontWeight: 600,
                        display: 'flex',
                        justifyContent: 'center'
                      }}
                    >
                      Cancel Booking
                    </button>
                  )}
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      )}

    </div>
  );
};

export default MyBookings;
