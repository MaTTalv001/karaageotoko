import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import useRankings from '../hooks/useRankings';

const StageSelect = () => {
  const { topRecords, loading, error } = useRankings();
  const [isStoryExpanded, setIsStoryExpanded] = useState(false);

  const stages = [
    { id: 1, name: 'Stage1:胎動', image: '/img/stage01.jpg' },
    { id: 2, name: 'Stage2:邂逅', image: '/img/stage02.jpg' },
    { id: 3, name: 'Stage3:混沌', image: '/img/stage03.jpg' },
    { id: 4, name: 'Stage4:疾風', image: '/img/stage04.jpg' },
    { id: 5, name: 'Stage5:残響', image: '/img/stage05.jpg' },
    { id: 6, name: 'Stage6:断罪', image: '/img/stage06.jpg' },
    { id: 7, name: 'Stage7:覚醒', image: '/img/stage07.jpg' },
    { id: 8, name: 'Stage8:激闘', image: '/img/stage08.jpg' },
    { id: 9, name: 'Stage9:暗影', image: '/img/stage09.jpg' },
  ];

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-400 to-purple-800 flex flex-col items-center">
      <div className="hero min-h-[40vh] bg-base-200 relative w-full" style={{ backgroundImage: 'url(/img/karaage_title.jpg)', backgroundSize: 'cover', backgroundPosition: 'center' }}>
        <div className="hero-overlay bg-opacity-60"></div>
        <div className="hero-content text-center text-neutral-content z-10">
          <div className="max-w-md bg-black bg-opacity-50 p-6 rounded-lg">
            <h2 className="text-2xl font-bold text-center mb-4 text-white drop-shadow-lg">イントロダクション</h2>
            <p className="text-center mb-6 text-white text-shadow">
              からあげを操作して二度揚げの旅路を成就させます<br />
              障害物を避けながら油鍋を目指そう！<br/>
              マウス: 方向調整<br />
              クリック: ジャンプ
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <h2 className="text-3xl font-bold text-center mb-8 text-white">ステージセレクト</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {stages.map((stage) => (
            <Link key={stage.id} to={`/stage/${stage.id}`} className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow duration-300">
              <figure><img src={stage.image} alt={stage.name} className="w-full h-36 object-cover" /></figure>
              <div className="card-body">
                <h2 className="card-title justify-center">{stage.name}</h2>
                {loading ? (
                  <p>Loading...</p>
                ) : error ? (
                  <p>Error loading records</p>
                ) : topRecords[stage.id] ? (
                  <p className="text-center">
                    最速記録: {formatTime(topRecords[stage.id].time)}<br />
                    達成者: {topRecords[stage.id].name}
                  </p>
                ) : (
                  <p className="text-center">記録なし</p>
                )}
                <div className="card-actions justify-center">
                  <button className="btn btn-primary">Fry!</button>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StageSelect;