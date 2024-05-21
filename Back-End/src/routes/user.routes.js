


import { Router } from "express";
import {
  getdata,
  loginUser,
  logoutUser,
  registerUser,
} from "../controllers/user.controllers.js";

import { addToCart } from "../controllers/cart.controllers.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/users").post(verifyJWT, getdata);
router.route("/logout").post(verifyJWT, logoutUser);
router.route("/addtoCart").post(addToCart);

export default router;
