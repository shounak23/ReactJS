import { Router } from "express";
import { loginController } from "../controllers/logInControllers.js";
import { logoutController } from "../controllers/logOutControllers.js";
import { registrationControllers } from "../controllers/registrationControllers.js";
import { isAuthenticated } from "../middleware/authMiddleware.js";

const router = Router();

router.post("/login", loginController);
router.post("/register", registrationControllers);
router.post("/logout", isAuthenticated, logoutController);
router.get("/dashboard", isAuthenticated, (req, res) => {
  res.status(200).json({ user: req.session.user });
});

export default router;