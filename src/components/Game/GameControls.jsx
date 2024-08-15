import React from 'react';
import ResetButton from '../ResetButton';

const GameControls = ({ toggleMute, isMuted, handleReset }) => {
  return (
    <div className="absolute top-2 left-2 z-50 flex flex-col gap-2">
      <button
        onClick={toggleMute}
        className="btn btn-sm"
      >
        {isMuted ? '🔇 Silent' : '🔊 BGM'}
      </button>
      <ResetButton
        onClick={handleReset}
        className="btn btn-sm"
      >
        🔄 リトライ
      </ResetButton>
    </div>
  );
};

export default GameControls;