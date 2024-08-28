import express from 'express';
import { getLikes, getUserProfileAndRepos, likeProfile, removeLike } from '../controllers/user.controller.js';
import { ensureAuthenticated } from '../middleware/ensureAuthenticated.js';

const router = express.Router();

router.get('/profile/:username', getUserProfileAndRepos)
router.get("/likes", ensureAuthenticated, getLikes);
router.post("/like/:username", ensureAuthenticated, likeProfile);
router.post("/removeLike/:username", ensureAuthenticated, removeLike);

export default router