import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const templatesDir = path.join(process.cwd(), 'templates');
const templatesFile = path.join(templatesDir, 'email-templates.json');

// Ensure templates directory exists
if (!fs.existsSync(templatesDir)) {
  fs.mkdirSync(templatesDir, { recursive: true });
}

// Initialize templates file if it doesn't exist
if (!fs.existsSync(templatesFile)) {
  fs.writeFileSync(templatesFile, JSON.stringify({}, null, 2));
}

interface EmailTemplate {
  id: string;
  name: string;
  html: string;
  topic: string;
  format: string;
  isTest: boolean;
  createdAt: string;
  updatedAt: string;
}

export async function GET() {
  try {
    const templatesData = fs.readFileSync(templatesFile, 'utf8');
    const templates = JSON.parse(templatesData);
    
    return NextResponse.json({
      success: true,
      templates: Object.values(templates),
    });
  } catch (error) {
    console.error('Error loading templates:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to load templates' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { name, html, topic, format, isTest } = await request.json();

    if (!name || !html) {
      return NextResponse.json(
        { success: false, error: 'Name and HTML are required' },
        { status: 400 }
      );
    }

    const templatesData = fs.readFileSync(templatesFile, 'utf8');
    const templates = JSON.parse(templatesData);

    const newTemplate: EmailTemplate = {
      id: `template_${Date.now()}`,
      name,
      html,
      topic: topic || 'General',
      format: format || 'detailed',
      isTest: isTest || false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    templates[newTemplate.id] = newTemplate;
    fs.writeFileSync(templatesFile, JSON.stringify(templates, null, 2));

    return NextResponse.json({
      success: true,
      template: newTemplate,
    });
  } catch (error) {
    console.error('Error saving template:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to save template' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { id, name, html, topic, format, isTest } = await request.json();

    if (!id || !name || !html) {
      return NextResponse.json(
        { success: false, error: 'ID, name, and HTML are required' },
        { status: 400 }
      );
    }

    const templatesData = fs.readFileSync(templatesFile, 'utf8');
    const templates = JSON.parse(templatesData);

    if (!templates[id]) {
      return NextResponse.json(
        { success: false, error: 'Template not found' },
        { status: 404 }
      );
    }

    const updatedTemplate: EmailTemplate = {
      ...templates[id],
      name,
      html,
      topic: topic || templates[id].topic,
      format: format || templates[id].format,
      isTest: isTest !== undefined ? isTest : templates[id].isTest,
      updatedAt: new Date().toISOString(),
    };

    templates[id] = updatedTemplate;
    fs.writeFileSync(templatesFile, JSON.stringify(templates, null, 2));

    return NextResponse.json({
      success: true,
      template: updatedTemplate,
    });
  } catch (error) {
    console.error('Error updating template:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update template' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Template ID is required' },
        { status: 400 }
      );
    }

    const templatesData = fs.readFileSync(templatesFile, 'utf8');
    const templates = JSON.parse(templatesData);

    if (!templates[id]) {
      return NextResponse.json(
        { success: false, error: 'Template not found' },
        { status: 404 }
      );
    }

    delete templates[id];
    fs.writeFileSync(templatesFile, JSON.stringify(templates, null, 2));

    return NextResponse.json({
      success: true,
      message: 'Template deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting template:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete template' },
      { status: 500 }
    );
  }
} 