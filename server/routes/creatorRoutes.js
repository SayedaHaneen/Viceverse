const express = require('express');
const router = express.Router();
const creatorController = require('../controllers/creatorController');
const { authMiddleware } = require('../middleware/authMiddleware');
const { requireCreator } = require('../middleware/roleMiddleware');
const upload = require('../middleware/uploadMiddleware');

// Public routes
router.get('/', creatorController.getCreators);
router.get('/:username', creatorController.getCreatorByUsername);

// Protected creator routes
router.put('/profile/update', authMiddleware, requireCreator, creatorController.updateCreatorProfile);
router.post('/upload', authMiddleware, requireCreator, upload.any(), creatorController.uploadMedia);
router.post('/portfolio', authMiddleware, requireCreator, creatorController.addPortfolioItem);
router.delete('/portfolio/:id', authMiddleware, requireCreator, creatorController.deletePortfolioItem);
router.put('/social-links', authMiddleware, requireCreator, creatorController.updateSocialLinks);

module.exports = router;
