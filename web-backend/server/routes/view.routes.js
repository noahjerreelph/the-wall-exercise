import { Router } from "express";
import ViewsController from "../controllers/views.controllers";

const ViewRoutes = new Router();

ViewRoutes.get("/", (req, res) => {
    let viewController = new ViewsController(req, res);
    viewController.visitLandingPage();
});

ViewRoutes.get("/dashboard", (req, res) => {
    let viewController = new ViewsController(req, res);
    viewController.visitDashboard();
});

ViewRoutes.get("/messages/:post_id/:comment_id?", (req, res) => {
    let viewController = new ViewsController(req, res);
    let {post_id, comment_id} = req.params;
    viewController.viewMessage(post_id, comment_id);
});

export default ViewRoutes;