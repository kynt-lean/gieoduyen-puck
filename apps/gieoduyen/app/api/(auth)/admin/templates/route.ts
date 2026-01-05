import { initialData } from "@config/initial-data";
import Template from "@lib/models/Template";
import connectDB from "@lib/mongodb";
import { processThumbnail } from "@lib/storage/server";
import { NextRequest, NextResponse } from "next/server";

// GET - List all templates
export async function GET() {
  try {
    await connectDB();

    // Seeding: Create default template if no templates exist
    const templateCount = await Template.countDocuments();
    if (templateCount === 0) {
      const defaultInitialData = initialData["/"];
      await Template.create({
        name: "default",
        slug: "default",
        description: "Template mặc định",
        initialData: defaultInitialData,
        isActive: true,
      });
    }

    // Admin should see all templates, not just active ones
    const templates = await Template.find({})
      .sort({ createdAt: -1 })
      .select("name slug description thumbnail isActive createdAt updatedAt")
      .lean();

    return NextResponse.json({ templates });
  } catch (error) {
    console.error("Error fetching templates:", error);
    return NextResponse.json(
      { error: "Failed to fetch templates" },
      { status: 500 }
    );
  }
}

// POST - Create new template
export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const { name, slug, description, initialData, thumbnail, copyFromSlug } = body;

    if (!name || !slug) {
      return NextResponse.json(
        { error: "Missing required fields: name, slug" },
        { status: 400 }
      );
    }

    // Check if slug already exists
    const existing = await Template.findOne({ slug });
    if (existing) {
      return NextResponse.json(
        { error: "Template with this slug already exists" },
        { status: 400 }
      );
    }

    // Process thumbnail với storage provider
    let processedThumbnail: string | undefined = undefined;
    if (thumbnail) {
      try {
        processedThumbnail = await processThumbnail(thumbnail);
      } catch (error: any) {
        return NextResponse.json(
          { error: `Invalid thumbnail: ${error.message}` },
          { status: 400 }
        );
      }
    }

    let templateData: any = {
      name,
      slug,
      description,
      thumbnail: processedThumbnail,
      isActive: false,
    };

    // If copying from another template, fetch its data
    if (copyFromSlug) {
      const sourceTemplate = await Template.findOne({ slug: copyFromSlug });
      if (!sourceTemplate) {
        return NextResponse.json(
          { error: "Source template not found" },
          { status: 404 }
        );
      }
      // Copy initialData from source template
      templateData.initialData = sourceTemplate.initialData;
      // If description/thumbnail not provided, copy from source
      if (!description) templateData.description = sourceTemplate.description;
      if (!thumbnail) templateData.thumbnail = sourceTemplate.thumbnail;
    } else {
      // If not copying, initialData is required
      if (!initialData) {
        return NextResponse.json(
          { error: "Missing required field: initialData (or provide copyFromSlug)" },
          { status: 400 }
        );
      }
      templateData.initialData = initialData;
    }

    const template = new Template(templateData);

    await template.save();

    return NextResponse.json(
      { template: template.toObject() },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error creating template:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create template" },
      { status: 500 }
    );
  }
}

