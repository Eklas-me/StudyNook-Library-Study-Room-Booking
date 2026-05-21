# StudyNook - Backend

This is the backend server for StudyNook, a modern library study room booking application. Built with Node.js, Express, and MongoDB, this API powers the comprehensive CRUD operations, authenticates users securely, and manages the robust room booking workflow.

## Features
- **JWT Authentication:** Secure token generation on login/registration, stored in HTTP-only cookies to prevent XSS attacks.
- **Protected Routes:** Middleware to verify JWT tokens securely before authorizing sensitive API calls.
- **Room CRUD API:** Endpoints to Create, Read, Update, and Delete study rooms, including complex queries (search by name, filter by amenities, filter by price range).
- **Booking Management:** Endpoints for creating bookings (with time-conflict resolution checks), retrieving a user's bookings, and securely cancelling bookings.
- **CORS Configured:** Secure Cross-Origin Resource Sharing settings tailored for local development and production environments.

## Tech Stack
- Node.js & Express.js
- MongoDB & Mongoose (or native MongoDB driver)
- JSON Web Tokens (JWT)
- Cookie-Parser
- Dotenv
- Cors

## Getting Started
1. Clone the repository and navigate to the `server` directory.
2. Run `npm install` to install backend dependencies.
3. Create a `.env` file containing your `MONGODB_URI` and `JWT_SECRET` (see `.env.example`).
4. Start the server using `npm run dev` (for Nodemon) or `node index.js`.
