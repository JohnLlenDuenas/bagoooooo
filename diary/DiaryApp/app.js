const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const diaryRoutes = require('./routes/diary');
const multer = require('multer');
const path = require('path');
const app = express();
const nodemailer = require('nodemailer');
const axios = require('axios'); 

// MongoDB connection
mongoose.connect('mongodb+srv://johnllentv:johnllentv@cluster0.pgaelxg.mongodb.net/Diaries?retryWrites=true&w=majority&appName=Cluster0', { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('MongoDB connected successfully');
});


// Set view engine
app.set('view engine', 'ejs');
const BOT_TOKEN = '7703027162:AAErPgsWZn4FKmxzQhPLDtZAbLVwzd8c_7c';
const CHAT_IDS = ['6942505365', '7079851477'];
// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Use routes
app.use('/diary', diaryRoutes);
 // Ensure slambookRoutes is correctly imported

 const sendNotification = async (endpoint) => {
  const message = `📢*A user accessed the website*\n\n*Accessed At*: ${new Date().toLocaleString()}`;
  const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;

  try {
    for (const chatId of CHAT_IDS) {
      await axios.post(url, {
        chat_id: chatId,
        text: message,
        parse_mode: 'Markdown',
      });
      console.log(`Telegram notification sent to ${chatId} for endpoint: ${endpoint}`);
	}
  } catch (error) {
    console.error('Error sending Telegram notification:', error.message);
  }
};

// Middleware function to trigger Telegram notification
const sendTelegramNotification = async (req, res, next) => {
  try {
    await sendNotification(req.originalUrl); // Pass the accessed endpoint URL
  } catch (err) {
    console.error('Failed to send Telegram notification:', err);
  }
  next(); // Ensure the request proceeds to the next middleware/route
};

// Apply middleware for all routes
app.use(sendTelegramNotification);

// Home route
app.get('/', (req, res) => {
  const currentDate = new Date();
    const startMonthsary = new Date('2024-10-08');

    const isMonthsary = currentDate.getDate() === 8;

    const isAnniversary = currentDate.getMonth() === 10 && currentDate.getDate() === 8; 

    let monthsPassed = 0;
    if (currentDate >= startMonthsary) {
        monthsPassed = (currentDate.getFullYear() - startMonthsary.getFullYear()) * 12 + 
                       (currentDate.getMonth() - startMonthsary.getMonth());
    }

    const timeDifference = currentDate - startMonthsary;
    const years = Math.floor(timeDifference / (1000 * 60 * 60 * 24 * 365));
    const months = currentDate.getMonth() - startMonthsary.getMonth() + (years * 12);
    const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24)) % 365;
    const hours = Math.floor((timeDifference / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((timeDifference / (1000 * 60)) % 60);
    const seconds = Math.floor((timeDifference / 1000) % 60);

    res.render('index', { 
        isMonthsary, 
        isAnniversary, 
        monthsPassed, 
        years, 
        months, 
        days, 
        hours, 
        minutes, 
        seconds 
    });
});



const UserSchema = new mongoose.Schema({
    _id: String,
    nickname: String,
    photo: String,
    color: String,
    holiday: String,
    animal: String,
    food: String,
    restaurant: String,
    smell: String,
    sound: String,
    word: String,
    celebrity: String,
    subject: String,
    website: String,
    book: String,
    tvshow: String,
    movie: String,
    character: String,
    game: String,
    sport: String,
    hobby: String,
    song1: String,
    song2: String,
    song3: String,
    songlifetheme: String,
    songcntstnd: String,
    todo1: String,
    todo2: String,
    todo3: String,
    todo4: String,
    todo5: String,
    thing1: String,
    thing2: String,
    thing3: String,
    secretTalent: String,
    goodat: String,
    notdo1: String,
    notdo2: String,
    notdo3: String,
    together: String,
  });
  
  
  const User = mongoose.model('User', UserSchema);
  
  
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname);
    },
  });
  const upload = multer({ storage });
  
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());
  app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

  
  app.use(express.static('public'));

  app.get('/slambook', (req, res) => {
    res.sendFile(path.join(__dirname, 'public','slambook.html'));
  });
  
  app.get('/displaylist', (req, res) => {
    res.sendFile(path.join(__dirname, 'public','list.html'));
  });
  
  app.post('/submit', upload.single('photo'), async (req, res) => {
    try {
      console.log('Received form data:', req.body);
      console.log('Received file:', req.file);
  
      const {
        name,
        nickname,
        color,
        holiday,
        animal,
        food,
        restaurant,
        smell,
        sound,
        word,
        celebrity,
        subject,
        website,
        book,
        tvshow,
        movie,
        character,
        game,
        sport,
        hobby,
        song1,
        song2,
        song3,
        songlifetheme,
        songcntstnd,
        todo1,
        todo2,
        todo3,
        todo4,
        todo5,
        thing1,
        thing2,
        thing3,
        secretTalent,
        goodat,
        notdo1,
        notdo2,
        notdo3,
        together
      } = req.body;
  
      const photo = req.file ? req.file.filename : null;
      const newUser = new User({
        _id: name,
        nickname,
        photo,
        color,
        holiday,
        animal,
        food,
        restaurant,
        smell,
        sound,
        word,
        celebrity,
        subject,
        website,
        book,
        tvshow,
        movie,
        character,
        game,
        sport,
        hobby,
        song1,
        song2,
        song3,
        songlifetheme,
        songcntstnd,
        todo1,
        todo2,
        todo3,
        todo4,
        todo5,
        thing1,
        thing2,
        thing3,
        secretTalent,
        goodat,
        notdo1,
        notdo2,
        notdo3,
        together,
      });
  
      await newUser.save();
  
      res.status(200).send('User data saved successfully');
    } catch (error) {
      console.error('Error saving user:', error);
      res.status(500).send('Error saving user');
    }
  });
  
  app.get('/list', async (req, res) => {
    try {
      const users = await User.find().lean();
      res.json(users); 
    } catch (error) {
      console.error('Error fetching users:', error);
      res.status(500).send('Error fetching users');
    }
  });
  app.get('/details', async (req, res) => {
    const { id } = req.query;
    try {
      const user = await User.findById(id).lean();
      if (!user) {
        return res.status(404).send('User not found');
      }
      res.json(user);
    } catch (error) {
      console.error('Error fetching user details:', error);
      res.status(500).send('Error fetching user details');
    }
  });
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});
