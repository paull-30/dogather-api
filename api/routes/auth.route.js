import express from "express"
import { register, login, logout } from "../controllers/auth.controller.js"
import { validateData } from "../middleware/validationMiddleware.js"
import {
  userLoginSchema,
  userRegistrationSchema,
} from "../schemas/validationSchemas.js"
import { verifyToken } from "../middleware/verifyToken.js"

const router = express.Router()

router.post("/register", validateData(userRegistrationSchema), register)
router.post("/login", validateData(userLoginSchema), login)
router.post("/authstatus", verifyToken, (req, res) => res.send())
router.post("/logout", logout)

export default router
