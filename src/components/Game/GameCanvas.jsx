import React from 'react';

const GameCanvas = ({ sceneRef }) => {
  return <div ref={sceneRef} className="absolute inset-0" />;
};

export default GameCanvas;