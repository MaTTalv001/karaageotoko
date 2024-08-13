import Matter from 'matter-js';
import { WORLD_GRAVITY } from '../constants/gameConfig';

export const setupMatter = (element) => {
  const engine = Matter.Engine.create({
    gravity: { x: 0, y: WORLD_GRAVITY }
  });
  const world = engine.world;

  const render = Matter.Render.create({
    element: element,
    engine: engine,
    options: {
      width: window.innerWidth,
      height: window.innerHeight,
      wireframes: false,
      background: '#87CEEB'
    }
  });

  Matter.Runner.run(Matter.Runner.create(), engine);
  Matter.Render.run(render);

  // リサイズハンドラーを関数として定義
  const handleResize = () => {
    if (render.canvas) {
      render.canvas.width = window.innerWidth;
      render.canvas.height = window.innerHeight;
      Matter.Render.setPixelRatio(render, window.devicePixelRatio);
    }
  };

  // リサイズイベントリスナーを追加
  window.addEventListener('resize', handleResize);

  return { engine, render, world, handleResize };
};