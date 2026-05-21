import { useEffect } from 'react';
import Banner from '../components/home/Banner';
import AvailableRooms from '../components/home/AvailableRooms';
import HowItWorks from '../components/home/HowItWorks';
import Testimonials from '../components/home/Testimonials';

const Home = () => {
  useEffect(() => {
    // Set dynamic tab title
    document.title = "StudyNook – Home";
  }, []);

  return (
    <div className="container" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {/* 1. Hero Banner */}
      <Banner />

      {/* 2. Available Rooms (latest 6) */}
      <AvailableRooms />

      {/* 3. Extra Section 1: How it Works */}
      <HowItWorks />

      {/* 4. Extra Section 2: Testimonials */}
      <Testimonials />
    </div>
  );
};

export default Home;
