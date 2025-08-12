import express from 'express';
import cors from 'cors';

const app = express();
const port = 3001;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Simple test endpoint
app.post('/contact', async (req, res) => {
  try {
    const { name, email, phone, designType, selectedFlash, size, description, appointmentDate, appointmentTime, uploadedFile } = req.body;

    // Validate required fields
    if (!name || !size || !description) {
      return res.status(400).json({ message: 'Name, size, and description are required' });
    }

    // Validate that at least email or phone is provided
    if (!email && !phone) {
      return res.status(400).json({ message: 'Please provide either an email or phone number' });
    }

    // Validate appointment details
    if (!appointmentDate || !appointmentTime) {
      return res.status(400).json({ message: 'Appointment date and time are required' });
    }

    // For local testing: block if slot is booked in-memory
    const key = `${appointmentDate}|${appointmentTime}`;
    if (localBookings.has(key)) {
      return res.status(409).json({ message: 'Selected time slot is already booked' });
    }

    // For local testing, just return success (no email sending)
    console.log('📧 Local Test - Booking Request Received:');
    console.log('Name:', name);
    console.log('Size:', size);
    console.log('Description:', description);
    console.log('Appointment:', appointmentDate, 'at', appointmentTime);
    console.log('Design Type:', designType);
    if (email) console.log('Email:', email);
    if (phone) console.log('Phone:', phone);
    if (designType === 'flash' && selectedFlash) console.log('Flash Design:', selectedFlash);
    if (uploadedFile) console.log('File uploaded:', uploadedFile.name);

    return res.status(200).json({ 
      message: 'Local test successful! This would send an email on Vercel.',
      data: { name, size, description, appointmentDate, appointmentTime }
    });
  } catch (error) {
    console.error('API error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// In-memory bookings for local testing
const localBookings = new Set(); // keys: `${date}|${time}`

app.get('/bookings', (req, res) => {
  const bookings = Array.from(localBookings).map((k) => {
    const [date, time] = k.split('|');
    return { date, time };
  });
  res.json({ bookings });
});

app.post('/bookings', (req, res) => {
  const { date, time } = req.body || {};
  if (!date || !time) {
    return res.status(400).json({ message: 'date and time are required' });
  }
  const key = `${date}|${time}`;
  if (localBookings.has(key)) {
    localBookings.delete(key);
    return res.json({ message: 'unbooked', date, time, booked: false });
  } else {
    localBookings.add(key);
    return res.json({ message: 'booked', date, time, booked: true });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Local test server running' });
});

app.listen(port, () => {
  console.log(`🚀 Local test server running on http://localhost:${port}`);
  console.log(`📝 Test the booking form at http://localhost:5173/`);
  console.log(`🔧 API endpoint: http://localhost:${port}/contact`);
});
