import { NextRequest, NextResponse } from 'next/server';
import sgMail from '@sendgrid/mail';

// Initialize SendGrid with API key
if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
}

export async function POST(request: NextRequest) {
  try {
    const { name, email, subject, message } = await request.json();

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Prepare email content
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>New Contact Form Submission - NewsletterAI</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 8px 8px; }
          .field { margin-bottom: 20px; }
          .label { font-weight: bold; color: #333; margin-bottom: 5px; }
          .value { color: #666; }
          .message-box { background: white; padding: 20px; border-radius: 8px; border-left: 4px solid #007bff; margin-top: 20px; }
          .footer { text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e9ecef; color: #666; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1 style="margin: 0; font-size: 24px;">📧 New Contact Form Submission</h1>
          <p style="margin: 10px 0 0 0; opacity: 0.9;">NewsletterAI Contact Form</p>
        </div>
        
        <div class="content">
          <div class="field">
            <div class="label">Name:</div>
            <div class="value">${name}</div>
          </div>
          
          <div class="field">
            <div class="label">Email:</div>
            <div class="value">${email}</div>
          </div>
          
          <div class="field">
            <div class="label">Subject:</div>
            <div class="value">${subject}</div>
          </div>
          
          <div class="field">
            <div class="label">Message:</div>
            <div class="message-box">
              ${message.replace(/\n/g, '<br>')}
            </div>
          </div>
          
          <div class="footer">
            <p>This message was sent from the NewsletterAI contact form at ${process.env.NEXT_PUBLIC_BASE_URL || 'https://newsletter-ai-snowy.vercel.app'}</p>
            <p>Sent on ${new Date().toLocaleString()}</p>
          </div>
        </div>
      </body>
      </html>
    `;

    // Send email using SendGrid
    const msg = {
      to: 'rolf@juvosolutions.co',
      from: {
        email: process.env.SENDGRID_FROM_EMAIL || 'newsletter@yourdomain.com',
        name: process.env.SENDGRID_FROM_NAME || 'NewsletterAI Contact Form',
      },
      subject: `NewsletterAI Contact: ${subject}`,
      html: htmlContent,
      replyTo: email, // Allow direct reply to the sender
      trackingSettings: {
        clickTracking: {
          enable: false,
        },
        openTracking: {
          enable: false,
        },
      },
    };

    const response = await sgMail.send(msg);
    console.log('📧 Contact form email sent successfully:', response[0].headers['x-message-id']);
    
    return NextResponse.json({
      success: true,
      messageId: response[0].headers['x-message-id'] as string,
    });

  } catch (error) {
    console.error('❌ Error sending contact form email:', error);
    
    if (error instanceof Error) {
      return NextResponse.json(
        { 
          error: error.message,
          success: false 
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { 
        error: 'Internal server error',
        success: false 
      },
      { status: 500 }
    );
  }
} 