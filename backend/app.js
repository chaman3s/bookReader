const express = require('express');
const cors = require('cors');
const translate = require('translate-google');
const bookRotues = require('./routes/bookRoutes');

const app = express();
app.use(cors({
    origin: '*', // Allows all websites (including localhost) to access the API
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization'],
    credentials: false // Set to false if you do not need to send credentials (cookies or HTTP authentication)
  }));
app.use(express.json());
const connectDB = require('./config/db'); 
const cloudinaryMiddleware = require('./config/cloudinary');
require('dotenv').config();
connectDB();

app.use(cloudinaryMiddleware);
app.use('/api/book',bookRotues);
app.get('/',(req, res)=>{

    res.json({msg:"hello"});
})
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
