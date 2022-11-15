import { Router } from "express";
import MessageControllers from "../../controllers/messages.controllers";

const MessageRoutes = new Router();

MessageRoutes.post("/create", MessageControllers.createMessage);
MessageRoutes.post("/update", MessageControllers.updateMessage);
MessageRoutes.post("/delete", MessageControllers.deleteMessage);

export default MessageRoutes;