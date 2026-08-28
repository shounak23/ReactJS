import mongoose from "mongoose";

const filesSchema = new mongoose.Schema(
  {
    originalName: { type: String, required: true },
    storedName:   { type: String, required: true },
    fileUrl:      { type: String, required: true },
    fileType:     { type: String, required: true },
    fileSize:     { type: Number, required: true },
    cloudPublicId:{ type: String, required: true },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true },
);

export const Files = mongoose.model("Files", filesSchema);