import React, { useState, useEffect, useRef } from 'react';

const Timer = ({ isRunning, onTimeUpdate, resetTimeStamp }) => {
  const [time, setTime] = useState(0);
  const timeRef = useRef(0);

  useEffect(() => {
    let interval;
    if (isRunning) {
      interval = setInterval(() => {
        timeRef.current += 10;
        setTime(timeRef.current);
      }, 10);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  useEffect(() => {
    timeRef.current = 0;
    setTime(0);
  }, [resetTimeStamp]);

  useEffect(() => {
    onTimeUpdate(time);
  }, [time, onTimeUpdate]);

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