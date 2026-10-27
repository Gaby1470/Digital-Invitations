import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { enforceRateLimit } from '@/lib/rate-limit';

const EMAIL_RE = /^[^\s@<>"]+@[^\s@<>"]+\.[^\s@<>"]+$/;

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// Strip CR/LF to prevent header injection
function singleLine(value: string, max: number): string {
  return value.replace(/[\r\n]+/g, ' ').trim().slice(0, max);
}

export async function POST(request: Request) {
  const rateLimitResponse = await enforceRateLimit(request, 'contact', 5, 60 * 60);
  if (rateLimitResponse) return rateLimitResponse;

  try {
    const body = await request.json().catch(() => null);
    if (!body || typeof body !== 'object') {
      return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
    }

    const name = typeof body.name === 'string' ? singleLine(body.name, 100) : '';
    const email = typeof body.email === 'string' ? singleLine(body.email, 254) : '';
    const subject = typeof body.subject === 'string' ? singleLine(body.subject, 150) : '';
    const message = typeof body.message === 'string' ? body.message.trim().slice(0, 5000) : '';

    if (!name || !subject || !message || !EMAIL_RE.test(email)) {
      return NextResponse.json({ error: 'Please fill in all fields with valid values.' }, { status: 400 });
    }

    // Create a transporter object using the default SMTP transport
    // You need to set up your environment variables for this to work.
    // For example, using Gmail, you would need to set:
    // EMAIL_HOST=smtp.gmail.com
    // EMAIL_PORT=587
    // EMAIL_USER=your-email@gmail.com
    // EMAIL_PASS=your-gmail-app-password
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: Number(process.env.EMAIL_PORT),
      secure: process.env.EMAIL_PORT === '465', // true for 465, false for other ports
      auth: {
        user: process.env.EMAIL_USER, // your email address
        pass: process.env.EMAIL_PASS, // your email password or app password
      },
    });

    const mailOptions = {
      from: `"Tap 2 Invite Contact" <tap2invite@gmail.com>`, // sender address
      replyTo: email,
      to: 'tap2invite@gmail.com', // list of receivers
      subject: `Contact Form: ${subject}`, // Subject line
      text: message, // plain text body
      html: `
        <h1>New Contact Form Submission</h1>
        <p><strong>Name:</strong> ${escapeHtml(name)}</p>
        <p><strong>Email:</strong> ${escapeHtml(email)}</p>
        <p><strong>Subject:</strong> ${escapeHtml(subject)}</p>
        <p><strong>Message:</strong></p>
        <p>${escapeHtml(message).replace(/\n/g, '<br />')}</p>
      `, // html body
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json({ message: 'Email sent successfully!' }, { status: 200 });
  } catch (error) {
    console.error('Error sending email:', error);
    return NextResponse.json({ error: 'Error sending email' }, { status: 500 });
  }
}
