import { NextRequest, NextResponse } from "next/server";
import { sendGridService } from "@/lib/sendgridService";

export async function POST(request: NextRequest) {
  try {
    const { topic, newsletterFormat, isTest, newsletterContent } = await request.json();

    // Validate input
    if (!topic || !newsletterFormat) {
      return NextResponse.json(
        { success: false, error: "Topic and newsletter format are required" },
        { status: 400 }
      );
    }

    const emailData = {
      email: "preview@example.com",
      topic,
      newsletterFormat,
      newsletterContent,
    };

    // Generate the template HTML
    const html = sendGridService.generateNewsletterTemplate(emailData, isTest);

    return NextResponse.json({
      success: true,
      html,
      topic,
      newsletterFormat,
      isTest,
    });
  } catch (error) {
    console.error("Error generating template:", error);
    return NextResponse.json(
      { success: false, error: "Failed to generate template" },
      { status: 500 }
    );
  }
} 