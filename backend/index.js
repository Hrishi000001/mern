const cors = require('cors');
const express = require('express');
const mongoose = require('mongoose');
const FormDataModel = require('./models/FormData');
const bcrypt = require('bcrypt'); 

require('dotenv').config(); 

const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect(process.env.MONGO_URI);

app.post('/register', async (req, res) => {
  try {
    
    const { email, password } = req.body;

    
    const existingUser = await FormDataModel.findOne({ email });
    if (existingUser) {
      return res.json({ message: 'Already registered' });
    }

    
    const hashedPassword = await bcrypt.hash(password, 10);

    
    const newUser = new FormDataModel({ email, password: hashedPassword });
    await newUser.save();

    res.json({ message: 'Registration successful' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' }); 
  }
});

app.post('/login', async (req, res) => {
  try {
    
    const { email, password } = req.body;

    const user = await FormDataModel.findOne({ email });
    if (!user) {
      return res.json({ message: 'No records found' });
    }

    
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.json({ message: 'Wrong password' });
    }

    res.json({ message: 'Login successful' }); 
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' }); 
  }
});

app.listen(3001, () => {
  console.log('Server listening on http://127.0.0.1:3001');
});