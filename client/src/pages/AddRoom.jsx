import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { FiHome, FiImage, FiMapPin, FiUsers, FiDollarSign, FiFileText } from 'react-icons/fi';
import useAxiosSecure from '../hooks/useAxiosSecure';

const AMENITIES_LIST = [
  "Whiteboard", "Projector", "Wi-Fi", "Power Outlets", "Quiet Zone", "Air Conditioning"
];

const AddRoom = () => {
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    image: '',
    floor: '',
    capacity: '',
    hourlyRate: '',
    amenities: []
  });

  useEffect(() => {
    document.title = "StudyNook – Add Room";
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (amenity) => {
    setFormData(prev => {
      const isSelected = prev.amenities.includes(amenity);
      if (isSelected) {
        return { ...prev, amenities: prev.amenities.filter(a => a !== amenity) };
      } else {
        return { ...prev, amenities: [...prev.amenities, amenity] };
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.amenities.length === 0) {
      toast.error("Please select at least one amenity.");
      return;
    }

    try {
      setLoading(true);
      await axiosSecure.post('/rooms', formData);
      toast.success("Room added successfully!");
      navigate('/my-listings');
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to add room. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-8" style={{ minHeight: '80vh', maxWidth: '800px' }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          backgroundColor: 'var(--surface)',
          borderRadius: '24px',
          padding: '2.5rem',
          border: '1px solid var(--border)',
          boxShadow: '0 8px 30px rgba(0,0,0,0.04)'
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <h1 style={{
            fontFamily: 'Outfit, sans-serif',
            fontSize: 'clamp(1.75rem, 3vw, 2.25rem)',
            fontWeight: 800,
            marginBottom: '0.5rem',
            color: 'var(--text-main)'
          }}>
            List a Study Room
          </h1>
          <p style={{ color: 'var(--text-muted)' }}>
            Provide the details of your study space so students can book it easily.
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {/* Room Name & Floor (Row) */}
          <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
            <div className="form-group" style={{ flex: '1 1 300px', margin: 0 }}>
              <label>
                <FiHome style={{ marginRight: '6px' }} /> Room Name *
              </label>
              <input
                type="text"
                name="name"
                required
                placeholder="e.g., Silent Corner Nook"
                className="form-control"
                value={formData.name}
                onChange={handleChange}
              />
            </div>
            <div className="form-group" style={{ flex: '1 1 200px', margin: 0 }}>
              <label>
                <FiMapPin style={{ marginRight: '6px' }} /> Floor *
              </label>
              <input
                type="text"
                name="floor"
                required
                placeholder="e.g., 3rd Floor"
                className="form-control"
                value={formData.floor}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Image URL */}
          <div className="form-group" style={{ margin: 0 }}>
            <label>
              <FiImage style={{ marginRight: '6px' }} /> Image URL *
            </label>
            <input
              type="url"
              name="image"
              required
              placeholder="https://example.com/room-image.jpg"
              className="form-control"
              value={formData.image}
              onChange={handleChange}
            />
          </div>

          {/* Capacity & Rate (Row) */}
          <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
            <div className="form-group" style={{ flex: 1, margin: 0 }}>
              <label>
                <FiUsers style={{ marginRight: '6px' }} /> Capacity (Persons) *
              </label>
              <input
                type="number"
                name="capacity"
                required
                min="1"
                placeholder="e.g., 4"
                className="form-control"
                value={formData.capacity}
                onChange={handleChange}
              />
            </div>
            <div className="form-group" style={{ flex: 1, margin: 0 }}>
              <label>
                <FiDollarSign style={{ marginRight: '6px' }} /> Hourly Rate ($) *
              </label>
              <input
                type="number"
                name="hourlyRate"
                required
                min="0"
                step="0.01"
                placeholder="e.g., 5.00"
                className="form-control"
                value={formData.hourlyRate}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Description */}
          <div className="form-group" style={{ margin: 0 }}>
            <label>
              <FiFileText style={{ marginRight: '6px' }} /> Description *
            </label>
            <textarea
              name="description"
              required
              rows="4"
              placeholder="Describe the room, its environment, and any special rules..."
              className="form-control"
              value={formData.description}
              onChange={handleChange}
              style={{ resize: 'vertical' }}
            />
          </div>

          {/* Amenities (Checkboxes) */}
          <div className="form-group" style={{ margin: 0 }}>
            <label style={{ marginBottom: '1rem' }}>Amenities (Select at least one) *</label>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
              gap: '1rem'
            }}>
              {AMENITIES_LIST.map(amenity => (
                <label key={amenity} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  cursor: 'pointer',
                  fontSize: '0.95rem',
                  fontWeight: 400
                }}>
                  <input
                    type="checkbox"
                    checked={formData.amenities.includes(amenity)}
                    onChange={() => handleCheckboxChange(amenity)}
                    style={{
                      width: '18px',
                      height: '18px',
                      accentColor: 'var(--primary)'
                    }}
                  />
                  {amenity}
                </label>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary"
            style={{
              marginTop: '1rem',
              padding: '14px',
              fontSize: '1rem',
              fontWeight: 600,
              display: 'flex',
              justifyContent: 'center',
              background: 'linear-gradient(90deg, var(--primary) 0%, #0F766E 100%)'
            }}
          >
            {loading ? 'Adding Room...' : 'List Study Room'}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default AddRoom;
