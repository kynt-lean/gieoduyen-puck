import mongoose, { Document, Model, Schema } from "mongoose";

export interface IUserPage extends Document {
  userId: string; // Username of the user
  templateId: string; // Reference to Template _id
  pageData: any; // Puck Data type - custom data saved by user
  createdAt: Date;
  updatedAt: Date;
}

const UserPageSchema = new Schema<IUserPage>(
  {
    userId: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    templateId: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    pageData: {
      type: Schema.Types.Mixed,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Unique constraint: one user can only have one page per template
UserPageSchema.index({ userId: 1, templateId: 1 }, { unique: true });

// Index for faster queries by userId
UserPageSchema.index({ userId: 1 });

// Index for faster queries by templateId
UserPageSchema.index({ templateId: 1 });

const UserPage: Model<IUserPage> =
  mongoose.models.UserPage || mongoose.model<IUserPage>("UserPage", UserPageSchema);

export default UserPage;

