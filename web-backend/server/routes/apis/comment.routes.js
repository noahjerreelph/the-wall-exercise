import { Router } from "express";
import CommentControllers from "../../controllers/comments.controller";

const CommentRoutes = new Router();

CommentRoutes.post("/create", CommentControllers.createMessage);
CommentRoutes.post("/:comment_id/update", CommentControllers.updateMessage);
CommentRoutes.post("/:comment_id/delete", CommentControllers.deleteMessage);

export default CommentRoutes;