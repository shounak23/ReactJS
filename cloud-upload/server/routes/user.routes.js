import { Router } from "express";
import { loginController } from "../controllers/logInControllers.js";
import { registrationControllers } from "../controllers/registrationControllers.js";
import { isAuthenticated } from "../middleware/authMiddleware.js";
import { logOutController } from "../controllers/logOutController.js";
import { refreshTokenController } from "../controllers/refreshTokenController.js";

const router = Router();

router.post("/login", loginController);
router.post("/register", registrationControllers);
router.post("/logout", isAuthenticated, logOutController);
router.get("/dashboard", isAuthenticated, (req, res) => {
  res.status(200).json({ user: req.user._id });
});
router.post("/refresh", refreshTokenController);

export default router;
