import { NextRequest, NextResponse } from "next/server";

// In a real application, you would use a database to store subscriptions
// For now, we'll use a simple in-memory storage (this will reset when the server restarts)
const subscriptions: Array<{
  email: string;
  topic: string;
  newsletterFormat: string;
  subscribedAt: Date;
}> = [];

export async function POST(request: NextRequest) {
  try {
    const { email, topic, newsletterFormat } = await request.json();

    // Validate input
    if (!email || !topic || !newsletterFormat) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, error: "Invalid email format" },
        { status: 400 }
      );
    }

    // Check if email is already subscribed to this topic
    const existingSubscription = subscriptions.find(
      (sub) => sub.email === email && sub.topic === topic
    );

    if (existingSubscription) {
      return NextResponse.json(
        { success: false, error: "You're already subscribed to this topic" },
        { status: 409 }
      );
    }

    // Add new subscription
    subscriptions.push({
      email: email.toLowerCase(),
      topic,
      newsletterFormat,
      subscribedAt: new Date(),
    });

    console.log(`New subscription: ${email} for topic: ${topic}`);

    return NextResponse.json({
      success: true,
      message: "Successfully subscribed to newsletter",
      subscription: {
        email,
        topic,
        newsletterFormat,
        subscribedAt: new Date(),
      },
    });
  } catch (error) {
    console.error("Email signup error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

// GET endpoint to retrieve all subscriptions (for admin purposes)
export async function GET() {
  return NextResponse.json({
    success: true,
    subscriptions,
    count: subscriptions.length,
  });
} 