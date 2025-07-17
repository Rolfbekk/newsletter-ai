import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

// In a real application, you would store these events in a database
const emailEvents: Array<{
  messageId: string;
  email: string;
  event: string;
  timestamp: Date;
  data: any;
}> = [];

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get('x-twilio-email-event-webhook-signature');
    const timestamp = request.headers.get('x-twilio-email-event-webhook-timestamp');
    
    // Verify webhook signature (optional but recommended for security)
    if (process.env.SENDGRID_WEBHOOK_SECRET && signature && timestamp) {
      const isValid = verifyWebhookSignature(body, signature, timestamp);
      if (!isValid) {
        console.warn('⚠️ Invalid webhook signature');
        return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
      }
    }

    const events = JSON.parse(body);
    
    // Process each event
    for (const event of events) {
      const { 
        message_id, 
        email, 
        event: eventType, 
        timestamp: eventTimestamp,
        ...eventData 
      } = event;

      console.log(`📧 SendGrid Event: ${eventType} for ${email} (${message_id})`);

      // Store the event
      emailEvents.push({
        messageId: message_id,
        email,
        event: eventType,
        timestamp: new Date(eventTimestamp * 1000),
        data: eventData,
      });

      // Handle specific events
      switch (eventType) {
        case 'delivered':
          console.log(`✅ Email delivered: ${email}`);
          break;
        case 'open':
          console.log(`👁️ Email opened: ${email}`);
          break;
        case 'click':
          console.log(`🖱️ Email clicked: ${email} - URL: ${eventData.url}`);
          break;
        case 'bounce':
          console.log(`❌ Email bounced: ${email} - Reason: ${eventData.reason}`);
          break;
        case 'dropped':
          console.log(`🗑️ Email dropped: ${email} - Reason: ${eventData.reason}`);
          break;
        case 'spamreport':
          console.log(`🚫 Email marked as spam: ${email}`);
          break;
        case 'unsubscribe':
          console.log(`📤 User unsubscribed: ${email}`);
          break;
        default:
          console.log(`ℹ️ Other event: ${eventType} for ${email}`);
      }
    }

    return NextResponse.json({ success: true, processed: events.length });
  } catch (error) {
    console.error('❌ Error processing SendGrid webhook:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * Verify SendGrid webhook signature
 */
function verifyWebhookSignature(
  body: string, 
  signature: string, 
  timestamp: string
): boolean {
  try {
    const secret = process.env.SENDGRID_WEBHOOK_SECRET;
    if (!secret) return true; // Skip verification if no secret configured

    const hmac = crypto.createHmac('sha256', secret);
    hmac.update(timestamp + body);
    const expectedSignature = hmac.digest('hex');

    return crypto.timingSafeEqual(
      Buffer.from(signature, 'hex'),
      Buffer.from(expectedSignature, 'hex')
    );
  } catch (error) {
    console.error('Error verifying webhook signature:', error);
    return false;
  }
}

/**
 * Get email analytics for a specific message
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const messageId = searchParams.get('messageId');
  const email = searchParams.get('email');

  if (messageId) {
    const messageEvents = emailEvents.filter(event => event.messageId === messageId);
    return NextResponse.json({
      messageId,
      events: messageEvents,
      analytics: {
        delivered: messageEvents.some(e => e.event === 'delivered'),
        opened: messageEvents.some(e => e.event === 'open'),
        clicked: messageEvents.some(e => e.event === 'click'),
        bounced: messageEvents.some(e => e.event === 'bounce'),
        unsubscribed: messageEvents.some(e => e.event === 'unsubscribe'),
      }
    });
  }

  if (email) {
    const userEvents = emailEvents.filter(event => event.email === email);
    return NextResponse.json({
      email,
      events: userEvents,
      totalEvents: userEvents.length,
    });
  }

  // Return all events (for admin purposes)
  return NextResponse.json({
    totalEvents: emailEvents.length,
    recentEvents: emailEvents.slice(-50), // Last 50 events
  });
} 