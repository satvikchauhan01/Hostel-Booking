import express from "express";
import * as roomController from "../controllers/roomController.js";

const router = express.Router();

router.get("/", roomController.getAllRooms);

export default router;