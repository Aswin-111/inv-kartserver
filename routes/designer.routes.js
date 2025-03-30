import express from "express";
import {
  getDesignTasks,
  getAllDesignImages,
} from "../controllers/designing.controller.js";

const router = express.Router();

router.get("/alldesigntasks", getDesignTasks);
router.get("/alldesigntasksimages/:orderId", getAllDesignImages);

export default router;
