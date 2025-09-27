const useTextToSpeech = () => {
  const speak = ({ text, lang = 'en-IN' }) => {
    if (!window.speechSynthesis) {
      console.error('Text-to-Speech is not supported by this browser.');
      return;
    }
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    window.speechSynthesis.speak(utterance);
  };

  return { speak };
};

export default useTextToSpeech;