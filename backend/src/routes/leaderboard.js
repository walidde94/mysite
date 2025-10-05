const express = require('express');
const router = express.Router();
const leaderboardController = require('../controllers/leaderboardController');
const { optionalAuth } = require('../middleware/auth');

router.get('/global', optionalAuth, leaderboardController.getGlobalLeaderboard);
router.get('/weekly', optionalAuth, leaderboardController.getWeeklyLeaderboard);
router.get('/friends', optionalAuth, leaderboardController.getFriendsLeaderboard);

module.exports = router;
