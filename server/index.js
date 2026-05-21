const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcrypt');
const { OAuth2Client } = require('google-auth-library');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// Custom middleware to verify Token
const verifyToken = (req, res, next) => {
  const token = req.cookies?.token;
  
  if (!token) {
    return res.status(401).send({ message: 'unauthorized access' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).send({ message: 'unauthorized access' });
    }
    req.user = decoded;
    next();
  });
};

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

const googleClient = new OAuth2Client(process.env.VITE_GOOGLE_CLIENT_ID);

async function run() {
  try {
    const db = client.db('studyNookDb');
    const usersCollection = db.collection('users');
    const roomsCollection = db.collection('rooms');
    const bookingsCollection = db.collection('bookings');

    // ============================
    // AUTHENTICATION ROUTES
    // ============================

    // 1. Register User (Email/Password)
    app.post('/api/auth/register', async (req, res) => {
      const { name, email, photoURL, password } = req.body;
      
      try {
        // Check if user already exists
        const existingUser = await usersCollection.findOne({ email });
        if (existingUser) {
          return res.status(400).send({ message: 'User already exists' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Save user
        const newUser = {
          name,
          email,
          photoURL,
          password: hashedPassword,
          bookings: [],
          createdAt: new Date()
        };

        const result = await usersCollection.insertOne(newUser);
        res.status(201).send({ insertedId: result.insertedId });
      } catch (error) {
        res.status(500).send({ message: 'Internal server error' });
      }
    });

    // 2. Login User (Email/Password)
    app.post('/api/auth/login', async (req, res) => {
      const { email, password } = req.body;
      
      try {
        const user = await usersCollection.findOne({ email });
        if (!user) {
          return res.status(401).send({ message: 'Invalid email or password' });
        }

        if (!user.password) {
          return res.status(401).send({ message: 'Invalid login method. Try Google Login.' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
          return res.status(401).send({ message: 'Invalid email or password' });
        }

        // Generate JWT
        const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '7d' });

        // Set Cookie
        res.cookie('token', token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
          maxAge: 7 * 24 * 60 * 60 * 1000
        });

        res.send({ 
          _id: user._id, 
          name: user.name, 
          email: user.email, 
          photoURL: user.photoURL 
        });
      } catch (error) {
        res.status(500).send({ message: 'Internal server error' });
      }
    });

    // 3. Google Login
    app.post('/api/auth/google-login', async (req, res) => {
      const { credential } = req.body; // credential is the JWT sent from Google OAuth on client

      try {
        // Verify Google token
        const ticket = await googleClient.verifyIdToken({
          idToken: credential,
          audience: process.env.VITE_GOOGLE_CLIENT_ID, 
        });
        const payload = ticket.getPayload();
        
        const { email, name, picture } = payload;

        // Check if user exists in DB
        let user = await usersCollection.findOne({ email });
        
        if (!user) {
          // Create new user if not exists
          const newUser = {
            name,
            email,
            photoURL: picture,
            bookings: [],
            createdAt: new Date()
            // No password field since they used Google
          };
          const result = await usersCollection.insertOne(newUser);
          user = { ...newUser, _id: result.insertedId };
        }

        // Generate JWT
        const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '7d' });

        // Set Cookie
        res.cookie('token', token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
          maxAge: 7 * 24 * 60 * 60 * 1000
        });

        res.send({ 
          _id: user._id, 
          name: user.name, 
          email: user.email, 
          photoURL: user.photoURL 
        });
      } catch (error) {
        console.error(error);
        res.status(401).send({ message: 'Google authentication failed' });
      }
    });

    // 4. Logout
    app.post('/api/auth/logout', (req, res) => {
      res.clearCookie('token', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
        maxAge: 0
      });
      res.send({ message: 'Logged out successfully' });
    });

    // 5. Get Current User (Protected via verifyToken)
    app.get('/api/auth/me', verifyToken, async (req, res) => {
      try {
        const user = await usersCollection.findOne(
          { _id: new ObjectId(req.user.id) },
          { projection: { password: 0 } } // Don't send password
        );
        
        if (!user) {
          return res.status(404).send({ message: 'User not found' });
        }
        
        res.send(user);
      } catch (error) {
        res.status(500).send({ message: 'Internal server error' });
      }
    });

    // Root route
    app.get('/', (req, res) => {
      res.send('StudyNook Server is running');
    });

    app.listen(port, () => {
      console.log(`Server is running on port: ${port}`);
    });

  } finally {
    // Keep server running
  }
}
run().catch(console.dir);
