import React from 'react';
import { Link } from 'react-router-dom';
import ResetButton from '../ResetButton';

const GoalModal = ({ 
  clearTime, 
  playerName, 
  setPlayerName, 
  isRecordSubmitted, 
  handleAddRanking, 
  handleReset, 
  formatTime,
  handleTweet 
}) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-base-200 p-8 rounded-lg shadow-xl max-w-md w-full text-center">
        <h2 className="text-5xl font-bold text-primary mb-6">ゴール！</h2>
        <p className="text-2xl mb-6">
          クリアタイム: <span className="font-bold">{formatTime(clearTime)}</span>
        </p>
        {!isRecordSubmitted && (
          <input
            type="text"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            placeholder="プレイヤー名を入力"
            className="input input-bordered w-full max-w-xs mb-4"
          />
        )}
        <div className="mb-6">
          {!isRecordSubmitted ? (
            <button
              onClick={handleAddRanking}
              className="btn btn-primary w-full"
            >
              レコード登録
            </button>
          ) : (
            <div className="text-success text-xl">
              レコードが登録されました！
            </div>
          )}
        </div>
        <div className="flex justify-center gap-4 mb-4">
          <ResetButton
            onClick={handleReset}
            className="btn btn-secondary"
          >
            リトライ
          </ResetButton>
          <Link to="/" className="btn btn-accent">
            ステージ選択
          </Link>
        </div>
        <button
          onClick={handleTweet}
          className="btn btn-info w-full"
        >
          Twitterで共有
        </button>
      </div>
    </div>
  );
};

export default GoalModal;