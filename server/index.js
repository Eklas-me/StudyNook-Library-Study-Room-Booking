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

    // ============================
    // STUDY ROOMS CRUD ROUTES
    // ============================

    // 1. Get all rooms with search & filters
    app.get('/api/rooms', async (req, res) => {
      try {
        const query = {};
        
        // Search by name ($regex)
        if (req.query.search) {
          query.name = { $regex: req.query.search, $options: 'i' };
        }
        
        // Filter by amenities ($in)
        if (req.query.amenities) {
          const amenitiesArr = req.query.amenities.split(',');
          query.amenities = { $in: amenitiesArr };
        }
        
        // Filter by floor
        if (req.query.floor) {
          query.floor = req.query.floor;
        }

        // Filter by hourly rate range ($gte, $lte)
        if (req.query.minRate || req.query.maxRate) {
          query.hourlyRate = {};
          if (req.query.minRate) {
            query.hourlyRate.$gte = parseFloat(req.query.minRate);
          }
          if (req.query.maxRate) {
            query.hourlyRate.$lte = parseFloat(req.query.maxRate);
          }
        }

        const rooms = await roomsCollection.find(query).sort({ createdAt: -1 }).toArray();
        res.send(rooms);
      } catch (error) {
        res.status(500).send({ message: 'Internal server error' });
      }
    });

    // 2. Get latest 6 rooms for Home Page
    app.get('/api/rooms/latest', async (req, res) => {
      try {
        const rooms = await roomsCollection
          .find({})
          .sort({ createdAt: -1 })
          .limit(6)
          .toArray();
        res.send(rooms);
      } catch (error) {
        res.status(500).send({ message: 'Internal server error' });
      }
    });

    // 3. Get my listed rooms (Private)
    app.get('/api/rooms/my-listings', verifyToken, async (req, res) => {
      try {
        const ownerId = req.user.id;
        const rooms = await roomsCollection
          .find({ owner: ownerId })
          .sort({ createdAt: -1 })
          .toArray();
        res.send(rooms);
      } catch (error) {
        res.status(500).send({ message: 'Internal server error' });
      }
    });

    // 4. Get single room by ID
    app.get('/api/rooms/:id', async (req, res) => {
      try {
        const id = req.params.id;
        const room = await roomsCollection.findOne({ _id: new ObjectId(id) });
        if (!room) {
          return res.status(404).send({ message: 'Room not found' });
        }
        res.send(room);
      } catch (error) {
        res.status(500).send({ message: 'Internal server error' });
      }
    });

    // 5. Add a room (Private)
    app.post('/api/rooms', verifyToken, async (req, res) => {
      try {
        const { name, description, image, floor, capacity, hourlyRate, amenities } = req.body;
        const newRoom = {
          name,
          description,
          image,
          floor,
          capacity: parseInt(capacity),
          hourlyRate: parseFloat(hourlyRate),
          amenities,
          owner: req.user.id,
          bookingCount: 0,
          createdAt: new Date()
        };
        const result = await roomsCollection.insertOne(newRoom);
        res.status(201).send({ insertedId: result.insertedId });
      } catch (error) {
        res.status(500).send({ message: 'Internal server error' });
      }
    });

    // 6. Update a room (Private, Owner only)
    app.put('/api/rooms/:id', verifyToken, async (req, res) => {
      try {
        const id = req.params.id;
        const room = await roomsCollection.findOne({ _id: new ObjectId(id) });
        if (!room) {
          return res.status(404).send({ message: 'Room not found' });
        }
        if (room.owner !== req.user.id) {
          return res.status(403).send({ message: 'Forbidden access: You do not own this room' });
        }
        const { name, description, image, floor, capacity, hourlyRate, amenities } = req.body;
        const updatedRoom = {
          $set: {
            name,
            description,
            image,
            floor,
            capacity: parseInt(capacity),
            hourlyRate: parseFloat(hourlyRate),
            amenities
          }
        };
        await roomsCollection.updateOne({ _id: new ObjectId(id) }, updatedRoom);
        res.send({ message: 'Room updated successfully' });
      } catch (error) {
        res.status(500).send({ message: 'Internal server error' });
      }
    });

    // 7. Delete a room (Private, Owner only)
    app.delete('/api/rooms/:id', verifyToken, async (req, res) => {
      try {
        const id = req.params.id;
        const room = await roomsCollection.findOne({ _id: new ObjectId(id) });
        if (!room) {
          return res.status(404).send({ message: 'Room not found' });
        }
        if (room.owner !== req.user.id) {
          return res.status(403).send({ message: 'Forbidden access: You do not own this room' });
        }
        
        await roomsCollection.deleteOne({ _id: new ObjectId(id) });
        res.send({ message: 'Room deleted successfully' });
      } catch (error) {
        res.status(500).send({ message: 'Internal server error' });
      }
    });

    // ============================
    // BOOKING SYSTEM ROUTES
    // ============================

    // 1. Book a room (Private)
    app.post('/api/bookings', verifyToken, async (req, res) => {
      try {
        const { roomId, date, startTime, endTime, totalCost, specialNote } = req.body;
        
        // Conflict check using $gte and $lte (prevent overlapping bookings)
        // Overlap condition: (startTime < existing.endTime) AND (endTime > existing.startTime)
        const conflict = await bookingsCollection.findOne({
          roomId: new ObjectId(roomId),
          date,
          status: 'confirmed',
          $or: [
            {
              $and: [
                { startTime: { $lt: endTime } },
                { endTime: { $gt: startTime } }
              ]
            }
          ]
        });

        if (conflict) {
          return res.status(409).send({ message: 'This time slot is already booked.' });
        }

        const newBooking = {
          roomId: new ObjectId(roomId),
          userId: new ObjectId(req.user.id),
          date,
          startTime,
          endTime,
          totalCost: parseFloat(totalCost),
          specialNote: specialNote || '',
          status: 'confirmed',
          createdAt: new Date()
        };

        const result = await bookingsCollection.insertOne(newBooking);
        const bookingId = result.insertedId;

        // Push booking ID to user's bookings array (Challenge requirement)
        await usersCollection.updateOne(
          { _id: new ObjectId(req.user.id) },
          { $push: { bookings: bookingId } }
        );

        // Increment room's bookingCount
        await roomsCollection.updateOne(
          { _id: new ObjectId(roomId) },
          { $inc: { bookingCount: 1 } }
        );

        res.status(201).send({ insertedId: bookingId });
      } catch (error) {
        res.status(500).send({ message: 'Internal server error' });
      }
    });

    // 2. Get current user's bookings (Private)
    app.get('/api/bookings/my-bookings', verifyToken, async (req, res) => {
      try {
        const userId = req.user.id;
        const bookings = await bookingsCollection.aggregate([
          { $match: { userId: new ObjectId(userId) } },
          {
            $lookup: {
              from: 'rooms',
              localField: 'roomId',
              foreignField: '_id',
              as: 'room'
            }
          },
          { $unwind: '$room' },
          { $sort: { date: 1, startTime: 1 } }
        ]).toArray();

        res.send(bookings);
      } catch (error) {
        res.status(500).send({ message: 'Internal server error' });
      }
    });

    // 3. Cancel a booking (Private)
    app.patch('/api/bookings/:id/cancel', verifyToken, async (req, res) => {
      try {
        const bookingId = req.params.id;
        const booking = await bookingsCollection.findOne({ _id: new ObjectId(bookingId) });
        if (!booking) {
          return res.status(404).send({ message: 'Booking not found' });
        }

        if (booking.userId.toString() !== req.user.id) {
          return res.status(403).send({ message: 'Forbidden access: This is not your booking' });
        }

        // Set status to cancelled
        await bookingsCollection.updateOne(
          { _id: new ObjectId(bookingId) },
          { $set: { status: 'cancelled' } }
        );

        // Pull booking ID from user's bookings array (Challenge requirement)
        await usersCollection.updateOne(
          { _id: new ObjectId(req.user.id) },
          { $pull: { bookings: new ObjectId(bookingId) } }
        );

        // Decrement room's bookingCount
        await roomsCollection.updateOne(
          { _id: booking.roomId },
          { $inc: { bookingCount: -1 } }
        );

        res.send({ message: 'Booking cancelled successfully' });
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
