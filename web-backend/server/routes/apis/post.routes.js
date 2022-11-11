import { Router } from "express";
import PostControllers from "../../controllers/posts.controllers";

const PostRoutes = new Router();

PostRoutes.post("/create", PostControllers.createMessage);
PostRoutes.post("/:post_id/update", PostControllers.updateMessage);

PostRoutes.post("/:post_id/delete", PostControllers.deleteMessage);

export default PostRoutes;