const express = require('express');
const router = express.Router();
const challengeController = require('../controllers/challengeController');
const { protect, isPremium, optionalAuth } = require('../middleware/auth');

router.get('/', optionalAuth, challengeController.getAllChallenges);
router.get('/featured', challengeController.getFeaturedChallenges);
router.get('/daily', protect, challengeController.getDailyChallenges);
router.get('/:id', optionalAuth, challengeController.getChallengeById);
router.post('/:id/start', protect, challengeController.startChallenge);
router.post('/:id/complete', protect, challengeController.completeChallenge);
router.get('/user/active', protect, challengeController.getActiveChallenges);
router.get('/user/completed', protect, challengeController.getCompletedChallenges);

module.exports = router;
