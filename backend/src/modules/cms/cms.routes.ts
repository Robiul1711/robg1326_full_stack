import { Router } from "express";
import { getCMSContent, updateCMSContent } from "./cms.controller";
import { authenticate, authorizeAdmin } from "../../common/middleware";

const router = Router();

// Public: Frontend can fetch dynamic content
router.get("/content", getCMSContent);

// Protected: Only Admin can update dynamic CMS content
router.put("/content", authenticate, authorizeAdmin, updateCMSContent);

export default router;
