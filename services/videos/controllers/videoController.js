const Video = require('../models/Video');
const Purchase = require('../models/Purchase');
const axios = require('axios');
const r2 = require('../config/r2');
const { v4: uuidv4 } = require('uuid');
require('../models/User');

exports.uploadVideo = async (req, res) => {
  try {
    const { title, description, type, price, videoUrl } = req.body;
    let finalVideoUrl = videoUrl;

    if (type === 'short' && req.file) {
      const key = `shorts/${uuidv4()}-${req.file.originalname}`;

      const params = {
        Bucket: process.env.CF_BUCKET_NAME,
        Key: key,
        Body: req.file.buffer,
        ContentType: req.file.mimetype,
        ACL: 'public-read'
      };

      const uploadResult = await r2.upload(params).promise();

      finalVideoUrl = `${process.env.CF_PUBLIC_DEV_URL}/${key}`;
    }

    const video = await Video.create({
      title,
      description,
      type,
      price: type === 'long' ? price : 0,
      videoUrl: finalVideoUrl,
      creatorId: req.user.userId
    });

    res.status(201).json({ message: 'Video uploaded', video });
  } catch (err) {
    console.error('Upload Error:', err);
    res.status(500).json({ error: err.message });
  }
};

// Get all videos sorted by newest
exports.getAllVideos = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const videos = await Video.find()
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .populate('creatorId', 'username');

    res.json(videos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getVideoById = async (req, res) => {
  try {
    const videoId = req.params.id;

    const video = await Video.findById(videoId)
      .populate('creatorId', 'username');

    if (!video) {
      return res.status(404).json({ error: 'Video not found' });
    }

    res.json(video);
  } catch (err) {
    console.error('Error fetching video:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.purchaseVideo = async (req, res) => {
  try {
    const userId = req.user.userId;
    const videoId = req.params.id;

    const video = await Video.findById(videoId);
    if (!video) return res.status(404).json({ error: 'Video not found' });

    if (video.price === 0) {
      return res.status(400).json({ error: 'This video is free to watch' });
    }

    const alreadyPurchased = await Purchase.findOne({ userId, videoId });
    if (alreadyPurchased) {
      return res.status(400).json({ error: 'You already purchased this video' });
    }

    const creatorId = video.creatorId.toString();
    if (creatorId === userId) {
      return res.status(400).json({ error: 'You cannot purchase your own video' });
    }

    // Step 1: Deduct from buyer's wallet
    await axios.put(
      `http://localhost:4000/api/auth/wallet/deduct`,
      { amount: video.price },
      { headers: { Authorization: req.headers.authorization } }
    );

    // Step 2: Add to creator's wallet
    await axios.put(
      `http://localhost:4000/api/auth/users/${creatorId}/wallet/add`,
      { amount: video.price },
      { headers: { Authorization: req.headers.authorization } }
    );

    // Step 3: Record the purchase
    const purchase = await Purchase.create({ userId, videoId });

    res.status(201).json({ message: 'Purchase successful', purchase });
  } catch (err) {
    console.error('Purchase failed:', err.message);
    res.status(500).json({ error: 'Purchase failed' });
  }
};


exports.hasUserPurchased = async (req, res) => {
  try {
    const userId = req.user.userId;
    const videoId = req.params.id;

    const purchase = await Purchase.findOne({ userId, videoId });
    const owned = !!purchase;

    res.json({ purchased: owned });
  } catch (err) {
    res.status(500).json({ error: 'Check failed' });
  }
};