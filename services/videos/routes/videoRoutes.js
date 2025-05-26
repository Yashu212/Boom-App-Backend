const express = require('express');
const router = express.Router();
const multer = require('multer');
const {  uploadVideo, getAllVideos, getVideoById, purchaseVideo, hasUserPurchased } = require('../controllers/videoController');
const { postComment, getComments, deleteComment } = require('../controllers/commentController');
const { sendGift, getGiftsForVideo, getTotalGifts } = require('../controllers/giftController');


const authMiddleware = require('../middleware/authMiddleware');

const storage = multer.memoryStorage();
const upload = multer({ storage, limits: { fileSize: 10 * 1024 * 1024 } }); // 10MB max

router.post('/upload', authMiddleware, upload.single('videoFile'), uploadVideo);
router.get('/', getAllVideos);
router.post('/:id/purchase', authMiddleware, purchaseVideo);
router.get('/:id/purchased', authMiddleware, hasUserPurchased);
router.post('/:id/comments', authMiddleware, postComment);         
router.get('/:id/comments', authMiddleware, getComments);          
router.delete('/comments/:id', authMiddleware, deleteComment);     
router.post('/:id/gift', authMiddleware, sendGift);


module.exports = router;
