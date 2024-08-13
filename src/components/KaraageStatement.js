import React, { useState, useEffect, useCallback } from 'react';
import KaraageStatements from '../constants/KaraageStatements';

const KaraageStatement = ({ onComplete }) => {
  const [statement, setStatement] = useState(null);
  const [showStatement, setShowStatement] = useState(false);

  const playStatement = useCallback((text) => {
    return new Promise((resolve, reject) => {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.onend = resolve;
      utterance.onerror = reject;

      // 音声合成の準備ができているか確認
      const checkAndSpeak = () => {
        if (speechSynthesis.speaking) {
          setTimeout(checkAndSpeak, 100);
        } else {
          speechSynthesis.speak(utterance);
        }
      };

      checkAndSpeak();
    });
  }, []);

  useEffect(() => {
    let isMounted = true;
    const randomStatement = KaraageStatements[Math.floor(Math.random() * KaraageStatements.length)];
    setStatement(randomStatement);
    setShowStatement(true);

    const speakAndComplete = async () => {
      try {
        await playStatement(randomStatement.statement_en);
        if (isMounted) {
          setShowStatement(false);
          onComplete();
        }
      } catch (error) {
        console.error('Speech synthesis failed:', error);
        if (isMounted) {
          setShowStatement(false);
          onComplete();
        }
      }
    };

    speakAndComplete();

    return () => {
      isMounted = false;
      speechSynthesis.cancel();
    };
  }, [onComplete, playStatement]);

  if (!showStatement) return null;

  return (
    <div style={{
      position: 'absolute',
      bottom: '20px',
      left: '50%',
      transform: 'translateX(-50%)',
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      color: 'white',
      padding: '10px 20px',
      borderRadius: '5px',
      fontSize: '18px',
      textAlign: 'center'
    }}>
      {statement?.statement_ja}
    </div>
  );
};

export default KaraageStatement;