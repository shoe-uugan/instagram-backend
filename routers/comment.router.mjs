import express from "express";
import { PostModel } from "../models/post.model.mjs";
import { CommentModel } from "../models/post-comment.model.mjs";
import { UserModel } from "../models/user.model.mjs";
import jwt from "jsonwebtoken";
import { nanoid } from "nanoid";

const router = express.Router();

router.get("/", async (req, res) => {
  const result = await CommentModel.find().populate("createdBy");
  return res.send(result);
});

router.get("/:id", async (req, res) => {
    const postId= req.params.id
  const commentId = req.params.id;
  const comment = await CommentModel.findById(commentId, postId);
  if (!comment) {
    return res.status(404).send({ message: "Post not found!" });
  }
  return res.send(comment);
});


router.post("/", async (req, res) => {
 const authorization = req.headers.authorization;

 if (!authorization) {
   return res.status(401).send({ message: "You are not authenticated" });
 }
 const token = authorization.split(" ")[1];

 let user = null;
 try {
   const payload = jwt.verify(token, process.env.JWT_SECRET);
   const id = payload.id;
   user = await CommentModel.findById(id);

   if (!user) {
     return res.status(403).send({ message: "Session user not found!" });
   }
 } catch (error) {
   console.log(error);
   return res
     .status(401)
     .send({ message: "Unsuccess", body: JSON.stringify(error, null, 2) });
 }

  if (!req.body) {
    return res.status(400).send({ message: "Body required!" });
  }
  const { description } = req.body;

  if (!description) {
    return res.status(400).send({ message: "description required!" });
  }
  
  const comment = await CommentModel.create({
    _id: nanoid(),
    post: post._id,
    description,
    imageUrl,
    createdBy: user._id,
  });
  return res.send({ message: "Post created successfully", body: comment });
});

router.delete("/:id", async (req, res) => {
     const postId = req.params.id;
  const commentId = req.params.id;
  const comment = await CommentModel.findById(commentId, postId);
  if (!comment) {
    return res.status(404).send({ message: "Post not found!" });
  }
  await CommentModel.deleteOne({ _id: commentId });
  return res.send({ message: "Successfully deleted post" });
});

router.put("/:id", async (req, res) => {
     const postId = req.params.id;
  const commentId = req.params.id;
  const comment = await CommentModel.findById(commentId, postId);
  if (!comment) {
    return res.status(404).send({ message: "Post not found!" });
  }
  if (!req.body) {
    return res.status(400).send({ message: "Body required!" });
  }
  const { description } = req.body;

  await CommentModel.updateOne({ _id: commentId, post: postId }, {description});

  return res.send({
    message: "Successfully updated post",
    body: { ...post, description, imageUrl },
  });
});

export default router;
