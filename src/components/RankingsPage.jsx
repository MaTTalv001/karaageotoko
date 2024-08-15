import React from 'react';
import { Link } from 'react-router-dom';
import useRankings from '../hooks/useRankings';

const RankingsPage = () => {
  const { detailedRankings, loading, error } = useRankings();

  if (loading) return <div className="flex justify-center items-center h-screen">
    <span className="loading loading-spinner loading-lg"></span>
  </div>;
  if (error) return <div className="alert alert-error">Error: {error}</div>;

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Rankings</h1>
        <Link to="/" className="btn btn-primary">ステージセレクトに戻る</Link>
      </div>
      {Object.entries(detailedRankings).map(([stage, records]) => (
        <div key={stage} className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Stage {stage}</h2>
          <div className="overflow-x-auto">
            <table className="table table-zebra w-full">
              <thead>
                <tr>
                  <th className="text-left">Rank</th>
                  <th className="text-left">Name</th>
                  <th className="text-left">Time</th>
                </tr>
              </thead>
              <tbody>
                {records.map((record, index) => (
                  <tr key={index} className="hover">
                    <td>{index + 1}</td>
                    <td>{record.name}</td>
                    <td>{formatTime(record.time)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </div>
  );
};

export default RankingsPage;