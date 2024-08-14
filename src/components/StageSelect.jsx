import React from 'react';
import { Link } from 'react-router-dom';

const StageSelect = () => {
  const stages = [
    { id: 1, name: 'ステージ 1' },
    { id: 2, name: 'ステージ 2' },
  ];

  return (
    <div>
      <h1>ステージ選択</h1>
      <ul>
        {stages.map((stage) => (
          <li key={stage.id}>
            <Link to={`/stage/${stage.id}`}>{stage.name}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default StageSelect;