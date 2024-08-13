import React, { useState, useEffect } from 'react';

const Timer = ({ isRunning, onTimeUpdate, resetTimeStamp }) => {
  const [time, setTime] = useState(0);

  useEffect(() => {
    let interval;
    if (isRunning) {
      interval = setInterval(() => {
        setTime((prevTime) => {
          const newTime = prevTime + 10;
          onTimeUpdate(newTime);
          return newTime;
        });
      }, 10);
    } else if (!isRunning) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isRunning, onTimeUpdate]);

  useEffect(() => {
    setTime(0);
  }, [resetTimeStamp]);

  const formatTime = (ms) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    const milliseconds = Math.floor((ms % 1000) / 100);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${milliseconds}`;
  };

  return (
    <div style={{
      position: 'absolute',
      top: '10px',
      right: '10px',
      fontSize: '24px',
      fontWeight: 'bold',
      color: '#fff',
      textShadow: '2px 2px 4px rgba(0,0,0,0.5)'
    }}>
      {formatTime(time)}
    </div>
  );
};

export default Timer;