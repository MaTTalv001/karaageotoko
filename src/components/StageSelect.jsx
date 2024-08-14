import React from 'react';
import { Link } from 'react-router-dom';

const StageSelect = () => {
  const stages = [
    { id: 1, name: '胎動', image: '/img/stage01.png' },
    { id: 2, name: '残響', image: '/img/stage02.png' },
    { id: 3, name: '輪廻', image: '/img/stage03.png' },
  ];

  return (
    <div className="min-h-screen bg-base-200 flex flex-col items-center">
      <div className="hero min-h-[50vh] bg-base-200" style={{backgroundImage: 'url(/img/karaage_title.jpg)'}}>
        <div className="hero-overlay bg-opacity-60"></div>
        <div className="hero-content text-center text-neutral-content">
          <div className="max-w-md">
            <h1 className="mb-5 text-4xl font-bold">からあげは二度揚げろ</h1>
            <p className="mb-5">彼は再び油を目指す</p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <h2 className="text-3xl font-bold text-center mb-8">ゲーム説明</h2>
        <p className="text-center mb-12">
          マウスでジャンプ方向を決め、クリックでジャンプ！<br/>
          障害物を避けながら油壺（フライヤー）を目指そう！<br/>
          最高のタイムを記録して、二度揚げマイスターを目指せ！
        </p>

        <h2 className="text-3xl font-bold text-center mb-8">ステージセレクト</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {stages.map((stage) => (
            <Link key={stage.id} to={`/stage/${stage.id}`} className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow duration-300">
              <figure><img src={stage.image} alt={stage.name} className="w-full h-48 object-cover" /></figure>
              <div className="card-body">
                <h2 className="card-title justify-center">{stage.name}</h2>
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