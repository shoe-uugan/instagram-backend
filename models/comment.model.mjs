import mongoose from "mongoose";
import { nanoid } from "nanoid";

const CommentSchema = new mongoose.Schema(
  {
    _id: { type: String, default: nanoid() },
    post: { type: String, ref: "Post" },
    description: { type: String },
    createdBy: { type: String, ref: "User" },
    createdAt: { type: Date },
    updatedAt: { type: Date },
  },
  { timestamps: true }
);



export const CommentModel = mongoose.model("Comment", CommentSchema);