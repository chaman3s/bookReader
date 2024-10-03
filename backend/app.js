const express = require('express');
const cors = require('cors');
const translate = require('translate-google');
const bookRotues = require('./routes/bookRoutes');

const app = express();
app.use(cors());
app.use(express.json());
const connectDB = require('./config/db'); 
const cloudinaryMiddleware = require('./config/cloudinary');
require('dotenv').config();
connectDB();

app.use(cloudinaryMiddleware);
app.use('/api/book',bookRotues);
app.post('/api/translate', async (req, res) => {
    const { text, targetLanguage } = req.body;

    try {
        const translation = await translate(text, { to: targetLanguage });
        res.json({ translatedText: translation });
    } catch (error) {
        console.error('Error translating text:', error);
        res.status(500).json({ error: 'Translation failed' });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
