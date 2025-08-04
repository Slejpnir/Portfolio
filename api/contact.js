import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { name, email, phone, designType, selectedFlash, size, description, uploadedFile } = req.body;

    // Validate required fields
    if (!name || !size || !description) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Validate that at least one contact method is provided
    if (!email && !phone) {
      return res.status(400).json({ message: 'Please provide either an email or phone number' });
    }

    // Create email content
    const emailContent = `
      <h2>New Tattoo Booking Request</h2>
      <p><strong>Name:</strong> ${name}</p>
      ${email ? `<p><strong>Email:</strong> ${email}</p>` : ''}
      ${phone ? `<p><strong>Phone:</strong> ${phone}</p>` : ''}
      <p><strong>Design Type:</strong> ${designType}</p>
      ${designType === 'flash' ? `<p><strong>Selected Flash Design:</strong> ${selectedFlash}</p>` : ''}
      <p><strong>Size:</strong> ${size}</p>
      <p><strong>Description:</strong> ${description}</p>
      ${uploadedFile ? `<p><strong>Reference Image:</strong> Attached as file: ${uploadedFile.name}</p>` : ''}
    `;

    // Prepare email options
    const emailOptions = {
      from: 'Tattoo Portfolio <onboarding@resend.dev>',
      to: [process.env.ADMIN_EMAIL],
      subject: `New Tattoo Booking: ${name}`,
      html: emailContent,
    };

    // Add attachment if file is uploaded
    if (uploadedFile && uploadedFile.data) {
      // Convert base64 to buffer for attachment
      const base64Data = uploadedFile.data.replace(/^data:image\/[a-z]+;base64,/, '');
      const buffer = Buffer.from(base64Data, 'base64');
      
      emailOptions.attachments = [
        {
          filename: uploadedFile.name,
          content: buffer,
          contentType: uploadedFile.type
        }
      ];
    }

    // Send email
    const { data, error } = await resend.emails.send(emailOptions);

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