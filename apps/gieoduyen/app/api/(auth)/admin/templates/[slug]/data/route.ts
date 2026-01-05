import Template from "@lib/models/Template";
import connectDB from "@lib/mongodb";
import { NextRequest, NextResponse } from "next/server";

// PUT - Update template initialData by slug
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    await connectDB();
    const { slug } = await params;

    const body = await request.json();
    const { initialData } = body;

    if (initialData === undefined) {
      return NextResponse.json(
        { error: "Missing required field: initialData" },
        { status: 400 }
      );
    }

    const template = await Template.findOne({ slug });

    if (!template) {
      return NextResponse.json(
        { error: "Template not found" },
        { status: 404 }
      );
    }

    // Update initialData only
    template.initialData = initialData;
    await template.save();

    return NextResponse.json({ 
      success: true,
      template: template.toObject() 
    });
  } catch (error: any) {
    console.error("Error updating template initialData:", error);
    return NextResponse.json(
      { error: error.message || "Failed to update template initialData" },
      { status: 500 }
    );
  }
}

