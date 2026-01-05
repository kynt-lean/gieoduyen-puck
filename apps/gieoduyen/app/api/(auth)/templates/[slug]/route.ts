import { NextRequest, NextResponse } from "next/server";
import Template from "@lib/models/Template";
import connectDB from "@lib/mongodb";

// GET - Get single active template by slug (for users)
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    await connectDB();
    const { slug } = await params;

    // Only return active templates for users
    const template = await Template.findOne({ slug, isActive: true }).lean();

    if (!template) {
      return NextResponse.json(
        { error: "Template not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ template });
  } catch (error) {
    console.error("Error fetching template:", error);
    return NextResponse.json(
      { error: "Failed to fetch template" },
      { status: 500 }
    );
  }
}

