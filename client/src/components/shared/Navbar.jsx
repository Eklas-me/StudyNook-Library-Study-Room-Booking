import { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import { ThemeContext } from '../../contexts/ThemeContext';
import { FiSun, FiMoon, FiMenu, FiX } from 'react-icons/fi';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useContext(ThemeContext);
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const navLinks = (
    <>
      <Link to="/" className="nav-link" onClick={() => setIsMenuOpen(false)}>Home</Link>
      <Link to="/rooms" className="nav-link" onClick={() => setIsMenuOpen(false)}>Rooms</Link>
      {user && (
        <>
          <Link to="/add-room" className="nav-link" onClick={() => setIsMenuOpen(false)}>Add Room</Link>
          <Link to="/my-listings" className="nav-link" onClick={() => setIsMenuOpen(false)}>My Listings</Link>
          <Link to="/my-bookings" className="nav-link" onClick={() => setIsMenuOpen(false)}>My Bookings</Link>
        </>
      )}
    </>
  );

  return (
    <nav className="navbar">
      <div className="container nav-container">
        {/* Logo */}
        <Link to="/" className="logo">
          Study<span style={{ color: 'var(--primary)' }}>Nook</span>
        </Link>

        {/* Desktop Links */}
        <div className="nav-links-desktop">
          {navLinks}
        </div>

        {/* Right Actions */}
        <div className="nav-actions">
          {/* Theme Toggle */}
          <button onClick={toggleTheme} className="theme-toggle-btn" title="Toggle Theme">
            {isDark ? <FiSun size={20} /> : <FiMoon size={20} />}
          </button>

          {/* Auth Buttons / Profile */}
          {user ? (
            <div className="profile-container">
              <img 
                src={user.photoURL || 'https://via.placeholder.com/40'} 
                alt="Profile" 
                className="profile-img"
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                title={user.name}
              />
              {isProfileOpen && (
                <div className="profile-dropdown">
                  <p className="profile-name">{user.name}</p>
                  <button onClick={handleLogout} className="btn btn-outline" style={{ width: '100%', marginTop: '10px' }}>Logout</button>
                </div>
              )}
            </div>
          ) : (
            <div className="auth-buttons-desktop">
              <Link to="/login" className="btn btn-outline" style={{ marginRight: '10px' }}>Login</Link>
              <Link to="/register" className="btn btn-primary">Register</Link>
            </div>
          )}

          {/* Mobile Menu Toggle */}
          <button className="mobile-menu-btn" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="mobile-menu">
          {navLinks}
          {!user && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '15px' }}>
              <Link to="/login" className="btn btn-outline" onClick={() => setIsMenuOpen(false)}>Login</Link>
              <Link to="/register" className="btn btn-primary" onClick={() => setIsMenuOpen(false)}>Register</Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
