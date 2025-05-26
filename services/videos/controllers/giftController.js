const Gift = require('../models/Gift');
const Video = require('../models/Video');
const axios = require('axios');
const mongoose = require('mongoose');

// POST /videos/:id/gift
exports.sendGift = async (req, res) => {
  try {
    const videoId = req.params.id;
    const senderId = req.user.userId;
    const { amount } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ error: 'Invalid gift amount' });
    }

    const video = await Video.findById(videoId);
    if (!video) return res.status(404).json({ error: 'Video not found' });

    const receiverId = video.creatorId.toString();
    if (receiverId === senderId) {
      return res.status(400).json({ error: 'You cannot gift yourself' });
    }

    // Step 1: Deduct from sender's wallet
    await axios.put(
      `http://localhost:4000/api/auth/wallet/deduct`,
      { amount },
      { headers: { Authorization: req.headers.authorization } }
    );

    // Step 2: Credit to creator's wallet
    await axios.put(
      `http://localhost:4000/api/auth/users/${receiverId}/wallet/add`,
      { amount },
      { headers: { Authorization: req.headers.authorization } }
    );

    // Step 3: Log the gift
    const gift = await Gift.create({
      videoId,
      senderId,
      receiverId,
      amount
    });

    res.status(201).json({ message: 'Gift sent and credited!', gift });
  } catch (err) {
    console.error('Gift error:', err.message);
    res.status(500).json({ error: 'Failed to send gift' });
  }
};