import React from 'react';

const ResetButton = ({ onClick, className, children }) => (
  <button
    onClick={onClick}
    className={`btn  ${className}`}
  >
    {children || '🔄 Reset'}
  </button>
);

export default ResetButton;