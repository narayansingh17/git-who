import express from "express";
import {
  getUser,
  getRepos,
  getEvents,
  getContributions,
} from "../controllers/repoControllers.js";

const router = express.Router();

router.route("/:username").get(getUser);
router.route("/:username/repos").get(getRepos);
router.route("/:username/events/public").get(getEvents);
router.route("/:username/contributions").get(getContributions);

export default router;
