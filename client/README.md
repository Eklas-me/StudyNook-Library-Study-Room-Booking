# StudyNook - Frontend

StudyNook is a dynamic, premium web application designed for students to easily find, book, and manage library study rooms. 

## Features
- **Modern & Premium UI:** Glassmorphism UI, smooth gradients, and engaging micro-animations using Framer Motion.
- **Authentication:** JWT-based robust authentication combined with Firebase Email/Password & Google Login.
- **Room Booking System:** Real-time cost calculation, conflict prevention, and complete CRUD for study spaces.
- **Advanced Filtering:** Browse rooms by specific amenities and hourly rate range.
- **Secure Routes:** Full implementation of Private Routes protecting critical parts of the application.
- **Responsive Design:** Fully fluid typography and layout optimized for all devices.

## Tech Stack
- React 18
- Vite
- TailwindCSS (Utility classes) & Vanilla CSS for Custom Aesthetics
- React Router DOM
- Axios (with interceptors for secure requests)
- Firebase Auth
- Framer Motion

## Getting Started
1. Clone the repository and navigate to the `client` directory.
2. Run `npm install` to install dependencies.
3. Create a `.env.local` file with your Firebase and API configurations (see `.env.example`).
4. Run `npm run dev` to start the development server.
