import Matter from 'matter-js';

export const setupMatter = (element) => {
  const engine = Matter.Engine.create();
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

  window.addEventListener('resize', () => {
    render.canvas.width = window.innerWidth;
    render.canvas.height = window.innerHeight;
    Matter.Render.setPixelRatio(render, window.devicePixelRatio);
  });

  return { engine, render, world };
};