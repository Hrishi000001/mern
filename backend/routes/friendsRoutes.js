const express = require('express');
const router = express.Router();
const User = require('../models/User');


router.get('/users', async (req, res) => {
  try {
    const users = await User.find().select('username'); 
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users' });
  }
});


router.post('/send-friend-request/:userId', async (req, res) => {
  const { userId } = req.params;
  const user = req.user;  

  try {
    
    const recipient = await User.findById(userId);
    if (!recipient.friendRequests.includes(user._id)) {
      recipient.friendRequests.push(user._id);
      await recipient.save();
      res.json({ message: 'Friend request sent!' });
    } else {
      res.status(400).json({ message: 'Friend request already sent!' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error sending friend request' });
  }
});


router.post('/accept-friend-request/:userId', async (req, res) => {
  const { userId } = req.params;
  const user = req.user;

  try {
    
    const currentUser = await User.findById(user._id);
    const friend = await User.findById(userId);

    if (!currentUser.friends.includes(userId)) {
      currentUser.friends.push(userId);
      currentUser.friendRequests = currentUser.friendRequests.filter(id => id.toString() !== userId);
      friend.friends.push(user._id);
      await currentUser.save();
      await friend.save();
      res.json({ message: 'Friend request accepted!' });
    } else {
      res.status(400).json({ message: 'Already friends!' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error accepting friend request' });
  }
});


router.post('/reject-friend-request/:userId', async (req, res) => {
  const { userId } = req.params;
  const user = req.user;

  try {
    const currentUser = await User.findById(user._id);
    currentUser.friendRequests = currentUser.friendRequests.filter(id => id.toString() !== userId);
    await currentUser.save();
    res.json({ message: 'Friend request rejected!' });
  } catch (error) {
    res.status(500).json({ message: 'Error rejecting friend request' });
  }
});


router.get('/friend-requests', async (req, res) => {
  const user = req.user;

  try {
    const currentUser = await User.findById(user._id).populate('friendRequests', 'username');
    res.json(currentUser.friendRequests);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching friend requests' });
  }
});


router.get('/friends', async (req, res) => {
  const user = req.user;

  try {
    const currentUser = await User.findById(user._id).populate('friends', 'username');
    res.json(currentUser.friends);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching friends list' });
  }
});

module.exports = router;
