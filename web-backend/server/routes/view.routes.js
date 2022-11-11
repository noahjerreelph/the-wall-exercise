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

ViewRoutes.get("/posts/:post_id", function(req, res) {
    let viewController = new ViewsController(req, res);
    viewController.editMessage(req.params.post_id, "posts");
});

ViewRoutes.get("/comments/:comment_id", function(req, res) {
    let viewController = new ViewsController(req, res);
    viewController.editMessage(req.params.comment_id, "comments");
});


export default ViewRoutes;