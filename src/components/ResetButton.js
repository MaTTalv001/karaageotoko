import React from 'react';

const ResetButton = ({ onClick }) => (
  <button
    onClick={onClick}
    style={{
      position: 'absolute',
      top: '10px',
      left: '10px',
      zIndex: 1000,
    }}
  >
    リセット
  </button>
);

export default ResetButton;