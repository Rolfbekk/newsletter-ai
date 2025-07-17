import { NextRequest, NextResponse } from "next/server";
import { sendGridService } from "@/lib/sendgridService";

export async function POST(request: NextRequest) {
  try {
    const { 
      email, 
      topic, 
      newsletterFormat, 
      newsletterContent 
    } = await request.json();

    // Validate input
    if (!email || !topic || !newsletterFormat) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Send the newsletter using SendGrid
    const emailResult = await sendGridService.sendWeeklyNewsletter({
      email,
      topic,
      newsletterFormat,
      newsletterContent,
    });

    if (emailResult.success) {
      return NextResponse.json({
        success: true,
        message: "Newsletter sent successfully",
        messageId: emailResult.messageId,
        email: email,
        topic: topic,
        format: newsletterFormat,
      });
    } else {
      return NextResponse.json(
        { success: false, error: emailResult.error },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Send newsletter error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
} 