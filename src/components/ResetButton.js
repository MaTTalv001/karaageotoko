import React from 'react';

const ResetButton = ({ onClick, style }) => (
  <button
    onClick={onClick}
    style={{
      padding: '5px 10px',
      fontSize: '16px',
      cursor: 'pointer',
      ...style
    }}
  >
    リセット
  </button>
);

export default ResetButton;