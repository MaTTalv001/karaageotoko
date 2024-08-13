import Matter from 'matter-js';
import { WORLD_GRAVITY } from '../constants/gameConfig';

export const setupMatter = (element, width, height) => {
  const engine = Matter.Engine.create({
    gravity: { x: 0, y: WORLD_GRAVITY }
  });
  const world = engine.world;

  const render = Matter.Render.create({
    element: element,
    engine: engine,
    options: {
      width: width,
      height: height,
      wireframes: false,
      background: '#87CEEB'
    }
  });

  Matter.Runner.run(Matter.Runner.create(), engine);
  Matter.Render.run(render);


  return { engine, render, world };
};