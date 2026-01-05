import mongoose, { Document, Model, Schema } from "mongoose";

export interface ITemplate extends Document {
  name: string;
  slug: string;
  description?: string;
  initialData: any; // Puck Data type
  thumbnail?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const TemplateSchema = new Schema<ITemplate>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    description: {
      type: String,
      trim: true,
    },
    initialData: {
      type: Schema.Types.Mixed,
      required: true,
    },
    thumbnail: {
      type: String,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
// Note: slug already has unique index from unique: true in schema definition
// Compound index for common query pattern: findOne({ slug, isActive: true })
TemplateSchema.index({ slug: 1, isActive: 1 });
// Index for filtering by isActive
TemplateSchema.index({ isActive: 1 });

const Template: Model<ITemplate> =
  mongoose.models.Template || mongoose.model<ITemplate>("Template", TemplateSchema);

export default Template;

