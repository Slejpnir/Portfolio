import { Resend } from 'resend';
import { Redis } from '@upstash/redis';

const resend = new Resend(process.env.RESEND_API_KEY);
const redis = process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
  ? new Redis({ url: process.env.UPSTASH_REDIS_REST_URL, token: process.env.UPSTASH_REDIS_REST_TOKEN })
  : null;

export default async function handler(req, res) {
  // Enable CORS for Vercel
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,DELETE,PATCH,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

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

    // If Redis configured, block already-booked slots
    if (redis) {
      const key = `${appointmentDate}|${appointmentTime}`;
      const isBooked = await redis.sismember('bookings', key);
      if (isBooked) {
        return res.status(409).json({ message: 'Selected time slot is already booked' });
      }
    }

    // Prepare email content
    let emailContent = `
      <h2>New Tattoo Booking Request</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Size:</strong> ${size}</p>
      <p><strong>Description:</strong> ${description}</p>
      <p><strong>Appointment Date:</strong> ${appointmentDate}</p>
      <p><strong>Appointment Time:</strong> ${appointmentTime}</p>
      <p><strong>Design Type:</strong> ${designType}</p>
    `;

    // Add contact information
    if (email) {
      emailContent += `<p><strong>Email:</strong> ${email}</p>`;
    }
    if (phone) {
      emailContent += `<p><strong>Phone:</strong> ${phone}</p>`;
    }

    // Add flash design selection if applicable
    if (designType === 'flash' && selectedFlash) {
      emailContent += `<p><strong>Selected Flash Design:</strong> ${selectedFlash}</p>`;
    }

    // Prepare email data
    const emailData = {
      from: process.env.ADMIN_EMAIL || 'noreply@yourdomain.com',
      to: process.env.ADMIN_EMAIL || 'admin@yourdomain.com',
      subject: `New Tattoo Booking: ${name} - ${appointmentDate} at ${appointmentTime}`,
      html: emailContent,
    };

    // Add attachment if file was uploaded
    if (uploadedFile && uploadedFile.data) {
      // Convert base64 to buffer
      const base64Data = uploadedFile.data.replace(/^data:image\/[a-z]+;base64,/, '');
      const buffer = Buffer.from(base64Data, 'base64');
      
      emailData.attachments = [{
        filename: uploadedFile.name,
        content: buffer,
        contentType: uploadedFile.type
      }];
    }

    // Send email
    const { data, error } = await resend.emails.send(emailData);

    if (error) {
      console.error('Resend error:', error);
      return res.status(500).json({ message: 'Failed to send email' });
    }

    // After email success, mark the slot as booked in Redis (if configured)
    if (redis) {
      try {
        const key = `${appointmentDate}|${appointmentTime}`;
        await redis.sadd('bookings', key);
      } catch (e) {
        console.error('Failed to persist booking in Redis:', e);
      }
    }

    return res.status(200).json({ message: 'Booking request sent successfully', data });
  } catch (error) {
    console.error('API error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
} 