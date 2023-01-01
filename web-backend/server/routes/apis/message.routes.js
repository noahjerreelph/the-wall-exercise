import { Router } from "express";
import MessageController from "../../controllers/messages.controller";

const MessageRoutes = new Router();

MessageRoutes.post("/create", MessageController.createMessage);
MessageRoutes.post("/update", MessageController.updateMessage);
MessageRoutes.post("/delete", MessageController.deleteMessage);

export default MessageRoutes;