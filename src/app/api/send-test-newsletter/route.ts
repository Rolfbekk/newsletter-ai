import { NextRequest, NextResponse } from "next/server";
import { sendGridService } from "@/lib/sendgridService";

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

    // Send the test newsletter using SendGrid
    const emailResult = await sendGridService.sendTestNewsletter({
      email,
      topic,
      newsletterFormat,
    });

    if (emailResult.success) {
      return NextResponse.json({
        success: true,
        message: "Test newsletter sent successfully",
        email: email,
        topic: topic,
        format: newsletterFormat,
      });
    } else {
      return NextResponse.json(
        { success: false, error: "Failed to send email" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Send test newsletter error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
} 