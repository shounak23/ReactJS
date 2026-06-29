 import mongoose from "mongoose";

const filesSchema = new mongoose.Schema(
  {
    originalName: String, // photo.jpg (user given name)
    storedName: String, // renamed file (timestamp version)
    fileUrl: String, // Cloudinary / AWS URL
    fileType: String, // image/png, application/pdf
    fileSize: Number, // in bytes
    cloudPublicId: String, // needed to delete from cloud
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true },
);

export const Files = mongoose.model("Files", filesSchema);
