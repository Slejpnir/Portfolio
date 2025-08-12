# InkCraft - Professional Tattoo Portfolio

A modern, responsive tattoo portfolio website built with React, Vite, and Tailwind CSS. Features include an interactive appointment calendar, booking system, gallery management, and email notifications.

## ✨ Features

- **Interactive Appointment Calendar** - Select dates and time slots
- **Admin Mode** - Toggle booked time slots (password: `admin123`)
- **Gallery Tabs** - Separate healed tattoos and flash designs
- **Quick Booking** - Book flash designs directly from gallery
- **File Upload** - Upload design references for custom tattoos
- **Email Notifications** - Automatic booking request emails via Resend
- **Responsive Design** - Works on all devices
- **Modern UI/UX** - Smooth transitions and professional styling

## 🚀 Quick Start

### Prerequisites
- Node.js 18.x or higher
- npm or yarn

### Local Development
1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd tattoo-portfolio
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory:
   ```bash
   RESEND_API_KEY=your_resend_api_key_here
   ADMIN_EMAIL=your_email@example.com
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5174`

## 🌐 Vercel Deployment

This project is optimized for Vercel deployment with serverless API routes.

### Automatic Deployment
1. **Push to GitHub** - Vercel will auto-deploy on push
2. **Set Environment Variables** in Vercel dashboard:
   - Go to Project Settings → Environment Variables
   - Add `RESEND_API_KEY` and `ADMIN_EMAIL`

### Manual Deployment
1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Deploy**
   ```bash
   vercel
   ```

3. **Set environment variables**
   ```bash
   vercel env add RESEND_API_KEY
   vercel env add ADMIN_EMAIL
   ```

## 📧 Email Setup (Resend)

1. **Create Resend account** at [resend.com](https://resend.com)
2. **Get API key** from dashboard
3. **Add to environment variables**
4. **Verify domain** (optional but recommended)

## 🏗️ Project Structure

```
tattoo-portfolio/
├── api/
│   └── contact.js          # Vercel serverless function
├── src/
│   └── tattoo_portfolio_template.jsx  # Main React component
├── index.html              # HTML entry point
├── package.json            # Dependencies and scripts
├── vite.config.js          # Vite configuration
├── tailwind.config.js      # Tailwind CSS configuration
└── postcss.config.js       # PostCSS configuration
```

## 🎨 Customization

### Colors
- Primary: Emerald (`emerald-400`, `emerald-500`)
- Background: Zinc (`zinc-950`, `zinc-900`, `zinc-800`)
- Text: White and Zinc variants

### Content
- **Gallery Images**: Update `healedTattoos` and `flashDesigns` arrays
- **Testimonials**: Modify `testimonials` array
- **Business Info**: Update contact details and social links

### Styling
- **Tailwind CSS**: Utility-first CSS framework
- **Responsive**: Mobile-first design approach
- **Animations**: Smooth transitions and hover effects

## 🔧 API Endpoints

### POST `/api/contact`
Handles booking form submissions and sends emails.

**Request Body:**
```json
{
  "name": "Client Name",
  "email": "client@email.com",
  "phone": "+1234567890",
  "designType": "own|flash",
  "selectedFlash": "Design Title",
  "size": "small|medium|large",
  "description": "Tattoo description",
  "appointmentDate": "2024-12-25",
  "appointmentTime": "14:00",
  "uploadedFile": "base64_data_optional"
}
```

## 🚨 Troubleshooting

### Common Issues

1. **"Unexpected end of JSON input"**
   - Ensure API endpoint is accessible
   - Check environment variables are set
   - Verify Resend API key is valid

2. **Build errors on Vercel**
   - Check Node.js version (18.x required)
   - Verify all dependencies are in `package.json`
   - Ensure API routes are in `api/` folder

3. **Email not sending**
   - Verify `RESEND_API_KEY` is set
   - Check `ADMIN_EMAIL` is valid
   - Review Resend dashboard for errors

### Local Development Issues

1. **Port conflicts**
   - Vite will automatically find available ports
   - Check terminal output for actual port number

2. **Dependencies issues**
   - Delete `node_modules` and `package-lock.json`
   - Run `npm install` again

## 📱 Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For issues and questions:
1. Check the troubleshooting section
2. Review Vercel deployment logs
3. Check Resend email delivery status
4. Open a GitHub issue

---

**Built with ❤️ using React, Vite, and Tailwind CSS**
