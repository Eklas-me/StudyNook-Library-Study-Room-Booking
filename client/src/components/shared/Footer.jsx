import { Link } from 'react-router-dom';
import { FaFacebook, FaLinkedin, FaInstagram } from 'react-icons/fa';
import { RiTwitterXFill } from 'react-icons/ri';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container footer-container">
        
        {/* Column 1: Logo & Info */}
        <div className="footer-col">
          <Link to="/" className="logo">
            Study<span style={{ color: 'var(--primary)' }}>Nook</span>
          </Link>
          <p className="footer-text mt-2">
            Your premium destination for booking quiet, private study rooms in the library. Focus better, study smarter.
          </p>
        </div>

        {/* Column 2: Quick Links */}
        <div className="footer-col">
          <h3>Quick Links</h3>
          <ul className="footer-links mt-2">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/rooms">Available Rooms</Link></li>
            <li><Link to="#">About Us</Link></li>
            <li><Link to="#">Privacy Policy</Link></li>
          </ul>
        </div>

        {/* Column 3: Contact & Social */}
        <div className="footer-col">
          <h3>Contact Us</h3>
          <p className="footer-text mt-2">Email: support@studynook.com</p>
          <p className="footer-text">Phone: +1 234 567 890</p>
          
          <div className="social-icons mt-4">
            <a href="#" className="social-icon"><FaFacebook size={20} /></a>
            <a href="#" className="social-icon"><RiTwitterXFill size={20} /></a>
            <a href="#" className="social-icon"><FaLinkedin size={20} /></a>
            <a href="#" className="social-icon"><FaInstagram size={20} /></a>
          </div>
        </div>

      </div>
      
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} StudyNook. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
