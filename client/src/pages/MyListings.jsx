import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import toast from 'react-hot-toast';
import { FiEdit2, FiTrash2, FiPlus, FiX } from 'react-icons/fi';
import useAxiosSecure from '../hooks/useAxiosSecure';
import Spinner from '../components/shared/Spinner';

const AMENITIES_LIST = [
  "Whiteboard", "Projector", "Wi-Fi", "Power Outlets", "Quiet Zone", "Air Conditioning"
];

const MyListings = () => {
  const axiosSecure = useAxiosSecure();
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  // Edit Modal State
  const [editingRoom, setEditingRoom] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    document.title = "StudyNook – My Listings";
    fetchMyRooms();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchMyRooms = async () => {
    try {
      setLoading(true);
      const response = await axiosSecure.get('/rooms/my-listings');
      setRooms(response.data);
    } catch (err) {
      console.error("Failed to fetch my listings", err);
      toast.error("Failed to load your listings.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (id) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this! All bookings for this room might be affected.",
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
          setRooms(prev => prev.filter(room => room._id !== id));
        } catch (err) {
          toast.error(err.response?.data?.message || "Failed to delete room");
        }
      }
    });
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    if (editingRoom.amenities.length === 0) {
      toast.error("Select at least one amenity.");
      return;
    }

    try {
      setIsUpdating(true);
      const { _id, ...updateData } = editingRoom;
      await axiosSecure.put(`/rooms/${_id}`, updateData);
      toast.success("Room updated successfully!");
      setEditingRoom(null);
      fetchMyRooms(); // Refresh data
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update room");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="container py-8" style={{ minHeight: '80vh' }}>
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '3rem'
      }}>
        <div>
          <h1 style={{
            fontFamily: 'Outfit, sans-serif',
            fontSize: 'clamp(2rem, 3vw, 2.5rem)',
            fontWeight: 800,
            color: 'var(--text-main)',
            marginBottom: '0.25rem'
          }}>
            My Room Listings
          </h1>
          <p style={{ color: 'var(--text-muted)' }}>Manage the study spaces you have listed on StudyNook.</p>
        </div>
        <Link to="/add-room" className="btn btn-primary" style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          borderRadius: '999px',
          background: 'linear-gradient(135deg, var(--primary) 0%, #8B5CF6 100%)'
        }}>
          <FiPlus /> Add New Room
        </Link>
      </div>

      {loading ? (
        <Spinner />
      ) : rooms.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '4rem 2rem',
          backgroundColor: 'var(--surface)',
          borderRadius: '24px',
          border: '1px dashed var(--border)'
        }}>
          <div style={{ fontSize: '3rem', opacity: 0.5, marginBottom: '1rem' }}>🏢</div>
          <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>You haven't listed any rooms yet.</h3>
          <p style={{ color: 'var(--text-muted)' }}>List your first room and let students start booking it.</p>
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
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: '2rem'
          }}
        >
          {rooms.map(room => (
            <motion.div
              key={room._id}
              variants={{ hidden: { opacity: 0, scale: 0.95 }, show: { opacity: 1, scale: 1 } }}
              style={{
                backgroundColor: 'var(--surface)',
                borderRadius: '16px',
                border: '1px solid var(--border)',
                overflow: 'hidden',
                boxShadow: '0 4px 15px rgba(0,0,0,0.03)'
              }}
            >
              <div style={{ position: 'relative', height: '180px' }}>
                <img 
                  src={room.image} 
                  alt={room.name} 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                />
                <div style={{
                  position: 'absolute',
                  top: '12px',
                  right: '12px',
                  backgroundColor: 'rgba(0,0,0,0.7)',
                  color: 'white',
                  padding: '4px 10px',
                  borderRadius: '999px',
                  fontSize: '0.8rem',
                  fontWeight: 600
                }}>
                  {room.bookingCount} Bookings
                </div>
              </div>
              <div style={{ padding: '1.25rem' }}>
                <h3 style={{ fontFamily: 'Outfit', fontSize: '1.25rem', marginBottom: '0.5rem' }}>{room.name}</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1rem' }}>
                  Floor: {room.floor} | Capacity: {room.capacity} | Rate: ${room.hourlyRate}/hr
                </p>
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  <button 
                    onClick={() => setEditingRoom(room)}
                    className="btn"
                    style={{
                      flex: 1,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.5rem',
                      backgroundColor: 'rgba(13, 148, 136, 0.1)',
                      color: 'var(--primary)'
                    }}
                  >
                    <FiEdit2 /> Edit
                  </button>
                  <button 
                    onClick={() => handleDelete(room._id)}
                    className="btn"
                    style={{
                      flex: 1,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.5rem',
                      backgroundColor: 'rgba(244, 63, 94, 0.1)',
                      color: 'var(--danger)'
                    }}
                  >
                    <FiTrash2 /> Delete
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Edit Room Modal overlay */}
      {editingRoom && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          backdropFilter: 'blur(4px)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1rem'
        }}>
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            style={{
              backgroundColor: 'var(--bg-color)',
              width: '100%',
              maxWidth: '600px',
              maxHeight: '90vh',
              overflowY: 'auto',
              borderRadius: '24px',
              padding: '2rem',
              position: 'relative'
            }}
          >
            <button 
              onClick={() => setEditingRoom(null)}
              style={{
                position: 'absolute',
                top: '1.5rem',
                right: '1.5rem',
                background: 'var(--border)',
                border: 'none',
                borderRadius: '50%',
                width: '32px',
                height: '32px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: 'var(--text-main)'
              }}
            >
              <FiX size={18} />
            </button>
            <h2 style={{ fontFamily: 'Outfit', fontSize: '1.5rem', marginBottom: '1.5rem' }}>Update Room</h2>
            
            <form onSubmit={handleUpdateSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <div className="form-group" style={{ flex: 1, margin: 0 }}>
                  <label>Room Name</label>
                  <input type="text" className="form-control" value={editingRoom.name} onChange={e => setEditingRoom({...editingRoom, name: e.target.value})} required />
                </div>
                <div className="form-group" style={{ flex: 1, margin: 0 }}>
                  <label>Floor</label>
                  <input type="text" className="form-control" value={editingRoom.floor} onChange={e => setEditingRoom({...editingRoom, floor: e.target.value})} required />
                </div>
              </div>
              <div className="form-group" style={{ margin: 0 }}>
                <label>Image URL</label>
                <input type="url" className="form-control" value={editingRoom.image} onChange={e => setEditingRoom({...editingRoom, image: e.target.value})} required />
              </div>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <div className="form-group" style={{ flex: 1, margin: 0 }}>
                  <label>Capacity</label>
                  <input type="number" className="form-control" min="1" value={editingRoom.capacity} onChange={e => setEditingRoom({...editingRoom, capacity: e.target.value})} required />
                </div>
                <div className="form-group" style={{ flex: 1, margin: 0 }}>
                  <label>Hourly Rate ($)</label>
                  <input type="number" className="form-control" step="0.01" min="0" value={editingRoom.hourlyRate} onChange={e => setEditingRoom({...editingRoom, hourlyRate: e.target.value})} required />
                </div>
              </div>
              <div className="form-group" style={{ margin: 0 }}>
                <label>Description</label>
                <textarea rows="3" className="form-control" value={editingRoom.description} onChange={e => setEditingRoom({...editingRoom, description: e.target.value})} required />
              </div>
              
              <div className="form-group" style={{ margin: 0 }}>
                <label>Amenities</label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.5rem', marginTop: '0.5rem' }}>
                  {AMENITIES_LIST.map(amenity => (
                    <label key={amenity} style={{ fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <input 
                        type="checkbox"
                        checked={editingRoom.amenities.includes(amenity)}
                        onChange={() => {
                          setEditingRoom(prev => ({
                            ...prev,
                            amenities: prev.amenities.includes(amenity)
                              ? prev.amenities.filter(a => a !== amenity)
                              : [...prev.amenities, amenity]
                          }));
                        }}
                      />
                      {amenity}
                    </label>
                  ))}
                </div>
              </div>

              <button type="submit" disabled={isUpdating} className="btn btn-primary" style={{ marginTop: '0.5rem' }}>
                {isUpdating ? 'Updating...' : 'Save Changes'}
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default MyListings;
