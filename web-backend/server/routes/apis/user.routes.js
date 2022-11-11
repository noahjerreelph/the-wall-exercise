import { Router } from "express";
import UserControllers from "../../controllers/users.controllers";

const UserRoutes = new Router();

UserRoutes.post("/create", UserControllers.createUser);
UserRoutes.post("/login", UserControllers.loginUser);

UserRoutes.get("/logout", (req, res) => {
    req.session.destroy();
    res.redirect("/");
});

export default UserRoutes;