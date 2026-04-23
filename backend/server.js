require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Kết nối MongoDB (Railway sẽ tự inject MONGO_URI)
mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/brownfield')
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB error:', err));

// Schema
const ContactSchema = new mongoose.Schema({
  name: String,
  email: String,
  message: String,
  date: { type: Date, default: Date.now }
});
const Contact = mongoose.model('Contact', ContactSchema);

// API: Contact Form
app.post('/api/contact', async (req, res) => {
  try {
    await new Contact(req.body).save();
    res.json({ success: true, message: 'Tin nhắn đã được gửi!' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Lỗi server' });
  }
});

// API: Login (demo)
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  if (email === 'investor@brownfield.com' && password === 'brownfield2026') {
    const token = jwt.sign({ user: 'investor' }, 'brownfield-secret', { expiresIn: '7d' });
    res.json({ success: true, token, message: 'Đăng nhập thành công' });
  } else {
    res.status(401).json({ success: false, message: 'Sai email hoặc mật khẩu' });
  }
});

// API: Dashboard data (dùng cho chart)
app.get('/api/dashboard', (req, res) => {
  res.json({
    aum: 498.5,
    ytdReturn: 14.2,
    irr: 18.7,
    momChange: 2.1,
    aumHistory: [142, 218, 305, 412, 487, 498],
    performance: [15.8, 11.4, 18.9],
    allocation: [48, 32, 15, 5]
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Backend chạy trên port ${PORT}`);
});
