import React from 'react';

const StartModal = ({ onStart }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-70">
      <div className="bg-base-200 p-8 rounded-lg shadow-xl text-center">
        <p className="mb-6 text-base-content">
          マウスで方向を決めクリックしてジャンプ!<br />
          フライヤーを目指しましょう!
        </p>
        <button
          onClick={onStart}
          className="btn btn-primary btn-lg animate-pulse"
        >
          Fry!
        </button>
      </div>
    </div>
  );
};

export default StartModal;