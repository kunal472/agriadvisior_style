import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import useSpeechToText from '../hooks/useSpeechToText';
import useTextToSpeech from '../hooks/useTextToSpeech';
import apiService from '../api/apiService';

const Chatbot = () => {
  const [messages, setMessages] = useState([{ sender: 'bot', text: 'Hello! How can I help you today?' }]);
  const [inputValue, setInputValue] = useState('');
  const { transcript, isListening, startListening, stopListening } = useSpeechToText();
  const { speak } = useTextToSpeech();
  const { i18n } = useTranslation();

  useEffect(() => {
    if (transcript) {
      setInputValue(transcript);
    }
  }, [transcript]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const userMessage = { sender: 'user', text: inputValue };
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    stopListening();

    try {
      const response = await apiService.post('/api/chatbot/ask', {
        question: inputValue,
        language_code: i18n.language === 'mr' ? 'mr-IN' : 'en-IN',
      });

      const botMessage = { sender: 'bot', text: response.data.answer };
      setMessages(prev => [...prev, botMessage]);
      speak({ text: response.data.answer, lang: i18n.language === 'mr' ? 'mr-IN' : 'en-IN' });
    } catch (error) {
      console.error("Chatbot API error:", error);
      const errorMessage = { sender: 'bot', text: 'Sorry, I am having trouble connecting.' };
      setMessages(prev => [...prev, errorMessage]);
    }
  };

  const toggleListening = () => {
    const lang = i18n.language === 'mr' ? 'mr-IN' : 'en-IN';
    if (isListening) {
      stopListening();
    } else {
      startListening(lang);
    }
  };

  return (
    <div style={{ border: '1px solid #ccc', padding: '1rem', marginTop: '2rem' }}>
      <h3>AI Agri-Bot</h3>
      <div style={{ height: '300px', overflowY: 'auto', borderBottom: '1px solid #ccc', marginBottom: '1rem' }}>
        {messages.map((msg, index) => (
          <div key={index} style={{ textAlign: msg.sender === 'user' ? 'right' : 'left', margin: '0.5rem' }}>
            <span style={{ background: msg.sender === 'user' ? '#dcf8c6' : '#f1f0f0', padding: '0.5rem', borderRadius: '7px' }}>
              {msg.text}
            </span>
          </div>
        ))}
      </div>
      <form onSubmit={handleSendMessage} style={{ display: 'flex' }}>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          style={{ flex: 1, padding: '0.5rem' }}
          placeholder="Ask a question..."
        />
        <button type="button" onClick={toggleListening} style={{ padding: '0.5rem', marginLeft: '0.5rem' }}>
          {isListening ? '...' : '🎤'}
        </button>
        <button type="submit" style={{ padding: '0.5rem', marginLeft: '0.5rem' }}>Send</button>
      </form>
    </div>
  );
};

export default Chatbot;