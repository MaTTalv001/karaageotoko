import React, { useState, useEffect, useCallback } from 'react';
import KaraageStatements from '../constants/KaraageStatements';

const KaraageStatement = ({ onComplete }) => {
  const [statement, setStatement] = useState(null);
  const [showStatement, setShowStatement] = useState(false);
  const [canPlay, setCanPlay] = useState(false);

  const playStatement = useCallback((text) => {
    return new Promise((resolve, reject) => {
      if (!canPlay) {
        console.warn('Audio not yet allowed');
        resolve();
        return;
      }

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.onend = resolve;
      utterance.onerror = (event) => {
        console.error('Speech synthesis error:', event);
        reject(event);
      };

      speechSynthesis.speak(utterance);
    });
  }, [canPlay]);

  useEffect(() => {
    const randomStatement = KaraageStatements[Math.floor(Math.random() * KaraageStatements.length)];
    setStatement(randomStatement);
    setShowStatement(true);

    const handleUserInteraction = () => {
      setCanPlay(true);
      document.removeEventListener('click', handleUserInteraction);
    };

    document.addEventListener('click', handleUserInteraction);

    return () => {
      document.removeEventListener('click', handleUserInteraction);
    };
  }, []);

  useEffect(() => {
    if (canPlay && statement) {
      const speakAndComplete = async () => {
        try {
          await playStatement(statement.statement_en);
        } catch (error) {
          console.error('Failed to play statement:', error);
        } finally {
          setShowStatement(false);
          onComplete();
        }
      };

      speakAndComplete();
    }
  }, [canPlay, statement, playStatement, onComplete]);

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