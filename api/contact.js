import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { name, email, designType, selectedFlash, size, description, uploadedFile } = req.body;

    // Validate required fields
    if (!name || !email || !size || !description) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Create email content
    const emailContent = `
      <h2>New Tattoo Booking Request</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Design Type:</strong> ${designType}</p>
      ${designType === 'flash' ? `<p><strong>Selected Flash Design:</strong> ${selectedFlash}</p>` : ''}
      <p><strong>Size:</strong> ${size}</p>
      <p><strong>Description:</strong> ${description}</p>
      ${uploadedFile ? `<p><strong>File Uploaded:</strong> ${uploadedFile.name}</p>` : ''}
    `;

    // Send email
    const { data, error } = await resend.emails.send({
      from: 'Tattoo Portfolio <onboarding@resend.dev>', // You'll need to verify your domain
      to: [process.env.ADMIN_EMAIL], // Your email address
      subject: `New Tattoo Booking: ${name}`,
      html: emailContent,
    });

    if (error) {
      console.error('Resend error:', error);
      return res.status(500).json({ message: 'Failed to send email' });
    }

    return res.status(200).json({ message: 'Email sent successfully' });
  } catch (error) {
    console.error('Server error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
} 