import express from "express"
import { verifyAdmin } from "../middleware/verifyAdmin.js"
import {
  adminLogin,
  adminLogout,
  getAdminData,
  deletePostAdmin,
  deleteUserAdmin,
} from "../controllers/admin.controller.js"

const router = express.Router()

router.post("/login", adminLogin)
router.post("/logout", verifyAdmin, adminLogout)
router.get("/data", verifyAdmin, getAdminData)
router.delete("/posts/:id", verifyAdmin, deletePostAdmin)
router.delete("/users/:id", verifyAdmin, deleteUserAdmin)

export default router
