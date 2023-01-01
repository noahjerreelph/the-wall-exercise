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

ViewRoutes.get("/messages/:id/:comment_id?", (req, res) => {
    let viewController = new ViewsController(req, res);
    viewController.editMessage((req.params.comment_id || req.params.id), (req.params.comment_id ? "comments" : "posts" ));
});

export default ViewRoutes;