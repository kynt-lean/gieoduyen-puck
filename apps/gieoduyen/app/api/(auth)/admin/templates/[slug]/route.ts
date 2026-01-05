import Template from "@lib/models/Template";
import connectDB from "@lib/mongodb";
import { processThumbnail } from "@lib/storage/server";
import { NextRequest, NextResponse } from "next/server";

// GET - Get single template by slug
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    await connectDB();
    const { slug } = await params;

    const template = await Template.findOne({ slug }).lean();

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

// PUT - Update template by slug
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    await connectDB();
    const { slug } = await params;

    const body = await request.json();
    const { name, slug: newSlug, description, thumbnail, isActive } = body;

    const template = await Template.findOne({ slug });

    if (!template) {
      return NextResponse.json(
        { error: "Template not found" },
        { status: 404 }
      );
    }

    // Update fields
    if (name !== undefined) template.name = name;
    if (newSlug !== undefined && newSlug !== slug) {
      // Check if new slug conflicts with another template
      const existing = await Template.findOne({ slug: newSlug, _id: { $ne: template._id } });
      if (existing) {
        return NextResponse.json(
          { error: "Template with this slug already exists" },
          { status: 400 }
        );
      }
      template.slug = newSlug;
    }
    if (description !== undefined) template.description = description;
    if (thumbnail !== undefined) {
      // Process thumbnail với storage provider
      if (thumbnail === "") {
        // Xóa thumbnail nếu gửi empty string
        template.thumbnail = undefined;
      } else {
        try {
          const processedThumbnail = await processThumbnail(thumbnail);
          template.thumbnail = processedThumbnail;
        } catch (error: any) {
          return NextResponse.json(
            { error: `Invalid thumbnail: ${error.message}` },
            { status: 400 }
          );
        }
      }
    }
    if (isActive !== undefined) template.isActive = isActive;

    await template.save();

    return NextResponse.json({ template: template.toObject() });
  } catch (error: any) {
    console.error("Error updating template:", error);
    return NextResponse.json(
      { error: error.message || "Failed to update template" },
      { status: 500 }
    );
  }
}

// DELETE - Delete template by slug
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    await connectDB();
    const { slug } = await params;

    const template = await Template.findOneAndDelete({ slug });

    if (!template) {
      return NextResponse.json(
        { error: "Template not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting template:", error);
    return NextResponse.json(
      { error: "Failed to delete template" },
      { status: 500 }
    );
  }
}

