import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiX, FiCalendar, FiClock, FiDollarSign } from 'react-icons/fi';
import toast from 'react-hot-toast';
import useAxiosSecure from '../../hooks/useAxiosSecure';

const BookingModal = ({ room, onClose, onSuccess }) => {
  const axiosSecure = useAxiosSecure();
  const [loading, setLoading] = useState(false);
  
  // Format today's date for min attribute (YYYY-MM-DD)
  const today = new Date().toISOString().split('T')[0];

  const [date, setDate] = useState(today);
  const [startTime, setStartTime] = useState('08:00');
  const [endTime, setEndTime] = useState('09:00');
  const [specialNote, setSpecialNote] = useState('');

  const TIME_SLOTS = [
    "08:00", "09:00", "10:00", "11:00", "12:00", "13:00", 
    "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00"
  ];

  // Derive available end times (must be strictly after start time)
  const availableEndTimes = TIME_SLOTS.filter(time => {
    const startHour = parseInt(startTime.split(':')[0], 10);
    const timeHour = parseInt(time.split(':')[0], 10);
    return timeHour > startHour;
  });

  // Automatically adjust end time if it becomes invalid
  useEffect(() => {
    const startHour = parseInt(startTime.split(':')[0], 10);
    const currentEndHour = parseInt(endTime.split(':')[0], 10);
    if (currentEndHour <= startHour) {
      // Default to 1 hour after new start time
      const nextHour = startHour + 1;
      setEndTime(`${nextHour < 10 ? '0' : ''}${nextHour}:00`);
    }
  }, [startTime, endTime]);

  // Calculate total cost
  const startHour = parseInt(startTime.split(':')[0], 10);
  const endHour = parseInt(endTime.split(':')[0], 10);
  const totalCost = (endHour - startHour) * room.hourlyRate;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (endHour <= startHour) {
      toast.error("End time must be after start time");
      return;
    }

    try {
      setLoading(true);
      await axiosSecure.post('/bookings', {
        roomId: room._id,
        date,
        startTime,
        endTime,
        totalCost,
        specialNote
      });
      toast.success("Room booked successfully!");
      if (onSuccess) onSuccess();
      onClose();
    } catch (err) {
      console.error(err);
      if (err.response?.status === 409) {
        toast.error("This time slot is already booked.");
      } else {
        toast.error("Failed to book room. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(15, 23, 42, 0.7)',
      backdropFilter: 'blur(8px)',
      zIndex: 2000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1rem'
    }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        style={{
          backgroundColor: 'var(--surface)',
          width: '100%',
          maxWidth: '500px',
          borderRadius: '24px',
          overflow: 'hidden',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          position: 'relative',
          border: '1px solid var(--border)'
        }}
      >
        {/* Header */}
        <div style={{
          padding: '1.5rem',
          borderBottom: '1px solid var(--border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'var(--bg-color)'
        }}>
          <h2 style={{ fontFamily: 'Outfit', fontSize: '1.5rem', margin: 0 }}>Book {room.name}</h2>
          <button onClick={onClose} style={{
            background: 'var(--border)', border: 'none', borderRadius: '50%',
            width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', color: 'var(--text-main)', transition: 'background-color 0.2s'
          }}>
            <FiX size={18} />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} style={{ padding: '1.5rem' }}>
          
          <div className="form-group">
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <FiCalendar /> Date
            </label>
            <input 
              type="date" 
              required
              min={today}
              className="form-control"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
            <div className="form-group" style={{ flex: 1 }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <FiClock /> Start Time
              </label>
              <select 
                className="form-control"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
              >
                {TIME_SLOTS.slice(0, -1).map(time => (
                  <option key={time} value={time}>{time}</option>
                ))}
              </select>
            </div>
            
            <div className="form-group" style={{ flex: 1 }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <FiClock /> End Time
              </label>
              <select 
                className="form-control"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
              >
                {availableEndTimes.map(time => (
                  <option key={time} value={time}>{time}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-group" style={{ marginTop: '1rem' }}>
            <label>Special Note (Optional)</label>
            <textarea 
              rows="2"
              className="form-control"
              placeholder="Any special requirements..."
              value={specialNote}
              onChange={(e) => setSpecialNote(e.target.value)}
            />
          </div>

          {/* Cost Summary Box */}
          <div style={{
            marginTop: '1.5rem',
            padding: '1.25rem',
            backgroundColor: 'rgba(13, 148, 136, 0.08)',
            borderRadius: '12px',
            border: '1px solid rgba(13, 148, 136, 0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div>
              <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Hourly Rate: ${room.hourlyRate}/hr</div>
              <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Duration: {endHour - startHour} hour(s)</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>Total Cost</div>
              <div style={{ 
                fontFamily: 'Outfit', 
                fontSize: '1.75rem', 
                fontWeight: 800, 
                color: 'var(--primary)',
                display: 'flex',
                alignItems: 'center'
              }}>
                <FiDollarSign size={20} />{totalCost.toFixed(2)}
              </div>
            </div>
          </div>

          {/* Action */}
          <button 
            type="submit" 
            disabled={loading}
            className="btn btn-primary"
            style={{ 
              width: '100%', 
              marginTop: '1.5rem', 
              padding: '14px', 
              fontSize: '1.05rem', 
              fontWeight: 600,
              background: 'linear-gradient(90deg, var(--primary) 0%, #0F766E 100%)'
            }}
          >
            {loading ? 'Processing...' : 'Confirm Booking'}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default BookingModal;
