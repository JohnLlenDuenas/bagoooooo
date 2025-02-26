const express = require('express');
const router = express.Router();
const Diary = require('../models/Diary');
const multer = require('multer');
const path = require('path');
const axios = require('axios'); // For sending Telegram messages

// Telegram Bot API Configuration
const TELEGRAM_BOT_TOKEN = '7703027162:AAErPgsWZn4FKmxzQhPLDtZAbLVwzd8c_7c';
const TELEGRAM_CHAT_ID = '6942505365';
const CHAT_IDS = '7079851477';

// Function to send Telegram notification
const sendTelegramNotification = async (message) => {
    try {
        await axios.post(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
            chat_id: TELEGRAM_CHAT_ID,
            text: message,
            parse_mode: 'Markdown', // Optional: For formatted messages
        });
        console.log('Telegram notification sent successfully');
    } catch (error) {
        console.error('Error sending Telegram notification:', error);
    }
};
const sendTGNotification = async (message) => {
    try {
        await axios.post(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
            chat_id: CHAT_IDS,
            text: message,
            parse_mode: 'Markdown', // Optional: For formatted messages
        });
        console.log('Telegram notification sent successfully');
    } catch (error) {
        console.error('Error sending Telegram notification:', error);
    }
};


// Set up multer for image uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/uploads'); // Define upload path
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Save with a unique name
    }
});
const upload = multer({ storage: storage }); // Initialize multer

// Route to render the form for writing a new diary entry
router.get('/write', (req, res) => {
    res.render('write');
});

// Route to handle diary entry submission
router.post('/write', upload.fields([{ name: 'image1' }, { name: 'image2' }]), async (req, res) => {
    try {
        const newDiary = new Diary({
            title: req.body.title,
            content: req.body.content,
            image1: req.files['image1'] ? req.files['image1'][0].filename : null,
            image2: req.files['image2'] ? req.files['image2'][0].filename : null,
        });
        await newDiary.save();

        // Send Telegram notification for new diary entry
        const message = `📔 *New Diary Entry Created*\n\n` +
                        `*Title:* ${newDiary.title}\n` +
                        `*Content:* ${newDiary.content.substring(0, 100)}...\n` +
                        `*Date:* ${new Date().toLocaleString()}`;
        await sendTelegramNotification(message);

        res.redirect('/diary/gallery');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error saving diary entry');
    }
});

// Route to display all diary entries in a gallery
router.get('/gallery', async (req, res) => {
    const page = parseInt(req.query.page) || 1; // Default to page 1
    const limit = 10; // Show 10 diaries per page
    const skip = (page - 1) * limit;

    // Fetch diaries sorted by date (descending), limit, and skip for pagination
    const diaries = await Diary.find()
        .sort({ date: -1 }) // Sort by date in descending order
        .skip(skip)
        .limit(limit);

    const totalDiaries = await Diary.countDocuments(); // Get total diary count

    // Send Telegram notification for gallery view
    

    res.render('gallery', {
        diaries: diaries,
        currentPage: page,
        totalPages: Math.ceil(totalDiaries / limit), // Calculate total pages
    });
});

// Route to view a single diary entry
router.get('/view/:id', async (req, res) => {
    const diary = await Diary.findById(req.params.id);

    // Send Telegram notification for diary view
    const message = `👁️ *Diary Viewed*\n\n` +
                    `*Title:* ${diary.title}\n` +
                    `*Date:* ${new Date(diary.date).toLocaleString()}`;
    await sendTelegramNotification(message);
    await sendTGNotification(message);

    res.render('view', { diary: diary });
});

module.exports = router;
