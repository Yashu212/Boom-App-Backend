const express = require('express');
const router = express.Router();
const {
  getWalletBalance,
  topUpWallet,
  deductFromWallet,
  addToWalletById 
} = require('../controllers/walletController');

const authMiddleware = require('../middleware/authMiddleware');

router.put('/wallet/topup', authMiddleware, topUpWallet);
router.put('/wallet/deduct', authMiddleware, deductFromWallet);
router.put('/users/:id/wallet/add', authMiddleware, addToWalletById);

module.exports = router;
