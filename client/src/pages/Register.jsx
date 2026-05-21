import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import toast from 'react-hot-toast';
import { GoogleLogin } from '@react-oauth/google';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [photoURL, setPhotoURL] = useState('');
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const { registerUser, googleLogin } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "StudyNook – Register";
  }, []);

  const validatePassword = (pass) => {
    if (pass.length < 6) return "Password must be at least 6 characters";
    if (!/[A-Z]/.test(pass)) return "Password must contain at least one uppercase letter";
    if (!/[a-z]/.test(pass)) return "Password must contain at least one lowercase letter";
    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const errorMsg = validatePassword(password);
    if (errorMsg) {
      setPasswordError(errorMsg);
      return;
    }
    
    setPasswordError('');

    try {
      await registerUser(name, email, photoURL, password);
      toast.success("Registration successful! Please login.");
      navigate('/login');
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed");
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      await googleLogin(credentialResponse.credential);
      toast.success("Logged in with Google!");
      navigate('/');
    } catch (err) {
      toast.error("Google login failed");
    }
  };

  return (
    <div className="container py-8" style={{ maxWidth: '500px', margin: '0 auto' }}>
      <div className="card" style={{ padding: '2rem' }}>
        <h2 className="text-center mb-4">Register for StudyNook</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Full Name</label>
            <input 
              type="text" 
              className="form-control" 
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>Email address</label>
            <input 
              type="email" 
              className="form-control" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>Photo URL</label>
            <input 
              type="url" 
              className="form-control" 
              required
              value={photoURL}
              onChange={(e) => setPhotoURL(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input 
              type="password" 
              className="form-control" 
              required
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setPasswordError('');
              }}
            />
            {passwordError && <p style={{ color: 'var(--danger)', fontSize: '0.85rem', marginTop: '4px' }}>{passwordError}</p>}
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Register</button>
        </form>

        <div style={{ textAlign: 'center', margin: '1.5rem 0' }}>
          <span style={{ color: 'var(--text-muted)' }}>--- Or ---</span>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() => {
              toast.error('Google Login Failed');
            }}
            text="signup_with"
          />
        </div>

        <p className="text-center mt-4">
          Already have an account? <Link to="/login" style={{ color: 'var(--primary)', fontWeight: '500' }}>Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
