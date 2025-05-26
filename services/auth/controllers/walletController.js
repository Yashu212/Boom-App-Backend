const User = require('../models/User');

// PUT /api/auth/wallet/topup
exports.topUpWallet = async (req, res) => {
  try {
    const { amount } = req.body;
    if (!amount || amount <= 0) {
      return res.status(400).json({ error: 'Invalid top-up amount' });
    }

    const user = await User.findById(req.user.userId);
    user.walletBalance += amount;
    await user.save();

    res.json({ message: `₹${amount} added`, balance: user.walletBalance });
  } catch (err) {
    res.status(500).json({ error: 'Top-up failed' });
  }
};

// PUT /api/auth/wallet/deduct (used by gifting/purchase flows)
exports.deductFromWallet = async (req, res) => {
  try {
    const { amount } = req.body;
    if (!amount || amount <= 0) {
      return res.status(400).json({ error: 'Invalid deduction amount' });
    }

    const user = await User.findById(req.user.userId);
    if (user.walletBalance < amount) {
      return res.status(400).json({ error: 'Insufficient balance' });
    }

    user.walletBalance -= amount;
    await user.save();

    res.json({ message: `₹${amount} deducted`, balance: user.walletBalance });
  } catch (err) {
    res.status(500).json({ error: 'Deduction failed' });
  }
};

// (used by gifting/purchase flows)
exports.addToWalletById = async (req, res) => {
  try {
    const { id } = req.params;
    const { amount } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ error: 'Invalid top-up amount' });
    }

    const user = await User.findById(id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    user.walletBalance += amount;
    await user.save();

    res.json({ message: `₹${amount} credited to user`, balance: user.walletBalance });
  } catch (err) {
    res.status(500).json({ error: 'Failed to top up user wallet' });
  }
};