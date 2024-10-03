import React, { useState } from 'react';
import translate from 'google-translate-api'; // Alternatively use the real API

const Translator = ({ textToTranslate }) => {
    const [translatedText, setTranslatedText] = useState('');
    const [loading, setLoading] = useState(false);

    const handleTranslate = async (targetLang = 'en') => {
        setLoading(true);
        try {
            const result = await translate(textToTranslate, { to: targetLang });
            setTranslatedText(result.text);
        } catch (error) {
            console.error("Error translating text:", error);
        }
        setLoading(false);
    };

    return (
        <div>
            <button onClick={() => handleTranslate('en')}>Translate to English</button>
            <button onClick={() => handleTranslate('es')}>Translate to Spanish</button>
            {loading ? <p>Translating...</p> : <p>{translatedText}</p>}
        </div>
    );
};

export default Translator;
