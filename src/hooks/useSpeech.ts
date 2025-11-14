import { useCallback, useEffect } from 'react';

export const useSpeech = () => {
  // コンポーネントのアンマウント時に音声を停止
  useEffect(() => {
    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  const speak = useCallback((text: string, lang: string = 'ru-RU') => {
    // 既存の音声を停止
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    utterance.rate = 0.85; // 少しゆっくり目に設定
    utterance.pitch = 1.0;
    utterance.volume = 1.0;

    window.speechSynthesis.speak(utterance);
  }, []);

  const stop = useCallback(() => {
    window.speechSynthesis.cancel();
  }, []);

  return { speak, stop };
};
